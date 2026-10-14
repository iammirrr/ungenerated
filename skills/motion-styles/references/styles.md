# The seven styles, in tokens

Every style is the same set of slots. The board's engine (`design-board` template, `js/styles.js`)
reads them; port the same numbers natively. Durations are in milliseconds, springs are SwiftUI's
`response / dampingFraction`, distances in points.

| Slot | What it moves |
|---|---|
| `title` | a heading arriving (`F.titleIn`) |
| `content` | the wave of content arriving (`F.rise`) |
| `pop` | a small thing appearing in place: a check, a chip, a badge (`F.pop`) |
| `press` | a button under the finger (`F.press`, every `F.primary`) |
| `swap` | words or a value changing in place (`F.swapText`, `F.setValue`) |
| `out` | leaving (`F.exit`) |
| `idle` | the hero waiting (`F.idle`): one per screen |
| `reel` | the spring a rolling number lands on (`F.reel`): calm, precise and cinematic use damping 1, so money never overshoots |
| `enter` | the move from the last screen to this one |

## Curves

| Name | Bezier | Feels |
|---|---|---|
| calm | 0.37, 0, 0.63, 1 | sine in-out: nothing hurries |
| standard | 0.4, 0, 0.2, 1 | measured, no overshoot |
| emph | 0.16, 1, 0.3, 1 | emphasised: a value landing |
| cine | 0.65, 0, 0.35, 1 | cubic in-out: a camera move |
| grow | 0.33, 1, 0.68, 1 | cubic out: growth that settles |
| snap | 0.15, 0.95, 0.25, 1 | very fast out: lands hard |
| decel | 0, 0, 0.2, 1 | a plain rise |
| exit | 0.4, 0, 1, 1 | leaving |

## Calm: nothing hurries

| Slot | Move |
|---|---|
| title | opacity 0 → 1, blur 10 → 0, y 4 → 0, 1100 ms calm |
| content | opacity, blur 6 → 0, y 6 → 0, 900 ms calm, 120 ms apart |
| pop | scale 0.96 → 1 with opacity, 700 ms calm (no spring) |
| press | scale 0.985 and opacity 0.8 in 160 ms; back in 480 ms calm |
| swap | out through a blur in 480 ms; in through a blur in 900 ms |
| idle | breathe: scale 1 → 1.035 and back, 4.8 s each way |
| enter | `fade`: the old screen dims and blurs, the new one clears through a blur, 980 ms |

SwiftUI: `.animation(.timingCurve(0.37, 0, 0.63, 1, duration: 0.9))`; the fade is
`.transition(.opacity.combined(with: .modifier(active: Blur(10), identity: Blur(0))))`.
Compose: `tween(900, easing = CubicBezierEasing(.37f, 0f, .63f, 1f))`.

## Snappy: every move lands on the beat

| Slot | Move |
|---|---|
| title | slam: scale 1.16 → 1, y −4 → 0, spring 0.26 / 0.7 |
| content | y 28 → 0 with opacity, spring 0.3 / 0.82, 35 ms apart |
| pop | scale 1.4 → 1 (it lands, it does not grow), spring 0.24 / 0.72 |
| press | scale 0.93 and 1 pt down in 60 ms; back on spring 0.22 / 0.6 |
| swap | old drops 16 pt out in 110 ms; new falls from 20 pt above on spring 0.26 / 0.75 |
| idle | pulse: scale 1.07 in the first 8% of every 1.2 s |
| enter | `push`: 340 ms on the snap curve, the old screen drifts back a quarter |

SwiftUI: `.spring(response: 0.26, dampingFraction: 0.7)`; the push is NavigationStack's push or
`.transition(.push(from: .trailing))` with `.timingCurve(0.15, 0.95, 0.25, 1, duration: 0.34)`.
Haptics: `.rigid` on landings.

## Bubbly: soft, round, alive

| Slot | Move |
|---|---|
| title | the engine's title (rise 10 pt with a blur 6 → 0, 520 ms strong) |
| content | y 10 → 0 with opacity, 460 ms decel, 55 ms apart (content never bounces) |
| pop | scale 0.5 → 1 from its source, spring 0.38 / 0.62 |
| press | squash 1.06 wide × 0.92 tall from the base in 90 ms; back on spring 0.34 / 0.6 |
| swap | old shrinks to 0.8 out in 150 ms; new pops 0.6 → 1 on spring 0.38 / 0.62 |
| idle | bob: up 6 pt and back with a squash on landing, 2.2 s |
| enter | `step`: the parts slide out and in |

See `bubbly-motion` for goo, stretch in flight and the overshoot table.

## Precise: measured, like a ledger

| Slot | Move |
|---|---|
| title | wipe: a clip reveals it left to right, x 6 → 0, 420 ms standard |
| content | wipe, x 10 → 0, 360 ms standard, 45 ms apart |
| pop | scale 0.9 → 1 with opacity, 220 ms standard |
| press | scale 0.98 in 80 ms; back in 180 ms, no overshoot |
| swap | wipe out to the right in 200 ms; wipe in from the left in 340 ms |
| value | numbers roll on reels, digit by digit (`F.reel`) |
| idle | none: precise screens are still when nothing changes |
| enter | `push`: 460 ms standard, the old screen drifts back a third |

SwiftUI: `.animation(.timingCurve(0.4, 0, 0.2, 1, duration: 0.36))`; wipes are a mask whose width
animates; numbers use `.contentTransition(.numericText())`.

## Fluid: one shape becomes the next

| Slot | Move |
|---|---|
| title | y 16 → 0 with opacity and blur 10 → 0, 760 ms emph |
| content | y 22 → 0, scale 0.98 → 1, blur 4 → 0, 680 ms emph, 60 ms apart |
| pop | scale 0.7 → 1 with blur 8 → 0, spring 0.5 / 0.78 |
| press | scale 0.96 in 120 ms; back on spring 0.42 / 0.75 |
| swap | out up 10 pt through a blur in 260 ms; in from 14 pt below through a blur in 640 ms |
| idle | wave: a slow drift of 3–4 pt and 1% scale, 6.4 s |
| enter | `carry`: every `[data-shared]` value flies to its twin on the next screen |

SwiftUI: `matchedGeometryEffect` for every carried value; `.spring(response: 0.5,
dampingFraction: 0.78)`. Compose: `SharedTransitionLayout` and `sharedElement`.

## Cinematic: a camera, not a cursor

| Slot | Move |
|---|---|
| title | lines: each line rises out of a mask fixed at its foot, 900 ms cine, 90 ms apart |
| content | curtain: a clip reveals the block bottom-up while it settles from y 24 and scale 1.04, 900 ms cine, 130 ms apart |
| pop | scale 1.08 → 1 with opacity, 900 ms cine (it settles, it does not grow) |
| press | scale 0.97 in 120 ms; back in 420 ms cine |
| swap | the old line rises out of a mask at its top in 420 ms; the new rises from its foot in 760 ms |
| idle | drift: photos zoom 1 → 1.07 over 9 s and back |
| enter | `iris`: the next screen opens in a circle from the finger, 820 ms cine |

SwiftUI: lines are separate `Text` views in a `.mask(Rectangle())` with an offset; the iris is
a `Circle` mask whose scale animates from the tap point. Compose: `Modifier.clip` plus
`graphicsLayer { translationY }`; the iris is a `GenericShape` circle.

## Organic: things grow

| Slot | Move |
|---|---|
| title | y 10 → 0 with opacity and blur 4 → 0, 720 ms grow |
| content | y 12 → 0, scale 0.96 → 1, a turn of −1.5° → 0, 680 ms grow, 80 ms apart |
| pop | sprout: scale 0.4 → 1 from its base, spring 0.5 / 0.7 |
| press | scale 0.95 with a 1° turn in 110 ms; back on spring 0.4 / 0.68 |
| swap | out up 6 pt in 240 ms; in from 10 pt below with a turn, 640 ms grow |
| idle | sway: ±1.6° from the base, 3.6 s each way |
| enter | `grow`: the next screen grows up from the bottom edge, its parts unfurling |

SwiftUI: `.anchor(.bottom)` on scale effects; the grow is a rounded-rect mask whose top edge
animates up. Compose: `TransformOrigin(0.5f, 1f)` in `graphicsLayer`.

## Haptics by style

| Style | Landing | Selection |
|---|---|---|
| Calm | soft | soft |
| Snappy | rigid | selection |
| Bubbly | light, on the squash's deepest point | selection |
| Precise | selection on each step | selection |
| Fluid | soft, when the carried value lands | selection |
| Cinematic | soft, at the end of a camera move | none |
| Organic | soft | selection |

## Reduced motion

Every style collapses to its end state at once (the engine does it): no blur, no clip, no loop,
and the haptic still fires. The calm fade becomes a 150 ms opacity change; nothing else moves.
