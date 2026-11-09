---
name: bubbly-motion
description: Give an app soft, bubbly, alive motion that still feels calm and expensive - springs tuned by overshoot, squash and stretch that keeps volume, things that grow from where they come from, gooey merges, follow-through, haptics on the peak, and the line between playful and sloppy. Use when an app feels stiff, flat, corporate or lifeless, when someone asks for bouncy, juicy, squishy, playful or bubbly motion ("like Duolingo"), or when tuning springs.
---

# Bubbly motion

Bubbly is one of seven motion personalities (`motion-styles`): right for language, kids, habit
and social apps, wrong for a bank or a sleep app. When it is the app's style, this is how to do it
well.

Bubbly is not bouncy. A bubble is round, soft and full of air: it gives under a finger, keeps its
volume when squeezed, pops into place and goes still. Motion with that quality makes an app feel
friendly and alive. Done carelessly, the same tools make it look like a toy or a template. This
skill is the difference. `motion-system` sets the engine and the calm rules; `interaction-feel`
covers each control under the finger; this is the character layer on top.

## What makes something feel like a bubble

1. **It has volume.** Squashed one way, it stretches the other, so width × height stays about the
   same. Squash without stretch reads as shrinking, not squishing.
2. **It comes from somewhere.** It grows out of the thing that made it (the finger, the button,
   the icon), with its transform origin there. Something that grows from its own centre looks
   pasted on.
3. **It has surface tension.** Neighbours that touch merge; when they part, a neck stretches and
   snaps. That is what "gooey" means.
4. **It has a little inertia.** Parts lag their parent by a frame or two: the icon inside a button
   lands 30–40 ms after the button.
5. **It settles fast.** One clear overshoot, at most a small second one, then stillness, all in
   about half a second. A bubble that keeps wobbling is jelly.

## Tune springs by overshoot

Damping decides how far a spring overshoots; response decides how long it takes. Choose the
overshoot first, by feel, then the speed.

| Damping | Overshoot | Feels | Use |
|---|---|---|---|
| 0.86 | about 0.5% | firm, premium | a press releasing, a sheet, most state changes |
| 0.70 | about 5% | soft | a card following a drag, a toggle knob |
| 0.62 | about 8% | bubbly | a check, a chip landing, a badge, a sticker |
| 0.55 | about 13% | lively | the one reward moment of a screen |
| below 0.45 | 20% or more | a toy, jelly | never |

Response: 0.30 s for small things, 0.38 s for a pop, 0.45–0.55 s for anything big. Bigger things
move slower; a big thing on a fast spring looks weightless.

## Where bubbly lives, and where it never does

- **Bubbly:** what the person touches or earns. Buttons on release, checks, chips, toggles, badges,
  stickers, toasts, the hero character, a tab icon when selected, pull to refresh, drag handles.
- **Calm:** what the person reads. Headings, body text, content cards, charts, lists, prices,
  legal lines. These arrive on curves, never springs.
- **One lively moment per screen.** Two bubbly things at once compete, and both look cheap.

## The recipes

Each one has the board call and its SwiftUI and Compose twin in `references/recipes.md`.

1. **Squish press** (round things: a big round button, a sticker, a character). Down: 1.05 wide,
   0.93 tall, 90 ms. Release: back to 1 on a 0.34 / 0.6 spring, so it rebounds slightly the other
   way. Wide buttons don't squish; they press in with depth (`interaction-feel`).
2. **Pop from a source.** Scale 0.5 → 1 on a 0.38 / 0.62 spring, opacity in over the first third,
   origin at the source. Never from scale 0: that reads as appearing from nothing.
3. **Stretch in flight.** A thing that travels (a tab indicator, a toggle knob, a segmented thumb)
   stretches along its path in proportion to its speed, at most 1.18, squashes to about 0.92 on
   arrival for a frame, then settles.
4. **Goo.** Two shapes merge and split through a blur plus a sharp alpha threshold. Use it for a
   pill that splits into two buttons, a badge leaving its icon, a tab indicator jumping tabs.
5. **Follow-through.** Children run the same spring 30–40 ms later, or a slightly softer one.
6. **Breathing.** A hero waiting for a tap grows to 1.02 and back over about 3 s. Stop it the moment
   anything else moves. One per screen.
7. **Rubber band.** Past an edge, the offset is d × (1 − 1 / (x × 0.55 / d + 1)), where x is how far
   the finger went and d the size of the area; it springs back on a soft spring when let go.
8. **The no.** A wrong answer shakes sideways three times (8, −6, 4, 0 pt in 360 ms) with the warning
   haptic. Errors only.
9. **A count that lands** nudges up 2 pt and back once, for achievements only. Money rolls and time
   flows (`motion-system`); they never bounce.

## Haptics on the peak

Fire the haptic when the squash is deepest or the thing lands, not when the motion starts. That
one detail is most of what makes it feel physical.

## Tune it with the reviewer

- Build the recipe in three tunings side by side on the Kit view (Firm, Bubbly, Lively) as a Pick
  group, and let the reviewer choose by feel. Write the choice down as a standing rule.
- Slow it to a quarter speed, or capture frames (`visual-qa`), and count the oscillations you can
  see: one, maybe two.
- Watch the moment of contact. It should land, not arrive and then make up its mind.

## Never

- Everything bouncing on entrance: the generated-template look.
- Springs on text, prices or content cards.
- Canned elastic or bounce easing curves. Use real springs, which carry velocity when interrupted.
- Scale from 0. Squash without stretch. Stretch without the squash on landing.
- Two lively moments at once, or a loop that never stops.
- Ignoring Reduce Motion: swap springs for a 150 ms fade and keep the haptic.

## On the board

The template's Kit has a **Bubbly** group: the squish in three tunings, a pop from its source, a
gooey pill that splits in two, and a toggle that stretches in flight. Copy a tile, tune it, Pick.
