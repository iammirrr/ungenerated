---
name: motion-system
description: The motion rules and engine for app screens - curves, springs, durations, one live pose per object, cameras over devices, shared elements between screens, reduced motion, and their SwiftUI and Compose equivalents. Use whenever a screen moves, a transition looks jerky, twitchy, staged or "AI", or someone asks for smoother animation.
---

# Motion system

Motion is the part people feel before they read. Most "it looks cheap" notes are motion notes.
The `design-board` template ships the engine (`js/kit.js`): `F.move`, `F.tween`, `F.rise`,
`F.titleIn`, `F.swapText`, `F.timeText`, springs sampled the SwiftUI way.

## The curves (only these)

| Name | Bezier | Use |
|---|---|---|
| decel | 0, 0, 0.2, 1 | things arriving (a rise) |
| strong | 0.23, 1, 0.32, 1 | UI under 300 ms |
| emph | 0.16, 1, 0.3, 1 | a camera move, a value landing |
| inout | 0.76, 0, 0.24, 1 | one object travelling between two rests |
| exit | 0.4, 0, 1, 1 | leaving: always faster than arriving |

Springs only for things the finger touched (a press release, a check, a toggle knob). Content
never bounces: a card, a chart, a title arrive on a curve.

## Rules

1. **One live pose per object.** Every moving object keeps its current x, y, scale, opacity. A new
   move starts from where it is now and cancels the old one. No two animations fight over an element.
2. **Nothing swaps in mid-air.** When a value travels to a new screen, the same element (or two
   copies on one path, crossing over in the middle) arrives. Never fade one out and pop another in.
3. **A hero stays.** Across the beats of an opening or story, the hero object stays on screen and
   moves; the words and the rest change around it.
4. **Cameras move devices whole.** To show a phone or a laptop, draw it at full size once and move
   a camera (translate + scale on its parent). Never crop a device with the frame, never let it run
   off the edge, never shrink it to fit by changing its layout.
5. **Morphs keep the content upright.** When one device becomes another (phone → laptop), the screen
   content stays the right way up and as large as the glass allows the whole time.
6. **Leaving is faster than arriving.** Exits 180–320 ms; entrances 420–680 ms.
7. **Stagger by 40–90 ms**, never more than five items in a wave.
8. **Text changes as words.** Old words lift and blur out (240 ms), new ones rise in (520 ms).
9. **Time flows, money rolls.** Durations and clocks glide through the values in between
   (`F.timeText`); prices roll on slot-machine reels (`F.reel`). Never the reverse.
10. **Reduced motion** lands every move on its final frame at once, and still shows the result.
11. **Measure after fonts load.** Any position read from layout waits for `document.fonts.ready`.

## Native equivalents

| Board | SwiftUI | Compose |
|---|---|---|
| curve `emph` 620 ms | `.timingCurve(0.16, 1, 0.3, 1, duration: 0.62)` | `tween(620, easing = CubicBezierEasing(.16f, 1f, .3f, 1f))` |
| spring 0.42 / 0.86 | `.spring(response: 0.42, dampingFraction: 0.86)` | `spring(dampingRatio = .86f, stiffness = ...)` |
| shared element | `matchedGeometryEffect` | `SharedTransitionLayout` + `sharedElement` |
| camera | `scaleEffect` + `offset` on a container | `graphicsLayer { scaleX; translationX }` |
| word swap | `.transition(.asymmetric(...))` per word | `AnimatedContent` |

Only transform, opacity, blur and clip move on the board, so every move has a native twin.

## Going further

- `bubbly-motion`: the soft, alive layer for what the finger touches (squish, pop, goo, stretch).
- `continuity`: planning a flow so one thing carries into the next (the thread sheet, the baton).

## How to fix "it's jerky"

1. Capture the move frame by frame (`visual-qa`).
2. Look for: a pop (opacity 0→1 in one frame), a jump (an element changing parent), two animations
   on one element, a layout read before fonts loaded, a delay that leaves the screen empty.
3. Fix the cause, never by slowing everything down.
