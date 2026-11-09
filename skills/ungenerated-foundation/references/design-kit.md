<!-- Part of ungenerated-foundation. Was the `design-kit` skill. -->
> **When:** Build the design kit before any screen - colour tokens with light and dark, type scale, spacing and radius scale, grounds, and the parts sheet - and write them as CSS tokens plus native equivalents. Use when starting a board, when screens look inconsistent, or when someone asks for a design system, tokens, colours, fonts or a theme.

# Design kit

The kit is made first. Screens are assembled from it and nothing else, so changing a token changes
every phone on the board at once.

## What the kit contains

1. **Colour tokens** in `css/tokens.css` (the board template in `ungenerated-flows` has the full list: `../../ungenerated-flows/template/css/tokens.css`):
   ground, panel, inset, hair lines, four inks (strong, body, muted, quiet), one accent with its
   text and soft variants, the button, four status colours. Light and dark, both written by hand.
2. **Type.** One family, two at most. A display weight for titles, a text weight for everything
   else, tabular figures for anything that counts. One italic or colour accent for the key word of
   a heading (`F.rich('Plan your *day.*')`), never both.
3. **Spacing.** A 4-pt grid. Screen gutter 24. Row height 56–60. Gaps 8, 12, 16, 24.
4. **Radius scale.** A pick, not a default: one owner wants soft cards, another near-square corners.
   A starting point: pills for actions and chips, 20 for cards, 16 for rows, 10 for tiles.
   **Inner radius = outer radius − the padding between them**, everywhere: a block inside a card,
   a highlight window around a row. Mismatched corners are the first thing a careful eye sees.
5. **Grounds.** Calm, and the same across a flow. Flat by default; a soft low-contrast gradient
   only as a named exception the owner picked. Offer two or three as a Pick on the board; never
   invent a pattern, and never dots or pluses (every AI tool reaches for them).
6. **The parts sheet.** Every part in every state on kit tiles: buttons (default, pressed,
   disabled, loading), rows (default, picked), inputs (empty, focused, filled, error), toggles,
   sliders, segmented controls, chips, progress. See `design-kit-parts-checklist.md`.
7. **Surfaces and shadows.** Soft borderless panels, a hairline or a soft inner glow for edges.
   Shadows are rare, and never behind an icon, a logo or an emoji.
8. **Line icons.** See below.

## Line icons for the UI

One small outline set for tabs, toolbars, rows and states. Illustrated icons and the app icon belong
to `ungenerated-icons`.

- One family (the board template ships a Lucide subset in `../../ungenerated-flows/template/js/icons.js`;
  SF Symbols natively), one stroke width, one size grid (16, 20, 24).
- Icons people already understand, with a word under them in a tab bar. Never a text-only tab bar,
  never a row of unlabelled custom glyphs.
- One icon per state of a thing (new, in progress, done, posted), each different in shape, not only
  colour. Never reuse one kind's state icons for another kind.
- Every icon on the sheet in light and dark, at its real size, with no shadow.

## Process

1. Ask for the brand's existing colours, font, logo, site and any earlier prototype. Copy the exact
   values of anything already picked. If there are none, ask three questions:
   warm or cool, quiet or loud, which app they wish theirs felt like.
2. Write `tokens.css`. Check contrast: body text 4.5:1, large text 3:1, in both themes.
3. Render the parts sheet on the board's Kit view and show it before any screen: the parts alone,
   never a fake screen. Work it out with the owner two or three options at a time, and lock each pick.
4. Export the same tokens for the native app (`ungenerated-flows` › native-port, references/native-port.md): a Swift `Color` extension or Compose
   theme generated from the CSS, never hand-copied twice.

## Rules

- One accent. A second accent is a second brand.
- Dark mode is designed, not inverted: panels get lighter than the ground, shadows get deeper.
- No colour is used that is not a token.
- Grounds never compete with the hero: no glow or halo behind the hero object.

## Anti-patterns (they read as generated)

- Purple-to-blue or pink-to-orange gradients as the brand; indigo or violet accents.
- The stock serif-plus-grotesk pairing every generator picks.
- Glassmorphism cards stacked on a blurred blob background.
- Every card with a coloured left border and an emoji.
- Three fonts, or a geometric display font on every label.
