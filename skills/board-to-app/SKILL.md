---
name: board-to-app
description: Turn an approved board section into a working native demo, SwiftUI first and Jetpack Compose later, that plays exactly like the board. Build one section alone behind a launch switch, with a test bar to replay any screen in slow motion. Use the board's own clock, curves and springs, copy parts from the board's computed styles, and check the list of bugs that ports hit. Use when a board section is approved and must run on a phone, or when the native build "doesn't feel like the board".
---

# Board to app

The board is the spec. A port is done when the phone plays the same thing at the same speed and
the reviewer can test it alone on a device: replay it, jump to any screen, slow it down.

## Order

1. **One section, alone.** Build only the approved section (say, the opening) in its own folder,
   and open it alone with a debug launch switch (`-Section`). Don't wire navigation, accounts or
   the rest of the app yet. If the reviewer asks for one section, don't touch anything else.
2. **The test bar before the motion.** The reviewer can't judge motion on a phone without it:
   replay, one button per screen, slow motion (1×, ½×, ¼×), hide, and a label ("3 of 7 · name").
   A launch argument starts at screen n (`-SectionBeat 3`) for repeatable screenshots. Debug
   builds only.
3. **The engine** (below): the board's canvas, one clock, the board's curves and springs.
4. **Beats, line by line.** Port each of the board's beat functions in the same order, with the
   same milliseconds and the same curves. Port the board's `scene(i)` too: the state screen i starts
   from. Then a jump to any screen starts where the previous screen ended.
5. **Parts from computed styles** (below). Build the button the reviewer sees on the board, not
   the app's existing component.
6. **Verify** with recordings and frame sheets on the simulator, then on a real device.
7. **Sync back.** The board stays the source. Any change asked for while testing on the phone
   also goes on the board in the same pass, and the online board is republished. When you hand
   over, show a sheet of every screen in the section, not just the last one.

## The engine

Full SwiftUI code (curves, tracks, director, stage, test bar), type-checked:
[references/swiftui-engine.md](references/swiftui-engine.md).

- **The board's canvas, scaled.** Lay out on the board's phone (390 × 844) with the board's
  positions in points, then scale that canvas to fit the device. Each number then matches a board
  number you can check.
- **One clock.** A single `TimelineView(.animation)` reads every value each frame. Each value is a
  track: from, to, start, duration, curve. A new move starts from wherever the value is now, so an
  interrupted move never jumps.
- **The board's curves and spring.** Solve its cubic-béziers the way the browser does. Use the
  same damped spring (response and damping fraction) with the same settle time. Copy the values
  from the board's kit (`F.CURVES`, `F.springCurve`); never eyeball them.
- **Beats in milliseconds.** `at(ms) { … }`, as on the board. A generation counter makes a replay
  cancel every pending beat.
- **A scene clock for slow motion.** Scene time = base + (wall − wall base) × speed, and timers
  sleep ms ÷ speed. Changing speed restarts the current screen.
- **Transforms and opacity only.** Nothing re-lays out while it moves. A finished view is built
  once at its final size, then moved, scaled and clipped (see `motion-system`, jitter).
- **Haptics on the board's moments.** The board shows them as chips. The simulator has no
  haptics; check them on a device.

## Parts: copy the computed style

When the reviewer says "use my button", they mean the one they see on the board. Open the board
and read the element's computed style (`getComputedStyle`): `background-image`, `box-shadow`
(inset or not), `border-radius`, height, font size and weight, colour. Build exactly that,
including the board's press. An existing design-system component can differ in every one of these
and brings behaviour the board doesn't have.

Read the pseudo-elements too (`getComputedStyle(el, '::after')`). Draw CSS inset shadows exactly,
then measure: capture both at 3× and compare them pixel by pixel. The conversions, the code and the
check are in [references/css-in-swiftui.md](references/css-in-swiftui.md).

## Bugs ports hit

| You see | Cause | Fix |
|---|---|---|
| Grey square corners round a rounded card | A mask or clip the size of the view also cuts its shadow; only the shadow's corners outside the rounded shape show | Never mask or clip a shadowed view with its own bounds. Clip the content, then draw the shadow on a background shape outside any clip. On the web, `clip-path` cuts `box-shadow` too (`overflow: hidden` does not) |
| A grey ring or dots above something that should be plain | A component's built-in effect (a burst, particles) drawn under a desaturate filter, or one the board doesn't have | Draw only the effects the board has. Check every reused component against a board frame |
| A label wraps on the phone but not on the board | The native font measures slightly wider than the browser's at the same size | One line with a small minimum scale (`lineLimit(1)` and `minimumScaleFactor(0.8)`), and keep a little spare room |
| Lines of a title sit too far apart or too close | CSS `line-height` has no direct twin; native text uses the font's own line height | Compare the two screenshots and adjust, or set each line as its own text at the board's distance |
| A jump to screen n shows the wrong state | Screen n has no start state | Port the board's `scene(i)` |
| Jitter while something resizes | Layout every frame, or content inside a container that changes size | Finished views at their final size, moved by transforms and clipped by a shape that changes |
| "Unable to type-check this expression in reasonable time" | Long arithmetic mixing `CGFloat`, `Double` and literals | Split into typed `let`s; convert types explicitly |
| A copied part looks darker, with a heavier rim | An `::after` layer was missed, or an inset shadow was faked with a blurred stroke | Read the pseudo-elements; draw inset shadows exactly; compare crops pixel by pixel |
| It feels different from the board | Different numbers | Same durations, distances, curves and springs; compare both at ¼× |
| Smooth on the simulator, stutters on the phone | The simulator renders on the Mac's GPU | Test on a device; watch frame drops in Instruments |

## Verify

- Launch on the simulator at each screen (`xcrun simctl launch <device> <bundle> -Section
  -SectionBeat n`) and take screenshots at chosen moments
  (`xcrun simctl io <device> screenshot`). Record the whole section with
  `xcrun simctl io <device> recordVideo`.
- Pull frames from the video at the board's milliseconds (`AVAssetImageGenerator` or `ffmpeg`).
  Lay them next to the board's frames from `visual-qa` at the same moments.
- Read every frame for the bugs above: corners, wraps, a frame where something blinks out or pops.
- On a real phone: haptics, frame rate, ProMotion, light and dark.
- Write down what you didn't prove: device feel, haptics, Reduce Motion, Dynamic Type.

## Compose (Android)

The same order and engine. Kotlin wasn't compiled for this skill, so check each call against your
Compose version.

| SwiftUI | Compose |
|---|---|
| `TimelineView(.animation)`, one clock | `LaunchedEffect(Unit) { while (true) withFrameNanos { now = it } }` |
| The canvas scaled to fit | A fixed `390.dp × 844.dp` box with `graphicsLayer { scaleX = k; scaleY = k }` |
| Transforms and opacity only | `graphicsLayer { translationX; translationY; scaleX; scaleY; rotationZ; alpha }`. Read animated values inside the lambda, so frames skip recomposition |
| Board curves | `CubicBezierEasing(x1, y1, x2, y2).transform(x)` |
| Spring (response, damping) | `spring(dampingRatio = damping, stiffness = (2π / response)²)`, or the same analytic spring as Swift |
| Shadow outside the clip | `Modifier.shadow(elevation, shape)` before any `clip(shape)` in the chain; a `clip` first cuts the shadow |
| One-line label | `maxLines = 1`, `softWrap = false`, and auto-size if your version has it |
| CSS `line-height` | `TextStyle(lineHeight = 1.15.em, lineHeightStyle = LineHeightStyle(LineHeightStyle.Alignment.Center, LineHeightStyle.Trim.Both))`, with `PlatformTextStyle(includeFontPadding = false)` |
| Launch switch and start screen | Intent extras in a debug build: `adb shell am start -n <app>/.MainActivity --es section opening --ei beat 3` |
| Screenshots and recording | `adb exec-out screencap -p > shot.png`, `adb shell screenrecord /sdcard/run.mp4` |
| Haptics | `View.performHapticFeedback(HapticFeedbackConstants.CONFIRM)` and the like |

Related: `native-port` (tokens, parts and the motion table), `motion-system`, `visual-qa`.
