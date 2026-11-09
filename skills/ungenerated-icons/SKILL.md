---
name: ungenerated-icons
description: On-brand icons and the app icon for any mobile app, made by an image model from a brief Claude writes. Lists every icon from the code with its size, keeps real brands as their original artwork (App Store artwork, the brand's press-kit mark, Apple's own App Store icon, never drawn or generated), keeps small UI as line icons, offers 3-4 style directions from the brand, writes one brief for Codex or ChatGPT (one icon at a time, transparent 1024 PNGs), imports the files by name into the board and the Xcode asset catalog, and reviews them at real size in light and dark. Also in-app pictures, character poses and a layered app icon for Icon Composer. Use when asked to "make icons", "replace the emoji", "custom icon set", "icon brief", "icons for Codex", "fix the fake App Store icon", "real brand logos", "design the app icon", "app icon options", or when a screen draws emoji, stand-in logos or mismatched icons.
---

# Icons: a brief for the image model, real brands kept real

Claude can't make images. This skill finds every icon the app needs, writes the brief, and sends the owner to Codex
(or ChatGPT) to make them; inside Codex, it makes them directly. Then it brings them in by name and checks them where
they show.

## Steps

1. **List every icon from the code, never from memory.**
   Run `kit/icon-audit.mjs` on the board: every app screen, every icon it draws (line icons, images, emoji, app tiles)
   and its size in points. Read the native app too (`Image(systemName:)`, `Image("…")`, emoji in strings). Merge into
   one table. Comma's first list was made from memory and missed the sun.
2. **Mark every real brand "original" and take it out of the brief.**
   Apps get their App Store artwork, platforms their press-kit mark, Apple its own App Store icon and badges. Flat, no
   shadow. If the original can't be found, say so and ask; never a stand-in. Read `references/real-brand-icons.md`.
3. **Decide line or illustrated.**
   Small UI stays line icons: nav bar, mics, buttons, toolbar glyphs, chevrons, rows, chips. An icon that is an object
   or a moment with room gets illustrated: states, streaks, leagues, answer cards, stamps, a path. Each area gets its
   own state set (Ideas is not Scripts). Write why next to everything that stays a line icon.
4. **Check every subject's wording.**
   One meaning per icon across the app; faceless where the emoji had a person; no eyes or limbs on objects; no letters
   unless the subject needs a mark; icons that mean the same merge under one name. Read `references/brief-template.md`
   § Subjects.
5. **Offer 3–4 style directions, and show them.**
   Each is drawn from the brand (its character, palette, type) with a sample prompt and the same three test subjects.
   The owner picks one; the pick plus one approved icon become the style references. Record every rejected style with
   why. Read `references/style-directions.md`.
6. **Write the brief.**
   The style paragraph first, word for word. Then one icon at a time, "Next: `file-name`: subject", grouped by where
   they show, with sizes. Transparent 1024 × 1024 PNG, about 78% fill, one soft contact shadow under the object, no
   text. Give the owner click-by-click steps for Codex or ChatGPT. Read `references/brief-template.md`.
7. **Bring them in by name.**
   The owner drops the files in one folder; `kit/import-icons.py` copies each into the board's assets and the Xcode
   asset catalog, only names the brief lists, transparent only. Placeholders stay until their file exists.
8. **Review at real size, light and dark.**
   `import-icons.py --sheet` writes a contact sheet; then look at every changed board screen and the simulator in both
   themes. Redo the weak ones by name ("redo `idea-used`: the tick is too small at 28 pt").
9. **The app icon: directions, then a layered brief.**
   3–4 directions from the brand, then the pick as foreground and background layers for Icon Composer (light, dark,
   tinted). Codex makes it, Claude imports it, and every candidate is checked at 60 pt on a real home screen beside
   real app icons. Read `references/app-icon.md`.
10. **Log the owner's verdicts**, then fold new lessons into `references/lessons.md`.

In-app pictures and character poses use the same brief shape: one style per set, one picture per reply, named files.
Read `references/brief-template.md` § Pictures and poses.

## Never

- Never draw, generate or substitute a real brand's mark: a phone emoji for the App Store, a lookalike Instagram
  glyph. ("if I write App Store, it is giving me … false icon … I do not want that for any application")
- Never put a drop shadow, glow or blurred disc behind an icon, logo or emoji in the UI. The one soft contact shadow
  belongs inside an illustrated icon's own artwork; brand marks get none. ("every icon have a shadow which I do not
  like")
- Never build the icon list from memory. Run the audit and read the app.
- Never put illustrated icons in the nav bar or other small UI. ("the navigation bar completely looks fucked")
- Never pick the style for the owner. Show 3–4 directions at real size first; the first guess (clay, puffy) was
  rejected outright.
- Never draw eyes, faces or limbs on objects, and never put text or letters in an icon.
- Never let one picture mean two things, or two pictures mean one thing. ("idea stands for bulb")
- Never show a state as a coloured row when it can be an icon, and never repeat a group's icon on every row of the
  group.
- Never let Claude hand-draw the final icon or app icon in SVG as if it were the real one. Placeholders are marked as
  placeholders.
- Never commit other companies' marks to a public repository. Use them only to name the app.

## Read when

| You are… | Read |
|---|---|
| Fetching or checking a real app, platform or Apple mark | `references/real-brand-icons.md` |
| Writing the brief, the subjects, or briefing pictures and poses | `references/brief-template.md` |
| Proposing the look, or recording a rejected one | `references/style-directions.md` |
| Making the app icon | `references/app-icon.md` |
| Wanting the reasons behind a rule | `references/lessons.md` |
| Listing the icons on a board | `kit/icon-audit.mjs` (usage at the top) |
| Importing the files | `kit/import-icons.py` (usage at the top) |
| Seeing a whole one-file brief for ChatGPT | `../../examples/IMAGE-PROMPTS.md` |

## Works with

- `ungenerated-foundation` › real icons and devices (`references/real-icons-and-devices.md`) and the design kit
  (`references/design-kit.md`): where the line-icon set and the brand palette come from.
- `ungenerated-flows` › the design board (`references/design-board.md`): the template whose screens the audit reads,
  with `tools/fetch-appicons.mjs` and `tools/capture.mjs`.
- `ungenerated-motion`: the character the icons take their style from.
- `ungenerated-review` › no-slop (`references/no-slop.md`) and visual QA (`references/visual-qa.md`): emoji stand-ins,
  fake logos and icon shadows are named checks.
- `ungenerated-store`: the app icon is the first thing on the listing; banners use the same marks.
