---
name: ungenerated-audit-payments
description: Audit, test and harden any app's payments and paywall so nobody gets paid features without paying and no payer is wrongly locked out. Covers Stripe, Paddle, Lemon Squeezy, RevenueCat, Apple StoreKit / App Store Server Notifications, Google Play Billing, and custom setups, on web, desktop (Mac/Windows), iOS and Android. Use for "audit payments", "make billing bulletproof", "find paywall loopholes", "test the subscription flow", "is my trial abusable", "go-live checklist for payments", refunds/chargebacks/dunning questions, or before turning on real money. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Payment audit: zero leaked revenue, zero wronged payers

The goal has two halves, and both count: **nobody gets paid access without paying**, and **nobody who paid is locked out**. Every finding is judged against both.

## Every run goes the same four steps

1. **Learn the app first.** Before any judgement, detect it from the repository (see "Discovery" below) and write an **App profile**: platforms, stack, backend, payment providers, products and prices, where access is decided. Ask the owner only what the code can't answer.
2. **Audit everything.** Phases 0–3 below, all of them. **Every row** of `references/loopholes.md` and every invariant gets a verdict: ❌ confirmed (file:line or live proof), ⚠️ suspected (what would settle it), ✅ safe (why), or N/A (why it doesn't apply to this app). Nothing is skipped silently; the report shows the coverage count (e.g. "42 of 42 checked").
3. **Tell the owner and stop.** Deliver the report (format at the end) with a **numbered fix list**, each item with what it fixes, what it touches, and whether it changes the server, the app or a provider setting. Change nothing before the owner answers. They reply with numbers, "all", or "none".
4. **Fix only what was approved**, then verify each fix (the test or sandbox run that found it now passes) and send a short final report: fixed, still open, what only the owner can do.

## Discovery (step 1)

- Platforms: `package.json` (web, Next, Vite), `src-tauri/` or `electron` (desktop), `*.xcodeproj` / `Package.swift` (iOS/Mac), `android/` / `build.gradle` (Android), `app.json` (Expo/React Native), `pubspec.yaml` (Flutter).
- Backend: `supabase/`, `firebase.json`, `prisma/`, server folders, serverless function folders, deployed functions (list them; anything deployed but not in the repo is a finding).
- Providers: grep for `stripe`, `paddle`, `lemonsqueezy`, `revenuecat`/`Purchases`, `StoreKit`, `BillingClient`, webhook routes, price ids, env names (`*_PRICE_*`, `*_WEBHOOK_SECRET`).
- Read the project's own docs on pricing and billing, and its AGENTS.md / CLAUDE.md rules.

Read `references/loopholes.md` (the full catalogue, the things nobody tests), `references/providers.md` (per-provider facts: events, signatures, test tools, time travel) and `references/lessons.md` (mistakes that shipped in real apps, and why each rule exists) before Phase 2. Laws on renewals and cancellation belong to the `ungenerated-audit-privacy` skill; secrets and API security to `ungenerated-audit-security`. Run them alongside when the scope touches them.

## Hard rules

- **Test money only.** Sandbox / test mode keys, test cards, sandbox Apple IDs, Google license testers. Never call a live API with a write. One real purchase and refund at go-live, only with the owner's explicit yes in that conversation.
- **Never ask for secrets in chat.** Ask the owner to put keys in the project's ignored env file (check `git check-ignore`). If a secret is pasted anyway, do not use a live one; say plainly it must be rotated, and use a test one only after saying so.
- **Read-only first.** Phase 1–2 change nothing. Fixes come after the owner sees the findings; server, schema, webhook and pricing changes need the owner's yes every time. Follow the repository's own rules (AGENTS.md / CLAUDE.md) where they are stricter.
- **Prove, don't assume.** Every "safe" claim cites a file:line, a passing test, or a live sandbox run with the stored result. Every "broken" claim gives a concrete exploit in 2–3 sentences.
- **Clean up.** Cancel test subscriptions, restore any setting you changed (for example a webhook's traffic source), and list what is left for the owner to delete.

## Phase 0: map the money (15 minutes, before reading code deeply)

Write a short map, in the report:
1. **Products and prices:** every plan, interval, currency, trial, intro offer, coupon/code, and where each price id is defined (dashboard, env, database table, client constant). Flag any price the client can choose freely.
2. **Stores:** which providers sell, on which platforms (web checkout, desktop, iOS App Store, Google Play). Two stores = a cross-store double-billing question.
3. **Source of truth for access:** the one table/field/function that decides "is this person paid now" (an entitlements row, RevenueCat entitlements, a JWT claim). If there is more than one, that is finding #1.
4. **Who writes it:** webhooks, a refresh endpoint, an admin tool, the client (red flag), a cron job.
5. **Who reads it:** server-side gates (API, RLS, sync), client-side gates (UI padlocks, limits), offline caches.
6. **Clocks:** whose clock decides expiry at each read (database `now()`, server `Date.now()`, the device clock).

## Phase 1: read the code against the invariants

For each invariant, find where it is enforced and whether the server enforces it (the client is a convenience, never the lock):

1. Access is granted **only** from a verified provider event or a server-side verified receipt/API read, never from a client claim or a URL parameter.
2. Webhooks: signature verified with a constant-time compare and a timestamp window; idempotent by event id; **out-of-order safe** (older event never overwrites newer); unknown events and unknown prices grant nothing; events for unknown users are retried or recorded, never granted to someone else.
3. Every way access ends (cancel at period end, immediate cancel, refund, chargeback/dispute, payment failure after grace, pause, expiry, account deletion, transfer/restore to another account) ends it **and** ends it at the provider when needed, so no later event reopens it.
4. Trials and free offers are limited **per person**, not per account row, and checked on the server at the moment they are granted (not only when the checkout is created).
5. Grace periods have a fixed start (the first failure) and a fixed length; retries never extend them.
6. Exactly one running subscription per person per product (or a deliberate rule for two), across all stores.
7. Codes/coupons: hashed, single-use or capped, dated, one per account, race-safe (row lock or unique constraint), cannot stack with a trial unless intended.
8. The paid gate is enforced where the value lives: server data (RLS/API), sync, server features. A client-only gate is a speed bump; write down what a tamperer gets.
9. Offline and caching: a cached "paid" answer has a server timestamp and a maximum offline age; the device clock can't extend it (use a floor of the latest server time seen plus monotonic running time).
10. Test mode can never grant access in production (sandbox receipts, test-store products, test webhooks to the production endpoint). A free pass exists in Debug builds only, never in TestFlight, beta or production.
11. Admin/beta/founder overrides are explicit, few, listed, and never overwritten or created by payment events.
12. Account deletion with a running subscription cancels it first (or blocks with a clear message), and the person can't keep using the old account's paid access in a new one.

13. The purchase is tied to the account before it happens: sign-in comes before the paywall and the payments SDK is logged into the account id, so the webhook can find the user.
14. Nothing pretends: cancel, resubscribe and offers go through the platform's own sheets and real store offers; the app reads the result from the server, and analytics log the result, never the tap.

## Phase 2: hunt the loopholes

Go through every row of `references/loopholes.md`. For each: **confirmed from code** (file:line), **suspected / depends on provider behaviour** (say which docs or sandbox run would settle it), or **safe** (why). Get an independent read for anything with money at risk: spawn one reviewer agent with the file list and the catalogue, and do not give it your conclusions.

## Phase 3: test, in three layers

1. **Pure rules (unit tests).** Extract the decision logic (event → access) into pure functions if it is not already, and test every catalogue case, including the time edges (exactly at expiry, one second after, renewal late by an hour, clock skew). A test for a fix must fail without the fix; check that once.
2. **Sandbox end to end, against the real backend.** Drive the provider with its test tools (`references/providers.md`): real checkouts with test cards, then API actions (cancel, resume, activate trial now, refund, pause) and simulated events for what can't be forced (failed renewal, chargeback). After **every** step, read the stored event log and the entitlement row and record: event type, applied or not, note, resulting access and its end date. Use time travel where the provider has it (Stripe test clocks, Apple sandbox accelerated renewals, Google test-card renewal intervals); otherwise simulate.
3. **The client.** With the backend in each state (trial, last day, ended without card, card trial, paid, past due, cancelled-ending, ended, refunded, code, offline), check what each screen and limit shows. If the app has a preview/test panel, use it for copy; use real server states for behaviour.

Minimum matrix (each row a test or a sandbox run with evidence): new trial; trial without card ends; card trial converts; card trial cancelled before charge; buy after trial; declined card; 3-D Secure; failed renewal → grace → recovery; failed renewal → grace → lock; cancel at period end; immediate cancel; undo cancel; refund pending, approved, partial; chargeback; second purchase while one runs; restart a trial (same account, new account same email, email alias); code valid/used/wrong/while paying/expiring; upgrade/downgrade/interval switch; currency other than the base; account deletion while paying; event for a deleted user; duplicate and out-of-order events; webhook with bad signature; clock moved back and forward; offline for days; two devices; cross-store purchase.

## Phase 4: fix (step 4: only the items the owner approved)

- Fix the root cause once, in the shared rule, with a test; keep fixes additive and backward compatible for installed clients.
- Typical fixes: decide access only in one server function; grant trials only through an eligibility check at grant time (and cancel at the provider what fails it); on revocation also cancel at the provider; fixed grace from first failure; a trial-usage ledger keyed by a normalised hash of the email (strip `+alias`, Gmail dots) and the provider customer id, kept after account deletion; server-time floors on the client; signed entitlement answers if offline tampering matters.
- Deploy server changes the way the repository documents, verify the deployed copy matches, then **re-run the sandbox steps that found the bug**.

## Phase 5: go-live checklist

Live keys present and the sandbox/test ones removed from production config; any key ever pasted in chat rotated; webhook endpoint registered in live with the needed events (including refunds/adjustments/disputes) and its secret on the server; live prices mapped; discount box and test coupons off unless intended; receipts/emails branded; one real purchase + refund passes; monitoring: webhook failure alert, processing errors = 0, a daily check of "paid in provider but not in app" and the reverse (reconciliation query).

## The report (for a non-developer owner)

Result first, plain words, short sentences. The App profile in five lines. Coverage ("42 of 42 loopholes checked, 14 invariants"). Then a table: case · result (✅ passed live / ✅ tested / ⚠️ suspected / ❌ open / N/A) · money at risk · fix. Then the **numbered fix list** for approval, and "what only you can do" (dashboards, keys). Stop there until the owner answers. Name what was not checked. Write the findings into the project's own docs (bug log, payments plan) so they outlive the conversation.
