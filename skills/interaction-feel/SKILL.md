---
name: interaction-feel
description: Make controls feel physical and fluid - press depth, picks that bloom from the finger, liquid toggles, sliders that glide, haptics mapped to meaning, and a side-by-side feel picker so the reviewer chooses. Use when controls feel rigid, clicky, generic or "templated", or when someone asks how a button, toggle, picker or tap should feel.
---

# Interaction feel

A control should feel like it has weight. Rigid, instant state changes read as a web form.

## The feel of each control

- **Press.** In to 0.97 and 1 pt down in 90 ms with a slightly darker fill; out on a spring
  (response 0.34, damping 0.6). Rows highlight instead of scaling.
- **Pick.** The selected colour spreads from where the finger touched and stays as the fill; unpick
  drains back to that point. The check draws itself, then pops once.
- **Single choice moves on** 340 ms after the pick. No Continue button for single picks.
- **Toggle.** The knob is two edges on two springs: under the finger it reaches toward where it
  will go; on release the leading edge runs ahead and the trailing edge catches up.
- **Slider and range.** The thumb glides to the finger instead of jumping; it grows under the
  finger; a value bubble follows; the value settles with a small spring on release. Never re-render
  the number on every step with a roll; let it flow.
- **Segmented control.** The thumb slides on a spring and stretches slightly with its speed.
- **Drag.** Objects follow the finger 1:1 with real physics on release (velocity carries).
- **Hold.** Something visibly fills while held; letting go early springs it back.

## Haptics, by meaning

| Moment | Haptic |
|---|---|
| A pick, a tick past a step | selection |
| A primary action | light (medium for the one big action of a screen) |
| Something completes | success |
| A wrong code, a limit reached | warning |
| Something lands with weight (a stamp) | rigid |

The board shows each haptic as a small chip beside the card number, never over the phone.

## The feel picker

When the reviewer cannot say what they want, show it. Build a Kit row with two or three versions
of the same control side by side (A · quiet, B · springy, C · liquid) as a Pick group, and let them
choose by feel. Record the choice as a standing rule.

For the playful character on top of these (squash and stretch, goo, follow-through), see
`bubbly-motion`.

## Press feedback must compose with position

A control that slides (a segmented thumb, a knob) and also squeezes under the finger must squeeze
with a separate property (the CSS `scale` property, or a separate scale modifier natively), never
by replacing its whole transform. A held "scale only" transform throws away the slide and parks the
thumb on the first option the moment someone taps.

## Anti-patterns

- Every element bouncing on entrance.
- A ripple from the centre instead of from the finger.
- Haptics on everything, or on nothing.
- Hover states on a phone screen.
