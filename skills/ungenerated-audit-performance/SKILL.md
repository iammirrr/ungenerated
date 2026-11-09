---
name: ungenerated-audit-performance
description: Measure whether an app is fast, light and calm on battery, on a real device (simulator runs flagged as such): cold and warm launch, time to first frame, hangs and dropped frames on the main flows and animations, memory and leaks, energy, network, app size, main-thread work, and the cost of big lists and images. Every number is compared with a budget (cold launch under 400 ms to first frame, no hang over 250 ms, 60/120 fps on key animations) and every finding comes with the trace that proves it. Instruments and xctrace for iOS/Mac, Macrobenchmark and Perfetto for Android, Lighthouse for web. Use for "performance audit", "why is my app slow", "app feels laggy", "launch is slow", "scrolling stutters", "battery drain", "memory leak", "app too big", "profile the app", or before launch. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Performance audit: fast, light and calm on battery, measured

For: finding what makes the app feel slow or drain the battery, with numbers from traces, not impressions. Every finding has a trace file the owner can open. Nothing is changed until the owner approves.

## Steps

1. **Learn the app.** Write the App profile (or take the runner's): platforms, UI framework (SwiftUI, UIKit, React Native, Flutter, Compose, web), the main flows and their animations, the heavy parts (long lists, images, video, audio, maps, AI streaming, sync), third-party SDKs that start at launch, AGENTS.md / CLAUDE.md rules (one simulator, sequential tests). Ask the owner which device they and their users have (the oldest supported phone matters most) and whether one is connected.
2. **Pick the device and the build.** A **real device**, the oldest supported one if possible, a **Release** build (Debug is many times slower and lies), signed in as a test user with realistic data (hundreds of items, not three). If only a simulator is available, measure anyway and label every number "simulator: relative only". Note the OS version, battery level and thermal state; plug in for timing runs, unplug for energy.
3. **Measure against the budgets.** Run each measurement in `references/commands.md` and record it against `references/checklist.md`: launch (cold and warm, 5 runs, median), hangs and hitches on each main flow and key animation, memory over a 10-minute session and leaks, energy, network on launch and per action, app size, main-thread work, lists and images. Save every trace (`.trace`, Perfetto, Lighthouse JSON) in a dated folder in the project so findings can be re-opened.
4. **Find the cause, not just the symptom.** For each budget missed, open the trace at the bad interval and name the cause with the call stack or the view that was evaluated (heavy view bodies, synchronous disk or network on the main thread, decoding big images, SDK init at launch, layout loops, a timer that never stops). Read the code at that file:line.
5. **Audit the catalogue.** Every row of `references/checklist.md` gets a verdict: ❌ over budget (number, trace, file:line), ⚠️ suspected (what measurement would settle it), ✅ within budget (number and trace), N/A (why).
6. **Report and stop.** Result first: the three things a person would feel most, in plain words ("opening the app takes 1.4 s on an iPhone 12; the goal is under 0.4 s"). Then a table: metric · budget · measured · device · trace · cause · fix. Coverage ("14 budgets measured on iPhone 12, iOS 26.1, Release"). A **numbered fix list** with the expected gain and effort. Change nothing until the owner answers with numbers, "all" or "none".
7. **Fix only what was approved, then re-measure.** Fix the cause, re-run the same measurement on the same device and build, and show before and after. A fix that doesn't move the number is reverted. Add a regression check where cheap (an XCTest metric test, a Macrobenchmark, a Lighthouse budget in CI). Then a short final report.

## Never

- Never call it fast or smooth without a number from a trace; "feels fine" is not a result.
- Never measure a Debug build, and never present simulator numbers as real-device numbers.
- Never change code before the owner approves; a "quick optimisation" can break motion the owner picked.
- Never trade away an approved animation or feature for speed without asking; make it cheaper instead.
- Never run several simulators or parallel builds while measuring; the machine's load ruins the numbers.
- Never fix a guess: find the cause in the trace first, then re-measure after.
- Never leave profiling code, extra logging or signposts that cost time in the Release build.

## Read when

| You are… | Read |
|---|---|
| Setting budgets and auditing | `references/checklist.md` |
| Running the measurements (iOS, Android, React Native, web) | `references/commands.md` |
| Wanting the why behind each rule | `references/lessons.md` |

## Works with

- `ungenerated-audit` runs this with the other seven.
- `ungenerated-motion` owns how animations should feel; this audit proves they hold their frame rate.
- `ungenerated-review` checks motion on real frames; hand it the hitchy animations this audit finds.
- `ungenerated-audit-code` finds the dead code, unused assets and huge files that also make the app big and slow.
- `ungenerated-flows` › board-to-app (references/board-to-app.md) for carrying board motion into native code that stays smooth.
