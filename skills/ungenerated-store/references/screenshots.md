<!-- Part of ungenerated-store. Was the `app-store-screenshots` skill. -->
> **When:** Make an app's App Store screenshots that sell, as an editable board in the repo - the features and headlines listed first, every screenshot composed by hand (big two-line headline, the app's real screens, the one feature exaggerated), the owner adjusting anything by clicking (move, rotate, resize, opacity, several at once), a true-to-app version under each from the real app, then exact App Store PNGs. Use when asked for App Store / Play Store screenshots, store listing images, or "screenshots like these" for any app, in any repo.

# App Store screenshots

The flow that works, learned over twelve rounds with a picky owner (three of Comma's are in `screenshots/examples/`; the rest show real creators' reels, so they stay out of this public repo). It is a process
more than a tool: **one screenshot at a time, composed by hand, judged at full size.** Never fill a template system
with many variations at once: that produced twenty average frames and was rejected every time.

**Always in this order:** the board first, where the owner edits and picks, in English at the base size (440 × 956,
iPhone 6.9"). Only then the other sizes and iPad (§8) and the languages (§9), both derived from the picked, edited
set, so one change in English reaches every size and language.

## 1. Set up the board (once per repo)

Pick any folder in the app's repo; `store/screens` below is only an example.

```
node <skill>/screenshots/scripts/new.mjs store/screens --brand=#ef7a45 --title="My app"
node <skill>/screenshots/scripts/serve.mjs            # from the repo root; open http://127.0.0.1:5199/store/screens/
```

`new.mjs` copies the kit into the folder: `base.css` (the frame, the one headline style, the phone, cards),
`theme.css` (the brand colours and fonts: edit it), `hand.js` (the editing layer), `index.html` (the board),
`screens.json` (the slots in order, each with its versions), `edits.json` (the owner's edits), a first screenshot to copy from, and
`FEATURES.md`. It never overwrites a file. Needs Node 22+ and Chrome (`CHROME=/path` when not in /Applications).

## 2. Features and headlines first, then the owner edits them

Read the app (its screens, its copy, its data) and fill `FEATURES.md`: one row per major feature, a headline of two
short lines (2–6 words, one word boxed `<span class="box">`), and in one sentence **what the picture shows**. Ask the
owner to edit that list before designing anything. Up to 10 screenshots (Apple's limit); the first three carry the
most. Ask for their reference screenshots and study them: what owns each frame, how the type is built, how the UI
breaks out of the phone.

## 3. Real material

- **The app's real screens**, crisp: iOS from the simulator with `screenshots/scripts/capture-ios.sh` (relaunch the app per
  screen with its own launch switches for a given screen, sample content and no debug overlays; feed recordings for
  voice features), or the web app captured at 1170 × 2532. Save to `native/`. Check every capture: no debug buttons,
  no permission popups, no "not available" banners, real content.
- **Real data**: real numbers, real names, real content from the product. A different real example on each screenshot.
- **HD media**: low-resolution images look soft at App Store size. Mark them `data-hd`; full-size files dropped
  into `hd/` replace them automatically. Content by other people needs their permission before it ships.

## 4. Compose each screenshot by hand

Copy `01-hero.html` to `NN-name.html`, add it to its slot in `screens.json`, and place each piece with absolute positions in
the 440 × 956 frame. Render it at full size and look at it next to the references before showing anyone:

- **The picture says exactly what the headline says.** "See its shape" shows the reel broken into its beats;
  "from idea to script" shows the idea's card rising out of the screen and an arrow into the script.
- **One main thing, big.** A straight phone with the real screen (any tilt only a few degrees), or the feature
  itself drawn big. Not every screenshot needs a phone.
- **Exaggerate the feature:** lift the real UI out of the screen bigger with a shadow; fade the rest of the phone's
  screen (`.dimmer` / opacity); make the moving part look like it moves (motion blur, speed streaks, a slot of
  options spinning past with the chosen one sharp).
- **Breathable and clean:** no stickers, no decorative props or random 3D icons, no pasted cut-outs of other
  things, no small text, no text shadows; the character (if the app has one) at most once, standing still.
- **One headline style for the whole set**, the same size everywhere; brand and white frames mixed.
- **Look like the real thing:** reels are tall 9:16 with their likes and handle; cards are one line each (`.one`
  shrinks a line to fit); icons are the app's own, never emoji stand-ins like ✨.
- When the owner asks for options, make 2–3 that are **completely different concepts**, never colour swaps.

## 5. The owner edits on the board

Everything is editable in place, in the board or on a page alone: click to select, Shift-click or drag a box for
more, drag to move, Option-drag to rotate, Cmd-drag to resize; the bar: bigger/smaller (+ −), opacity ([ ]), dim a
phone's screen (, .), forward/back (F B), reset (0), arrow keys to nudge. Arrows (`<svg class="arrow"
data-pts="x1,y1,bend x,bend y,x2,y2">`) get handles for their ends and bend. Edits go to `edits.json` and apply to
the exports. When you change a page's markup, keep existing pieces in their order (edits are keyed by order) or
clear that page's edits and say so. Never test the editor on the owner's real edits; use a copy.

Log every piece of the owner's feedback before changing anything, and re-read it each round.

## 6. True to the app, edited

Under each screenshot, add its true-to-app version (a second version of its slot in `screens.json`). Apple asks for
screenshots that show the app in use, and owners trust what looks like their app. Do not just paste a raw capture:
**redraw the real screen at the app's own scale** with `app-screen.css` (`.phone > .scr > .in`, 390 × 844 points),
copying its background, type, controls and icons from the captures, then edit it so it sells:

- **Trim the clutter:** labels that serve nothing ("8 reels"), notes, secondary buttons, helper paragraphs, camera
  hints, dotted guides. Fewer items, bigger: three creators instead of four, two cards instead of two and a half,
  two beats with big text instead of three small ones, a short line instead of a paragraph.
- **The feature, exaggerated but recognisable:** dim the rest of the screen (`.dimmed`), pop the one card out of the
  phone (`.pop`, slightly turned, bigger than in the app), add the effect the designed version used (an underline
  on the word being said, a voice wave, a keyboard up while writing, beats as circles under the reel).
- **Creative freedom on content, faithful on look:** a different real example on each screen; nothing that the app
  could not show. Keep the phone straight and big.
- Background: tile an empty area of a capture on the pattern's own period (measure it: the vertical offset where
  rows repeat) so there are no seams; the status bar is the top 50 points of a capture.



## 7. Pick

Each slot in `screens.json` holds its versions (`"versions": [{"file", "label"}]`: A designed, B true to the app,
any extra for a slot that must be stronger, like the first screenshot). On the board the owner presses **Use this**
under the version that ships; **All versions / Final set** switches between comparing and seeing only the picks.

## 8. Every size: iPhone, iPad, Mac

On the board, the size tabs (iPhone 6.9″ · 6.5″ · 6.3″ · 5.5″ · iPad 13″ · iPad 12.9″ · Mac) show the whole set at each
size's real proportions, still editable. Export:

```
node <skill>/screenshots/scripts/shoot.mjs store/screens --size=iphone69,iphone65,iphone63,iphone55,ipad13,ipad129,mac --final
```

PNG at Apple's exact pixels (iPhone 1320 × 2868, 1284 × 2778, 1206 × 2622, 1242 × 2208; iPad 2064 × 2752,
2048 × 2732; Mac 2880 × 1800) into `out/<size>/final/NN.png`, the picked version of each slot in order, with the
owner's edits (without `--final`: every version, for review). **Proportions are kept:** the frame scales uniformly to
the canvas's height, centred, and its field runs edge to edge; pieces that bled off the frame's edge continue onto
the wider field. Nothing stretches, and the edits apply unchanged. **The device follows the canvas:** each iPhone size shows a current phone (6.9″ and 6.3″ the Dynamic Island, 6.5″ and
5.5″ the notch: 5.5″ only sets the pixels, never draw an old home-button phone); on iPad every phone becomes an iPad of
the same height whose app screen uses the space (the content ~80% of the width, bigger, no empty margins; the lower
half moves up only as far as the gap above it allows; pop-outs and arrows follow what they sit on, by where they are
seen; the app's words a pop-out covers or repeats are hidden), and the headline grows into the iPad's width (its widest
line ~72% of it, pushing the iPad down, never into a piece that stays put); on Mac a MacBook with the app in its own
window. **When the automatic iPad layout of a screenshot is weak, draw that slot an iPad page of its own**
(`"ipad": "NN-name-ipad"` on the version in `screens.json`: the board and the export use it on iPad sizes; lay it out
on the iPad canvas, `.f { width: 717px }`, its device a `.tab`, in a layout only a big screen allows).
The PNGs are Apple's exact pixels (rendered at a whole-number scale, 3x for iPhone, 2x for iPad and Mac, the frame zoomed to fit). Look at the iPad and Mac tabs: where a screenshot
looks empty on the wider canvas, add an iPad or Mac version to that slot. Apple needs iPad screenshots only when the
app runs on iPad, and Mac ones only for a Mac app (an iPhone app on Apple silicon Macs shows its iPhone screenshots).

Planned next (not built yet): duo screenshots, two neighbouring screenshots as one continuous picture.

## 9. Audit before showing anything

```
node <skill>/screenshots/scripts/audit.mjs store/screens --final --size=iphone69,iphone65,iphone63,iphone55,ipad13,ipad129 --lang=en,de-DE,ja,hi,ar-SA
```

The owner should never have to point out a cut word or a small headline. The audit loads every page as the export
does, on every size and language, and reports text cut in its box (`cut`), letters leaking from the pill (`pill`), texts
on top of each other where both are seen (`overlap`), text half hidden by a screen or the canvas's edge (`clipped`,
`edge`), and a headline at the edge or small on a wide canvas (`headline`). It exits 1 on any cut, pill or overlap: fix
those (in the page, or in the rule that caused them, so every app gains), run it again, and look at the renders of
what it flagged. Use a long language (de-DE), a CJK one (ja), an Indic one (hi) and a right-to-left one (ar-SA).
Rules already in the editor so most never happen: one-line texts and ellipses refit after every move and zoom; a
translated text never comes out taller than the English, nor a one-line label more than 15% wider.

## 10. Languages

```
node <skill>/screenshots/scripts/shoot.mjs store/screens --collect            # strings/en.json: every headline and interface word
node <skill>/screenshots/scripts/translate.mjs store/screens                   # strings/<lang>.json for App Store Connect's languages
node <skill>/screenshots/scripts/shoot.mjs store/screens --lang=all --size=iphone69,ipad13 --final   # out/<lang>/<size>/final/NN.png
```

- **Which languages:** App Store Connect has 50 localizations (`translate.mjs` lists them; the four English ones
  share the English set): every European one, Arabic, Hebrew, Turkish, Hindi and the ten other Indian languages,
  Chinese (simplified and traditional), Japanese, Korean, Thai, Vietnamese, Indonesian, Malay. The 175 storefronts
  (countries) each show the closest of these, so this is every language a listing can have. Run all of them; they
  cost cents. On the board the picker lists them by name, by region.
- **What translates:** headlines (the `[boxed]` word and the two lines kept) and the app's own interface (tabs,
  buttons, labels, section names), as the localized app will show them.
- **What stays as written:** what people write in the app: scripts, captions, notes, reel titles, handles, numbers.
  Put those texts in `keep.json`, or mark them `data-keep` / `.said` in the page. Never let a screenshot promise a
  feature in a language the app doesn't support yet. For Comma, script writing in other languages is untested, so
  scripts stay English.
- Only new or changed English texts are translated (on Claude Haiku, `ANTHROPIC_API_KEY`); a translation that loses
  its brackets or lines is refused. `--redo=ja` asks again for shorter ones.
- Every headline line stays on one line and shrinks to fit; a longer translated label shrinks within its box; RTL
  headlines (ar, he, ur) turn. Each script gets its own good font per role (a heavy rounded or display face for the
  headline, Noto Sans for the interface, Noto Serif for serif titles), placed before any generic fallback, with its own
  line height; the boxed word keeps whole glyphs inside the box, and lines keep the side margins. Look at a long language (de-DE) and a CJK one (ja) before shipping.
- On the board, the language picker shows the whole set in any translated language, still editable.

`references/screenshots-lessons.md` holds the owner quotes behind each rule; `screenshots/examples/` shows the set they produced.
