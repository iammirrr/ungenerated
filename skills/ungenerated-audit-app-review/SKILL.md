---
name: ungenerated-audit-app-review
description: Check whether Apple (and Google Play) will approve an app by testing every App Review Guideline that applies against the real build and its metadata: subscriptions (3.1.1, 3.1.2: price, length, renewal, Terms and Privacy links, Restore, no outside payment for digital goods), in-app account deletion (5.1.1(v)), login services (4.8), permission purpose strings, privacy manifest and required-reason APIs, privacy labels against the code, AI data disclosure, demo account and review notes, placeholder or beta wording, broken links, metadata and 4+ assets, completeness (2.1), minimum functionality (4.2) and the most common rejections. Each item is pass, fail with file:line, or can't tell from the code; ends with draft App Review notes. Use for "will Apple approve this", "App Review check", "pre-submission audit", "why was my app rejected", "guideline 3.1.2", "ready to submit", or before uploading a build for review. Part of ungenerated; runs alone or through ungenerated-audit.
---

# App Review audit: will the store approve this build?

For: catching a rejection before Apple (or Google) does, by checking the real build, its metadata and its store setup against every guideline that applies, and handing the owner ready-to-paste review notes.

Guidelines change several times a year. The numbers and wording in `references/checklist.md` were checked against Apple's App Review Guidelines in November 2026; **re-read the current page before each run** (developer.apple.com/app-store/review/guidelines) and the Upcoming Requirements page (developer.apple.com/news/upcoming-requirements), and write the date in the report. Never warn about a rejection without quoting the guideline number and its words.

## Steps

1. **Learn the app.** Write the App profile (or take the runner's): platforms, account and sign-in methods, what is free and what is paid, products and offers, permissions used, SDKs, AI providers, user-generated content, the website's legal pages, the release path (archive, TestFlight, App Store Connect), AGENTS.md / CLAUDE.md rules. Ask the owner only what can't be detected: the App Store Connect metadata if there is no connector or API key (name, subtitle, description, keywords, screenshots, privacy labels, age rating answers, review notes), and a demo account.
2. **Get the real build and its metadata.** Use the archive or the last uploaded build, not only the source: Info.plist, entitlements of the app and every extension, `PrivacyInfo.xcprivacy` files (app and SDKs), the Release build configuration, strings in the binary. Read the store metadata through the App Store Connect API when a key exists (read-only), or from the owner. Commands in `references/checklist.md` §0.
3. **Check every applicable item.** Each row of `references/checklist.md` gets **pass** (proof: file:line, a screenshot, a command's output), **fail** (file:line and the guideline's words), **can't tell from the code** (what would settle it: a screen on device, a field in App Store Connect), or N/A (why). Walk the main flows on a device or simulator from a fresh install (signed out, no purchases) the way a reviewer does: launch, sign up, the paywall, buy in the sandbox, restore, every permission, delete the account.
4. **Check the common rejections.** The list in `references/checklist.md` §9 is what most first submissions fail on; check each against this build even if a section above passed.
5. **Report and stop.** Result first: "likely to pass", "likely to be rejected for N reasons", or "can't tell until X". Then each fail with its guideline number, quoted words, file:line and the fix; the can't-tells with how to settle them; coverage ("52 of 52 checked, 9 N/A"); and a **numbered fix list** (what it fixes, what it touches: code, a store setting, a web page, metadata). Change nothing until the owner answers with numbers, "all" or "none".
6. **Fix only what was approved, then write the review notes.** Fix in the app, the website or the metadata as approved; re-check each fixed item with the same proof. Then draft the App Review notes and the demo account section from `references/review-notes.md` for the owner to paste into App Store Connect. Never submit for review yourself.

## Never

- Never say "this will be approved"; say what was checked, against which guideline text, on which date.
- Never warn about a rejection without the guideline number and its words.
- Never judge from the source alone when the archive exists; Release builds differ (flags, entitlements, stripped debug UI).
- Never leave test UI, a free pass, fixture data or "beta"/"coming soon" wording in a build a reviewer sees.
- Never put real people's personal data in the demo account; make a test account with realistic content.
- Never change App Store Connect metadata, pricing, agreements or submit a build without the owner's yes in this conversation.
- Never tell the owner to fake or bias reviews (a star prompt that sends low ratings elsewhere is review gating).

## Read when

| You are… | Read |
|---|---|
| Checking the build and metadata | `references/checklist.md` |
| Writing the notes for App Store Connect | `references/review-notes.md` |
| Wanting the why behind each rule | `references/lessons.md` |

## Works with

- `ungenerated-audit` runs this with the other seven.
- `ungenerated-audit-payments` proves the purchases work in the sandbox; this audit checks what the screens say.
- `ungenerated-audit-privacy` owns the privacy policy, labels and consent law; this audit checks they exist, are linked and match the build.
- `ungenerated-audit-ai` owns the AI consent sheet and data path behind 5.1.2(i).
- `ungenerated-audit-code` finds debug UI and dead screens that would confuse a reviewer.
- `ungenerated-flows` › paywall (references/paywall.md), account-signup (references/account-signup.md), consent-and-permissions (references/consent-and-permissions.md) and cancel-flow (references/cancel-flow.md) build the screens these rules apply to.
- `ungenerated-store` makes the screenshots, preview and listing that 2.3 checks.
