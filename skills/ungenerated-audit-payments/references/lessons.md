# What we learned, and why

Lessons from shipping paid apps (Comma, an iOS script-writing app; Flamely, a Mac/Windows/iOS focus app; Pip, a small iOS app), Oct–Nov 2026. Each one is a mistake that shipped or nearly shipped. Comma's and Flamely's own products, prices and providers appear only as examples. Read them before Phase 1; every one is a row to check.

## Nothing pretends

**1. Never show an offer, a cancel or a purchase the store can't really do.** No stand-in store sheet, no discount without a real promotional or win-back offer behind it, no "cancelled" that only changed the phone. Why: "A person who thinks they cancelled and is charged anyway, or who takes a discount that never comes, is a refund, a 1-star review and an App Review rejection." Comma, Nov 2026.

**2. Cancel through the platform's own sheet, and read the result from the billing service.** On iOS that is the system's manage-subscriptions sheet; the app learns "cancelled, still paid until the date" from the server (for example RevenueCat's `willRenew` going false). Why: a stand-in screen marked the phone "cancelled" while Apple kept billing, and it shipped. Comma, Nov 2026.

**3. "Subscribe again" while cancelled turns renewal back on; it is not a new purchase.** Open the platform's sheet. A new purchase on top of a still-running period double-bills or fails. Comma, Nov 2026.

**4. Offers must be grantable.** A switch from monthly to yearly, a lighter plan, a real promotional or win-back offer configured in the store. Never "half off" or "a month free" with nothing behind it. Comma, Nov 2026.

## The purchase belongs to the account

**5. Sign in before the paywall, and log the payments SDK into the account id.** With RevenueCat that is `Purchases.logIn(userId)` before the purchase. Why: a purchase made signed out stays on an anonymous id, and the webhook answers "no user", so the server never learns who paid. Comma, Nov 2026.

**6. Keep entitlements on the server, one trial per account, and mark special accounts explicitly.** Founders and code-holding testers get a visible, listed override; nothing else is Pro by accident. Why: the owner found his own pre-payments account still showing Pro and couldn't tell why. Flamely, Nov 2026.

## Log what happened, never the tap

**7. Closing the store's purchase sheet returns no plan; log the result (trial, active, closed, failed).** Why: a closed sheet was logged as "subscribed" until it was caught. Funnels, revenue maths and the welcome screen all read that event. Comma, Nov 2026.

**8. Fire "trial started" and "subscribed" only when the paid state really started**, read back from the entitlement, and put plan and status on the analytics person. Comma, Nov 2026.

## Trials

**9. Offer a trial only to an account the store says is still eligible.** On iOS check intro-offer eligibility for the subscription group; otherwise every word, button and step says Subscribe and the "how your trial works" screen is skipped. Why: an ineligible person who is promised a free trial is charged on day one. Comma, Nov 2026.

**10. Send the trial reminder only for a real trial, the day before the store's own end date.** Read the date from the transaction, not from your own clock. Why: monthly subscribers with no trial were told "your free trial ends tomorrow". Comma, Nov 2026.

**11. A short trial comes with limited paid cost (AI, storage, sends), so it can't be farmed.** Why: "no free week only 2 days free with very limited ai". Comma, Nov 2026.

## Prices

**12. Prices come from the store, in the buyer's own currency.** A hard-coded price is the fallback only, and design, app and store agree. Why: board, app and store disagreed for weeks; on desktop the checkout showed "$8, $12, even though we only promised ... $9". Comma, Oct–Nov 2026; Flamely, Nov 2026.

**13. Prefer round prices per currency (9 USD, 9 EUR, 9 GBP) over automatic conversion**, and show the real one from the first screen. Why: "showing them this amount and then cutting out different ... it's kind of weird". Flamely, Nov 2026.

**14. Any "free time" claim is computed from the store's real prices and rounded down**, so it is true in every currency. Comma, Nov 2026.

**15. Do the margin maths after the store's cut and after worst-case running cost, for every plan and offer.** The store takes 15% on its small-business rate and 30% otherwise (check the current rates). Why: "count 15% plus please exactly break down stuff"; "how much we can give away without giving away our profits". Comma, Nov 2026.

**16. A solo developer applies for the store's small-business rate before launch.** It halves the store's cut on every sale. Comma, Nov 2026.

**17. Sell only what costs you money to run, and keep the rest free.** Why: "if it doesnt cost us everything free tbh". Pip, Oct 2026.

## The one-time offer

**18. An offer plan never falls back to the regular product.** If the offer product is missing, show nothing. Why: the fallback charges full price to someone promised a discount. Comma, Nov 2026.

**19. Show an exit offer only to someone who closed the paywall and is still eligible for the intro price**; otherwise the store charges full price. Discount only the first period, so renewals return to full price. Comma, Nov 2026.

**20. An offer's timer is real and survives reinstall** (store its start in the Keychain on iOS). When it ends, the offer is gone. "No thanks" goes back to the paywall, never into the app. Why: "ADD TIMER FOR 1 HOUR ... CRITICALLY ANALYZE THE PROFIT MARGIN". Comma, Nov 2026.

## Test builds and test money

**21. The free pass exists in Debug only; TestFlight and production run the real paywall.** The sandbox charges nothing, so testers buy for real and say so. Why: the rule flipped once ("I actually have to pay to use this app") and settled on "TestFlight has no free pass". Comma, Oct–Nov 2026.

**22. Production is a hard paywall: closing it never lets anyone in, and Restore is always there.** Why: "NOW WE MOVING TO PRODUCTION SO NO IT SHOULD GIVE US HARD PAYWALL". Comma, Nov 2026.

**23. Store test keys never reach a Release build.** A RevenueCat `test_` key in Release alerts and then crashes the app; keep it in Debug only and check the archive. Flamely, Oct 2026.

**24. Before testing, confirm the sandbox can't charge a real card, and clear the test account's state.** Why: "to confirm it doesn't cut my actual credit does it?". Comma, Oct–Nov 2026.

**25. Give testers a way to see every subscription state before real money is on** (trial ends with a card, without a card, failed renewal, grace, refund, restore), as test-only buttons or sandbox runs. Why: "SO I CAN CLEARLY SEE WHAT HAPPNED AFTER TRIAL ENDS AND IF PAYMENT ISNT ATTACHED ALL THE EDGES CASES"; "BEFORE LIVE PLEASE GIVE ME LIST OF ALL THE EDGESCASES WE NEED TO LOCKIN". Flamely, Nov 2026.

## Verifying

**26. Aim for zero leakage both ways.** Why: "I WANT 0 dollars loss ... and obviously app lock as well if they dont pay"; "WE CANT LEAVE A SINGLE DROP OF LOOP HOLES". Flamely, Nov 2026.

**27. Verify money end to end, in this order:** a sandbox purchase, then the customer in the billing dashboard, then the webhook rows and the entitlement in the database, then the products' state in the store console. Code that "should work" is not proof. Comma, Nov 2026.

**28. Every purchase screen states price, length and auto-renewal, and links Terms and Privacy.** It is App Review 3.1.2 and the auto-renewal laws; see `ungenerated-audit-app-review`. Comma, Nov 2026; Flamely, Oct 2026.

**29. Run paywall experiments through the subscription service, not hand-rolled.** Why: "make A/B testing screens from the RevenueCat as well". Comma, Oct 2026.
