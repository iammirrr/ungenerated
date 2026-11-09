# The app icon

The icon is the first thing people see on the listing and the thing they see every day on the home screen. Claude
writes the directions and the brief; Codex (or ChatGPT) makes the art; Claude imports it and checks it beside real
icons. Claude never draws the final icon itself.

## 1. Directions from the brand

Offer 3–4, each with a sample prompt, each made and shown before the owner picks:

- **From the character**, if the app has one: its face or its most recognisable part, big, on the brand colour. When
  the character changes, the app icon changes with it, everywhere at once, with no fallback to the old one (Comma
  replaced its octopus with a clapperboard and the icon went the same day).
- **From the main object**: the one thing the app is about, as one bold shape (a loaf for a baking app, a crescent for
  a sleep app).
- **From a mark**: an abstract shape that carries the name or the idea (a split circle for an app shared by two).
- **From the type**: a single letterform, only when the brand's type is distinctive.

Each prompt follows the same rules (see `examples/IMAGE-PROMPTS.md`, set 2, at the repo root):

> An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous
> margin, <background colour by hex>. No text, no letters. <the subject and its look in the brand's style.>

- **Full square, no rounded corners.** The system masks it.
- **Nothing small.** It's read at 60 pt on the home screen and much smaller in Settings and notifications.
- **No words.** The name sits under the icon already.
- **No baked gloss, glow or shadow.** The system adds its own light; baked effects fight it.

Record the rejected directions with why, as for the icon set (`references/style-directions.md`).

## 2. The layered brief for Icon Composer

Apple's Icon Composer (with Xcode) builds one icon file with light, dark and tinted (and clear) appearances from
layers. Brief the picked direction as layers, not as one flat picture:

- **Background**: a solid colour or a simple two-stop gradient, given as hex values. It is set in Icon Composer, not
  drawn into the art.
- **Foreground layers**: one to four, each a transparent 1024 × 1024 PNG (or SVG) of one part of the subject, all
  drawn on the same canvas so they stack in place. Separate the parts that should catch light or sit at different
  depths (a body, a highlight shape, a small detail).
- **Flat fills.** Each layer flat or with a very gentle gradient; Icon Composer adds the depth, blur and specular
  light.
- **Dark and tinted**: say in the brief how each layer behaves: which colours change in dark (often only the
  background), and which layer must stay legible as one tint.

A brief for one layered icon:

```
Next: `appicon-bg`: none, background is <#hex> → <#hex> (set in Icon Composer)
Next: `appicon-fg-1`: <the main shape>, flat <#hex>, centred, about 60% of the canvas, transparent 1024 × 1024 PNG
Next: `appicon-fg-2`: <the detail that sits on top>, flat <#hex>, same canvas and position as fg-1
```

Then the owner (or Claude, with Xcode on the machine) assembles them in Icon Composer and saves the icon file into the
project. Check the current Icon Composer documentation for layer limits and file formats before writing the brief.

## 3. Check it where it lives

Every candidate, before the owner picks:

- **At 60 pt on a real home screen**, beside real app icons the audience uses (fetched with
  `tools/fetch-appicons.mjs`, or the simulator's home screen with the build installed). An icon that looks fine alone
  can vanish or shout among others.
- **Light, dark and tinted**, in that real context.
- **At 29 pt and 20 pt** (Settings, notifications, Spotlight): the shape must still read.
- **Next to the listing**: the icon sits beside the first three screenshots in search results; it should belong to
  them.

Show the candidates side by side on one board page, each in its home-screen context. Never ask the owner to pick from
loose 1024 px files.
