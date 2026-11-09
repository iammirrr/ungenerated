# Banners: Apple's creative assets and the rest

Claude makes the banners (they're layout, type and the real app, which Claude can build and render exactly). The icons
inside them come from `ungenerated-icons`. The owner: "BANNER SHOULD BE MADE BY CLAUDE ICON SHOULD BE WRITTEN DRAFTS TO
CODEX"; "BANNER IS LOOK NEW APPSTORE STUFF".

Sources, read before each upload because they change:
- developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications
- developer.apple.com/app-store/asset-best-practices

## What Apple's creative assets are

- Live since **5 October 2026**, shown on **iOS and iPadOS 27 and later**.
- Uploaded in **App Store Connect › Asset Library**, and approved **without an app update**.
- They replace the old Feature Banner.
- Custom Product Pages can each have their own.

## The sizes

| Asset | Ratio | Pixels | Image or video |
|---|---|---|---|
| **Product page header** | 21:9 | 3840 × 1646 | image, or a 5–30 s looping video at 30 or 60 fps that starts muted |
| **Search results** | 3:2 | 1920 × 1280 up to 3840 × 2560 | image, or a 5–30 s video, always muted |
| **Universal asset** | 16:9 | 5244 × 2950, PNG | image; one asset for both placements |
| **In-app event card** | 16:9 | 1920 × 1080 up to 3840 × 2160 | image or video |
| **In-app event details** | 9:16 | 1080 × 1920 up to 2160 × 3840 | image or video; event videos run 15–30 s |

- **The header** is for a first-time visitor: what the app is, in one picture.
- **The search result** states the app's purpose at a glance and shows the real interface. Without it, the app's
  events, preview and screenshots show there instead, so it competes with your own first screenshots.

## Apple's rules

- No alpha channel.
- The focal point centred inside the template's safe area (download Apple's templates and check against them).
- One short phrase that adds to the picture, or none. Not a paragraph, not the app name repeated.
- No prices, discounts, URLs or ©.
- No other platforms' logos, and no Apple awards.
- Content suitable for 4+.
- Localised per language, like the screenshots.
- Videos: work with the sound off, loop seamlessly, have a strong poster frame, and no fast cuts.

## How to build them

1. **Same system as the screenshots.** The screenshots' headline type, pill and grounds, and the app's real screens
   or real UI pieces (`references/screenshots.md`). A banner that looks like a different brand from the screenshots
   breaks the page.
2. **One idea per banner.** Usually the app's core moment, big, in the centre: the feature the first screenshot sells.
   No props, no stickers, no collage.
3. **HTML on the board, rendered to exact pixels.** One page per banner at half size, captured at 2x with the board's
   capture tool (`ungenerated-flows` template, `tools/capture.mjs`):

   ```
   W=1920 H=823  DSF=2 node tools/capture.mjs "http://localhost:4173/banners/header.html" out/header 1500   # 3840 × 1646
   W=1920 H=1280 DSF=2 node tools/capture.mjs "http://localhost:4173/banners/search.html" out/search 1500   # 3840 × 2560
   W=2622 H=1475 DSF=2 node tools/capture.mjs "http://localhost:4173/banners/universal.html" out/universal 1500   # 5244 × 2950
   ```

   Then remove the alpha channel: a browser's PNG often carries one even when every pixel is opaque.

   ```
   python3 -c "import sys; from PIL import Image; [Image.open(p).convert('RGB').save(p) for p in sys.argv[1:]]" out/*.png
   ```

4. **The header and search videos are cut from the trailer's scenes** (`references/trailer.md`): the same Remotion
   project, a new composition at 21:9 or 3:2, one movement made to loop (its last frame is its first). No new
   footage, no fast cuts. Check the loop point frame by frame, and pick the poster frame on purpose.
5. **Check before upload:** in Apple's preview in App Store Connect, and against Apple's templates' safe areas, in
   light and dark, in every language you ship. Run the screenshots' audit thinking on them: no cut words, nothing at
   the edge, nothing small.

## The rest of the artwork a launch needs

| Asset | Size | Notes |
|---|---|---|
| Website hero | the site's own | the header banner's picture, recomposed for the page |
| Open Graph image | 1200 × 630 | what a shared link shows; one phrase, the real app, the icon |
| Google Play feature graphic | 1024 × 500 | only when there's an Android app; no device frames required |

Thumbnails and header art: the brand's own background, uncluttered, the subject and logo big, and checked in both
square and vertical crops if it'll be reused in social.
