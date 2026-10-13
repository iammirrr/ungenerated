# Ungenerated

Skills for designing mobile apps with Claude, from the concept to the store listing and the way
out: a live design board for every screen, a motion system, the onboarding, paywall and cancel-flow
patterns that work, and a checklist that keeps the result from looking generated.

They come from designing a real app screen by screen with a demanding reviewer. Every rule in here
was a correction once.

**Page:** https://iammirrr.github.io/ungenerated/ · **Example board:** https://iammirrr.github.io/ungenerated/board/

## Install

In Claude Code:

```
/plugin marketplace add iammirrr/ungenerated
/plugin install ungenerated@ungenerated
```

Or copy the folders you want from `skills/` into `~/.claude/skills/` (all projects) or
`.claude/skills/` (one project).

## Use

Start with "design the onboarding for my app" or "set up a design board", and Claude follows
`app-design-workflow`: concept, research, kit, board, then the flow screen by screen, each checked
before you see it. You review on the board with Pick and Note; the next pass reads your notes.

## The skills

### Start here

| Skill | What it does |
|---|---|
| [`app-design-workflow`](skills/app-design-workflow/SKILL.md) | The order to design a mobile app in, and which skill to use at each step. |
| [`app-concept`](skills/app-concept/SKILL.md) | Define what an app is before designing it. |

### Foundation

| Skill | What it does |
|---|---|
| [`design-kit`](skills/design-kit/SKILL.md) | Build the design kit before any screen. |
| [`motion-system`](skills/motion-system/SKILL.md) | The motion rules and engine for app screens. |
| [`interaction-feel`](skills/interaction-feel/SKILL.md) | Make controls feel physical and fluid. |
| [`real-icons-and-devices`](skills/real-icons-and-devices/SKILL.md) | Show real app icons and real-looking devices on design screens. |
| [`human-copy`](skills/human-copy/SKILL.md) | Write app copy that sounds like a person. |

### The board

| Skill | What it does |
|---|---|
| [`design-board`](skills/design-board/SKILL.md) | Scaffold and run a live design board for a mobile app. |
| [`app-research`](skills/app-research/SKILL.md) | Study how top apps structure a journey (onboarding, paywall, setup, a core screen) and turn it into "what we took" notes on the design board. |
| [`design-review`](skills/design-review/SKILL.md) | Run review passes with a reviewer. |
| [`visual-qa`](skills/visual-qa/SKILL.md) | Verify screens and motion with real screenshots before showing them. |

### The flow

| Skill | What it does |
|---|---|
| [`opening-hook`](skills/opening-hook/SKILL.md) | Design an app's opening. |
| [`onboarding-questions`](skills/onboarding-questions/SKILL.md) | Design onboarding questions that are quick and varied. |
| [`story-screens`](skills/story-screens/SKILL.md) | Design the story between the questions and the plan. |
| [`plan-reveal`](skills/plan-reveal/SKILL.md) | Show the person's answers becoming their plan. |
| [`account-signup`](skills/account-signup/SKILL.md) | Place and design the sign-up so it feels like saving progress, not a wall. |
| [`paywall`](skills/paywall/SKILL.md) | Design an honest, high-converting paywall. |
| [`consent-and-permissions`](skills/consent-and-permissions/SKILL.md) | Ask for consent and system permissions honestly and in context. |
| [`setup-and-tour`](skills/setup-and-tour/SKILL.md) | Design the first-run setup and tour. |
| [`app-screens`](skills/app-screens/SKILL.md) | Design the app's own screens after onboarding. |
| [`cancel-flow`](skills/cancel-flow/SKILL.md) | Design the cancel flow for a subscription app. |

### Quality

| Skill | What it does |
|---|---|
| [`no-slop`](skills/no-slop/SKILL.md) | The checklist every screen passes before anyone sees it. |
| [`accessibility-pass`](skills/accessibility-pass/SKILL.md) | Check app screens for accessibility before approval. |
| [`native-port`](skills/native-port/SKILL.md) | Build approved board screens natively in SwiftUI or Jetpack Compose. |
| [`app-store-assets`](skills/app-store-assets/SKILL.md) | Make App Store and Play Store screenshots and the preview video from the design board. |

## The design board

`skills/design-board/template/` is a working board: the motion engine, the parts (buttons, rows,
toggles, sliders, segmented controls, reels, coach marks), six screen transitions, Play the flow,
Pick and Note saved to the repo, and the tools that capture real-time screenshots and contact
sheets. Copy it into your project and run `node tools/serve.mjs`.

## Contributing

Each skill is one folder with a `SKILL.md`. Keep them specific: a rule, why it holds, and what to do
instead. If a rule came from a real correction, it belongs here. The page rebuilds itself from the
skills on every push.

## Licence

MIT for this repository. The icon subset in the board template is from Lucide (ISC). App icons are
not included: `tools/fetch-appicons.mjs` fetches them for your private use.
