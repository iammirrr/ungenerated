---
name: visual-qa
description: Verify screens and motion with real screenshots before showing them - real-time captures at chosen milliseconds, mid-motion frames, contact sheets, light and dark, phone and laptop widths - and the common causes of broken frames. Use before reporting any screen as done, after any motion change, or when something "looks off" and you cannot see why.
---

# Visual QA

A screen is not done until you have looked at it, at the moments that matter, in both themes.

## Tools (in the `design-board` template)

- `node tools/capture.mjs <url> <out-prefix> <ms,ms,...> [light|dark] ["ms=js" ...]`
  real-time screenshots of one screen (`#only-<id>`) or the flow (`#play`). Run scripts at given
  times to tap things: `"1800=document.querySelector('.btn').click()"`.
- `node tools/sheet.mjs out.png a.png b.png ...` puts frames side by side to compare.
- `W=1440 H=900 DSF=1` captures the whole board at laptop size.

## What to capture

- The **rest** of every screen, light and dark.
- **Mid-motion** frames of every move: 25%, 50%, 75% of it. That is where pops, jumps and swaps hide.
- The **end** of a sequence after it has fully played (count durations from the page load; the
  board itself takes about a second to load).
- **Phone width** for the board, and the flow full screen.

## Read the frames for

- Text cut, wrapped word by word, or overlapping.
- An element blinking out for a frame (a swap), or appearing at full size (a pop).
- A device cut off by the frame or the layout.
- Corners that don't nest (inner radius should be outer minus padding).
- A layout that collapsed: usually a class name clashing with an older rule. Rename yours.
- Positions measured before fonts loaded (things land a few points off).
- Content behind content (z-order) and empty screens during a transition.

## Pitfalls

- Headless "virtual time" freezes animations part-way and shows frames that never happen. Use real time.
- Captures at fixed intervals can land at the start of every beat; offset them.
- A dev server that crashes on a missing file looks like a blank page. Check the server first.

## Report

Say what you checked and what you could not prove (frame rate, a real device, VoiceOver).
