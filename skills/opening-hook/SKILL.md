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
   (the noise goes quiet, a focus ring draws). If they don't, a soft ring marks it and waits. Never
   tap for them: a demo finger belongs to a board preview, not the app.
4. **The product at work**, on its real surfaces: the calendar, the dashboard, the actual app
   screen. Not an abstract card.
5. **Everywhere it lives**: the same content moving from phone to computer (one device turning into
   the other), if the product spans devices.
6. **The answer** to the question beat 2 asked, as a moment, never a chart in a card (patterns
   below).
7. **The last line** over the hero, bigger, and only now the button.

## Rules

- **One hero carries every beat.** It is on the first screen and the last.
- **Never swap between beats.** One thing turns into the next. Fading a picture out and popping a
  new card in is a swap, and it reads as a cut however smooth the fade (`continuity`).
- **No motif twice in a row.** If the last beat brings the hero back big, the beat before it
  doesn't show the hero too (say, small inside a ring).
- **No logo repeated.** The brand name appears at most once.
- **One heading and at most one short line per beat.** No paragraphs, no small print.
- **No Continue until the end.** A tap anywhere moves to the next beat. Beats never move on by
  themselves in the app: once a beat has played, a quiet "Tap to continue" shows and it waits.
- **Devices are never cut off**; cameras move them whole (`real-icons-and-devices`).
- **The ground does not change colour between beats** unless the change is the story (grey → colour).
- Show the features that carry the promise; the rest wait for the story or the app.
- Say what the product is in the reviewer's words; never sell it as something it is not.

## The answer beat

The problem beat asks something ("Where did your hours go?"). The answer beat replies to it, with
the same things, so the story closes. Three patterns that work:

- **The callback.** The objects the problem scattered come back to the same places, now upright,
  still and sized by what they took, each with its number: the work apps big, the distractions
  small. Beat 2 is the mess, this is the answer ("Now you know").
- **Unit by unit.** The heading's unit (every hour, every meal, every run) becomes a row of
  tiles that flip over one by one, each showing what that one was. Literal, quick, a little
  playful.
- **The product's own move.** The one thing only this product does, happening once on screen
  (it asks what you did, you answer, and the answer lands where it belongs).

A donut or bar chart inside a card, with a legend under it, is a dashboard. It answers nothing
the person felt, so it falls flat however well it moves.

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
- A dashboard as the payoff: a chart in a card, a legend, three stat tiles.

## Holding it together

Plan the beats with `continuity` before animating: write the thread sheet, give every change of
beat a baton, and keep one ground and one direction.
