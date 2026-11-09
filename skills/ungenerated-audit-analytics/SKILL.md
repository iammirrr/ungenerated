---
name: ungenerated-audit-analytics
description: Audit whether an app's analytics are true and useful: map every event in the code against what the analytics tool actually receives (PostHog, Firebase/GA4, Amplitude, Mixpanel, Segment), check events log outcomes not taps, the onboarding, paywall, offer, cancel and deletion funnels are complete step by step, revenue comes from the server or webhook, the anonymous person merges into the signed-in one by account id (never email or name), no personal data or user words in events, duplicates, dead events and naming, and that the dashboards that run the business exist. Every claim proven live. Web, desktop, iOS, Android. Use for "audit analytics", "are my events right", "check PostHog", "why don't the numbers match", "funnel is broken", "set up tracking properly", "what should we track", "event plan", or before running ads or launching. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Analytics audit: are the numbers true and useful?

For: making sure every number the owner will decide on is real. An event that logs a tap as a purchase, a funnel with a missing step, or revenue counted from the client leads to wrong decisions that look right.

## Steps

1. **Learn the app.** Write the App profile (or take the runner's): platforms, analytics and attribution SDKs, the subscription service and its integrations, the flows that matter (onboarding, sign-in, paywall, offer, cancel, deletion, the core action), build configurations, AGENTS.md / CLAUDE.md rules. Ask the owner only what the code can't answer: which questions the numbers must answer (where people come from, where they drop, who pays, who leaves and why).
2. **Map the events in the code.** Grep every capture, screen, identify, alias, reset, group and person-property call (`references/checklist.md` §1 has the patterns per SDK). One row per event: name, properties, file:line, the trigger (the real outcome or just the tap), which build configs send it. Read the SDK config: autocapture, session replay, person profiles, flush, opt-out, test-build filtering.
3. **Map what arrives.** Query the analytics tool for every event name and its volume over the last 30 days (and last hour for live tests), split by environment or app version. Use the tool's connector or API when present, read-only. Events in the code that never arrive are dead or broken; events that arrive but aren't in the code come from old builds, autocapture or another surface. See `references/checklist.md` §2.
4. **Compare each flow with the template.** For onboarding, sign-in, paywall, purchase, offer, cancel, deletion and the core action, compare the events with `references/event-template.md`: every step present, outcomes not taps, properties that let you split by plan and step. Build each funnel in the tool and check the step counts make sense (no step larger than the one before without a reason).
5. **Audit the catalogue.** Every row of `references/checklist.md` gets a verdict: ❌ confirmed (file:line, a query and its result, a live event), ⚠️ suspected (what would settle it), ✅ safe (why, with proof), N/A (why).
6. **Prove it live.** For each flow: run it once on a test build with telemetry on (simulator or device, a test account), then find each event in the tool with its properties, on the right person, in order. Then check money: the purchase in the subscription service and the revenue event from the server. Screenshot the query results for the report. Turn any test flag back off.
7. **Report and stop.** Result first: the questions the numbers can and can't answer today. Then the event map (code vs arrives), each funnel with its gaps, coverage ("30 of 30 checked"), findings ranked by how wrong a decision they would cause, each with proof, and a **numbered fix list** (what it fixes, what it touches: app code, server, tool settings, a dashboard). Change nothing until the owner answers with numbers, "all" or "none".
8. **Fix only what was approved.** Add or correct events in the shared telemetry helper (one place, typed names), never scattered; keep old names working until dashboards move; build the dashboards; re-run the live proof for every fixed event. Then a short final report: fixed, still open, what only the owner can do.

## Never

- Never log a tap as an outcome. "Purchase started" is a tap; "trial started" fires only when the entitlement says so.
- Never count revenue from the client; it comes from the store's server notification or the subscription service's webhook.
- Never identify a person by email or name; use the account id, and reset on sign-out.
- Never send the person's own words (notes, prompts, cancel reasons typed in, search text) or contact details in an event or a person property. Send categories and flags.
- Never call an event verified because the code looks right; it is verified when it arrives in the tool with the right properties on the right person.
- Never push analytics changes silently; they change the numbers the owner reads. Propose, get the yes, then ship.
- Never let test builds, the owner's account or the simulator pollute production numbers; filter them by environment or property.
- Never turn on session replay or autocapture of inputs without consent and masking (see `ungenerated-audit-privacy`).

## Read when

| You are… | Read |
|---|---|
| Finding events in code and in the tool, auditing | `references/checklist.md` |
| Checking or designing a flow's events | `references/event-template.md` |
| Wanting the why behind each rule | `references/lessons.md` |

## Works with

- `ungenerated-audit` runs this with the other seven.
- `ungenerated-audit-payments` owns the purchase results and the webhook these revenue events read.
- `ungenerated-audit-privacy` owns consent, replay and what the policy says analytics collect.
- `ungenerated-audit-ai` checks AI events carry no prompts or outputs.
- `ungenerated-flows` › paywall (references/paywall.md), cancel-flow (references/cancel-flow.md) and onboarding-questions (references/onboarding-questions.md) name each flow's events next to its screens; keep the two in step.
- `ungenerated-review` runs the tap tests whose events this audit checks.
