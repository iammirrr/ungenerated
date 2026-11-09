# One-time offer

One honest discount for someone who just closed the paywall. It replaces "Countdown timers" only in
this one place: the timer is real and the offer is real, or there is no offer.

## Rules

- **Only after closing the paywall.** Never at launch, never on the first view of the paywall,
  never in the cancel flow.
- **Only if the account can get it.** Check eligibility with the store (StoreKit
  `isEligibleForIntroOffer`, or the payment SDK's eligibility check). If it can't, there is no
  offer: closing goes straight back to the paywall.
- **Real products.** The offer is an introductory price on its own products in the same
  subscription group (or a store promotional offer), set up in the store and in the payment SDK as
  a separate offering. Something the store actually grants.
- **Never fall back to the full-price product.** If the offer product or package is missing, hide
  the offer. A fallback would charge full price under an offer's headline.
- **A real timer.** One hour (or whatever you pick), started the first time it's shown and kept in
  the Keychain, so reopening or reinstalling doesn't reset it. When it ends, the offer is gone.
- **"Free time" is worked out from the store's prices** in the person's currency, and rounded
  down: (full price for the period − offer price) ÷ the full monthly price. A year at 79.99 against
  99.99 a year is 20 ÷ 8.33 = 2.4, so "2 months free". It is then true in every currency.
- **Discount the first period only.** Renewals return to full price. Work out the margin after the
  store's cut and the worst-case cost of the person's usage.
- **"No thanks" goes back to the paywall,** never into the app (the paywall is hard).
- **It's a purchase screen:** price, length, auto-renewal, Terms and Privacy (App Review 3.1.2).
- **The look:** "One-time offer", the countdown, at most two deals, one button ("Claim my offer"),
  a quiet "No thanks". The app's character may arrive with it. No confetti, no guilt.

## Where it lives

Between the paywall's close button and the paywall. Nowhere else.

## Events

- `exit_offer_started` (the timer starts)
- `exit_offer_shown`
- `exit_offer_claim_tapped` {plan}
- `purchase_result` {plan, result: trial | active | closed | failed} (the same event as the paywall)
- `exit_offer_declined`
- `exit_offer_expired`

## Mistakes and traps

- An offer purchase that falls back to the regular product charges full price. Hide the offer.
- A "2 months free" written for US dollars is false in other currencies. Compute it.
- A timer kept in ordinary storage resets on reinstall, so the "one hour" is a lie.
- "No thanks" letting people into the app turns a hard paywall into a soft one.
- An older rule said "no discount trick on close" (Flamely, Oct 2026). The newer one wins (Comma,
  Nov 2026): one real offer after close, only for people the store says can have it, once.
