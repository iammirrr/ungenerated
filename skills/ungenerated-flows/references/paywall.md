<!-- Part of ungenerated-flows. Was the `paywall` skill. -->
> **When:** Design an honest, high-converting paywall - one value beat before the price, every price visible before any tap, a trial timeline with real dates, money that rolls, a bright calm ground, and no dark patterns. Use for subscription screens, pricing, trials, upgrade prompts or "the paywall looks scammy".

# Paywall

## Before the price (1–3 beats, no top bar)

- One screen of value in their terms: their week before and with the app, from their answers.
- If something is free (a companion app), say so before the price.
- A small commitment (hold the hero to commit) can lead into the paywall.

## The paywall

1. **Every price visible before any tap.** A big single price is fine only if the others are on
   the screen too.
2. **The trial timeline**: today, the reminder day, the first charge day, with real dates.
3. **Money rolls** on slot-machine reels when a plan changes; time never does.
4. **A bright, calm ground**: one colour field or a soft gradient, fine grain at most.
5. **What you get**: three or four lines with weight, not ten ticks.
6. **One button**, the outcome ("Start my free week"), then a quiet "Restore purchases".

## The way out

- Say how to cancel on the paywall, in its small print ("Cancel anytime in Settings"), and make
  it true: Cancel sits where people expect it and is never more than a tap away ([cancel-flow.md](cancel-flow.md)).
- On a trial, the reminder on the timeline is a promise. Send it.

## Never

- Laurels, invented reviews, "#1 app" claims you cannot prove.
- Fake countdowns and "only today" prices that are always there. The one real timer is the
  one-time offer's ([one-time-offer.md](one-time-offer.md)).
- Pre-selected expensive plans hidden below the fold.
- Per-week prices that hide an annual charge.
- A close button that is hard to find.

## Lessons from shipping (Comma, Nov 2026)

- **Hard paywall.** Closing never lets anyone in. The close button opens the one-time offer if the
  account can have it ([one-time-offer.md](one-time-offer.md)); "No thanks" there comes back here.
  Restore is always on screen.
- **No free pass outside Debug.** Not in TestFlight, not in production. The store's sandbox charges
  nothing, so testers buy for real. A free pass for tap tests lives in Debug builds only.
- **Prices from the store, in their currency** (StoreKit `displayPrice`, or the payment SDK's
  localised string), loaded at launch. A hard-coded price is only the fallback, and the board, the
  app and the store agree.
- **The trial only if the account can still have it.** Otherwise the copy, the button and the
  steps say Subscribe, and the trial timeline is skipped.
- **A short trial comes with limited AI,** so it can't be farmed (Comma: three days, a handful of
  AI scripts).
- **Every purchase screen** (paywall, offer, plan picker) links Terms and Privacy and states the
  price, the length and that it renews automatically (App Review 3.1.2).
- **Sign in first** and log the payment SDK into the account id ([sign-in.md](sign-in.md)).
- **Log the result, not the tap.** Closing the store's sheet returns no plan; it was logged as
  "subscribed" until it was caught.
- **The trial reminder only for a real trial,** the day before the store's own end date. Monthly
  subscribers were told "your free trial ends tomorrow".

## Events

- `paywall_shown` {where}
- `paywall_plan_picked` {plan}
- `purchase_started` {plan, trial}
- `purchase_result` {plan, result: trial | active | closed | failed}
- `trial_started` / `subscribed`, only when the plan really started
- `restore_result` {found, where}
- `paywall_closed`

Set the plan and status on the person. One dashboard holds the paywall and cancel funnels.
