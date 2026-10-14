# The example projects

Seven made-up apps, each with its own kit and its own motion style, shown through fifteen full
flows: three openings, three onboardings, three paywalls, three setups and three ways out. They run
on the design-board template's engine and are published as the
[project pages](https://iammirrr.github.io/ungenerated/#projects) and the
[example board](https://iammirrr.github.io/ungenerated/board/).

| App | What it is | Motion style | Flows |
|---|---|---|---|
| Loaf | sourdough, on your starter's schedule | cinematic | the opening, the first bake |
| Stride | a running coach | snappy | the opening, onboarding, the paywall |
| Ripe | a diet app that keeps the food you love | fluid | onboarding, the paywall |
| Halves | a budget for two | precise | onboarding, leaving for another app |
| Lull | sleep sounds and a wind-down | calm | the paywall |
| Parla | Italian you say out loud | bubbly | the opening, the microphone, leaving for a break |
| Fern | plant care | organic | the first plant, leaving for budget |

## The files

| File | What it is |
|---|---|
| `apps.json` | Each app: its kit (colours, type, radius), its motion style, and its before/after pair for the page with the numbered notes for both phones. |
| `flows.json` | Every flow: its steps in order, what each step does and why, the skills it shows, and the moment each step is screenshotted. |
| `images.json` | Every picture the apps use, with the prompt that makes it. `IMAGE-PROMPTS.md`, the brief for ChatGPT, is written from it. |
| `js/apps/<app>.js`, `css/apps/<app>.css` | Each app's screens. A screen is `F.def({ id, section: '<flow id>', style: '<motion style>', ... })`. |
| `js/apps/common.js`, `css/common.css` | What they share: real dates, the iOS alert and sheet, pictures and their placeholders (`X.pic`), app icons, the mascot. |
| `js/apps/embed.js`, `embed.html` | One phone on its own: `embed.html#<screen-id>` loops a screen, `embed.html#flow=<flow-id>` plays a flow. |
| `kitsheet.html#<app>` | An app's kit part by part (colour, type, buttons, toggles, slider, choice, chips, a value), beside Claude's default. |
| `motionsheet.html` | The same four parts (a heading, a button, a toggle, a value) in every motion style, in the kit of the app that moves that way. |
| `css/generated.css` | The default kit the generated drafts share, everything the no-slop checklist names, on purpose. |
| `images/` | The pictures, as light WebP files (from `node scripts/images.mjs`). |
| `shots/` | Screenshots and recordings for the page and the README (from `node scripts/shots.mjs`). |

## Work on them

```
node scripts/dev.mjs               # http://127.0.0.1:5310/board/, served live from source
node scripts/build-site.mjs        # the home page, project pages, skill pages and the board, into site/
node scripts/shots.mjs             # retake the screenshots and recordings
```

Pictures: upload `IMAGE-PROMPTS.md` to a new ChatGPT chat and send; it makes one picture per
reply, each labelled with its file name, and “next” moves on. Save the originals in `images-src/`
(not committed) by those names, run `node scripts/images.mjs`, rebuild. The brief lists only the
pictures not made yet.
