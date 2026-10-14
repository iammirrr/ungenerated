---
name: motion-styles
description: Give an app its own motion personality instead of the one generic bounce - choose one of seven styles (calm, snappy, bubbly, precise, fluid, cinematic, organic) from what the app is for, apply it with one setting on the design board, and port it with its SwiftUI and Compose tokens. Use when starting an app's motion, when every app "moves the same", when motion feels generic, templated or wrong for the product (a sleep app that bounces, a bank that wobbles), or when someone asks for a motion style, feel or personality.
---

# Motion styles

Generated apps all move the same way: everything fades up with the same bounce. Real products
have a motion personality, and it says what the product is before a word is read. A sleep app
that snaps feels anxious; a bank that wobbles feels unsafe; a running app that drifts feels slow.

`motion-system` sets the rules every style keeps (curves, one live pose per object, exits faster
than entrances, reduced motion). This skill picks the personality on top. `bubbly-motion` is the
deep dive on one of the seven.

## The seven styles

| Style | It feels | Use for | Signature moves | Never |
|---|---|---|---|---|
| **Calm** | Nothing hurries. | sleep, meditation, health, journaling | 900 ms sine in-out; fades through a soft blur; a breathing hero; a slow fade between screens | springs, slams, anything under 400 ms |
| **Snappy** | Every move lands on the beat. | fitness, sport, games, music | 120–340 ms; stiff springs (0.26 / 0.7); headlines slam down from 116%; a hard push between screens; a pulse on the beat | drift, blur, long fades |
| **Bubbly** | Soft, round, alive. | language, kids, habits, social | springs 0.38 / 0.62; squash that keeps volume; pops from the source; a bobbing mascot | bounce on text or content, two lively things at once |
| **Precise** | Measured, like a ledger. | money, productivity, tools | 180–460 ms standard curve; clip wipes left to right; numbers roll digit by digit; one axis at a time; a push between screens | overshoot, rotation, blur, idle loops |
| **Fluid** | One shape becomes the next. | diet, health tracking, utilities | 640–760 ms emphasised curve; shared elements that fly and turn into their twin; liquid fills; soft springs | hard cuts, things appearing from nowhere |
| **Cinematic** | A camera, not a cursor. | food, travel, reading, fashion | 760–1100 ms cubic in-out; lines rise out of masks; images revealed bottom-up while the camera settles; slow drift on photos; an iris from the finger between screens | springs, pops, small fast moves |
| **Organic** | Things grow. | plants, gardening, wellbeing, nature | 640–760 ms cubic out; things sprout from their base; a slight turn as they settle; a sway; the next screen grows up from the bottom | linear moves, perfect symmetry, hard edges in motion |

Full tokens, the move for every helper, and the SwiftUI and Compose twins are in
`references/styles.md`.

## Choose one

1. Start from `app-concept`: what the person feels when the app works. Rested → calm. Strong →
   snappy. Delighted → bubbly. In control → precise. Light → fluid. Inspired → cinematic.
   Nurtured → organic.
2. Check it against the category in the table, then against the audience. A kids' bank is
   bubbly, not precise; a meditation app for athletes may be snappy in its timer and calm
   everywhere else (see Mixing).
3. **Show it, don't describe it.** Put the style tiles on the board's Kit view (the template has
   them: the same screen moving seven ways) and let the reviewer pick by feel. Write the pick
   down as a standing rule.

## Apply it on the board

The `design-board` template ships the engine (`js/styles.js`). One setting moves every screen:

```js
window.BOARD = { style: 'calm', ... };              // the whole app
F.def({ id: 'tonight', style: 'calm', ... });       // or one screen
```

Then the usual helpers move in that style without any other change: `F.titleIn` (a calm fade, a
snappy slam, a cinematic line mask), `F.rise` (the wave of content), `F.pop` (a check, a chip),
`F.press` (every button), `F.swapText` and `F.setValue` (words and values changing), `F.idle`
(the hero waiting), and the screen-to-screen move (`fade`, `push`, `step`, `carry`, `iris`,
`grow`). A screen can still name its own `enter`.

## Mixing

- **One personality per app.** A second style is a second brand.
- **A moment may borrow, the app may not.** A calm app can let one achievement pop (bubbly) and
  a snappy app can let its sleep screen fade (calm). Mark the borrowed screen with its own
  `style`, and keep it to one screen per flow.
- **Touch stays physical in every style.** Every style presses in under the finger and comes
  back; only how far and how fast changes.
- **Content never bounces**, in any style. Snappy slams headlines with a stiff, nearly
  critically damped spring; bubbly springs only what the finger touched or earned.

## Port it

The style is a token set, not a set of animations. Port the tokens once (`native-port`):

- SwiftUI: one `MotionStyle` struct with `enter`, `content`, `title`, `press`, `pop`, `swap`,
  `idle`, read from the environment (`.environment(\.motionStyle, .calm)`), so every view uses
  the same values.
- Compose: a `MotionStyle` data class in a `CompositionLocal`, the same seven instances.

## Check

- Watch the whole flow at full speed, then at a quarter (`visual-qa`). Can you name the style
  without seeing the colours?
- Pause any frame: does anything move against the style (a bounce in calm, a drift in snappy)?
- Reduce Motion: every style lands on its final frame and keeps its haptics.
