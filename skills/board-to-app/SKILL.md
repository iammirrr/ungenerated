---
name: board-to-app
description: Turn an approved board into a working native app, SwiftUI first and Jetpack Compose later, that looks and moves exactly like the board. Its motion plays itself as designed; only the board's fake inputs (auto-picks, typing, toggles) are left out. One debug host holds every screen in the board's order with the board's transitions, under a test bar to jump, replay, play, loop and slow down. Use the board's own clock, curves and springs, copy parts from the board's computed styles, and check the list of bugs that ports hit. Use when a board section is approved and must run on a phone, or when the native build "doesn't feel like the board".
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
8. **Then the next section**, into the same host: the test bar grows with each one (below).

## Motion plays itself; inputs wait for the person

A board shows two kinds of automatic behaviour, and only one of them ports.

- **Motion graphics port exactly, playing themselves.** An opening film runs beat to beat on its
  own; a story moves on after each beat's hold and is never skipped by a tap; showcases, flights
  and counts play as soon as their screen opens. Keep the board's timing to the millisecond. Never turn
  a self-playing sequence into tap-to-continue or a drag the person must do: that breaks the
  design the reviewer approved.
- **The designed tap points stay as designed.** A "Tap to focus" waits for the tap, with the
  board's fallback if it has one (a finger that taps after a few seconds is part of the film);
  the last button ("Get started") waits.
- **Fake inputs never port.** Board previews pick answers, type, toggle, swipe and accept
  promises so a reviewer can watch them. In the app, choices, forms and buttons wait for the
  person, always (also while the test bar plays). A question waits for its Continue: a pick never
  moves on by itself, so people can change their mind.
- **When a reviewer says "it continues by itself", ask which:** a demo input filling in their
  choices (remove it), or a sequence's own motion (keep it). Confirm before changing how a
  sequence advances.

## The test bar, for the whole board

One debug host holds every ported screen in the board's order, each entered with the board's
transition, under a floating bar (Liquid Glass on iOS 26). Reviewers asked for it on every screen:
"switch screens myself, play the animations, and loop any sequence".

1. A menu: every section, then its screens; "Play the whole flow".
2. Previous, next, replay; play and loop (each screen after its hold, never faking an input);
   1×, ½×, ¼×; hide.
3. A caption: "Section · 3 of 7 · name".
4. Launch switches: open the flow, start at a screen, start playing, and start with the bar folded
   away for screenshots that line up with the board.

Keep the app's own navigation native (tab bars, navigation bars, sheets, menus, alerts); only the
screens' content copies the board. A drawn tab bar belongs only inside pictures of the app.

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
| Lines of a title sit too far apart or too close | CSS `line-height` has no direct twin; native text uses the font's own line height | iOS 26: `lineHeight(.exact(points:))`; elsewhere set each line as its own text at the board's distance |
| Titles sit a few points low and the lines under them a point high, though their boxes match | In an exact line iOS places the glyphs differently from Chrome; for Poppins it is 0.668 × size − line ÷ 2 lower (34 pt titles 4.2 pt, 28 pt 2.5 pt, 15 pt lines −1.3 pt) | Measure your font once: the first row of ink on both screenshots for two sizes gives the constant. Pass the font size to your line-height modifier and offset the letters by it. Checked to 0.3 pt |
| The app picks, types, toggles or swipes for the person | The board's preview demo was ported | Remove the fake input; keep the motion around it (see above) |
| A self-playing sequence now stops at every step | Demos and motion were removed together | Restore the sequence's own timing; only fake inputs go |
| A jump-then-spring never moves (a check's pop, a tile's bounce, a pulse) | Setting the start pose and animating back in the same update cancels out, so SwiftUI sees no change | Set the pose without animation, then animate home a frame later |
| A value in a chip or row is cut with "…" | CSS keeps it whole (`white-space: nowrap`); a native stack compresses text to fit | `fixedSize()` and a higher layout priority on the value; let the label give way |
| A tinted texture or grain is darker than the board's | SVG filters (`feColorMatrix`, `feTurbulence`) work in linear RGB, so their numbers are lighter in sRGB | Convert the filter's colours to sRGB before drawing; compare the mean colour of a flat area |
| Something snaps to a new angle or size when its animation ends | The board's animation keeps only its start pose (`fill: backwards`), so the end pose drops | A board bug: fix the board's animation, then port the fixed version |
| A picker, field or switch looks drawn | The board imitates iOS controls | Use the real ones (menus, text fields with the keyboard, switches); keep the board's look only for its own design-system controls |
| A jump to screen n shows the wrong state | Screen n has no start state | Port the board's `scene(i)` |
| Jitter while something resizes | Layout every frame, or content inside a container that changes size | Finished views at their final size, moved by transforms and clipped by a shape that changes |
| "Unable to type-check this expression in reasonable time" | Long arithmetic mixing `CGFloat`, `Double` and literals | Split into typed `let`s; convert types explicitly |
| A copied part looks darker, with a heavier rim | An `::after` layer was missed, or an inset shadow was faked with a blurred stroke | Read the pseudo-elements; draw inset shadows exactly; compare crops pixel by pixel |
| It feels different from the board | Different numbers | Same durations, distances, curves and springs; compare both at ¼× |
| Smooth on the simulator, stutters on the phone | The simulator renders on the Mac's GPU | Test on a device; watch frame drops in Instruments |
| On first launch a choreography has already finished when its screen appears | The first draw after an install stalls the main thread (up to seconds); timers on wall time all fire behind the frozen screen | Run choreography on a scene clock that moves with the frames, each frame's step capped (50 ms): a stall pauses the scene. Reproduce by reinstalling, or by blocking the main thread for 2 s in a test build |
| A white flash between two screens | Mid-move both screens are partly transparent and nothing is under them | Draw the board's stage colour under every screen |
| A text button or link barely answers taps | With a custom button style only drawn pixels take taps; a clear pill behind the words doesn't count | Give the label a content shape over its whole pill, 44 pt tall, without changing the layout (pad, shape, pad back) |
| A tap that does nothing (the last screen's Done, Restore) | `next()` past the end, or a stub action | Every tap answers: it moves on, or a toast says what happened |
| Orphan lines on a narrower phone ("This helps us / build it.") | The board's line breaks were copied into the copy for the board's width | Keep copied breaks in body copy only at the board's width and let it wrap elsewhere; titles may keep theirs |
| The smallest phone hides the main button or pushes the title under the status bar | Layouts sized for the board's screen | Check the smallest supported phone (375 × 667 on current iOS): content scrolls above pinned actions, pictures scale to their room |
| VoiceOver reads file names, or every digit of a reel | Images and composed numbers expose their parts | Decorative images; one name per control; picked things marked selected; a reel speaks its value |

## Verify

- Launch on the simulator at each screen (`xcrun simctl launch <device> <bundle> -Section
  -SectionBeat n`) and take screenshots at chosen moments
  (`xcrun simctl io <device> screenshot`). Record the whole section with
  `xcrun simctl io <device> recordVideo`.
- Pull frames from the video at the board's milliseconds (`AVAssetImageGenerator` or `ffmpeg`).
  Lay them next to the board's frames from `visual-qa` at the same moments.
- **Motion, frame by frame.** Record the board with the browser's screencast (each frame carries
  its time) and the app with the simulator's recording. Align both on the first frame where the
  title's ink appears, then put them side by side at the same offsets (0, 60, 120, 200, 300,
  420, 600, 900 ms…). Entrances, staggers and flights show any difference at once.
- Start the app with the test bar folded away so its layout lines up with the board's.
- Read every frame for the bugs above: corners, wraps, a frame where something blinks out or pops.
- On a real phone: haptics, frame rate, ProMotion, light and dark.
- **Tap everything.** Drive each screen on a separate simulator (AXe, or a UI test): every button,
  Later and Skip included, every field with the keyboard up, Return, scrolling. Read the
  accessibility tree for names. Never test on the reviewer's own simulator.
- **The smallest phone**, and one fresh install (the first draw stalls; choreography must still be
  seen).
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
