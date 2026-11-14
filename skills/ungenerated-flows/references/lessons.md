# What we learned, and why

Lessons from building the flows of real apps with their owner (Comma, a script-writing app;
Flamely, a time tracker; CutRoom, a video editor). Each one transfers to any app. Where two lessons
disagreed, the newer one is here and the condition is said. Best first within each group.

## Nothing pretends

- **One rule over every flow: nothing pretends.** No stand-in store sheet, no offer the store
  can't grant, no "cancelled" that only changed the phone, no "subscribed" logged for a closed
  sheet. A person charged after "cancelling" is a refund, a one-star review and a rejection.
  (Comma, Nov 2026)
- **Nothing in onboarding promises what the build can't do on the phone.** "The Apple login is not
  working yet ... The continue with Google is not working. So, legitly, nothing is working."
  Hide what doesn't work. (Comma, Oct 2026)
- **A fake success is worse than an honest error.** A stub sign-in or a fake queued request makes
  the whole app untrustworthy: "80% of things are not working here, so what's the point of it."
  (Comma, Oct 2026)
- **A demo calls the real thing.** A "try it" step in onboarding runs the real model on their input,
  never hard-coded output: "it just literally put those lines, like hard-coded them." (Comma, Oct
  2026)
- **Log the result, not the tap.** Closing the store's sheet returns no plan, and it was logged as
  "subscribed". Record trial, active, closed or failed. (Comma, Nov 2026)

## The board

- **Design on a live board, never static mockups.** Rows of small animated phones per part,
  playable as a flow: static screens were "ass", the live board "ten times better". (Flamely and
  Comma, Oct 2026)
- **Each part of the journey is its own section.** "There is no separate section for account,
  plan, paywall, setup; you basically combined those." (Comma, Oct 2026)
- **Variations are a switch on one card, picked by letter.** The owner chose "C for the main",
  "combine E and D". A cut screen is deleted from the board and the app the same round: "why the
  screen I cancelled are not deleted?" (Comma and Flamely, Oct 2026)
- **The board is the spec, and notes are the open list.** Every note reaches the native app in the
  same round and is cleared only when it's true on the phone: "I hope you applied the comment to
  actual application as well." (Comma, Oct 2026)
- **Keep the board lean and fast.** Screens only, one motion-off switch that lasts one visit, no
  speed sliders nobody uses: "the browser demo is too slow." (Comma and Flamely, Oct 2026)
- **No demo data.** Run the board on a real day one built from the onboarding's answers and live
  content: "the demo data is kind of ruining the quality of everything." (Comma, Oct 2026)
- **Mark what each screen needs from outside the app** (sign-in, payments, AI, a permission, an
  event): the owner loved it: "I really like this as a skill." (Comma, Oct 2026)
- **Work on the board the owner opens.** Not a published copy that goes stale: "that is where you
  need to update stuff." (Flamely, Oct 2026)

## Onboarding order and questions

- **Never open on sign-in.** Hook, questions, story, "make it yours", plan, account, paywall, then
  setup and the tour: "you do not want to show the login screen at first. That is the first rule."
  (Flamely, Oct 2026)
- **Every question screen asks something.** Facts and insights go in the story: "I don't know if
  this is an input screen." (Comma, Oct 2026)
- **Inputs are toys, and nothing locks.** Rulers, charts, swipe decks; Continue appears when
  they've answered, and a pick never moves on by itself. This replaced auto-advance on single
  picks (Comma, Oct 2026; Flamely asked for Continue on every question the same month). If a flow
  auto-advances anywhere, do it the same way everywhere.
- **A control owns every drag that starts on it.** The age ruler's drag moved the screen and the
  bug was reported 18 times. Never pick the gesture by direction; a finger's first points are
  noisy. Test with a diagonal drag. (Comma, Nov 2026)
- **Ask for the destination, not the current state.** "It needs to be how often you wanna post":
  that's what people came for. (Comma, Oct 2026)
- **A rejected question is replaced, not reworded.** "Just ask a different question. How many times
  do I have to tell you that?" (Flamely, Oct 2026)
- **Never label the person.** "There is no true creator category. Generalizing things that don't
  exist is what AI does." Talk about their time and their work. (Comma, Oct 2026)
- **Fewer questions up front.** Configuration (rhythm, hours, goals) moves into setup after the
  paywall: "put this in setup." (Comma, Oct 2026)
- **Onboarding never sends people out of the app to do a chore; it teaches a system feature by
  doing it once on the real path.** A screen that told them to copy a link and paste it back was
  removed; the share sheet and the widget gallery are shown step by step, then done for real:
  "make it actually functional." (Comma, Oct 2026)

## Opening, story and plan

- **The opening is the crux.** A short film that shows the dream outcome and plays itself, with no
  Continue until it ends. (Flamely, Oct 2026)
- **A tap hurries, never skips.** What's playing plays about twice as fast and Continue appears at
  once: "a tap means hurry up, not skip what I have not seen." (Comma, Oct 2026)
- **Before and after must be drastic and magical,** never a bar or rows of labels: "this is an ass
  screen ... there should be like some magical stuff." Exaggerate scale, never the facts.
  (Comma, Oct 2026)
- **The plan is earned from their answers.** Never show details they didn't give. (Flamely, Oct
  2026)

## Sign-in, consent and AI permission

- **Sign in before the paywall, and log the payment SDK into the account id.** A purchase made
  signed out stayed anonymous and the webhook answered "no user". (Comma, Nov 2026)
- **The success moment lands.** A tick, the character jumps once; a return says "Welcome back":
  "it's supposed to show a tick." (Comma, Nov 2026)
- **AI permission is the app's own sheet,** never a system alert: who writes, what is sent where,
  Allow or Keep writing by hand. "I want that pop-up to be nice." (Comma, Nov 2026)
- **Save a consent answer at the tap.** A delay lost it when the app closed. Present it from the
  root and from inside sheets, because a sheet can't show the root's sheet. (Comma, Nov 2026)
- **Ask each permission where it is first used,** unless the plan depends on it: a permissions
  screen for a camera nobody needs yet was removed. (Comma, Oct 2026)

## Paywall and the offer

- **Hard paywall.** "Currently if I cancel, it just let me in the app, which is pretty bad."
  Closing never lets anyone in; Restore is always there. (Comma, Nov 2026)
- **No free pass in test builds for real users.** The sandbox charges nothing; the free pass lives
  in Debug only. (Comma, Nov 2026, reversing Oct)
- **Prices from the store, in their currency; the trial only if the store says they can have it.**
  Otherwise everything says Subscribe. (Comma, Nov 2026)
- **The trial reminder only for a real trial,** the day before the store's own end date. Monthly
  subscribers were told their trial ended tomorrow. (Comma, Nov 2026)
- **One real offer after the paywall is closed.** "If they try to go back, we need to give them a
  massive discount ... we should not let them go." Real timer kept across reinstall, "free time"
  worked out from real prices, No thanks back to the paywall, never a fallback to full price. This
  replaced "no discount trick on close" (Flamely, Oct 2026). (Comma, Nov 2026)
- **The paywall is defined and never cheap.** One headline, the value, the trial timeline, every
  price, one button, no top bar: "it looks scammy now ... you make it look cheap." (Flamely and
  Comma, Oct 2026)

## Cancel, deletion, feedback

- **Cancel goes all the way, with "Keep my plan" at every step.** What they made → why → one
  follow-up → one real offer → the store's own sheet → goodbye with dates: "MAKE THE FULL CANCEL
  FLOW A LOT MORE IN-DEPTH." (Comma, Nov 2026)
- **Cancel through the platform's sheet and read the result from the server.** A stand-in marked
  the phone "cancelled" while the store kept billing. (Comma, Nov 2026)
- **Offers must be grantable.** A plan switch, a lighter plan, a real promotional offer; never
  "half off" with nothing behind it. (Comma, Nov 2026)
- **The cancel flow's discount is the store's own promotional offer on the plan they're on**, at
  the same prices as the paywall's one-time offer (one set of numbers to check the margin on).
  Offer it for price, a pause and "something else"; where a better fix exists (formats → request
  content, too much → a lighter rhythm), offer that instead. Show it only when the store returns
  it, in the store's currency; taking it is the store's sheet, and the flow moves on only when the
  store says they stayed: "I WANT YOU TO GIVE THE DISCOUNTS ON CANCEL FLOW AS WELL". (Comma, Nov 2026)
- **Deleting the account is separate from cancelling.** Export first, hold to delete, and say the
  subscription isn't cancelled by it. Refuse signed out before clearing anything. (Comma, Oct and
  Nov 2026)
- **A public feedback board; cancel feedback private.** Votes and statuses in public, reasons in a
  private list the owner actually reads; analytics get the answer, never the words. (Comma, Nov
  2026)

## The app's own screens and AI writing

- **Creating never starts on a blank page.** "If we click on write script, it should never start
  from like a blank page, that is what we are eliminating." Gather their material first, then ask
  how to write it. (Comma, Nov 2026)
- **Context given once is never asked again, and the AI never writes blind.** "I already gave it a
  context and when I was borrowing the shape it was again asking me." (Comma, Nov 2026)
- **Dictation never loses words.** A pause wiped a whole brain dump in a shipped build. (Comma, Nov
  2026)
- **Drafts come back whole, and every version is kept.** "If we wasted credits on that, yes it would
  be better to keep it." (Comma, Nov 2026)
- **Moving between stages never re-runs the AI.** Re-running is an explicit button that says it
  uses a credit. (Comma, Nov 2026)
- **Show AI limits exactly, from the server's own numbers.** "IN SETTINGS ALSO WE NEED AI
  TRANSPARENCY A LOT. SHOW EXACTLY WHAT IS LEFT." (Comma, Nov 2026)
- **Don't give an early stage its own tab.** "The ideas should not have its own screen because I
  have to go to the ideas and then I have to put into the scripts." An unwritten idea is a draft.
  (Comma, Nov 2026)
- **Creation lives where the work lives,** not behind a global plus: "we can remove the plus icon
  cuz it adds no value." (Comma, Nov 2026)
- **Never mix unfinished drafts with ready work.** Status groups in one compact list, finished work
  in its own archive. (Comma, Nov 2026)
- **Get the manual basics working before AI on top.** Select, move, resize, delete: "I can't even do
  basic editing myself, let alone the editing from Claude." (CutRoom, Nov 2026)
- **Every AI button opens a prompt with what and where filled in.** "How does it even know where?
  I can't even prompt it there." (CutRoom, Nov 2026)
- **Delete is always visible, with Undo.** "I CAN'T DELETE DRAFTS." (Comma, Nov 2026)
- **Screens after onboarding are for using, not watching.** Make the core actions really work:
  "I can't even add the entry in my calendar." (Flamely, Oct 2026)

## Porting to native

- **Port UI and motion first, one section at a time; wire services last.** "For all the
  technicality ... we will leave that out for the last." (Flamely, Oct 2026)
- **A debug test bar to jump, replay and loop, never in a build anyone uses.** "In simulator I was
  able to jump between the different screens, that is the most turning point"; later "remove any
  sort of these settings bars." (Flamely and Comma, Oct–Nov 2026)
- **Controls identical to the board's, measured, not eyeballed.** "Button isn't identical." Copy
  the computed style. (Flamely, Oct 2026)
- **Every animation approved on the board reaches the app.** "I'm still not able to see the
  animations that we made on the browser in the app." (Comma, Nov 2026)
- **Native chrome for navigation.** The platform's own tab bar, sheets and alerts: "I wanna keep
  iOS native navigation, the liquid glass one." (Flamely and Comma, Oct–Nov 2026)
- **Support is a help window, not a policy page.** Questions down the left, the open answer on the
  right (a one-line answer as its title, then the detail, then one reassuring note); on a phone the
  same questions open in place. Write each as a `<details>` so it works without script and links by
  id (`/support/#cancel`), and put "email us" and "ask for a feature or report a bug" above it. The
  support page and the public feedback board share one header with two tabs. "I have a feedback
  board ... really nice-looking support sections ... make it for this one as well." (Comma, Nov 2026)
- **A board that was built is not a board that works.** Ship the backend with the page, then post,
  approve, vote and unvote from the real page, and delete the test rows; an undeployed board on a
  live site just says "Could not connect". (Comma, Nov 2026)
