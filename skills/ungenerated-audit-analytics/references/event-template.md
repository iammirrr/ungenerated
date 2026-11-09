# The event template, per flow

A starting list for a subscription mobile app. Rename to the app's own style, drop what the app doesn't have, add the app's core action. Each event: when it fires (the outcome, not the tap) and its properties. Never put the person's words, email or name in any of them.

Conventions: `snake_case`, object then past-tense verb for outcomes (`purchase_result`, `cancel_completed`); every event carries `environment` (debug, testflight/beta, production) and the app version; screen ids are stable strings that survive a redesign.

## Onboarding

| Event | Fires when | Properties |
|---|---|---|
| `onboarding_started` | first onboarding screen shown, once per install | `source` (organic, ad, link) if known |
| `$screen` / `screen_view` | every onboarding screen shown | `screen_id`, `step` (index), `section` |
| `onboarding_answered` | an answer is saved (one per question) | `question_id`, `answer` (category or bucket, never free text) |
| `try_it_result` | a demo before sign-in finished | `result` (done, refused, offline, error) |
| `onboarding_completed` | the last onboarding screen passed | `duration_s` |

## Sign-in

| Event | Fires when | Properties |
|---|---|---|
| `sign_in_shown` | the account screen shown | `where` |
| `signed_up` / `signed_in` | the server confirmed the account (new / returning) | `method` (apple, google, email) |
| `sign_in_failed` | the provider or server returned an error | `method`, `code` |

Identify with the account id at this moment (merging the anonymous person), and log the payments SDK into the same id.

## Paywall and purchase

| Event | Fires when | Properties |
|---|---|---|
| `paywall_shown` | the paywall appears | `paywall_id`/`variant`, `where` (onboarding, feature gate, settings), `trial_eligible` |
| `paywall_plan_picked` | a plan is selected | `plan` |
| `purchase_started` | the store's purchase sheet is requested | `plan`, `trial` (bool), `offer` |
| `purchase_result` | the store returned | `plan`, `result` (trial, active, closed, failed, pending), `error_code` |
| `trial_started` / `subscribed` | the entitlement confirms it, once | `plan`, `period` |
| `restore_result` | restore finished | `found` (none, active, expired), `where` |
| `paywall_closed` | closed without buying | `variant`, `seconds_open` |

Set person properties `plan` and `status` from the server's entitlement after each result.

## One-time or exit offer

| Event | Fires when | Properties |
|---|---|---|
| `offer_started` | the offer's timer starts (first show ever) | `offer_id` |
| `offer_shown` | the offer appears | `offer_id`, `seconds_left`, `eligible` |
| `offer_claim_tapped` | claim tapped (then `purchase_result` carries the outcome) | `offer_id`, `plan` |
| `offer_declined` | "No thanks" | `offer_id` |
| `offer_expired` | the timer ran out | `offer_id` |

## Cancel (inside the app, ending in the platform's own sheet)

| Event | Fires when | Properties |
|---|---|---|
| `subscription_opened` | the subscription screen shown | `status` |
| `cancel_started` | the cancel flow's first step shown | `plan`, `months_paid` |
| `cancel_step` | each step shown | `step` |
| `cancel_reason` | a reason picked | `reason` (category) |
| `cancel_followup` | the follow-up answered | `answer` (category), `wrote_note` (bool; the note itself goes to a private store) |
| `cancel_offer_shown` / `_taken` / `_declined` | the one real offer | `offer` |
| `cancel_store_opened` | the platform's manage-subscriptions sheet opened | |
| `cancel_completed` | the server says renewal is off | `plan`, `ends_at` |
| `cancel_kept` | "Keep my plan" tapped | `step` |
| `resubscribe_tapped` | turn renewal back on from the cancelled state | |

## Deletion

| Event | Fires when | Properties |
|---|---|---|
| `delete_opened` | the delete screen shown | `has_subscription` |
| `export_done` | the export finished | `items` (count) |
| `delete_confirmed` | the hold-to-delete completed | |
| `delete_result` | the server answered | `result` (deleted, refused_signed_out, failed) |

Send `delete_result` before the identity is reset, then reset.

## The core action and AI

| Event | Fires when | Properties |
|---|---|---|
| `<core>_started` / `<core>_completed` | the app's main job started / done | type, size bucket |
| `ai_result` | an AI call finished | `job`, `result` (done, limit, too_short, offline, error), `credits_left` |
| `error_shown` | a person saw an error in a key flow | `flow`, `code` |

## From the server (never from the app)

Through the subscription service's analytics integration or your webhook: initial purchase, trial converted, renewal, cancellation (renewal off), uncancellation, billing issue, expiration, refund, product change. Each with `product`, `price`, `currency`, `store`, `period`, on the same account id.

## The one dashboard per area

- Onboarding: funnel `onboarding_started` → each `screen_id` → `onboarding_completed` → `signed_up`.
- Paywall: `paywall_shown` → `purchase_started` → `purchase_result = trial|active`, split by `variant` and `where`.
- Cancel: `cancel_started` → each step → `cancel_completed`, with `cancel_kept` by step and `cancel_reason` counts.
- Revenue: server events only.
