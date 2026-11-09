---
name: ungenerated-foundation
description: Start here for any mobile app design. Sets what the app is and the kit it is made from, before any screen - the concept (angle, one person, one promise, feature map, what it is not), research of real top apps (flow only, never their look; Appllama when connected), the kit worked out with the owner (colour in light and dark, type, spacing, radius, grounds, the parts sheet), a small line-icon set, real app icons and devices, copy that sounds like a person, and a preview sheet of the parts alone. Also the map of the whole ungenerated library and how to work with the owner. Use when someone says "design my app", "where do I start", "new app", "redesign", "make a design system", "pick colours and fonts", "set up tokens", "it looks generated", "write the copy", "research how other apps do it", or before onboarding, a paywall or any flow.
---

# Foundation: what the app is, and the kit it is made from

Start here: the concept, the research and the kit come before any screen, and this page holds the order of the whole library.

## Steps

1. **Write the concept on one page.**
   The angle, the one person, the promise, the hero object, the feature map, what it is not.
   Name the product's pillars and say which one the app is about. Read `references/app-concept.md`.
2. **Research real top apps for flow, never visuals.**
   Use the Appllama MCP when it is connected (walk the top apps in the category screen by screen), the owner's screenshots, or the pattern notes. Take order, mechanics and pacing; never colours, layouts or mascots. Tell the owner which apps you studied. Read `references/app-research.md` and `references/app-research-patterns.md`.
3. **Ask for what already exists.**
   The owner's brand, site, logo, earlier prototypes, picks from past rounds. Copy the exact values of anything they already chose; never approximate a pick.
4. **Work out the kit with the owner, back and forth.**
   Colour in light and dark, type, spacing, radius, grounds and the parts sheet, in that order, two or three options at a time on one sheet. Lock each pick before the next. Write them as CSS tokens and native tokens from one source. Read `references/design-kit.md`.
5. **Draw every part in every state.**
   Buttons, rows, inputs, toggles, rulers, sheets, toasts, in light and dark. Read `references/design-kit-parts-checklist.md`.
6. **Pick the small line-icon set for the UI.**
   One outline family, one stroke, one size grid, and one icon per state (draft, done, posted), never a colour tint. Illustrated icons and the app icon go to `ungenerated-icons`. Read the line-icon section of `references/design-kit.md`.
7. **Use real app icons and real devices.**
   Official App Store artwork for any app you name, no shadow behind it; devices drawn whole, never cropped. Read `references/real-icons-and-devices.md`.
8. **Write copy like a person.**
   Few words, every label says what happens when you tap it, no invented jargon, no persona labels. Read `references/human-copy.md`.
9. **Show the preview sheet.**
   The kit as parts alone (swatches, type ramp, each part in its states, the icons), never a fake screen. Open it for the owner at a fresh URL with caching off, collect picks, log every note. Read `references/working-with-the-owner.md`.
10. **Hand off.**
    Motion next (`ungenerated-motion`), then the board (`ungenerated-flows`).

## Never

- Never ship the default AI kit: indigo or violet accents, a stock serif-plus-grotesk pair, purple-to-blue gradients, sparkle icons. It reads as generated at a glance.
- Never copy a reference app's look. "Why are you becoming a copycat": take the mechanic, tell your own story.
- Never invent a colour, font or pattern when the owner already picked one. An approximation of a pick gets called "bad".
- Never use demo data or invented numbers. Real content, or the owner can't judge what the app is.
- Never show a fake screen to present the kit. Parts are shown as parts.
- Never put a shadow behind an icon, logo or emoji, and keep shadows rare everywhere else. Overused shadows look less polished.
- Never use gradients, grids, smoke, particles or shines as grounds by default. Flat and calm; one named exception at most.
- Never show a state with a coloured row or a fraction. A state is an icon.
- Never use small text people won't read, or chrome full of words. The person's own words are the content.
- Never invent jargon or label the person with a persona. If a newcomer can't say what a label does, rename it.
- Never draw a stand-in for a real app's icon. Fetch the real one, or use an emoji or illustration for things that aren't apps.
- Never give one action two entry points, or one control two looks. One way to do each thing.

## Read when

| You are… | Read |
|---|---|
| starting an app, or the design has no direction | `references/app-concept.md` |
| studying how other apps do a journey | `references/app-research.md` |
| without a research tool, needing the common patterns | `references/app-research-patterns.md` |
| making colours, type, spacing, radius, grounds, line icons | `references/design-kit.md` |
| drawing the parts sheet | `references/design-kit-parts-checklist.md` |
| showing other apps' icons, a phone or a laptop | `references/real-icons-and-devices.md` |
| writing any words on a screen | `references/human-copy.md` |
| showing work, taking feedback, reporting status | `references/working-with-the-owner.md` |
| wanting the reasons behind these rules | `references/lessons.md` |
| needing token files, a Kit view and line icons to start from | the board template in `ungenerated-flows`: `../ungenerated-flows/template/css/tokens.css`, `../ungenerated-flows/template/js/screens/kit.js`, `../ungenerated-flows/template/js/icons.js` |

## Works with

The library, in order. No step starts until the one before it fits on a page the owner has seen.

1. `ungenerated-foundation` (this): concept, research, the kit, the UI line icons, copy.
2. `ungenerated-motion`: the motion style and the feel of every part on the sheet.
3. `ungenerated-flows`: the live board, every flow on it in order (opening, questions, story, plan, sign-up, permissions, paywall, setup, the app's screens, cancel), then the port to SwiftUI.
4. `ungenerated-review`: the no-slop gate, real screenshots, accessibility and review rounds, before anything is shown.
5. `ungenerated-icons`: illustrated icons and the app icon (this skill keeps only the small UI line icons).
6. `ungenerated-store`: screenshots, the preview trailer and the listing, built from the kit and the real app.
7. The audits before launch: `ungenerated-audit` runs payments, privacy and security together.
