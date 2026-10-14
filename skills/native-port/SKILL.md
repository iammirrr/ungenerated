---
name: native-port
description: Build approved board screens natively in SwiftUI or Jetpack Compose - tokens generated from the kit, motion mapped curve for curve, shared elements, cameras, haptics - and compare side by side with the board. Use when an approved screen moves to the app, or when the native build "doesn't feel like the board".
---

# Native port

## Order

1. **Tokens first**: generate a Swift `Color`/`Font` extension or a Compose theme from
   `css/tokens.css`. Never hand-copy hex values.
2. **Parts next**: button, row, toggle, slider, segmented control, each with the board's press and
   pick motion. Compare each one side by side with its kit tile.
3. **Screens, section by section**, only approved ones. Keep the board open next to the simulator.
   The whole process for a section, with its test bar, engine, pitfalls and checks, is in
   `board-to-app`.

## Motion mapping

| Board | SwiftUI | Compose |
|---|---|---|
| `F.move` with curve | `withAnimation(.timingCurve(x1, y1, x2, y2, duration:))` | `animate*AsState(tween(ms, easing = CubicBezierEasing(...)))` |
| spring (response, damping) | `.spring(response:dampingFraction:)` | `spring(dampingRatio, stiffness = (2π / response)²)` |
| `F.rise` stagger | `.transition(.move(edge: .bottom).combined(with: .opacity))` + delays | `AnimatedVisibility` with delayed `enter` |
| `carry` (shared value) | `matchedGeometryEffect(id:in:)` | `Modifier.sharedElement(...)` |
| camera over a device | container `.scaleEffect().offset()` | `graphicsLayer { }` on the container |
| word swap | `.contentTransition(.opacity)` + per-word offset | `AnimatedContent` |
| time flowing | `.contentTransition(.numericText())` | `AnimatedContent` per digit |
| haptic selection / success | `.sensoryFeedback(.selection / .success, trigger:)` | `HapticFeedbackType` |

## Rules

- Same numbers as the board: durations, distances, spring values. If it feels different, the
  numbers differ.
- Copy a part from its computed style on the board (`getComputedStyle`), not from the app's own
  component: "use my button" means the one on the board.
- A shadow sits outside every clip. Masking or clipping a shadowed view with its own bounds cuts
  the shadow into grey square corners.
- Test on a device, not only the simulator, for anything with haptics or frame-rate-sensitive motion.
- Record what the port does not reproduce yet and why.
