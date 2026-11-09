---
name: ungenerated-review
description: The no-slop gate before any screen, board round or build is shown. Runs every AI tell as a named check with what to do instead (pills inside text, nuggets on cards, tabs nobody asked for, eyebrows, two-tone giant headlines, clipped fragments, emoji bullets, sparkle icons, violet gradients, glows, everything centred, identical card grids, fake stats, step counters, boxed cards, small text, shadows behind icons, stand-in brand icons, plus copy and motion tells), then real screenshots, then accessibility, then proves the flow works (tap tests, analytics events, database and payments, screenshots looked at), then runs the round with the reviewer. Use when something "looks like AI", "looks generated", "looks cheap", "unslop this", "review the screens", "is it ready to show", "check before the build", "verify the flow", or before showing anything to anyone.
---

# Review: the gate before anything is shown

Nothing reaches the owner until it has passed this gate: no AI tells, real screenshots looked at,
accessible, and proven to work on the real thing.

## Steps

1. **Run the AI-tells checklist** on every changed screen, light and dark. Name each tell you find
   by its number and fix it. Read [ai-tells.md](references/ai-tells.md), then tick
   [no-slop-checklist.md](references/no-slop-checklist.md); the background is
   [no-slop.md](references/no-slop.md).

2. **Take real screenshots and look at them.** Real time, never headless virtual time: at rest,
   mid-motion, light and dark, the smallest phone. Read [visual-qa.md](references/visual-qa.md).

3. **Run the accessibility pass.** Contrast, tap targets, scaling text, Reduce Motion, labels.
   Read [accessibility-pass.md](references/accessibility-pass.md).

4. **Prove it works, in order:** tap tests with real input → the analytics events arrive → the
   database and payments state → screenshots looked at by a person. One shared simulator. Read
   [check-order.md](references/check-order.md).

5. **Run the round with the reviewer.** Open it for them at a fresh URL (or the simulator on the
   changed screen), log every note with a number before changing anything, fix in one pass, keep
   what they picked, and turn repeats into standing rules. Read
   [design-review.md](references/design-review.md).

## Never

- Never show a check you didn't run, or call something done that you haven't seen running.
- Never call a reported bug fixed without real input that reproduced it (the ruler bug came back
  18 times).
- Never show the owner a cached page or an old build: fresh URL, no caching, newest build number.
- Never ask the owner to pick between screens they can't see: open each one, side by side.
- Never re-skin what was picked; change only what was flagged.
- Never ship a fake success (stub sign-in, fake purchase, stand-in lines): it is worse than an
  honest error.
- Never test on the owner's real account or leave test data in their space.
- Never run more than one simulator, or tests in parallel on it.
- Never let a tell through because it is small: small text, a sparkle, a shadow behind an icon are
  each enough to read as generated.
- Never use headless virtual time for motion frames; it freezes animations mid-way.

## Read when

| You are… | Read |
|---|---|
| Checking a screen for AI tells | [ai-tells.md](references/ai-tells.md) |
| Ticking a screen off before showing it | [no-slop-checklist.md](references/no-slop-checklist.md) |
| Wanting the visual, motion, copy and data rules in prose | [no-slop.md](references/no-slop.md) |
| Taking and reading screenshots and motion frames | [visual-qa.md](references/visual-qa.md) |
| Checking accessibility | [accessibility-pass.md](references/accessibility-pass.md) |
| Proving a flow works before calling it done | [check-order.md](references/check-order.md) |
| Taking feedback and running a round | [design-review.md](references/design-review.md) |
| Wondering why a rule exists | [lessons.md](references/lessons.md) |
| Capturing screenshots of the board | the board template's `tools/capture.mjs` and `tools/sheet.mjs` (`ungenerated-flows/template/tools/`) |

## Works with

- `ungenerated-flows`: the board and flows under review; each flow names the events to check.
- `ungenerated-foundation`: the kit and copy rules the tells are measured against.
- `ungenerated-motion`: the motion numbers behind the motion tells.
- `ungenerated-icons`: real brand icons and the illustrated set.
- `ungenerated-audit-analytics`, `ungenerated-audit-payments`: the deeper checks behind steps 2
  and 3 of the check order.
