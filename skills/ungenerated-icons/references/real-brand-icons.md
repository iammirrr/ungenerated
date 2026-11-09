# Real brand icons

Every icon that stands for a real app, platform or service is the original artwork. It is never drawn, never
generated, never an emoji, and never a lookalike glyph. The owner, on a fake App Store icon: "if I write App Store, it
is giving me … false icon … I do not want that for any application." A stand-in that imitates a brand reads as fake
and is worse than leaving the brand out.

These icons are marked **original** on the icon list and left out of the image model's brief.

## Where each kind comes from

| Kind | Examples | Source |
|---|---|---|
| **Apps on the App Store** | Instagram, TikTok, YouTube, Notion, Spotify, ChatGPT, Claude, Google Docs, Notes | The app's App Store artwork, by the iTunes lookup |
| **Platform and service marks** | the Instagram glyph, the YouTube play button, the TikTok note, a payment network | The brand's own brand-resources or press-kit page, on its own domain |
| **Apple's marks** | the App Store icon, the "Download on the App Store" badge, Apple Pay, Sign in with Apple | Apple's marketing resources and identity guidelines (developer.apple.com/app-store/marketing/guidelines), and Apple's own controls in code |
| **Desktop-only tools** | a Mac or Windows app with no App Store listing | Ask the owner to export it from their machine, or leave it out |

### Apps: the iTunes lookup

The board template has the fetcher (`ungenerated-flows` template, `tools/fetch-appicons.mjs`):

```
node tools/fetch-appicons.mjs instagram:389801252 notion=notion "docs=google docs"
```

- `key:<App Store id>` looks up by id (the number in the app's App Store link). Prefer it: a search can return a
  lookalike.
- `key=<term>` searches and takes the first app whose name contains the term.
- **Check the printed seller name** is the real company, then **look at every file**. Some listings carry an old or
  seasonal icon.
- The board draws them with `F.appTile(key)`. When a file is missing it shows a plain letter tile, and the icon audit
  reports it as `original: MISSING`. That letter tile is a marker that something is missing. It never ships.
- In the native app, put the same files in the asset catalog (`kit/import-icons.py` works for these too, without
  `--brief`), at 3x the drawn size.

### Platform marks: the press kit

- Search the brand's own site for "brand resources", "brand guidelines" or "press kit". Never take a logo from an
  icon-font site or a search result image.
- Use the mark the guidelines say is for the context (the glyph for a small icon, the wordmark only where words fit).
- Follow the rules on the page: colours, clear space, minimum size, no recolouring, no rotation, no outlines.

### Apple's marks

- The **App Store icon** and the **App Store badge** come from Apple's marketing resources, in the current version.
  Comma once drew the App Store as a phone emoji on an answer card; the fix is Apple's own icon.
- **Sign in with Apple** and **Apple Pay** buttons are Apple's own controls (`SignInWithAppleButton`,
  `PayWithApplePayButton`) in the app. On the board, copy their exact look from Apple's resources.
- Apple's rules on its marks change; read the current guidelines before shipping a screen that shows them.

## How they sit on screen

- **Flat on the card, no shadow, no glow, no disc behind them.** The owner: "I do not like the shadow behind the
  TikTok, Instagram."
- **Big enough to read.** An app icon smaller than about 20 pt stops being recognisable; the owner asked for the
  Figma, Claude and ChatGPT icons "to be bigger".
- **Real app icons keep their own rounded square.** Don't recrop a full-bleed app icon into a circle.
- **Several platforms at once:** overlap their marks as one cluster, each cut out with a thin ring in the ground's
  colour. Check each brand's rules allow it; some forbid touching other marks.

## If you can't find the original

Say so plainly, name the brand, and ask the owner: "I couldn't find Brain Rot's real icon. Can you send it, or
should I leave it out?" Keep the letter tile on the board as the visible gap until it's answered. Never fill the gap
with a drawn or generated version.

## Licences and the store

- Other companies' marks are trademarks. Use them only to name the app or service, never so that it looks endorsed.
- Don't commit them to a public repository: keep `assets/appicons/` in `.gitignore` for public work.
- App Review guideline 5.2.1 covers third-party marks. Showing many in onboarding is a review risk; keep them to
  screens that need them.
- Before publishing other companies' mascots or artwork in marketing, check their licence or fan-content terms.
- If you ship an open-licence icon set (Lucide, ISC; Microsoft Fluent Emoji, MIT), ship its licence notice in the app.
