# CSS in SwiftUI, measured

How to rebuild a board part from its computed CSS so it matches pixel for pixel, and how to prove
it. Every conversion here was measured against Chrome at 3× unless it says otherwise.

## Read the whole part

`getComputedStyle(el)` gives the element. Read `getComputedStyle(el, '::before')` and
`getComputedStyle(el, '::after')` too: a pseudo-element with its own inset shadows and a
`mix-blend-mode` is often half of a button's look. Note `isolation`, `filter`, `letter-spacing`
and `line-height` as well.

## Conversions

| CSS | SwiftUI |
|---|---|
| `box-shadow: inset x y blur spread color` | `CSSInsetShadow` below: the shape outside the hole, blurred by **blur ÷ 2**, clipped. Measured: within 1 of 255 of Chrome. A blurred stroke only approximates it, heavier at the ends |
| several shadows on one element | One layer each, the first listed on top |
| `mix-blend-mode: overlay` on `::after` | The layer in a `ZStack`, `.compositingGroup()`, then `.blendMode(.overlay)` |
| `isolation: isolate` | `.compositingGroup()` on the whole part |
| `filter: brightness(.96)` | `.colorMultiply(Color(white: 0.96))` |
| `letter-spacing: -0.15px` | `.kerning(-0.15)` |
| Text centred in its line box | Measure the letters' position on both crops; a half-point offset is common |
| `line-height` on iOS 26 | `.lineHeight(.exact(points: L))`, then offset the letters by `L ÷ 2 − k × size`; for Poppins k = 0.668. Measure k for your font from two sizes |
| `white-space: nowrap` | `.fixedSize()` on the text, and a higher `layoutPriority` than its neighbours |
| `feColorMatrix` colours in an SVG filter | Linear RGB: convert to sRGB (`1.055 × c^(1/2.4) − 0.055`) before using them |
| `transition: x 200ms` on a state change | `.animation(curve, value: state)` on that view; a jump-then-animate needs a frame between the two |
| `box-shadow` (outer) | `.shadow(radius: blur ÷ 2, x:, y:)` is the usual conversion (not measured here); no spread, so draw a grown shape. Never clip it (see the pitfalls in `SKILL.md`) |

## The inset shadow

```swift
import SwiftUI

/// A CSS inset box-shadow on a capsule, drawn the way CSS draws it: everything outside the hole
/// (the box moved by x and y, grown by -spread) is shadow, blurred with SwiftUI radius = CSS
/// blur ÷ 2, and clipped to the shape.
struct CSSInsetShadow: View {
    var color: Color
    /// The CSS blur radius.
    var blur: CGFloat
    var x: CGFloat = 0
    var y: CGFloat = 0
    var spread: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            shadowShape(geo.size)
                .fill(color, style: FillStyle(eoFill: true))
                .blur(radius: blur / 2)
        }
        .clipShape(Capsule())
        .allowsHitTesting(false)
    }

    private func shadowShape(_ size: CGSize) -> Path {
        let w: CGFloat = size.width
        let h: CGFloat = size.height
        let margin: CGFloat = blur * 2 + abs(x) + abs(y) + abs(spread) + 8
        let outside = CGRect(x: -margin, y: -margin, width: w + 2 * margin, height: h + 2 * margin)
        let hole = CGRect(x: x, y: y, width: w, height: h).insetBy(dx: spread, dy: spread)
        let r: CGFloat = hole.height / 2
        var p = Path()
        p.addRect(outside)
        p.addRoundedRect(in: hole, cornerSize: CGSize(width: r, height: r), style: .circular)
        return p
    }
}

/// An example: a pill whose CSS is
///   background: linear-gradient(#5b6cf0, #7d8bf5);
///   box-shadow: inset 0 -2px 10px rgba(20, 0, 80, .5);
///   ::after { mix-blend-mode: overlay;
///             box-shadow: inset 0 -14px 7px -5px rgba(255,255,255,.3), inset 0 10px 10px rgba(0,0,0,.08); }
struct ExampleSurface: View {
    var body: some View {
        ZStack {
            Capsule().fill(LinearGradient(colors: [Color(red: 0.357, green: 0.424, blue: 0.941), Color(red: 0.49, green: 0.545, blue: 0.961)], startPoint: .top, endPoint: .bottom))
            CSSInsetShadow(color: Color(red: 0.078, green: 0, blue: 0.314).opacity(0.5), blur: 10, y: -2)
            // ::after: its shadows (the first listed on top), blended into the button as one layer.
            ZStack {
                CSSInsetShadow(color: .black.opacity(0.08), blur: 10, y: 10)
                CSSInsetShadow(color: .white.opacity(0.3), blur: 7, y: -14, spread: -5)
            }
            .compositingGroup()
            .blendMode(.overlay)
        }
        .compositingGroup()   // CSS `isolation: isolate`: the blend sees only the button
        .clipShape(Capsule())
        .frame(height: 56)
    }
}
```

## Prove it

1. Capture the board's part at 3×: Chrome DevTools `Page.captureScreenshot` with a `clip` round
   the element and `deviceScaleFactor: 3`. Capture it once more with its label hidden, to compare
   the surface alone.
2. Render the SwiftUI part at 3× on the same ground (`ImageRenderer` in a macOS script is the
   fastest loop: no build, no simulator). Compare the crops pixel by pixel inside the shape:
   mean and max difference per channel, and the signed mean (a negative one means darker).
3. Try the conversions that are uncertain (a blur factor, a text offset) as a sweep and keep the
   one with the smallest difference.
4. Check the real app: screenshot a simulator as wide as the board's phone (390 pt: iPhone 16e),
   so nothing is rescaled, crop the same rectangle and compare again.

Under about 1 of 255 on average is identical to the eye. Text keeps single-pixel peaks at the
letters' edges, because Chrome and iOS smooth fonts differently. In one port, a button that
looked right was 8.8 off on average and visibly darker.
