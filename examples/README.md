# The example apps

Six made-up apps, each designed twice from the same brief: once the way a model designs by default
(the generated draft), once with the skills. They run on the design-board template's engine and
are published as the [example board](https://iammirrr.github.io/ungenerated/board/).

| File | What it is |
|---|---|
| `apps.json` | The source of truth: each app's kit (colours, type, radius), its step, the skills that shaped it, and the numbered notes for both phones. The build turns it into the board's config, the kit styles and the page. |
| `js/apps/<app>.js` | Each app's two screens: `<app>-generated` and the screen made with the skills. |
| `js/apps/common.js` | What they share: real dates, the iOS alert (drawn as iOS draws it), and the generated draft's parts. |
| `js/apps/kits.js` | The Kits view: the default kit, then the six. |
| `js/apps/embed.js`, `embed.html` | One phone on its own, looping; the page's live phones are this in an iframe. |
| `css/generated.css` | The default kit, everything the no-slop checklist names, on purpose. |
| `css/apps.css` | The six apps' own parts. |
| `shots/` | Screenshots for the page and the README, from `node scripts/shots.mjs`. |

To work on them: `node scripts/build-site.mjs`, serve `site/` (for example `npx serve site`), and open
`/board/` or `/board/embed.html#lull-paywall`.
