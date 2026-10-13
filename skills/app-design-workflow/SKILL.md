---
name: app-design-workflow
description: The order to design a mobile app in, and which skill to use at each step. Use at the start of any new app, onboarding, paywall or redesign, or when someone asks "where do I start", "design my app", "make the onboarding", "build the screens". It routes to the other skills in this library.
---

# App design workflow

Design happens on a board before it happens in code. Every screen is a live phone on the board,
reviewed with Picks and Notes, and only approved screens are built natively. This skill is the map.

## The order

1. **Concept** (`app-concept`): what the app is, for whom, the one promise, what it is not.
   Nothing else starts until this fits on one screen.
2. **Research** (`app-research`): how the best apps in the category structure the same journey.
   Take the flow, never the look.
3. **Kit** (`design-kit`, `motion-system`, `interaction-feel`, `bubbly-motion`, `continuity`,
   `real-icons-and-devices`): tokens,
   type, motion curves, the feel of every control. The kit is made before any screen.
4. **Board** (`design-board`): scaffold the board, one row per part of the flow, the kit in its
   own view, research in its own view.
5. **The flow, part by part**, each on the board:
   `opening-hook` → `onboarding-questions` → `story-screens` → `plan-reveal` →
   `account-signup` → `paywall` → `consent-and-permissions` → `setup-and-tour` → `app-screens` →
   `cancel-flow` (the way out is designed with the way in).
6. **Words** (`human-copy`) on every screen, as they are made, not after.
7. **Check** every screen with `visual-qa` (real screenshots, mid-motion frames) and `no-slop`
   before showing it. `accessibility-pass` before anything is approved.
8. **Review** (`design-review`): read the reviewer's Picks and Notes, log them, fix in passes.
9. **Build** (`native-port`): only approved screens, section by section, compared side by side.
10. **Ship** (`app-store-assets`): store screenshots and the preview, made from the board.

## Rules that hold across every step

- **Show, then build.** No native UI work on a screen that is not approved on the board.
- **Keep what the reviewer likes whole.** When they say "I like this, but…", fix the "but" in
  place. Never split, re-layout or re-style a liked screen.
- **One standing-rules file.** Every correction the reviewer repeats becomes a rule
  (`design-review`). Check every new screen against it before showing it.
- **Plan, then build, then show.** Say what you will change in plain words, do it, verify it with
  screenshots, then report. Never report a screen you have not looked at.
- **Small passes.** One pass answers one round of notes. Do not redesign what was not mentioned.

## What to say when you hand over a pass

A short list in the reviewer's own terms: what changed on each screen, what you could not do and
why, and one or two questions where their answer changes what you do next. No adjectives about
your own work.
