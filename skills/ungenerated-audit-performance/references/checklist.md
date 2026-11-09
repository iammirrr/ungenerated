# Performance checklist and budgets

Every numbered item: ❌ over budget, ⚠️ suspected, ✅ within budget, N/A. Each verdict carries the number, the device, the build and the trace file. ★ = commonly missed. Budgets below are starting points from Apple's and Google's published guidance (as of late 2026); re-check the current docs (Apple: developer.apple.com/documentation/xcode/improving-your-app-s-performance; Android: developer.android.com/topic/performance/vitals) and agree the budgets with the owner before measuring.

## Budgets

| Metric | Budget (iOS) | Budget (Android) | Web |
|---|---|---|---|
| Cold launch to first frame | < 400 ms | Android vitals flags ≥ 5 s cold; aim < 1 s | LCP < 2.5 s |
| Warm launch / resume | < 200 ms | flagged ≥ 2 s warm, ≥ 1.5 s hot | |
| Hang (main thread blocked) | none ≥ 250 ms; microhangs (100–250 ms) on taps fixed | ANR = 5 s; aim no frame > 700 ms (frozen) | INP < 200 ms |
| Frame rate on key animations and scrolls | steady 60 fps, 120 fps on ProMotion; hitch time ratio < 5 ms/s (10+ is bad) | < 1% slow frames (> 16 ms), 0 frozen | CLS < 0.1 |
| Memory | steady state well under the device limit; no growth over a 10-minute loop; 0 leaks in your code | same; no `OutOfMemory` | |
| Energy | no CPU when idle on a static screen; no wakeups/timers in background | no wakelocks held; no background work without reason | |
| Network on launch | only what the first screen needs; nothing blocking first frame | same | total JS < budget agreed |
| App size | download size agreed with the owner (watch over-the-air cellular limits) | AAB per-device size agreed | |

## Launch

1. ★ Cold launch to first frame on the oldest supported device, Release, median of 5.
2. Warm launch and resume from background.
3. ★ Nothing heavy before the first frame: SDK inits (analytics, crash, payments, AI) deferred or async; no synchronous disk or network reads; no big JSON decoding; no font or image loading beyond the first screen.
4. Launch on a slow network and offline is not slower than online (no blocking request waiting to time out).
5. The first screen is useful at first frame (no blank screen waiting for data that could be cached).

## Smoothness

6. ★ Each main flow (onboarding, the core action, the paywall, scrolling the main list) recorded with hangs and hitches; every hang ≥ 250 ms and every hitchy animation listed with its cause.
7. Key animations (the ones the owner approved) hold the device's frame rate, including on the oldest device and with Reduce Motion off.
8. ★ Typing and dictation into text fields never lag (no work per keystroke on the main thread; no whole-document re-render per character).
9. Real-time features (audio following, a teleprompter, live transcription, playback, scrubbing) never stall or go deaf under load; measure updates per second.
10. Drags start instantly and follow the finger 1:1 (no gesture recogniser conflicts or layout on every move).

## Main-thread work

11. ★ No disk I/O, network, JSON or database queries, image decoding or big sorts on the main thread during interaction (Time Profiler, main thread only).
12. SwiftUI: view bodies cheap and not re-evaluated on unrelated changes (SwiftUI instrument / view body counts); no `Canvas` or `TimelineView` redrawing when nothing changes. React Native: no heavy JS during animations (Reanimated on the UI thread). Compose: stable parameters, no recomposition loops.

## Memory

13. ★ Memory over a 10-minute session of the main flows doesn't keep growing; leaks found with the Leaks instrument (or LeakCanary) are in your code or an SDK, named.
14. Big images are downsampled to their display size, not decoded at full resolution; caches have limits.
15. Previews, video, camera and audio sessions are released when their screen goes away.

## Lists and media

16. ★ Long lists are lazy (`List`, `LazyVStack`, `FlatList`/`FlashList` with stable keys, `LazyColumn`, `RecyclerView`) and stay smooth with hundreds of real items.
17. A list still scrolls when a gesture starts on one of its items.
18. Previews and editing use lightweight copies (smaller video, thumbnails); originals only for export or full view.
19. Media dropped or picked in shows a placeholder at once and loads off the main thread.

## Energy and background

20. ★ A static screen uses no CPU: no timers, animations or polling that run when nothing changes; off-screen animations and previews stop completely.
21. Background work is only what the platform allows and what the app needs; location, audio and Bluetooth stop when not in use.
22. Hot device: the app lowers its work rate and lets the screen sleep when nothing is happening; the camera stops when unused.
23. Network: requests batched; no polling where push or a socket would do; retries back off; images and responses cached.

## Size

24. App download and install size from the App Thinning Size Report (or the Play Console / bundletool); the biggest contributors listed (assets, fonts, videos, embedded frameworks, unused architectures).
25. ★ Unused assets, fonts, localisations and dependencies removed (take the list from `ungenerated-audit-code`); images in modern formats at the sizes used.

## Field data (when the app is live)

26. Xcode Organizer (launch, hangs, memory, energy, disk writes) or MetricKit; Android vitals in the Play Console; crash and hang reports in Sentry or similar. Compare with the lab numbers; field data wins.

Coverage line for the report: "Performance: 26 of 26 checked; 14 budgets measured on <device>, <OS>, Release; traces in <folder>".
