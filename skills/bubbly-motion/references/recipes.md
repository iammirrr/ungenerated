# Bubbly recipes: board, SwiftUI, Compose

Springs use SwiftUI's terms: `response` (seconds) and `dampingFraction`. In iOS 17's newer form,
`.spring(duration: response, bounce: 1 − dampingFraction)`. In Compose, a spring with mass 1 has
`stiffness = (2π / response)²` and `dampingRatio = dampingFraction`. For example, 0.38 / 0.62 is
`spring(dampingRatio = 0.62f, stiffness = 273f)`.

| Tuning | SwiftUI | Compose |
|---|---|---|
| Firm 0.30 / 0.86 | `.spring(response: 0.30, dampingFraction: 0.86)` | `spring(0.86f, 439f)` |
| Bubbly 0.38 / 0.62 | `.spring(response: 0.38, dampingFraction: 0.62)` | `spring(0.62f, 273f)` |
| Lively 0.45 / 0.55 | `.spring(response: 0.45, dampingFraction: 0.55)` | `spring(0.55f, 195f)` |

## 1 · Squish press

Board:
```js
const down = () => F.move(el, { sx: 1, sy: 1 }, { sx: 1.05, sy: 0.93 }, { duration: 90, curve: 'strong', fill: 'forwards', ctx });
const up = () => { F.move(el, { sx: 1.05, sy: 0.93 }, { sx: 1, sy: 1 }, { spring: { response: 0.34, damping: 0.6 }, fill: 'none', ctx }); ctx.haptic('light'); };
```
SwiftUI:
```swift
.scaleEffect(x: pressed ? 1.05 : 1, y: pressed ? 0.93 : 1, anchor: .bottom)
.animation(pressed ? .easeOut(duration: 0.09) : .spring(response: 0.34, dampingFraction: 0.6), value: pressed)
.sensoryFeedback(.impact(weight: .light), trigger: released)
```
Compose:
```kotlin
val sx by animateFloatAsState(if (pressed) 1.05f else 1f, if (pressed) tween(90) else spring(0.6f, 341f))
val sy by animateFloatAsState(if (pressed) 0.93f else 1f, if (pressed) tween(90) else spring(0.6f, 341f))
Modifier.graphicsLayer { scaleX = sx; scaleY = sy; transformOrigin = TransformOrigin(0.5f, 1f) }
```

## 2 · Pop from a source

Board: set `transform-origin` to the source's point inside the element, then
```js
F.move(badge, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.38, damping: 0.62 }, fill: 'backwards', ctx });
```
SwiftUI: `.transition(.scale(scale: 0.5, anchor: .topLeading).combined(with: .opacity))` inside
`withAnimation(.spring(response: 0.38, dampingFraction: 0.62))`.
Compose: `AnimatedVisibility(enter = scaleIn(spring(0.62f, 273f), initialScale = 0.5f, transformOrigin = TransformOrigin(0f, 0f)) + fadeIn())`.

## 3 · Stretch in flight

Sample the position each frame, compute the speed, and stretch along the path:
```js
const stretch = Math.min(0.18, Math.abs(x - lastX) * 0.035); // per frame at 60 fps
el.style.transform = `translateX(${x}px) scale(${1 + stretch}, ${1 - stretch * 0.4})`;
```
On arrival, one frame at 0.92 wide, 1.04 tall, then the spring settles it. SwiftUI: drive
`scaleEffect(x:y:)` from the velocity of a `withAnimation` completion or a `TimelineView`.
Compose: read `Animatable.velocity` and map it to `scaleX`.

## 4 · Goo

Board (SVG filter on the container that holds the shapes):
```html
<svg width="0" height="0"><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="7"/>
<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter></svg>
<div style="filter:url(#goo)"> …two pills… </div>
```
Put the labels outside the filtered layer, or the text melts. SwiftUI: a `Canvas` with
`context.addFilter(.alphaThreshold(min: 0.5))` and `context.addFilter(.blur(radius: 8))`, drawing
the shapes as symbols. Compose: `RenderEffect.createBlurEffect` plus a color-matrix threshold
(Android 12+), or draw the merged path yourself.

## 5 · Follow-through

```js
F.move(button, from, to, { spring: S, ctx });
F.move(icon, from, to, { spring: S, delay: 35, ctx });
```
SwiftUI: `.animation(.spring(...).delay(0.035), value:)` on the child. Compose: `delayMillis` on
the child's spec, or a softer spring.

## 6 · Breathing

```js
el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 3200, iterations: Infinity, easing: 'ease-in-out' });
```
Cancel it on the first touch. SwiftUI: `.phaseAnimator([1, 1.02]) { $0.scaleEffect($1) } animation: { _ in .easeInOut(duration: 1.6) }`.

## 7 · Rubber band

```js
const band = (x, d, c = 0.55) => (1 - 1 / ((x * c) / d + 1)) * d;
```
This is the curve iOS scroll views use at their edges. Release on a 0.55 / 0.8 spring.

## 8 · The no

```js
el.animate([0, 8, -6, 4, 0].map((x) => ({ transform: `translateX(${x}px)` })), { duration: 360, easing: 'ease-out' });
ctx.haptic('warning');
```
SwiftUI: `.keyframeAnimator` on an offset, with `.sensoryFeedback(.error, trigger:)`.

## Reduce Motion

Every recipe above becomes a 150 ms opacity change at the final size; the haptic stays.
