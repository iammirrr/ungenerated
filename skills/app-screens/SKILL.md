---
name: app-screens
description: Design the app's own screens after onboarding - tab bar, home or dashboard, calendars and timelines, lists, detail screens, settings, empty and loading states - from the kit, consistent with the onboarding's promises. Use when designing any core product screen on the board.
---

# App screens

## Rules

1. **The app keeps the onboarding's promises.** Every surface the opening showed exists here and
   looks the same.
2. **A companion copies its parent's mechanics, words and defaults.** If the product already
   exists on another platform, read its code before drawing a screen: how it asks, when, what it
   stores, what it calls things. Inventing a feature the product doesn't have (a journal where the
   product asks a check-in question) breaks the promise that both are one product.
3. **Five tabs at most**, labelled, with the current one filled. The main action lives on the home
   screen, not in a floating button that covers content.
4. **One radius per element type**, nested correctly. Calendar blocks share one radius.
5. **Show only what fits.** A short calendar block shows its project; a taller one its title; the
   tallest its time. Never squeeze three lines into a 30-pt block.
6. **Numbers that count**: time flows, money rolls, both tabular.
7. **Empty states** say what will appear and offer the one action that fills them.
8. **Loading** keeps the layout (skeletons shaped like the content), never a centred spinner.
9. **Settings** in plain groups; destructive actions last and red.
10. **The plan lives in Settings**, where people look: price, next charge, who bills it, a cheaper
   way to pay, then Cancel as a plain row with its true consequence (`cancel-flow`).

## Patterns worth reusing

- **The check-in.** Ask one short question on a rhythm the person sets ("What did you do since
  14:15?", every 15 minutes of real work, pausing during breaks), as a card that rises from the
  bottom: a one-line field, Skip, the main action, a switch for context. Pin the answer to the
  stretch it covers and show it where the time is shown (the block's title), so the record writes
  itself. When the field is empty and an earlier answer exists, the main action becomes "Same as
  before". Missed ones wait in an updates list; the answer is personal data, so keep it on the
  device unless the person chooses otherwise.
- **Tasks that fill like a water tank.** A planned task is an outlined box on the day; the time
  tracked inside it fills it from the bottom. Plan and actual become one picture, with no second
  lane to compare. A past task with nothing tracked turns grey.
- **Calendar blocks** with small, even corners (about 7 pt), no accent bar, the project as a tab,
  the person's own words as the title, a thin split of active / idle / break along the bottom and a
  small gap under each. A running block reads "14:35 – now".
- **Phones can't see idle.** A phone knows a session ran, not whether the person worked; count
  phone time as active or break, and show idle only from a device that can measure it.
- A day calendar with Plan beside Tracked lanes and a now-line.
- A ring for a daily goal with its parts (productive, idle, break) in their own colours.
- A week as seven columns with the goal as a line; stacked parts meet with no gap.

- **A ring split by project is one continuous band.** The colours meet edge to edge with flat
  joins (butt caps, no gaps); only the start and the moving tip are round. Drawn in, it is one
  stroke that changes colour as it passes each project, not separate pills appearing with gaps.

## The micro screens every app needs

Design these with the screens, not after; each is small, and each is where people decide whether
the app feels finished.

- **Sheets** for choosing (switch project, a technique), for details (a session: what you did, how
  the time split), for editing (a task: name, project, start and end, status, delete) and for one
  line of input (a note). A grab handle, a title, the content, one main action.
- **Cards that rise from the bottom** for a question or a nudge in the middle of work (a check-in,
  "Time for a break?", "Ready when you are."), above the tab bar, never covering the main control.
- **Toasts** for what just happened, in under three seconds, one at a time, with Undo when it can
  be undone ("Switched to Admin", "Break started", "Note saved").
- **The platform's own alert** for anything destructive, with the destructive word in red and a
  safer choice first ("Delete Side project?" → Cancel, Archive instead, Delete).
- **Notifications** in the app's own words, each with a switch in Settings, and the important ones
  answerable without opening the app (a reply field on the Lock Screen).
- **An updates list** for what the person missed while away.

## Anti-patterns

- Dashboards of identical stat cards.
- Charts without a single sentence of meaning.
- Different corner radii on cards in the same list.
