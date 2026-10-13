---
name: app-screens
description: Design the app's own screens after onboarding - tab bar, home or dashboard, calendars and timelines, lists, detail screens, settings, empty and loading states - from the kit, consistent with the onboarding's promises. Use when designing any core product screen on the board.
---

# App screens

## Rules

1. **The app keeps the onboarding's promises.** Every surface the opening showed exists here and
   looks the same.
2. **Five tabs at most**, labelled, with the current one filled. The main action lives on the home
   screen, not in a floating button that covers content.
3. **One radius per element type**, nested correctly. Calendar blocks share one radius.
4. **Show only what fits.** A short calendar block shows its project; a taller one its title; the
   tallest its time. Never squeeze three lines into a 30-pt block.
5. **Numbers that count**: time flows, money rolls, both tabular.
6. **Empty states** say what will appear and offer the one action that fills them.
7. **Loading** keeps the layout (skeletons shaped like the content), never a centred spinner.
8. **Settings** in plain groups; destructive actions last and red.
9. **The plan lives in Settings**, where people look: price, next charge, who bills it, a cheaper
   way to pay, then Cancel as a plain row with its true consequence (`cancel-flow`).

## Patterns worth reusing

- A day calendar with Plan beside Tracked lanes and a now-line.
- A ring for a daily goal with its parts (productive, idle, break) in their own colours.
- A week as seven columns with the goal as a line.

- **A ring split by project is one continuous band.** The colours meet edge to edge with flat
  joins (butt caps, no gaps); only the start and the moving tip are round. Drawn in, it is one
  stroke that changes colour as it passes each project, not separate pills appearing with gaps.

## Anti-patterns

- Dashboards of identical stat cards.
- Charts without a single sentence of meaning.
- Different corner radii on cards in the same list.
