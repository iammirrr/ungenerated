---
name: ungenerated-audit-code
description: Find what's dead, duplicated or risky in an app's code, and report it with file:line before changing anything: dead screens (nothing navigates to them, or they can't be reached from the app's entry) in SwiftUI, UIKit, React Native/Expo, Flutter, Compose and web routers; dead code, unused assets, strings and dependencies; duplicate components; risky logic (money, auth, sync, deletion, time, user words) with no test; huge files; TODO, FIXME and shortcut debt; debug UI or test switches that reach release builds; release hygiene (entitlements, frozen branches). Use for "code audit", "find dead code", "dead screens", "what can I delete", "unused assets", "clean up the codebase", "is this code risky", "tech debt", "what's untested", or before launch or a big refactor. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Code audit: what's dead, duplicated or risky

For: a codebase the owner can trust and change. Screens cut from the design still in the code, three copies of one button, and money logic with no test are what make the next change break something. This audit lists them with proof and changes nothing until the owner approves.

## Steps

1. **Learn the app.** Write the App profile (or take the runner's): languages, UI frameworks, the app's entry points (the `@main` app, `App.tsx`/`app/_layout.tsx`, `main.dart`, `MainActivity`, the web router), targets and extensions, build configurations, test targets, CI, AGENTS.md / CLAUDE.md rules. Note which tools are installed (`periphery`, `knip`, `depcheck`, `jscpd`, `dart analyze`, Android lint); say before installing anything.
2. **Draw the screen graph.** From the entry, follow every way a screen is reached (navigation links, destinations, sheets, covers, tabs, routes, deep links, notifications, widgets, extensions) and list every screen in the code. Screens that are not in the graph are dead or only reached from previews and tests. Method per framework in `references/dead-screens.md`. Confirm with the owner's design (a board or flow list) which screens were cut on purpose.
3. **Scan for the rest.** Run the tools and greps in `references/checklist.md` for dead code, unused assets, strings and dependencies, duplicates, huge files, debt comments and debug UI in release. Read every hit before calling it dead: reflection, string-built names, storyboards, deep links, server-driven UI and dynamic imports make tools wrong.
4. **Find risky logic with no test.** List the code that handles money, entitlements, auth, deletion, sync and merge, time and dates, limits, and the person's words (text input, dictation, drafts). For each, find its tests (and coverage if available) and say what breaks if it's wrong. A UI test that is stale or flaky counts as no test; a failing one may be a real bug, so read it.
5. **Audit the catalogue.** Every row of `references/checklist.md` gets a verdict: ❌ confirmed (file:line, the tool's output, the search that found no caller), ⚠️ suspected (what would settle it), ✅ fine (why), N/A (why). Get one independent reviewer agent for the risky-logic list, given the files and the checklist, not your conclusions.
6. **Report and stop.** Result first, plain words: what can be deleted safely (with the count of lines and files), what is risky and untested, what is huge. Then the screen graph (a short list or a diagram), coverage ("28 of 28 checked; tools run: periphery, knip"), each finding with proof, and a **numbered fix list** (delete, merge, split, add a test), each with what it touches and its risk. Change nothing until the owner answers with numbers, "all" or "none".
7. **Fix only what was approved.** Delete in small commits, one kind at a time; build every target and run the tests after each; add the missing tests first for logic you're about to touch (a test must fail without the fix). Then a short final report: removed (files, lines, size), merged, tests added, still open.

## Never

- Never delete anything before the owner approves the numbered list; "unused" is often wrong.
- Never call code dead from a tool's output alone; find no caller by search, and check strings, reflection, storyboards, deep links and dynamic routes.
- Never delete a screen the owner may bring back without saying so; screens cut from the design are deleted only when the owner confirms they're cut.
- Never refactor while auditing; the audit changes nothing.
- Never touch another project's or another agent's lane; stage by exact path.
- Never run several simulators or parallel builds; one at a time.
- Never leave a release with debug UI, a test switch, a free pass or fixture data reachable.
- Never mark risky logic "fine" because it hasn't broken yet; it needs a test or a named reason.

## Read when

| You are… | Read |
|---|---|
| Finding dead screens (SwiftUI, UIKit, RN/Expo, Flutter, Compose, web) | `references/dead-screens.md` |
| Running the scans and auditing | `references/checklist.md` |
| Wanting the why behind each rule | `references/lessons.md` |

## Works with

- `ungenerated-audit` runs this with the other seven.
- `ungenerated-audit-security` owns secrets and dependency vulnerabilities; this audit owns unused and duplicated code.
- `ungenerated-audit-performance` uses the unused-asset and huge-file lists for app size.
- `ungenerated-audit-app-review` needs the debug-UI and placeholder findings.
- `ungenerated-flows` › design-board (references/design-board.md) holds the screen list the graph is compared with, and board-to-app (references/board-to-app.md) the rule that every approved board screen exists in the app.
