---
name: no-slop
description: The checklist every screen passes before anyone sees it - the visual, motion, copy and data tells that make a design read as generated ("AI slop"), and what to do instead. Run it on every screen and every pass. Use when something "looks like AI", "looks templated", "looks cheap", or before showing any design.
---

# No slop

Generated-looking design has a small set of tells. Remove them all; one is enough to lose trust.
Run `references/checklist.md` on every screen before showing it.

## Visual

- No purple-blue or pink-orange brand gradients; no gradient text.
- No glows, halos or blooms behind the hero; no drop shadows on everything.
- No glass cards stacked on blurred blobs.
- No emoji as icons. Real app icons for real apps; one icon set for the rest.
- No coloured left borders on every card; no pill badges on everything.
- One accent colour. One or two typefaces.
- Corners nest: inner radius = outer radius − padding.
- Nothing is cut off by the frame unless it is meant to be, and devices never are.
- Real content, not "Lorem ipsum", "John Doe", "Acme" or round numbers like 1,000.

## Motion

- Content never bounces; only things the finger touched spring.
- No pop-ins (0 → 1 opacity in a frame), no swaps in mid-air, no two animations on one element.
- Not everything staggers in. One wave per screen at most.
- No confetti for things that are not achievements.

## Copy

- No "unlock", "supercharge", "seamless", "elevate", "effortless", "journey", "empower".
- No three-adjective lines, no exclamation marks, no emoji in UI text.
- No headings that could belong to any app. Specific nouns and the person's numbers.
- No paragraphs on onboarding screens.

## Leaving

- Cancel is where people expect it and one tap away; never behind support or a chat.
- No confirmshaming, guilt, countdowns or spin-the-wheel offers. One honest offer, matched to
  the reason (`cancel-flow`).

## Data

- No invented statistics, reviews or user counts.
- Every number on screen can be traced to the person's answers or a stated example.

## Structure

- No feature carousel with dots as an opening.
- No segmented bars at the top of story screens.
- No login first. No paywall that hides prices.
