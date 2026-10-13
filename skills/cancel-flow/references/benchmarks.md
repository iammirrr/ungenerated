# Cancel-flow benchmarks

Figures as reported in Mobbin's study of 393 cancel flows, made with Churnkey, whose team
observed about 12 million cancel attempts. They are one company's data across its customers:
use them as a starting point, then measure your own.

## Why it matters

- Subscription apps lose roughly two in five paying users a year.
- At 5% monthly churn, almost half are gone within the year (1 − 0.95¹² ≈ 46%).
- A well-built cancel flow changes the mind of up to about one in three people who start it.

## The four offers people accept most

| Offer | What was reported |
|---|---|
| Discount | The most accepted. Takers stayed about 5 months longer; about 1 in 10 still paid a year later. Up to 40% gave the best mix of save rate and lifetime value; three-month discounts worked well. |
| Pause | Takers stayed about 5½ months longer, yet only about 7% of mobile apps offer one. Cap the length (three months is common) and show the resume date, or forgotten pauses end in disputes. |
| Switch plan | Moving to a cheaper plan kept people longest, about 7 months more, with almost 30% still there a year later. Switching to yearly was accepted about as often as a discount. |
| Trial extension | Offered by about 2% of mobile apps. Many trial cancels happen within minutes of starting, from people who don't trust themselves to remember. |

## The exit survey

- About 60% of mobile cancel flows have one; most do nothing with the answer.
- About 29% of people leave feedback you can use (fair price, bugs, missing features).
- Each question after the first lowers the save rate by about 6.7%. Four or five answers at most.
- Only about 18% of apps frame money as budget ("doesn't fit my budget") rather than price.
- About two thirds include "Other"; offers matched to "Other" are accepted least of all.
- One answer per person: with several boxes ticked, there is no single offer to show.
- Flows with no offers at all still saved about 14% when the survey was specific to the market.

## Ease and the goodbye

- Save rates were higher where "Manage subscription" sat where people expect it, and did not
  drop when every screen had a Cancel button.
- About 40% of people read the confirmation screen; make it personal and exact.
- Make returning one tap (Netflix's restart banner is the reference).

## Health

- Save rate: about 20–36% for teams that work on the flow; 50% means the offers are too high.
- Saved customers still paying later: 40–70% healthy; around 75% means you're giving away too much.

## Platform notes

- **App Store:** subscriptions cannot be paused. Cancelling runs through Apple's sheet
  (`manageSubscriptionsSheet` in SwiftUI, `showManageSubscriptions(in:)` in StoreKit). Promotional
  offers can reach current subscribers (a discount from the next renewal); win-back offers reach
  lapsed ones. A free trial cannot be extended; cancelling during it normally keeps access until it ends
  (trust the expiration date StoreKit reports).
- **Google Play:** subscriptions can be paused (one week to three months) and offers can target
  existing subscribers.
- **Web checkout:** the provider's portal cancels; link to it directly, no "email us".
