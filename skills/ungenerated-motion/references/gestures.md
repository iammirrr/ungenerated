# Gestures

What happens under a finger. The one bug that came back most in one owner's rounds was a ruler whose
drag also moved the screen; he reported it eighteen times. Everything here is there to stop that kind
of bug.

## A control owns every drag that starts on it

- **Ownership is decided by where the touch starts, never by where it goes.** A drag that begins on a
  ruler, slider, chart or card belongs to it until the finger lifts. The page never scrolls, pages or
  swipes back with it.
- **Never decide by direction.** "If the first 10 points are more vertical, let the page scroll" fails
  on real fingers: their first points are noisy, so a sideways drag often starts a few points up or
  down, and the page grabs it at random.
- **Claim it at touch-down.** On the board: `touch-action: none` on the control, pointer capture on
  `pointerdown`, and handle `pointercancel` and a release outside the control. In SwiftUI: a
  `DragGesture(minimumDistance: 0)` given priority (`.highPriorityGesture`) on the control. Then check
  that the scroll view and the system back swipe don't also start; if the edge swipe still wins, keep
  the control off the left edge or turn the swipe off while the control is on screen.
- **Follow the finger 1:1, by transform only.** While dragging, nothing else animates and nothing
  re-lays out: no label that re-wraps, no number that rolls on every step, no header that resizes.
  Values change smoothly; the text near them crossfades or flows in place.

## Flicks

- **A flick carries its speed, but capped.** Limit how far a release can travel (a few steps, or a
  fixed distance), so a fast flick never throws the value off the end.
- **It glides straight onto a step.** No overshoot past the step and back: that read as the value
  "shooping in and out". Land with one small bump of the knob and a selection haptic on the step.
- **Rubber band at the ends,** never a hard stop (`bubbly-motion-recipes.md`, the rubber band).

## Reorder by holding

- Hold the item itself: it lifts slightly larger with a soft shadow, follows the finger 1:1, the others
  glide aside on a spring, and it settles where it is let go.
- No grip handles and no three-bar icons. A quick swipe on the same list still scrolls; only a hold
  picks up.
- Rename by tapping the heading; delete by dropping on a delete zone at the bottom, always with Undo.
- Never the system drag that lifts only a small grip preview.

## Taps during an animation

- **A tap never skips.** It hurries what is playing (the rest at about twice the speed) and Continue
  appears at once. A second tap moves on. "A tap means hurry up, not skip what I haven't seen."
- **Story and opening beats play themselves.** At most one meaningful tap mid-story and one final call
  to action. If the person waits after a beat has played, it may move on by itself after 2–3 s, so
  nobody feels trapped.
- **Question screens never move on by themselves.** An answer stays changeable; Continue appears when
  they have answered. (An older rule moved single picks on after 340 ms; the owner reversed it because
  people couldn't change their mind. When both apply, the question wins: wait for Continue.)
- **Survive fast taps.** Anything that animates on a tap must survive taps faster than its animation:
  set every element's target at once, declaratively, and let one cancellable animation per element
  carry it. Never a chain of timers a second tap can strand halfway.

## Sheets

- A sheet follows the finger down and dismisses past a threshold or on a downward flick.
- Swiping a question sheet away is an answer (no), saved the moment it happens.

## Test it like a finger

Scripted tests drag in perfect straight lines; fingers don't. Before showing a gesture:

1. **A diagonal drag** that starts on the control and wanders: the page must not move.
2. **A fast fling** both ways: it lands on a step, no overshoot and return.
3. **A drag that leaves the control** and is released outside it: the drag ends cleanly.
4. **A drag from the left edge** of the screen: the back swipe must not take it.
5. **Rapid taps** on anything animated, then check the settled state.
6. **On the real phone**, with a real finger, at the smallest size.
