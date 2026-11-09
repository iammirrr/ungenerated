---
name: ungenerated-store
description: Everything an app's App Store listing needs, in order - ASO keyword research with RespectASO (countries, seed words in the ways people search, title, subtitle and keyword field per language, tracking), hand-composed screenshots on an editable board exported at Apple's exact sizes and languages, a preview trailer as one continuous motion-graphics film in Remotion, banners for Apple's new creative assets (product page header, search results, in-app events), and the app icon via ungenerated-icons. Use when asked for "ASO", "keywords", "app title and subtitle", "keyword field", "localise the listing", "App Store screenshots", "Play Store screenshots", "screenshots like these", "app preview", "app trailer", "product video", "launch film", "App Store banner", "product page header", "creative assets", "Open Graph image", "store listing", or "get ready for the App Store".
---

# Store: the listing, from the words people search to the film they watch

This skill makes the listing: being found (ASO), then being picked (screenshots, trailer, banners, icon).

## Steps

1. **ASO with RespectASO.**
   Pick countries with the opportunity finder, list seed words from the app's concept in the ways people really
   search, choose relevant + popular + winnable (long-tail first), then write the title, subtitle and keyword field
   per language. Track weekly; change only with an update. Read `references/aso.md`, then `references/aso-tools.md`.
2. **Screenshots.**
   List the features and headlines first and let the owner edit them. Then compose one screenshot at a time on the
   editable board, a true-to-app version under each, the owner picks, and export every size and language. Read
   `references/screenshots.md`; the kit is `screenshots/kit/` and `screenshots/scripts/`.
3. **Trailer.**
   Motion graphics in Remotion, one continuous movement built from the app's real UI and data, the AI and core
   features exaggerated, cut to a measured track, 30 s. Send a 10-second checkpoint of the opening before the rest.
   Read `references/trailer.md` and `references/trailer-lessons.md` before the first frame.
4. **Banners.**
   Apple's new creative assets: the product page header, search results, the universal asset and in-app events. Built
   as HTML on the board in the screenshots' type, rendered to exact pixels; the videos cut from the trailer's scenes.
   Read `references/banners.md`.
5. **The app icon.**
   Hand to `ungenerated-icons` › app icon (`../ungenerated-icons/references/app-icon.md`): directions, a layered brief
   for Codex, checked at 60 pt beside real icons.
6. **Before upload, check everything together.**
   The icon, the first three screenshots and the search banner side by side as the search result shows them; every
   language; the screenshots' audit at 0 cut words. Log every owner note first, then fold the lesson into
   `references/lessons.md`.

## Never

- Never more than one headline or one feature per screenshot, and never small text. ("Small stuff is always bad stuff")
- Never a fake app: screenshots, trailer and banners show the real app's UI and real data.
- Never tilt a phone so far the feature can't be read; phones straight, any tilt a few degrees. ("EXTREME TILTING BRO
  NO FEATURE IS SHOWING")
- Never props, stickers, pasted cut-outs or a card inside a card; the character at most once, still. ("bloated with a
  lot of other elements")
- Never the same real example twice: a different real creator or item in each screenshot and across the film.
- Never make the trailer the screenshots animated, or a phone walkthrough; it is one calm continuous film. ("LITERALLY
  THE SCREENSHOT COMPILED, I'M DISAPPOINTED TO MY CORE")
- Never promise a feature the app doesn't have, or in a language it hasn't been tested in.
- Never mass-produce screenshot variations from a template; one at a time, by hand, judged at full size.
- Never let automatic layout override the owner's edits, and never test the editor on his real edits.
- Never put competitor brands in the keyword field, or repeat a word across title, subtitle and keyword field.
- Never change keywords without an app update, or judge a change before 2–4 weeks.
- Never prices, discounts, URLs, ©, other platforms' logos or Apple awards in a banner, and never an alpha channel.
- Never send a render you haven't looked at in its final encoded file.

## Read when

| You are… | Read |
|---|---|
| Researching keywords or writing the title, subtitle and keyword field | `references/aso.md` |
| Choosing RespectASO's edition or Apple's tools (analytics, Custom Product Pages, tests, events) | `references/aso-tools.md` |
| Making screenshots | `references/screenshots.md`, kit in `screenshots/kit/`, scripts in `screenshots/scripts/` |
| Wanting the owner's words behind each screenshot rule | `references/screenshots-lessons.md`, `screenshots/examples/` |
| Making the trailer | `references/trailer.md`, kit in `trailer/kit/`, encode in `trailer/scripts/encode.mjs` |
| Before the trailer's first frame | `references/trailer-lessons.md` |
| Making banners, the Open Graph image or the Play feature graphic | `references/banners.md` |
| Needing a short checklist or the Play Store sizes | `references/app-store-assets.md` |
| Wanting the reasons behind any rule here | `references/lessons.md` |

## Works with

- `ungenerated-icons`: the app icon and every icon inside screenshots and banners; real brand marks stay original.
- `ungenerated-foundation` › app concept (`references/app-concept.md`) for the seed words and features; human copy
  (`references/human-copy.md`) for headlines, description and promotional text.
- `ungenerated-flows` › the design board (`references/design-board.md`): its `tools/capture.mjs` renders banners and
  frames.
- `ungenerated-motion` › continuity (`references/continuity.md`) and motion styles: how the trailer's parts grow out
  of each other.
- `ungenerated-review` › visual QA (`references/visual-qa.md`): the last look before the owner sees anything.
