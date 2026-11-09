# The brief

One file the owner pastes into Codex or ChatGPT, or that Codex works through on its own. It holds the picked style
word for word, then every icon as its own line. Save it in the app's repo (for example `docs/icon-brief.md`): the
import script reads its names, and the next round adds to it.

## Subjects

Before a subject goes in the brief, check its wording:

- **One meaning per icon, across the whole app.** A bulb is always "idea". If two areas need different things, they
  get different pictures; if two names mean the same, they merge under one file and the importer reuses it
  (`--reuse emoji-bulb=core-idea`).
- **Each area has its own state set.** Ideas' new / developing / used are not Scripts' draft / ready / posted.
- **States read without words.** Make them distinct in shape, not only in colour.
- **Faceless people.** Where the emoji had a person (a shrug, a hug, a flexed arm), write the subject faceless: "a
  faceless figure shrugging, palms up".
- **No eyes, faces or limbs on objects.** Only the app's character has a face.
- **No letters or numbers** unless the subject needs a mark (a calendar page can have lines, not a date).
- **Say what it is, not what it means.** "a magnifying glass", then the meaning in brackets for the owner: "(didn't
  find my formats)".
- **The size it shows at.** A subject that must read at 24 pt is one bold shape, not a scene.

## The template

````markdown
# <App>: the icons to make (<date>, from the code)

The list comes from the code: the icon audit opened every screen and recorded every icon and its size. Numbers like
A12 are the board's screens.

**To make: <n>.** Done: <n>. Reused under a second name: <n>. Originals (not made, the brands' own): <n>.
Everything that stays a line icon is listed at the end, with why.

## How (Codex or ChatGPT)

1. Attach the two style references: `<character.png>` and `<approved-icon.png>`.
2. Paste the style below, then this whole file.
3. One icon per reply, in order. Under each, write only its file name.
4. Wait for "next". On "redo `<file-name>`: <why>", make that one again.
5. Each file is a transparent 1024 × 1024 PNG, named exactly as listed, saved to `<folder>`.
6. When a batch is in: `python3 kit/import-icons.py <folder> assets/icons --brief docs/icon-brief.md --xcassets <App>/Assets.xcassets/Icons --px 288 --sheet`

## The style (paste this first, word for word)

> Use case: stylized-concept. Asset: one <App> iOS icon. Two reference images: 1 is the <app's character>; 2 is the
> approved <icon>. Use both only as style references: <the picked direction's look, in concrete words>. Don't copy
> their subjects. No eyes, faces or limbs on objects. No strokes or outlines unless the style is a line style. No
> letters, words or numbers unless the subject needs a mark. Palette: <hexes>; another colour only when the subject
> names it. One centred object, readable at 32 px, about 78% of a 1024 × 1024 transparent PNG, one very soft contact
> shadow under it. No other shadow, glow or background.

## 1 · <Area> (<n>)

Where these show and who sees them, in one line.

| File | Subject | Where | pt |
|---|---|---|---|
| `<area-thing>` | <a concrete object> (<what it means here>) | <screens> | <min–max> |

Next: `<area-thing>`: <subject>
Next: `<area-other>`: <subject>

## Originals (not in this brief)

| Brand | Source | Where |
|---|---|---|
| App Store | Apple's marketing resources | <screens> |
| Instagram | App Store artwork (`tools/fetch-appicons.mjs`) | <screens> |

## Done

`<file>`, `<file>` …

## Reused, nothing to make

`<emoji-bulb>` ← `<core-idea>`: the same meaning, one picture.

## Stays a line icon (and why)

- **The nav bar** (<pt>): illustrated icons there were rejected.
- **Buttons and toolbars**: back, close, chevrons, add, share, delete…
- **Rows and chips** (13–18 pt): too small for a picture to read.
````

## Naming

- Lower-case words and dashes, an area prefix: `state-draft`, `idea-used`, `stamp-first-post`, `fmt-voice`.
- An emoji's replacement is `emoji-<key>`, so the board and the app swap it everywhere that emoji shows.
- The file name is the asset name in the catalog and the board. Never rename after import without updating both.

## Sending the owner

Claude can't make the images. Tell the owner exactly what to do, click by click:

- **Codex (preferred, it can save files into the repo):** open Codex in this repo, start a new task, attach the two
  reference PNGs, paste the brief, and send. It saves each file into `<folder>`. Then tell Claude "icons are in".
- **ChatGPT:** start a new chat, upload the two references and the brief file, send. Download each picture and save
  it as the name written under it into `<folder>`. Check the background is really transparent: a painted checkerboard
  is not transparency, and the importer will skip it.
- **Inside Codex with image generation**, this skill makes the images itself, one by one, straight from the brief.

## Redo by name

After the contact sheet and the board, write each redo as its own line: "redo `idea-used`: the tick is lost at 28 pt,
make it twice as big". Never regenerate a whole set to fix two icons.

## Pictures and poses

In-app pictures (food photos, plants, empty states) and the character's poses use the same shape. The whole worked
example is `examples/IMAGE-PROMPTS.md` at the root of this repository (seven sets, 34 pictures):

- **One style paragraph per set**, pasted before every picture of that set. Each set starts fresh; nothing carries
  over unless a picture says so.
- **One picture per reply**, numbered, `1/34 · parla-tazza-hello.png` under it, then wait for "next".
- **Shape and background stated per picture**: square 1024 × 1024 or portrait 1024 × 1536; transparent or not.
- **Where the screen crops it**: "keep the bowl centred, the screen crops to a circle"; "keep the lower 40% empty, the
  app sets words there".
- **Character poses**: the same character, same size, same base line in every pose ("the saucer's base at the same
  height, about 90% down"), so poses swap in place. Poses come from the owner's own drawing, moved about its joints;
  never redesign the character.
- **No text, letters, logos, watermarks, borders or frames** in any picture.
