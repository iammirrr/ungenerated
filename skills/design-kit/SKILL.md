---
name: design-kit
description: Build the design kit before any screen - colour tokens with light and dark, type scale, spacing and radius scale, grounds, and the parts sheet - and write them as CSS tokens plus native equivalents. Use when starting a board, when screens look inconsistent, or when someone asks for a design system, tokens, colours, fonts or a theme.
---

# Design kit

The kit is made first. Screens are assembled from it and nothing else, so changing a token changes
every phone on the board at once.

## What the kit contains

1. **Colour tokens** in `css/tokens.css` (the `design-board` template has the full list):
   ground, panel, inset, hair lines, four inks (strong, body, muted, quiet), one accent with its
   text and soft variants, the button, four status colours. Light and dark, both written by hand.
2. **Type.** One family, two at most. A display weight for titles, a text weight for everything
   else, tabular figures for anything that counts. One italic or colour accent for the key word of
   a heading (`F.rich('Plan your *day.*')`), never both.
3. **Spacing.** A 4-pt grid. Screen gutter 24. Row height 56–60. Gaps 8, 12, 16, 24.
4. **Radius scale.** Pills for actions and chips, 20 for cards, 16 for rows, 10 for tiles.
   **Inner radius = outer radius − the padding between them**, everywhere: a block inside a card,
   a highlight window around a row. Mismatched corners are the first thing a careful eye sees.
5. **Grounds.** Calm and one per screen: flat, or a soft low-contrast gradient between two near
   colours, with fine grain at most. Offer two or three as a Pick on the board; never invent a pattern.
6. **The parts sheet.** Every part in every state on kit tiles: buttons (default, pressed,
   disabled, loading), rows (default, picked), inputs (empty, focused, filled, error), toggles,
   sliders, segmented controls, chips, progress. See `references/parts-checklist.md`.

## Process

1. Ask for the brand's existing colours, font and logo. If there are none, ask three questions:
   warm or cool, quiet or loud, which app they wish theirs felt like.
2. Write `tokens.css`. Check contrast: body text 4.5:1, large text 3:1, in both themes.
3. Render the parts sheet on the board's Kit view and show it before any screen.
4. Export the same tokens for the native app (`native-port`): a Swift `Color` extension or Compose
   theme generated from the CSS, never hand-copied twice.

## Rules

- One accent. A second accent is a second brand.
- Dark mode is designed, not inverted: panels get lighter than the ground, shadows get deeper.
- No colour is used that is not a token.
- Grounds never compete with the hero: no glow or halo behind the hero object.

## Anti-patterns (they read as generated)

- Purple-to-blue or pink-to-orange gradients as the brand.
- Glassmorphism cards stacked on a blurred blob background.
- Every card with a coloured left border and an emoji.
- Three fonts, or a geometric display font on every label.
