# Provider facts for testing

Verify against the provider's current docs before relying on a detail; APIs change. Fetch docs with WebFetch; when a doc is silent, settle it with a sandbox run and record the result.

## Stripe
- Webhooks: verify `Stripe-Signature` with the endpoint secret (`stripe.webhooks.constructEvent`), 5-minute tolerance. Events: `checkout.session.completed`, `customer.subscription.created|updated|deleted|trial_will_end|paused|resumed`, `invoice.paid|payment_failed|payment_action_required`, `charge.refunded`, `charge.dispute.created|closed`, `customer.subscription.pending_update_*`.
- Test: `stripe listen --forward-to`, `stripe trigger <event>`, test cards (4242…, 4000 0027 6000 3184 for 3DS, 4000 0000 0000 0341 attaches then fails), **test clocks** to advance time through trials, renewals and dunning. Smart Retries / dunning settings live in the dashboard.
- Traps: `checkout.session.completed` before the subscription is active; `trial_end` on the subscription; customer portal lets people switch plans if enabled; coupons with `percent_off: 100`; `allow_promotion_codes` shows the code box.

## Paddle Billing
- Webhooks: `Paddle-Signature` (`ts=…;h1=…`, HMAC-SHA256 of `ts:rawBody`), compare in constant time, check the timestamp. Events: `subscription.created|trialing|activated|updated|past_due|paused|resumed|canceled`, `transaction.completed|payment_failed|past_due|canceled`, `adjustment.created|updated` (refunds, credits, chargebacks; refunds start `pending_approval`).
- Test: sandbox (`sandbox-api.paddle.com`, `sandbox-vendors.paddle.com`), test cards (4242…; 4000 0038 0000 0446 3DS; 4000 0000 0000 0002 declined; 4000 0027 6000 3184 fails at renewal). API actions: `POST /subscriptions/{id}/cancel` (`effective_from: immediately | next_billing_period`), `PATCH` `scheduled_change: null` (undo), `POST /subscriptions/{id}/activate` (end a trial now and charge), `POST /adjustments` (refund, `type: full|partial`). **Simulations:** `POST /simulations` + `/runs`; the notification setting must accept simulation traffic (`traffic_source: all`); restore it to `platform` after.
- Traps: automatic currency conversion for countries without a price override; the checkout page may read offer/price from its URL; a refund does not cancel the subscription; whether `current_billing_period` advances on a failed renewal is not documented, so never base grace on it; retries (dunning) up to 30 days by default.

## Apple (StoreKit 2, App Store Server API, Server Notifications V2)
- Verify JWS signed transactions/notifications with Apple's certificate chain (App Store Server Library). Notification types: `SUBSCRIBED`, `DID_RENEW`, `DID_FAIL_TO_RENEW` (with `GRACE_PERIOD` subtype), `GRACE_PERIOD_EXPIRED`, `EXPIRED`, `DID_CHANGE_RENEWAL_STATUS`, `REFUND`, `REVOKE` (Family Sharing), `CONSUMPTION_REQUEST`, `PRICE_INCREASE`, `OFFER_REDEEMED`.
- Test: Xcode StoreKit configuration files (time rate, failed transactions, refunds, ask-to-buy), sandbox testers with accelerated renewals (a month ≈ 5 minutes), TestFlight renewals, `requestTestNotification`.
- Traps: `environment` must be Production in prod; `appAccountToken` to bind purchases to your user; Family Sharing grants; introductory offer eligibility is per Apple ID subscription group; refunds arrive as `REFUND`; account deletion rules require a path to manage/cancel.

## Google Play Billing
- Real-time developer notifications (Pub/Sub) → always re-read the purchase with the Play Developer API (`purchases.subscriptionsv2.get`) before granting; acknowledge purchases within 3 days or they refund. States: active, in grace, on hold, paused, canceled, expired; `SUBSCRIPTION_REVOKED` for refunds.
- Test: license testers (test renewal periods of minutes), test cards that always approve / decline, the Play Console's test instruments.
- Traps: `obfuscatedExternalAccountId` to bind to your user; account hold vs grace; resubscribe from Play Store; voided purchases API for refunds/chargebacks.

## RevenueCat
- Webhook `Authorization` header you set; events `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `UNCANCELLATION`, `BILLING_ISSUE`, `EXPIRATION`, `PRODUCT_CHANGE`, `TRANSFER`, `SUBSCRIPTION_PAUSED`, `REFUND_REVERSED`, `TEMPORARY_ENTITLEMENT_GRANT`. `environment` = SANDBOX | PRODUCTION.
- Traps: restore behaviour (transfer to new app user vs keep) is a project setting; `TRANSFER` must end access on the old user; Test Store products must never count in production; anonymous app user ids merging into real ones.

## Lemon Squeezy, Gumroad, others
- Same invariants: signed webhooks (`X-Signature` HMAC), event id dedupe, subscription states, refunds and disputes, test mode separate from live.
