---
name: design-board
description: Scaffold and run a live design board for a mobile app - every screen a working phone in rows, the kit in its own view, research in its own view, transitions side by side, Pick and Note on every card, and Play the flow full screen. Ships a ready template (engine, parts, transitions, local server, screenshot tools). Use when starting to design screens, when someone wants to "see all the screens", review a flow, or prototype motion before building natively.
---

# Design board

The board is where an app is designed and reviewed before it is built. Every screen is a live
390 × 844 phone that plays its motion; the reviewer picks variations and leaves notes on the
screens themselves; "Play the flow" walks the whole journey full screen.

## Start one

1. Copy `template/` from this skill into the project, for example `design/board/`.
2. Fill in `board.config.js`: the app's name, one section per part of the flow (in order), the
   kit sections (`view: 'kit'`), and research cards as you gather them (`app-research`).
3. Replace `css/tokens.css` with the app's kit (`design-kit`).
4. Write screens in `js/screens/<section>.js` with `F.def({...})`, one file per section, and add
   each file to `index.html` before `js/board.js`.
5. Run `node tools/serve.mjs` and open the printed address. On a phone on the same Wi-Fi, open the
   second address to review with real fingers. Picks and Notes save to `review/store.json`.

## A screen

```js
F.def({
  id: 'q-goal', section: 'questions', name: 'What are you here for?',
  flow: true,            // part of Play the flow
  enter: 'step',         // how it is entered: cut, dissolve, step, layer, carry, cover
  progress: 0.3,         // the question bar
  group: 'goal-style',   // variations share a group; the reviewer Picks one
  intent: 'One sentence: what this screen is for.',
  build(ctx) {
    const { body } = F.frame(ctx);
    body.append(F.qTop(ctx, { progress: 0.3 }), F.qHead(ctx, 'What are you *here for?*'));
    // ctx.at, ctx.loop, ctx.on, ctx.haptic, ctx.next, ctx.answers, ctx.mode ('board' | 'flow' | 'demo')
  },
});
```

- A **whole-part card** leads each row: `F.def({ id: 'seq-questions', section: 'questions', seq: true })`.
  It plays the section's screens in order with their real transitions and is outlined on the board.
- In `ctx.mode !== 'flow'` a screen may demo itself (a finger taps the answer); in the flow it waits
  for the person.
- `#only-<id>` shows one screen at real size; `#play` and `#play-<id>` open the flow.

## The board's layout (keep it)

- Views in the order of the work: **Research · Kit · Screens · Transitions**.
- Each card: a small tool bar (number, Replay, Note, Pick, ⓘ), the phone, one line with its name.
  The description and the note sit behind ⓘ, over the phone. Nothing else around the card.
- The first card of a row is the whole part, outlined, the same size as the rest.
- Variations are a Pick group, not extra rows.
- Theme switch (Auto, Light, Dark) and Play the flow in the top bar. Nothing else up there.

## Publish it

To share with a reviewer who is not on your machine, publish the folder as a private web page
(for example a Claude artifact, or any static host behind a login). Picks and Notes then save to
that page's store.

## Rules

- No native code for a screen until it is approved here.
- Use only motion that the native platform can reproduce (transform, opacity, blur, clip).
- One screen file per section; shared parts go in `js/parts.js`, never copied between screens.
