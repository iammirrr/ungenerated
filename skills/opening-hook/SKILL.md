---
name: opening-hook
description: Design an app's opening - the first 15 to 25 seconds before any question - as one short story carried by a hero object, with one hands-on moment, the product's real surfaces, and the button only at the end. Use for welcome screens, intros, hooks, "first screen", or when an opening has no coherence, too much text, or too many logos.
---

# Opening hook

The opening shows what the app does for this person, in their own day, fast. It is the crux of the
whole flow.

## Structure (5–7 beats, 15–25 seconds)

1. **The hero arrives.** The brand's hero object (from `app-concept`), alone. One line.
   A strong pattern: everything starts grey, and the hero bringing colour is the first motion.
2. **The problem**, felt, not explained: the real things that pull at the person (real app icons,
   scattered, tilted, drifting, badges climbing). One heading.
3. **The hands-on moment.** The person taps or holds the hero and something visibly changes
   (the noise goes quiet, a focus ring draws). If they don't, a soft ring marks it and a finger
   taps for them after a few seconds.
4. **The product at work**, on its real surfaces: the calendar, the dashboard, the actual app
   screen. Not an abstract card.
5. **Everywhere it lives**: the same content moving from phone to computer (one device turning into
   the other), if the product spans devices.
6. **The result**, as the app shows it: a real stat, a real chart.
7. **The last line** over the hero, bigger, and only now the button.

## Rules

- **One hero carries every beat.** It is on the first screen and the last.
- **No logo repeated.** The brand name appears at most once.
- **One heading and at most one short line per beat.** No paragraphs, no small print.
- **No Continue until the end.** A tap anywhere moves to the next beat.
- **Devices are never cut off**; cameras move them whole (`real-icons-and-devices`).
- **The ground does not change colour between beats** unless the change is the story (grey → colour).
- Show the features that carry the promise; the rest wait for the story or the app.
- Say what the product is in the reviewer's words; never sell it as something it is not.

## Process

1. Write the beats as one line each, with the heading, before any code.
2. Build it on the board as one screen with internal beats (one stage, so the hero never remounts).
3. Capture every beat and the moves between them (`visual-qa`).
4. Offer a short and a full cut if the length is in question.

## Anti-patterns

- A feature carousel with dots.
- A phone mockup in the middle of every beat.
- Five logos, a tagline, and "Get started" on the first screen.
- Text explaining what the animation already shows.

## Holding it together

Plan the beats with `continuity` before animating: write the thread sheet, give every change of
beat a baton, and keep one ground and one direction.
