---
name: ungenerated-flows
description: Design a mobile app's whole journey on a live board, then carry it into the native app. Scaffolds the board (every screen a working, animated phone in journey order, Pick and Note on each card, Play the flow), designs every flow in order (opening hook, onboarding questions, story, plan reveal, sign-in, consent and AI permission, paywall and one-time offer, setup and tour, the app's own screens, AI writing and usage, feedback board, cancel flow, account deletion), each with its rules, where it lives, its analytics events and the mistakes made building it, and ports the approved board to SwiftUI or Compose so it moves exactly like the board. Use when someone says "design the onboarding", "make a board", "show me all the screens", "build the paywall", "add a cancel flow", "sign in with Apple", "AI permission popup", "show AI usage", "exit offer", "delete account", "feedback board", "port the board to SwiftUI", or "the app doesn't feel like the board".
---

# Flows: the board and every flow on it

The board is the flows: one live board holds every screen of the journey, and the approved board
becomes the app.

**One rule over every flow: nothing pretends.** No stand-in store sheet, no offer the store can't
grant, no "cancelled" that only changed the phone, no "subscribed" logged for a closed sheet, no
button for something the build can't do. A pretend step is a refund, a one-star review and an App
Review rejection.

Every flow reference has the same shape: **rules · where it lives · events · mistakes.** Events
log what happened, not the tap; identify people by account id, never name or email; send answers
and counts, never the person's own words.

## Steps

1. **Scaffold the live board.**
   Copy `template/` into the project, fill `board.config.js` with one section per part of the
   journey, swap in the kit's tokens and serve it with no caching. Read
   [design-board.md](references/design-board.md).

2. **Design each flow in journey order,** one section of the board each, one reference each.
   Finish a section, show it, log the notes, then move on.
   1. Opening hook: a short film that plays itself. [opening-hook.md](references/opening-hook.md)
   2. Questions: every screen asks; inputs are toys. [onboarding-questions.md](references/onboarding-questions.md)
   3. Story: their own numbers, honest maths. [story-screens.md](references/story-screens.md)
   4. Plan reveal: answers glide into the plan. [plan-reveal.md](references/plan-reveal.md)
   5. Sign-in, before the paywall. [account-signup.md](references/account-signup.md), [sign-in.md](references/sign-in.md)
   6. Consent, permissions and AI permission. [consent-and-permissions.md](references/consent-and-permissions.md), [ai-permission.md](references/ai-permission.md)
   7. Paywall, then the one-time offer after close. [paywall.md](references/paywall.md), [one-time-offer.md](references/one-time-offer.md)
   8. Setup and tour, on the real app screens. [setup-and-tour.md](references/setup-and-tour.md)
   9. The app's own screens, AI writing and AI usage, the feedback board. [app-screens.md](references/app-screens.md), [ai-writing.md](references/ai-writing.md), [ai-transparency.md](references/ai-transparency.md), [feedback-board.md](references/feedback-board.md)
   10. Cancel flow and account deletion. [cancel-flow.md](references/cancel-flow.md), [account-deletion.md](references/account-deletion.md)

3. **Port the approved board natively,** one section at a time, in a debug host with a test bar.
   Same clock, curves and numbers as the board; copy parts from their computed styles. Read
   [board-to-app.md](references/board-to-app.md), then [native-port.md](references/native-port.md);
   the code is in [board-to-app-swiftui-engine.md](references/board-to-app-swiftui-engine.md) and
   [board-to-app-css-in-swiftui.md](references/board-to-app-css-in-swiftui.md).

4. **Check every flow end to end before calling it done:** tap tests, the events in the analytics
   tool, the database and the money, then screenshots looked at. Read `ungenerated-review` ›
   check-order (references/check-order.md).

## Never

- Never a pretend step: a stand-in store or cancel sheet, an offer with nothing in the store
  behind it, a success logged for a closed sheet. Real money and real trust are on the line.
- Never promise in onboarding what the build can't do on the phone. Hide it until it works.
- Never open on sign-in, and never put the paywall before sign-in: the purchase must belong to the
  account (log the payment SDK into the account id).
- Never let closing the paywall into the app in production; never a free pass outside Debug.
- Never a hard-coded price where the store's localised price exists; never a trial for someone
  the store says can't have one.
- Never an AI call before the app's own permission sheet says yes; swiping it away is no.
- Never ask for context twice, let the AI write blind, or lose a word the person typed or said.
- Never hide Cancel or "Keep my plan" on any cancel step; never mark "cancelled" from the phone.
- Never a question screen that doesn't ask; never a persona label; never "Step 2 of 4".
- Never let a drag control give its drag to the screen behind it (reported 18 times).
- Never write native code for a screen that isn't approved on the board, and never ship the test
  bar in a build anyone else uses.
- Never leave a cut screen in the code, or a board note unapplied in the app.

## Read when

| You are… | Read |
|---|---|
| Starting the board, adding screens, publishing it | [design-board.md](references/design-board.md), `template/` |
| Designing the first 15–25 seconds | [opening-hook.md](references/opening-hook.md) |
| Writing onboarding questions | [onboarding-questions.md](references/onboarding-questions.md) |
| Turning answers into a story | [story-screens.md](references/story-screens.md) |
| Showing the plan | [plan-reveal.md](references/plan-reveal.md) |
| Placing and designing the account screen | [account-signup.md](references/account-signup.md) |
| Wiring sign-in, "Welcome back", the payment SDK login | [sign-in.md](references/sign-in.md) |
| Asking for consent and system permissions | [consent-and-permissions.md](references/consent-and-permissions.md) |
| Asking before words go to an AI provider | [ai-permission.md](references/ai-permission.md) |
| Designing the paywall | [paywall.md](references/paywall.md) |
| Adding an offer after the paywall is closed | [one-time-offer.md](references/one-time-offer.md) |
| Designing setup, the widget ask or a tour | [setup-and-tour.md](references/setup-and-tour.md) |
| Designing the app's own screens and micro screens | [app-screens.md](references/app-screens.md) |
| Building any AI writing feature | [ai-writing.md](references/ai-writing.md) |
| Showing AI limits and usage | [ai-transparency.md](references/ai-transparency.md) |
| Adding a public feedback board | [feedback-board.md](references/feedback-board.md) |
| Designing cancelling | [cancel-flow.md](references/cancel-flow.md), [cancel-flow-benchmarks.md](references/cancel-flow-benchmarks.md), [cancel-flow-field-study.md](references/cancel-flow-field-study.md) |
| Designing account deletion | [account-deletion.md](references/account-deletion.md) |
| Porting a board section to SwiftUI or Compose | [board-to-app.md](references/board-to-app.md), [board-to-app-swiftui-engine.md](references/board-to-app-swiftui-engine.md), [board-to-app-css-in-swiftui.md](references/board-to-app-css-in-swiftui.md) |
| Mapping tokens, parts and motion to native | [native-port.md](references/native-port.md) |
| Wondering why a rule exists | [lessons.md](references/lessons.md) |

## Works with

- `ungenerated-foundation`: the concept, research and kit the board is built from.
- `ungenerated-motion`: how every screen and transition on the board moves.
- `ungenerated-review`: the no-slop gate and the check order before anything is shown.
- `ungenerated-icons`: the illustrated icons and real brand icons the screens use.
- `ungenerated-audit-payments`, `ungenerated-audit-analytics`, `ungenerated-audit-ai`,
  `ungenerated-audit-privacy`: the truth checks behind the paywall, the events, AI usage and
  deletion.
