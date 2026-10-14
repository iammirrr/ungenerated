# SwiftUI engine for a board section

The code that plays a board section natively, in one file. It type-checks for iOS 17 in Swift 5 and
Swift 6 modes (`swiftc -typecheck`, iOS simulator SDK). The beats are a two-screen example: replace
them with the board's, line by line.

How to use it:

- Rename `Director`, `SectionView` and the `-Section` argument after the section.
- Copy the curve values from the board's kit (`F.CURVES`). Add any extra named curve as a case, or
  use `.bezier(x1, y1, x2, y2)`.
- Port the board's `initial()`, `scene(i)` and each beat. Keys are plain strings (`"cardY"`), one
  per moving value, read in the view with `d.v("cardY", t)`.
- Keep every position on the 390 × 844 canvas, in the board's points.
- Open it in a Debug build from the app's root: `if ProcessInfo.processInfo.arguments.contains("-Section") { SectionView() }`,
  with the argument on in the scheme's Run arguments while you work on it.

```swift
import SwiftUI
import UIKit
```

## The board's curves and spring

Solved as the browser solves `cubic-bezier()`, so a curve lands on the same value at the same millisecond. The spring is SwiftUI's (response, damping fraction), settling where the board's does.

```swift
/// The board's named curves (its kit's `F.CURVES`) and its spring, solved as the browser solves them.
enum BoardCurve {
    case linear, inOut, emph, decel, strong, exit
    case bezier(Double, Double, Double, Double)
    case spring(response: Double, damping: Double)

    /// Eased progress for linear progress `x` (0…1).
    func ease(_ x: Double) -> Double {
        if x <= 0 { return 0 }
        if x >= 1 { return 1 }
        switch self {
        case .linear: return x
        case .inOut: return Self.cubic(0.76, 0, 0.24, 1, x)
        case .emph: return Self.cubic(0.16, 1, 0.3, 1, x)
        case .decel: return Self.cubic(0, 0, 0.2, 1, x)
        case .strong: return Self.cubic(0.23, 1, 0.32, 1, x)
        case .exit: return Self.cubic(0.4, 0, 1, 1, x)
        case let .bezier(x1, y1, x2, y2): return Self.cubic(x1, y1, x2, y2, x)
        case let .spring(response, damping):
            return Self.springValue(x * Self.springSeconds(response, damping), response, damping)
        }
    }

    /// How long the move takes; a spring sets its own length.
    func seconds(_ ms: Double) -> Double {
        if case let .spring(response, damping) = self { return Self.springSeconds(response, damping) }
        return ms / 1000
    }

    /// A CSS cubic-bézier, solved for x (Newton, then bisection).
    static func cubic(_ x1: Double, _ y1: Double, _ x2: Double, _ y2: Double, _ x: Double) -> Double {
        let cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
        let cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
        let sx = { (t: Double) -> Double in ((ax * t + bx) * t + cx) * t }
        let sy = { (t: Double) -> Double in ((ay * t + by) * t + cy) * t }
        let dx = { (t: Double) -> Double in (3 * ax * t + 2 * bx) * t + cx }
        var t = x
        for _ in 0..<8 {
            let e = sx(t) - x
            if abs(e) < 1e-5 { break }
            let d = dx(t)
            if abs(d) < 1e-6 { break }
            t -= e / d
        }
        var lo = 0.0, hi = 1.0, i = 0
        while i < 20 && abs(sx(t) - x) > 1e-5 {
            if sx(t) < x { lo = t } else { hi = t }
            t = (lo + hi) / 2
            i += 1
        }
        return sy(t)
    }

    /// A damped spring's position after `t` seconds (SwiftUI's response and damping fraction).
    static func springValue(_ t: Double, _ response: Double, _ damping: Double) -> Double {
        let w0 = 2 * Double.pi / response
        let z = min(damping, 0.999)
        let wd = w0 * (1 - z * z).squareRoot()
        return 1 - exp(-z * w0 * t) * (cos(wd * t) + (z * w0 / wd) * sin(wd * t))
    }

    /// When the spring has settled within 0.08% (the board stops its spring there too).
    static func springSeconds(_ response: Double, _ damping: Double) -> Double {
        let w0 = 2 * Double.pi / response
        let z = min(damping, 0.999)
        let amplitude = 1 + z / (1 - z * z).squareRoot()
        return min(3, log(amplitude / 0.0008) / (z * w0))
    }
}
```

## Tracks and the director

Every moving value is a track. `to` starts from wherever the value is now. `at` schedules in scene milliseconds and drops beats from a run that was replayed. `play(from:)` is what the test bar calls: reset, the start state, the start state of screen i, then the beat.

```swift
/// One value moving from where it was to where it goes, on a curve.
struct Track {
    var from: Double
    var to: Double
    var start: Double
    var seconds: Double
    var curve: BoardCurve

    func value(at t: Double) -> Double {
        guard seconds > 0 else { return to }
        let x = (t - start) / seconds
        if x <= 0 { return from }
        if x >= 1 { return to }
        return from + (to - from) * curve.ease(x)
    }
}

/// Holds every moving value of the section and schedules its beats in milliseconds, as the
/// board does. The view reads values each frame; nothing here touches layout.
@MainActor
@Observable
final class Director {
    private(set) var tracks: [String: Track] = [:]
    private(set) var flags: Set<String> = []
    /// The screen playing now (0-based), for the test bar.
    var beat = -1
    /// Slow motion: 1, 0.5 or 0.25 of real time.
    private(set) var speed = 1.0

    @ObservationIgnored private var generation = 0
    @ObservationIgnored private var wallBase = Date().timeIntervalSinceReferenceDate
    @ObservationIgnored private var sceneBase = Date().timeIntervalSinceReferenceDate

    /// The section's own clock: real time, slowed by the test bar.
    func sceneTime(_ wall: Double) -> Double { sceneBase + (wall - wallBase) * speed }
    func now() -> Double { sceneTime(Date().timeIntervalSinceReferenceDate) }

    func setSpeed(_ value: Double) {
        let wall = Date().timeIntervalSinceReferenceDate
        sceneBase = sceneTime(wall)
        wallBase = wall
        speed = value
    }

    func v(_ key: String, _ t: Double, _ fallback: Double = 0) -> Double {
        tracks[key]?.value(at: t) ?? fallback
    }

    func set(_ key: String, _ value: Double) {
        tracks[key] = Track(from: value, to: value, start: 0, seconds: 0, curve: .linear)
    }

    /// Moves `key` to `value` from wherever it is now, so an interrupted move never jumps.
    func to(_ key: String, _ value: Double, ms: Double, _ curve: BoardCurve = .strong) {
        let now = self.now()
        tracks[key] = Track(from: v(key, now), to: value, start: now, seconds: curve.seconds(ms), curve: curve)
    }

    func has(_ flag: String) -> Bool { flags.contains(flag) }

    func flag(_ flag: String, _ on: Bool = true) {
        if on { flags.insert(flag) } else { flags.remove(flag) }
    }

    /// Runs `action` after `ms` milliseconds of scene time, unless the section restarted meanwhile.
    func at(_ ms: Double, _ action: @escaping @MainActor () -> Void) {
        let g = generation
        Task { @MainActor [weak self] in
            if ms > 0 { try? await Task.sleep(nanoseconds: UInt64(ms / max(0.05, self?.speed ?? 1) * 1_000_000)) }
            guard let self, self.generation == g else { return }
            action()
        }
    }

    func reset() {
        generation += 1
        tracks = [:]
        flags = []
        beat = -1
    }

    // MARK: The section's beats, ported line by line from the board

    /// Plays from screen `i`: the test bar's numbers. A jump lands where screen i - 1 ended.
    func play(from i: Int) {
        reset()
        initial()
        if i > 0 { scene(i) }
        go(i)
    }

    private func initial() {
        set("cardO", 0); set("cardY", 40); set("cardS", 1)
    }

    /// The state screen `i` starts from (the board's `scene(i)`).
    private func scene(_ i: Int) {
        set("cardO", 1); set("cardY", 0)
    }

    func go(_ i: Int) {
        beat = i
        switch i {
        case 0: arrive()
        case 1: pop()
        default: break
        }
    }

    private func arrive() {
        at(260) {
            self.to("cardO", 1, ms: 620, .decel)
            self.to("cardY", 0, ms: 620, .decel)
        }
        at(2400) { self.go(1) }
    }

    private func pop() {
        set("cardS", 0.86)
        to("cardS", 1, ms: 0, .spring(response: 0.52, damping: 0.72))
        at(120) { UIImpactFeedbackGenerator(style: .light).impactOccurred() }
    }
}
```

## The stage

One `TimelineView` reads every value each frame; the canvas is scaled to the device. The card shows the shadow rule: the content is clipped, and the shadow is drawn on the background shape outside any clip. Clipping or masking the whole card would cut its shadow into grey square corners.

```swift
/// The board's phone canvas, scaled to the device. Every position is the board's, in points.
struct SectionView: View {
    @State private var d = Director()
    static let canvas = CGSize(width: 390, height: 844)
    static let names = ["Arrive", "Pop"]

    /// Debug builds open the section alone with `-Section`; `-SectionBeat 2` starts at screen 2.
    static var testing: Bool {
        #if DEBUG
        ProcessInfo.processInfo.arguments.contains("-Section")
        #else
        false
        #endif
    }

    var body: some View {
        ZStack(alignment: .top) {
            GeometryReader { geo in
                let k = min(geo.size.width / Self.canvas.width, geo.size.height / Self.canvas.height)
                TimelineView(.animation) { timeline in
                    let t = d.sceneTime(timeline.date.timeIntervalSinceReferenceDate)
                    stage(t)
                        .frame(width: Self.canvas.width, height: Self.canvas.height, alignment: .topLeading)
                        .scaleEffect(k)
                        .frame(width: geo.size.width, height: geo.size.height)
                }
            }
            .ignoresSafeArea()
            if Self.testing { TestBar(director: d, names: Self.names) }
        }
        .task {
            let start = UserDefaults.standard.integer(forKey: "SectionBeat")
            d.play(from: Self.testing ? min(Self.names.count - 1, max(0, start - 1)) : 0)
        }
    }

    private func stage(_ t: Double) -> some View {
        ZStack(alignment: .topLeading) {
            card(t)
        }
    }

    /// A card that casts a shadow: the shadow is drawn on the background shape, outside any clip;
    /// only the content inside is clipped.
    private func card(_ t: Double) -> some View {
        let shape = RoundedRectangle(cornerRadius: 24, style: .continuous)
        return VStack(alignment: .leading, spacing: 8) {
            Text("Today").font(.system(size: 18, weight: .semibold))
            Text("3 of 5").font(.system(size: 26, weight: .semibold)).monospacedDigit()
        }
        .padding(16)
        .frame(width: 358, height: 420, alignment: .topLeading)
        .clipShape(shape)
        .background(shape.fill(Color(uiColor: .systemBackground)).shadow(color: .black.opacity(0.14), radius: 14, x: 0, y: 10))
        .scaleEffect(d.v("cardS", t, 1))
        .offset(x: 16, y: 124 + d.v("cardY", t))
        .opacity(d.v("cardO", t))
    }
}
```

## The test bar

Replay, one button per screen, slow motion and hide. Speed changes restart the current screen at the new speed.

```swift
/// Replay, play any screen, slow motion, hide. Debug only.
struct TestBar: View {
    let director: Director
    let names: [String]
    @State private var open = true

    var body: some View {
        if open {
            VStack(spacing: 4) {
                HStack(spacing: 4) {
                    chip(Image(systemName: "arrow.counterclockwise"), on: false, label: "Replay") { director.play(from: 0) }
                    ForEach(names.indices, id: \.self) { i in
                        chip(Text("\(i + 1)"), on: director.beat == i, label: "Play screen \(i + 1), \(names[i])") { director.play(from: i) }
                    }
                    chip(Text(director.speed == 1 ? "1×" : director.speed == 0.5 ? "½×" : "¼×"), on: director.speed < 1, label: "Speed") {
                        director.setSpeed(director.speed == 1 ? 0.5 : director.speed == 0.5 ? 0.25 : 1)
                        director.play(from: max(0, director.beat))
                    }
                    chip(Image(systemName: "chevron.up"), on: false, label: "Hide the test bar") { open = false }
                }
                if director.beat >= 0 && director.beat < names.count {
                    Text("\(director.beat + 1) of \(names.count) · \(names[director.beat])")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(6)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        } else {
            Button { open = true } label: {
                Image(systemName: "slider.horizontal.3").frame(width: 38, height: 38).background(.ultraThinMaterial, in: Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Show the test bar")
            .frame(maxWidth: .infinity, alignment: .trailing)
            .padding(.trailing, 14)
        }
    }

    private func chip(_ content: some View, on: Bool, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            content
                .font(.system(size: 14, weight: .semibold))
                .frame(minWidth: 30, minHeight: 30)
                .background(Capsule().fill(Color.primary.opacity(on ? 0.25 : 0.08)))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }
}
```
