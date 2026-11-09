# Analytics audit checklist

Every numbered item gets a verdict: ❌ confirmed, ⚠️ suspected, ✅ safe, N/A. Proof is a file:line, a query and its result, or a live event. ★ = commonly missed. SDK method names and tool features change: check the vendor's current docs and write the date.

## 1. Find every event in the code

```bash
# PostHog
grep -rnE "posthog\.(capture|screen|identify|alias|reset|group|register)|PostHogSDK\.shared\.(capture|screen|identify|reset)|\\\$set" .
# Firebase / GA4
grep -rnE "logEvent|Analytics\.logEvent|setUserID|setUserProperty|gtag\(" .
# Amplitude
grep -rnE "amplitude\.(track|logEvent|setUserId|identify|reset)|Amplitude\.instance" .
# Mixpanel
grep -rnE "mixpanel\.(track|identify|alias|reset|people\.set)|Mixpanel\.mainInstance" .
# Segment / RudderStack
grep -rnE "analytics\.(track|identify|screen|page|alias|reset)" .
```
Then read the wrapper if the app has one (a `Telemetry` or `track` helper): the real list is its callers. Read the SDK setup for autocapture, screen autocapture, session replay, person profiles mode, flush interval, opt-out default, and how Debug/test builds are tagged.

1. ★ All events go through one helper with typed names (an enum or a constants file), so a typo can't make a new event.
2. Every event's trigger is understood: an outcome, a screen shown, or a tap (taps only when the tap itself is the question).

## 2. Find what arrives

- **PostHog:** SQL/HogQL `select event, count() from events where timestamp > now() - interval 30 day group by event order by count() desc`; split with `properties.$app_version`, `properties.environment` or `properties.$lib`. Live: the Activity / events explorer, filtered to the test person.
- **Firebase / GA4:** DebugView (iOS launch argument `-FIRDebugEnabled`, Android `adb shell setprop debug.firebase.analytics.app <package>`), then Events and the Realtime report; BigQuery export for exact counts.
- **Amplitude:** User Look-Up for the test user's event stream; the Ingestion Debugger; Data › Events for volumes.
- **Mixpanel:** Events (live view) filtered to the test distinct id; Lexicon for names and volumes.

3. ★ Every event in the code arrives from the current build (dead ones are listed with their file:line).
4. Every event that arrives is in the code or explained (old build, autocapture, web, server); unknown ones are listed.
5. Property names and types match between code and tool (no `plan` as a string in one place and an object in another).
6. Test builds, the simulator, staff and the owner's account are separable from real users (an environment property, a test-user flag, or an internal-users filter) and production dashboards exclude them.

## 3. Outcomes, not taps

7. ★ Purchase result is logged from the store's actual result: trial, active, closed (no plan), failed, pending. A closed sheet is never "subscribed".
8. "Trial started" / "subscribed" fire only after the entitlement confirms it, once per real start.
9. Cancel is logged from the subscription service's state (renewal turned off), not from a tap on a stand-in screen.
10. Restore logs what was found (nothing, active, expired) and where.
11. Sign-in logs success and failure separately, with the method; signed-up and signed-in are distinct.
12. AI actions log the result (done, refused by limit, too little input, offline, provider error), never the prompt or output.

## 4. Funnels complete (compare with `event-template.md`)

13. Onboarding: a screen event with a stable screen id for every step, plus started and completed; drop-off per screen is answerable.
14. Paywall: shown (with which paywall/variant and where from), plan picked, purchase started, purchase result, closed.
15. Offer: shown, claimed, declined, expired, and the purchase result of a claim.
16. Cancel: opened, each step, reason (category), follow-up (category + wrote_note flag), offer shown/taken/declined, store sheet opened, completed (from the server), kept (with the step).
17. Deletion: opened, export done, confirmed, completed or refused (signed out), and the server's confirmation.
18. The core action (the thing the app is for) has a started and a completed event, so activation and retention can be measured.
19. Errors people see in key flows are logged as events (with a code, not a message containing user data).

## 5. Revenue and identity

20. ★ Revenue comes from the server: the subscription service's integration (RevenueCat → PostHog/Amplitude/Mixpanel/Firebase) or your webhook, with product, price, currency, store and period. Client "revenue" events are removed or renamed.
21. Refunds, cancellations, billing issues and renewals arrive from the server too, so lifetime value and churn are real.
22. ★ The anonymous person before sign-in merges into the account after sign-in (identify/alias with the account id at sign-in), so onboarding and paywall steps belong to the same person as the purchase.
23. The same account id is used by analytics, the subscription service and crash reporting, so one person can be followed across tools.
24. Sign-out resets the analytics identity; the next person on the device starts anonymous.
25. Plan and status (free, trial, active, cancelled-until-date, expired) are set as person properties from the server's truth.
26. ★ No email, name, phone, address or user-written text in any event or person property; identify calls send the id only.

## 6. Hygiene

27. No duplicate events (two names for one thing, or the same event sent from two places: client and server, view `onAppear` firing twice).
28. Naming is consistent (one case style, object_verb or verb_object, past tense for outcomes) and documented in one list.
29. Event volume is reasonable for the plan's free tier: no per-frame, per-keystroke or per-scroll events.

## 7. The business dashboards exist

30. ★ Dashboards that answer the owner's questions exist and are linked in the project docs: acquisition (installs or visits by source and country), onboarding drop-off by screen, paywall conversion by plan and variant, trial to paid, offer take rate, cancel reasons and keep rate by step, revenue and refunds (from the server), core-action activation and week-1 retention, errors in key flows.

Coverage line for the report: "Analytics: 30 of 30 checked; N events in code, M arriving, K dead, J unknown; funnels: onboarding ✅, paywall ❌ (2 gaps), …".
