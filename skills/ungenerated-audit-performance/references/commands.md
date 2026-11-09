# How to measure

Tool names, templates and flags change between Xcode, Android Studio and browser versions: run the list/help command first (`xcrun xctrace list templates`, `xcrun xctrace help record`, `adb shell perfetto --help`) and use what this machine has. Save every output in a dated folder, for example `perf/2026-11-09/`.

## iOS and Mac (Instruments from the command line)

```bash
xcrun xctrace list devices                     # find the real device's UDID (simulators are listed separately)
xcrun xctrace list templates                   # App Launch, Time Profiler, Animation Hitches, Allocations, Leaks, Network, SwiftUI, Energy Log …

# Cold launch: force-quit first, then record a launch (the installed Release build; see `xctrace help record` for --launch targets)
xcrun xctrace record --template 'App Launch' --device <UDID> --time-limit 15s \
  --output perf/launch-1.trace --launch -- <path to .app or bundle id>

# Hangs and main-thread work during a flow: start, do the flow by hand on the device, stop at the time limit
xcrun xctrace record --template 'Time Profiler' --device <UDID> --attach '<App name>' --time-limit 60s --output perf/flow-onboarding.trace

# Hitches on an animation or a scroll
xcrun xctrace record --template 'Animation Hitches' --device <UDID> --attach '<App name>' --time-limit 30s --output perf/hitches-list.trace

# Memory growth and leaks over a 10-minute loop of the main flows
xcrun xctrace record --template 'Allocations' --device <UDID> --attach '<App name>' --time-limit 600s --output perf/memory.trace
xcrun xctrace record --template 'Leaks' --device <UDID> --attach '<App name>' --time-limit 180s --output perf/leaks.trace

# SwiftUI view-body cost (Xcode versions that ship the SwiftUI template)
xcrun xctrace record --template 'SwiftUI' --device <UDID> --attach '<App name>' --time-limit 30s --output perf/swiftui.trace

# Read numbers out of a trace for the report
xcrun xctrace export --input perf/launch-1.trace --toc
xcrun xctrace export --input perf/launch-1.trace --xpath '/trace-toc/run[@number="1"]/data/table[@schema="<schema from the toc>"]'
```

Open any `.trace` in Instruments to find the cause: select the bad interval, look at the main thread's heaviest stack, and name the file:line.

**Repeatable numbers in XCTest** (set the scheme's Test action to the Release configuration; run on the device, one at a time):

```swift
func testColdLaunch() {
    measure(metrics: [XCTApplicationLaunchMetric(waitUntilResponsive: true)]) { XCUIApplication().launch() }
}

func testMainListScroll() {
    let app = XCUIApplication(); app.launch()
    let options = XCTMeasureOptions(); options.invocationOptions = [.manuallyStop]
    measure(metrics: [XCTOSSignpostMetric.scrollingAndDecelerationMetric], options: options) {
        app.collectionViews.firstMatch.swipeUp(velocity: .fast)   // or scrollViews / tables
        stopMeasuring()
    }
}

func testMemoryOfCoreFlow() {
    let app = XCUIApplication(); app.launch()
    measure(metrics: [XCTMemoryMetric(application: app), XCTCPUMetric(application: app)]) { /* drive the core flow */ }
}
```
```bash
xcodebuild test -project App.xcodeproj -scheme AppPerf -destination 'id=<UDID>' \
  -only-testing:AppPerfTests -parallel-testing-enabled NO
```
Wrap your own expensive work in `os_signpost` intervals (Points of Interest) so traces show where your code starts and ends.

**App size:** export the archive with app thinning to get a size report per device.

```bash
# ExportOptions.plist: method = app-store-connect (or development), thinning = <thin-for-all-variants>
xcodebuild -exportArchive -archivePath App.xcarchive -exportPath perf/export -exportOptionsPlist ExportOptions.plist
cat "perf/export/App Thinning Size Report.txt"
```
App Store Connect › the build › App Store File Sizes gives the real download sizes after upload.

**Field data:** Xcode › Organizer › Metrics (launch, hangs, memory, energy, disk writes, by device) and Reports (hang and crash logs); MetricKit (`MXMetricManager`) for your own collection.

**Simulator only?** Use the same templates with the simulator's UDID and label every number "simulator: relative only". Energy and thermal numbers from a simulator are meaningless; skip them.

## Android

```bash
# Cold start: TotalTime in ms
adb shell am force-stop <package> && adb shell am start -W -n <package>/<.MainActivity>

# Frames during a flow
adb shell dumpsys gfxinfo <package> reset    # then do the flow on the device
adb shell dumpsys gfxinfo <package>           # janky frames %, percentiles

# A full system trace (open in ui.perfetto.dev)
adb shell perfetto -o /data/misc/perfetto-traces/flow.pftrace -t 20s sched freq idle am wm gfx view binder_driver dalvik input memory
adb pull /data/misc/perfetto-traces/flow.pftrace perf/

# Memory and battery
adb shell dumpsys meminfo <package>
adb shell dumpsys batterystats --reset        # use the app unplugged, then: adb bugreport perf/bugreport.zip (Battery Historian)

# Size of the bundle per device
bundletool build-apks --bundle=app.aab --output=app.apks && bundletool get-size total --apks=app.apks
```
Repeatable: Jetpack Macrobenchmark (`StartupTimingMetric`, `FrameTimingMetric`) in a benchmark module, run with `./gradlew :macrobenchmark:connectedBenchmarkAndroidTest` on a real device. Leaks: LeakCanary in debug builds. Field: Android vitals in the Play Console.

## React Native and Flutter

Measure the native app with the platform tools above (launch, frames, memory are the same questions). Then:
- React Native: profile the JS thread (Hermes profiler via the dev menu or `npx react-native profile-hermes`), check animations run on the UI thread (Reanimated), and lists use `FlashList` or a tuned `FlatList`; Flashlight (`flashlight measure`) gives a frame-rate score on Android.
- Flutter: run `flutter run --profile` on a device and use DevTools' Performance view for frame build/raster times; `flutter build apk --analyze-size` or `flutter build ipa --analyze-size` for size.

## Web and desktop web views

```bash
npx lighthouse https://<site> --only-categories=performance --output=json --output-path=perf/lighthouse.json   # mobile by default
npx lighthouse https://<site> --preset=desktop --only-categories=performance --output=html --output-path=perf/lighthouse-desktop.html
```
Chrome DevTools › Performance for long tasks and layout shifts; the `web-vitals` library or the Chrome UX Report for field data. For a design board or prototype page: a per-frame sampler (requestAnimationFrame deltas) over each animation, and stop every animation, timer and video that is off-screen.
