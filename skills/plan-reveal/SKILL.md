---
name: plan-reveal
description: Show the person's answers becoming their plan - values gliding into a plan card in one continuous motion, the plan carrying its values into the next screen, and a calm commitment. Use for "your plan", "your program", "here's how it works for you" screens, or when a plan reveal pops, waits, jitters or swaps.
---

# Plan reveal

## The move

1. The plan card arrives (rise, 620 ms) with its rows' labels and empty values.
2. Each answer glides up from below the card **straight into its row**, one after another
   (170 ms apart, 900 ms each, emphasised curve). It enters as a dark chip and melts into the row's
   value as it lands. One continuous move: no pop, no cloud of chips waiting, no swap at landing.
3. When the last lands, the card's mark gets a small check (pop, once) and one success haptic.
4. Moving on, the values that appear on the next screen **travel there** as shared elements
   (`carry` transition): one eased flight each, the old copy and the new crossing over mid-path,
   while the old screen eases out under the new one.

## Rules

- Show only what they told you, plus what follows directly from it. Nothing they did not enter
  (no project names before they named one).
- Each row has a small icon; the card carries the app's own mark, not a generic icon.
- Words are human: "This is how *it* will work for you", not "Your personalised plan is ready".
- No "Save my plan" button. Continue moves on.

## Anti-patterns

- Chips that pop up under the card, wait, then fly.
- A value that fades out and a different element fading in at the destination.
- A confetti burst.
