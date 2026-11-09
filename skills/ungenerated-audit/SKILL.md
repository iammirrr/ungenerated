---
name: ungenerated-audit
description: The full pre-launch audit of any app in one run, or any single audit on its own: payments, security, privacy and legal, code, analytics, AI, App Review and performance. One app profile, each audit's findings with proof (file:line, command output or a live check), one combined report ranked by what could actually happen, one approval, then the fixes. For web, desktop (Mac/Windows), iOS and Android. Use for "audit everything", "full audit", "launch audit", "is my app ready to launch", "check everything before we go live", "cover everything", "will Apple approve this", "pre-submission check", or "run just the analytics audit" (or any one of the eight). Part of ungenerated.
---

# Audit: everything once, one report, then fix what the owner approves

This skill runs the eight ungenerated audits as one job, or any one of them alone. Load each audit's SKILL.md and its references as you reach its part. Read `references/lessons.md` first: it is how the owner wants an audit run, learned the hard way.

| Audit | Skill | Answers |
|---|---|---|
| Security | `ungenerated-audit-security` | Can anyone steal keys or data, or get in where they shouldn't? |
| Payments | `ungenerated-audit-payments` | Can anyone get paid features free, or is any payer locked out? |
| Privacy and legal | `ungenerated-audit-privacy` | Does every disclosure match what the app really does? |
| AI | `ungenerated-audit-ai` | Is every model call capped, consented, honest and resilient? |
| Analytics | `ungenerated-audit-analytics` | Are the numbers true, complete and useful? |
| App Review | `ungenerated-audit-app-review` | Will Apple (or Google) approve this build? |
| Code | `ungenerated-audit-code` | What's dead, duplicated or risky with no test? |
| Performance | `ungenerated-audit-performance` | Is it fast, light and calm on battery, measured? |

**Running one audit.** When the owner names one ("just the AI audit"), still do Step 1 (the profile is short and every audit needs it), then run only that audit's Steps and stop at its report. Offer the rest in one line.

## Step 1: learn the app (once, shared by all eight)

Detect from the repository and the live surfaces, and write one **App profile**:
- **Platforms and stack:** web (`package.json`, framework), desktop (`src-tauri/`, electron), iOS/Mac (`*.xcodeproj`, `Package.swift`), Android (`android/`, `build.gradle`), cross-platform (`app.json`, `pubspec.yaml`).
- **Backend:** database and auth (`supabase/`, `firebase.json`, `prisma/`), server and serverless functions, and what is actually deployed (anything deployed but not in the repo is a finding).
- **Money:** payment providers, products, prices, trials, offers, codes, where access is decided.
- **Data:** every SDK and vendor (analytics, errors, replay, email, AI, fonts/CDNs), user content, marketing messages.
- **AI:** every model provider, where calls are made from, what limits exist.
- **Release path:** CI, signing, the build configurations (Debug, TestFlight/beta, Release), app stores, the website and its legal pages.
- **Devices:** whether a real device is connected (performance needs one; the simulator is flagged).
- **The owner's rules:** AGENTS.md / CLAUDE.md, existing audit and legal docs. Start from earlier findings, don't redo settled ones blindly; re-verify them.
- **Connectors and keys on this machine** (Supabase, PostHog, Sentry, RevenueCat, App Store Connect, Cloudflare): use them yourself for live checks, read-only.

Ask the owner only what can't be detected: the operator's legal identity and address, target countries, whether children could use it, whether real money is already on, which model and limits they chose.

## Step 2: audit everything

Run each audit's steps in this order: **security** (a leaked key changes everything else), **payments**, **privacy and legal**, **AI**, **analytics**, **App Review**, **code**, **performance**. Every catalogue item in each gets a verdict (❌ confirmed, ⚠️ suspected, ✅ safe, N/A with a reason; App Review uses pass / fail / can't tell from the code). Every ❌ and ✅ carries its proof: a file:line, a command and its output, a query result, or a live check (tap test, event in the analytics tool, row in the database, trace). For money-at-risk and data-at-risk items, get an independent read: one reviewer agent per area, given the files and the catalogue, not your conclusions.

Exception to waiting: a leaked **live** secret is told to the owner at once, with "rotate this now".

Overlaps are settled once, in the audit that owns them, and the others point to it: renewal law in privacy, purchase-screen rules in app-review, the AI data path in AI, events in analytics, keys in security.

## Step 3: one report, then stop

For a non-developer owner, plain words, result first, short sentences:
1. The App profile (five to eight lines).
2. Coverage per audit, e.g. "security 58/58, payments 42/42 + 14 invariants, privacy 35/35, AI 56/56, analytics 30/30, App Review 52/52 (6 can't tell), code 28/28, performance 26/26 on a real device, 3 found beyond the lists".
3. **The top risks across all eight, ranked by what could actually happen:** a rejection or a crash at launch, money lost, data exposed, fines that apply **per** visitor/session/email, a runaway AI bill, numbers the business would decide on wrongly. Each with its proof.
4. One **numbered fix list** across all areas, each with: what it fixes, what it touches (code, server, a published text, a provider or store setting, a registration), effort, and "needs a lawyer" where true.
5. What only the owner can do (dashboards behind their login, key rotation, registrations, a real device in their hand, a lawyer's review), as exact click-by-click steps.
6. What was not checked, and why.

Save the report in the project's docs so the next audit starts from it. Change nothing until the owner answers with numbers, "all" or "none".

## Step 4: fix what was approved

Fix in the order security → payments → privacy → AI → analytics → App Review → code → performance, following each skill's fix rules and the repository's rules (approval for server, schema, deploys and published texts; tests for logic; the documented deploy path). Verify each fix with the proof that found it: the exploit now fails, the event now arrives, the trace now meets its budget. Then a short final report: fixed, still open, what only the owner can do, and where the full findings were saved.

## Never

- Never change anything before the owner's numbered approval (a live leaked secret is told at once, not fixed silently).
- Never claim a finding or a "safe" without proof the owner could re-run.
- Never pause, restore, delete or reconfigure a production project, store setting or sibling app; read-only means read-only.
- Never test on the owner's real data or real account; use test users and clean up after.
- Never say "compliant" or "will be approved"; say what was checked, against which source, on which date.
- Never bury the answer: the owner reads the first five lines; put the verdict there.

## Read when

| You are… | Read |
|---|---|
| Starting any audit | `references/lessons.md` |
| Running one audit | that audit's `SKILL.md` and its `references/` |

## Works with

The eight audits above. Design and flow fixes the audits find (a paywall missing its terms, a fake cancel screen, an AI permission sheet) are built with `ungenerated-flows`; screenshots and the listing with `ungenerated-store`; visual checks with `ungenerated-review`.
