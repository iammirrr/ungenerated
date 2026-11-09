# The loophole catalogue

Each row: the trick, how to check it, the usual fix. "Nobody tests this" rows are marked ★.

## Getting access without paying

| # | Trick | Check | Usual fix |
|---|---|---|---|
| 1 ★ | Restart a free trial forever: open the checkout link with `?offer=trial` (or a trial price id) after the trial was used, cancel, repeat | Does the checkout page or client pick the price/offer? Does the webhook re-check eligibility when a `trialing` subscription arrives? | Server checks eligibility when the trial is granted; ineligible trials are cancelled at the provider before any charge |
| 2 ★ | New trial per new account: email `+alias`, Gmail dots, new Google/Apple account, delete account and sign up again | Is trial usage stored per account row only? Does deletion erase it? | Trial ledger by normalised email hash + provider customer id + (mobile) store account; kept after deletion |
| 3 | Client chooses the price: a $0 price, a trial price, another product's cheaper price, a test price in prod | Which price ids are accepted? Is the list server-side? | Server creates the checkout/transaction; only listed prices open plans; unknown price opens nothing |
| 4 | 100% coupon / discount box on the checkout; codes without limits; codes shared publicly | Is the discount field visible? Usage caps, expiry, one per customer? | Hide the box; cap and date every code; server-side redemption with a row lock |
| 5 ★ | Trial stacking: an in-app trial, then a card trial started late adds its full length | Does the provider trial start at checkout or at the own trial's end? | Move the first charge to the own trial's end, or offer the card trial only at the start |
| 6 | Pay with a card that fails at the first charge, keep the trial | Is access during a card trial the trial's, ending on the trial's end regardless? | Access ends at trial end unless the first payment succeeds (grace only after a real paid period) |
| 7 | Test/sandbox purchases accepted by production (Apple sandbox receipts, RevenueCat Test Store, Stripe test webhooks to prod) | Environment checked on every event? | Reject non-production environments in production |
| 8 | Forged webhook / replay of an old valid one | Signature + timestamp window + event id dedupe | All three |
| 9 | Event for user A carries `custom_data` pointing to user B | Who does the webhook trust for identity? | Identity from the server-created checkout record / provider customer mapping; custom_data only as a hint that must match |
| 10 | Edit the local cache / SQLite / localStorage to "paid" and go offline | Is the cached answer signed? Max offline age? | Signed server answers verified natively; offline cap; server-side gates for real value |
| 11 ★ | Move the device clock back (trial never ends) or forward (daily free limit resets) | Which clock does each expiry/limit read? Are large offsets ignored as "broken"? | Floor = latest server time seen + monotonic run time; daily limits on server time |
| 12 | Never let the app reach the server (block the domain) so the "unknown" state never locks | What does "never heard from the server" open? | Unknown opens nothing paid; known-paid caches expire |
| 13 | Share one paid account across many people/devices | Device or session limits? | Device limit, concurrent session cap (product decision) |
| 14 | Free-tier limits counted per device (two computers = double) | Where is usage summed? | Sum on the server per account |
| 15 | Feature flags / test switches reachable in release builds | Grep build-time flags; are they compiled out? | Compile out; any shipped preview may only lock more |
| 16 | Admin/beta/founder override granted by mistake or never removed | List every override row; how is one created? | Explicit list, reviewed; payment events never create them |

## Keeping access after paying stops

| # | Trick | Check | Usual fix |
|---|---|---|---|
| 17 ★ | Refund, then a later "cancel at period end" event reopens access for the rest of the period | Does revocation also cancel at the provider? Can any later event set it active again? | Cancel at the provider on refund/chargeback; refunded subscriptions never reopen |
| 18 ★ | Failed renewal grace counted from a period end the provider already advanced (≈ one free month) | Grace base: period end or first failure? Do retries move it? | Grace from the first failure, fixed length, retries never extend |
| 19 | Partial refund treated as full, or full treated as partial | Adjustment type handling | Explicit: full ends access, partial doesn't (product decision) |
| 20 | Chargeback/dispute lost but access kept | Dispute events subscribed and handled? | Lost dispute ends access; won dispute may restore |
| 21 | Pause / resume edge cases | Pause events handled? Access during pause? | Paused = no paid access unless decided otherwise |
| 22 ★ | Restore/transfer purchase to account B; account A keeps access | TRANSFER events end access on the old owner? | End on the old account when its last store subscription leaves |
| 23 | Two subscriptions; cancelling one removes access given by the other (wrongly locks a payer) or keeps the wrong one | Multiple-subscription rule | Best running subscription decides; only the one that gave access takes it away |
| 24 | Cross-store: subscribed on web and in the app, charged twice | Does each store know about the other? | Block the second purchase or warn; one entitlement |
| 25 | Account deleted while paying: still charged, or new account inherits nothing | Deletion cancels first? | Cancel then delete, or refuse with a clear message |
| 26 | Upgrade/downgrade/interval switch grants the bigger plan before paying, or keeps it after downgrade | Proration mode and which event updates access | Access follows the provider's confirmed state |
| 27 | Out-of-order or duplicated events flip state back | Stale-event guard by occurred_at per subscription; event id dedupe | Both |
| 28 | Webhook fails (500) and the provider gives up; user paid, never unlocked (payer wronged) | Retries, alerts, reconciliation | Alert on processing errors; daily reconciliation provider ↔ database |

## Money and trust details

| # | Issue | Check |
|---|---|---|
| 29 ★ | The app shows $9, the checkout charges A$12.83 (auto currency conversion) or adds tax | Price shown = price charged? Use the provider's price preview for the buyer's country |
| 30 | Renewal terms not next to the subscribe button; no cancellation path; no reminder before a trial converts | See `ungenerated-audit-privacy` (auto-renewal laws) |
| 31 | Receipts/emails carry the provider's name, confusing buyers into chargebacks | Brand the receipts; descriptor on card statements |
| 32 | Card testing fraud through the checkout endpoint | Rate limits, provider fraud tools, captcha on public checkout |
| 33 | Secrets: live API key in the client, in the repo, or pasted in chat | See `ungenerated-audit-security`; rotate |
| 34 | Leftover admin/debug payment functions deployed (seed, wipe, grant) | List deployed functions; anything not in the repo is a finding |

## App stores: things that shipped wrong (see `lessons.md`)

| # | Issue | Check | Usual fix |
|---|---|---|---|
| 35 ★ | Purchase made signed out stays on an anonymous store/SDK id; the webhook finds no user and the payer is never unlocked on the server | Is sign-in before the paywall? Is the SDK logged into the account id (`Purchases.logIn`, `appAccountToken`, `obfuscatedExternalAccountId`) before purchase? | Sign in first; bind every purchase to the account id |
| 36 ★ | Closing the store's purchase sheet logged or treated as "subscribed" | What does the code do when the purchase returns cancelled/closed with no transaction? | Branch on the real result (trial, active, closed, failed); read the entitlement back |
| 37 ★ | Trial promised to an account the store won't give it to (charged on day one) | Is intro-offer eligibility checked before trial copy is shown? | Eligible → trial copy; otherwise Subscribe copy and skip the trial steps |
| 38 ★ | Trial reminder sent to people with no trial, or on the app's own date | What schedules the reminder? Which date does it read? | Only for a real trial, from the store's own expiry date |
| 39 ★ | Exit/one-time offer falls back to the full-price product when the offer product is missing, or is shown to someone not eligible for the intro price | Purchase code path when the offer package is nil; eligibility check before showing | No fallback; show nothing; eligibility first |
| 40 | Offer timer resets on reinstall or relaunch (endless "one-time" offer) | Where is the start time stored? | Persist across reinstall (iOS Keychain) or on the server |
| 41 ★ | In-app "cancel" or "resubscribe" changes only local state while the store keeps billing (or never resumes) | Does cancel open the platform's manage-subscriptions sheet? Where does the app read the result? | Platform sheet; result from the server/billing service; resubscribe = renewal back on |
| 42 | A free pass, test store key or debug unlock present in TestFlight/Release | `strings` on the archive; build-configuration flags; SDK key prefix (`test_`) | Debug only; scan every archive before upload |
