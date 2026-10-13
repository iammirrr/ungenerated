---
name: cancel-flow
description: Design the cancel flow (exit flow) for a subscription app - Cancel where people expect it and one tap away on every screen, one exit question with four or five specific answers and no "Other", one offer matched to the answer (a fair price, a pause or break, a cheaper plan, more trial time, or no offer at all), the person's own numbers, the platform's own cancel sheet, a personal goodbye and an easy way back. Use when designing cancellation, "manage subscription", retention or win-back screens, or when churn is the problem.
---

# Cancel flow

A cancel flow has three jobs: keep the people an honest offer can keep, learn why the others
leave, and part well with everyone. A flow that traps people saves a few this month and loses
the trust that would have brought them back. A good one changes the mind of roughly one in five
to one in three people who start it.

## Why it works

- **People arrive defensive.** Someone who had to hunt for Cancel comes in angry and refuses
  everything. Someone who found it where they expected comes in calm and actually reads the offer.
  That's why easy cancelling saves more people, not fewer.
- **Leaving is a decision about one reason.** Ask for that reason and answer it: a price problem
  gets a price, a time problem gets a pause, a product problem gets a person. A generic "50% off"
  answers a question nobody asked, and it costs you the most.
- **The answers teach you.** A specific list ("My team uses another tracker") tells you something
  you can act on. "Other" and long surveys tell you nothing, and every extra question loses people
  who were about to stay.
- **Their own numbers feel like theirs.** "412 hours since March" is something they made; an
  average is marketing. People value what they made, so say what they keep, not only what they lose.
- **Cheap offers wear out.** An offer shown every time becomes the price. People who stay at a
  price that fits (a smaller plan, yearly billing) stay longest; deep discounts hold people only
  until they run out.
- **The goodbye is the first screen of coming back.** A clear, warm, exact goodbye is what people
  remember when they need the product again.

## The screens

1. **Where they expect it.** Settings → the plan. The plan, its price, the next charge date and
   who bills it. A cheaper way to pay sits above Cancel (yearly billing, a smaller plan). Cancel
   is a plain row, never hidden, with its true consequence under it ("Your data stays.").
2. **One question.** Four or five answers, one pick, written in the product's words. No "Other".
   "Skip, just cancel" goes straight to the end.
3. **One offer, matched to the answer** (table below). Its own screen, with "Continue to cancel"
   as a full button, not a grey link.
4. **What stays and what stops**, with the person's own numbers and the exact date. Nothing
   that is not true.
5. **The platform's own sheet.** On iOS, `manageSubscriptionsSheet` does the cancelling; on
   Android, the Play subscription centre; on the web, the checkout provider's cancel page. Show
   the real thing on the board; never fake it in the app.
6. **The goodbye.** Their name, a thank-you, the exact day access ends, "You won't be charged
   again", what they keep, and one tap to undo.
7. **Coming back.** The same plan screen after it ends: what happened, every price, one tap to
   restart, their data waiting.
8. **On a trial** (its own card): more trial time if the platform allows it; otherwise the truth
   ("Cancel now and keep the rest of your trial") beside a reminder before the first charge.
   Many trial cancels happen in the first minutes, from people who don't trust themselves to
   remember.

## Match the offer to the answer

| They say | Offer | Watch for |
|---|---|---|
| It doesn't fit my budget right now | Either ask what would feel fair (three price ranges) and match it, or show the whole menu once: a free month, a few months at a discount, a discounted year, every price visible, the best value picked | Never one offer after another. Up to about 40% keeps value best; deeper cuts and free months save more people this month and fewer a year on, so measure the cohort. Once a year |
| I'm taking a break | A pause with a cap (three months at most) and the resume date on screen | Where the store can't pause (App Store), the honest version: renewal off, data kept, a reminder on the day they pick, nothing charges by itself |
| It's missing something | No discount. A line of feedback, "Tell me when it ships", or a person to talk to | Name wishes, never promise unshipped features |
| We moved to another tool | No offer. Let them take their data (export now or later) | Pretending an offer will help is slop |
| I got what I came for | Applause: their numbers, a thank-you, Cancel as the main button, "Tell us what helped" | These people write your best stories |

Write the answers so they neither insult the product nor sound final: "doesn't fit my budget
right now", not "too expensive"; "I'm taking a break", not "I don't use it anymore". Name the
reasons only your customers have; specific answers make people stop and think.

## Rules

1. **Resistance comes from value, never from obstacles.** Make staying look like the product:
   their own numbers big on the plan screen and again before the platform sheet, the offers on the
   paywall's own ground, the button that keeps the plan made like the plan. Cancel stays a proper
   button at the bottom of every screen, never a grey link and never missing.

2. **Cancel is one tap away on every screen of the flow.** It does not lower saves; it raises
   trust. Several US states require it.
3. **One question.** Every extra question costs saves.
4. **No "Other".** It becomes a second cancel button, and its answers are made up.
5. **One offer screen per person, matched to the reason.** At most once a year; nobody with an
   active discount gets another; no stacking pauses. An offer every time turns Cancel into a
   coupon machine.
6. **Yearly plans are different.** No refund is needed: cancelling stops the renewal and every
   paid day stays. Offer a discounted next year, and remind them a week before it ends.
7. **Their own numbers, never an average.** "412 hours since March", not "users save 5 hours".
   If they saved nothing, don't show the counter.
8. **Say what stays** as clearly as what stops. If the data or the free tier stays, that is the
   strongest honest line you have.
9. **No discount for leaving.** A win-back offer is for people long gone, not the ones who left
   this week; otherwise you teach everyone to cancel.

## Never

- Cancel hidden in a menu, behind support, a chat, a phone call or "email us".
- Confirmshaming ("No, I don't want to save money"), crying mascots, guilt, "You'll lose
  everything" when they won't.
- Countdown timers, spin-the-wheel discounts, "this offer disappears forever".
- Multi-select reasons, long surveys, a required text field.
- Pauses that resume and charge without warning.
- A goodbye that only says "You will lose access at the end of your billing period."

## Measure

- **Save rate:** about 20–36% for teams that work on the flow. Above 50%, the offers are too
  generous and the product looks cheaper than it is.
- **Saved people still paying later:** 40–70% is healthy; far above that, you're giving away too
  much.
- **Lifetime value by offer:** of the people who took each offer, how many still pay a year on.
- **Voluntary vs involuntary churn:** failed payments need retries and reminders, not this flow.
- **Read the answers every week.** About three in ten leave feedback you can use.

## On the board

One row: the plan screen, the question, one card per answer's offer, what stays, the platform
sheet, the goodbye, coming back, the trial case. A whole-part card plays one path end to end.
The board's demo finger acts inside a screen; only the whole-part card moves between screens.

See `references/benchmarks.md` for the numbers and where they come from.
