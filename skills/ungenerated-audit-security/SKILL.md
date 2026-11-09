---
name: ungenerated-audit-security
description: Find and fix security holes in any app the owner controls: leaked API keys and secrets, data leaks (logs, analytics, crash reports, public buckets, open database tables), broken auth and access control (Supabase RLS, Firebase rules, IDOR), webhook and API abuse, dependency and supply-chain risk, CI/CD, and client hardening for web, desktop (Electron/Tauri, Mac/Windows), iOS and Android. Use for "security audit", "check for API leaks", "are my keys exposed", "can someone read other users' data", "pentest my app", "harden before launch", "check RLS", "is this safe to ship", or after a suspected leak. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Security audit: no leaked keys, no leaked data, no open doors

Scope is the owner's own code, infrastructure and accounts. **Authorised targets only**; never scan, probe or attack anything the owner does not control, never run load or denial-of-service tests against production, never read real users' private data beyond the minimum needed to prove a finding (count rows, don't dump them).

Read `references/checklists.md` before Phase 2, and `references/lessons.md` (real leaks and near misses from shipped apps, and why each rule exists). AI-specific abuse (cost, prompt injection, consent) is covered in depth by `ungenerated-audit-ai`. Payments-specific holes belong to `ungenerated-audit-payments`, legal/privacy disclosure to `ungenerated-audit-privacy`; run them alongside when relevant.

## Every run goes the same four steps

1. **Learn the app first.** Detect it from the repository and write an **App profile**: platforms (`package.json`, `src-tauri/`/electron, `*.xcodeproj`, `android/`, `app.json`, `pubspec.yaml`), backend and database (`supabase/`, `firebase.json`, server and function folders, what is deployed), auth, third-party services and their keys (names only), CI (`.github/workflows/`), how builds are signed and updated, and the threat model (Phase 0). Ask the owner only what the code can't answer.
2. **Audit everything.** Phases 1–5, all of them. **Every item** in `references/checklists.md` for the app's platforms gets a verdict: ❌ confirmed (proof), ⚠️ suspected (what would settle it), ✅ safe (why), or N/A (why). The report shows the coverage count and which tools ran.
3. **Tell the owner and stop.** Deliver the report with a **numbered fix list** (what it fixes, what it touches, whether it needs a deploy or a key rotation). The one exception: a leaked **live** secret is reported at once with "rotate this now", before the rest. Change nothing until the owner answers with numbers, "all" or "none".
4. **Fix only what was approved** (Phase 6), re-run each proof (it must now fail), and send a short final report.

## Hard rules

- **Read-only by default.** Changes, deploys, key rotations and permission changes need the owner's yes. A leaked live secret is the exception that justifies saying "rotate this now" first.
- **One key per environment.** Test keys only in Debug/test builds, live keys only in production; a crossed key is a finding.
- **Never pause, restore, delete or reconfigure a production project or a sibling app's resources** without the owner's yes in this conversation.
- **Never print secrets.** Show a key's name, location and first 4 characters at most. Never paste a secret into a tool call that leaves the machine (except to the service it belongs to). If the owner pastes one in chat, tell them it must be rotated.
- **Prove each finding** with a file:line, a command output, or a harmless request that shows the access (e.g. an anonymous request that returns a row count it should not). State what you could not test.
- **Use proper tools when available**, and say which you ran: `gitleaks` or `trufflehog` (secrets, full git history), `semgrep` (code patterns), `osv-scanner` / `npm audit` / `pnpm audit` / `cargo audit` / `pip-audit` (dependencies), CodeQL. The Trail of Bits skills (`/plugin marketplace add trailofbits/skills`) add static-analysis and variant-analysis workflows; use them if installed, and review any third-party skill before trusting it. Don't install tools without saying so.
- Follow the repository's own rules (AGENTS.md / CLAUDE.md) when stricter.

## Phase 0: threat model (one page)

What is worth stealing or breaking: user data (which kinds), money (payments, credits, paid features), accounts, the owner's cloud bill (abuse of paid APIs: AI, SMS, email), the signing keys (app updates), the brand (defacement, phishing from your domain). Who might attack: a curious user with devtools, a free user wanting paid features, a scraper, a criminal with leaked keys. Entry points: the client bundle, public APIs and functions, webhooks, auth flows, file uploads, deep links, the update channel, CI.

## Phase 1: secrets and keys

1. Scan the **whole git history** and all branches (`gitleaks detect --log-opts="--all"` or `trufflehog git file://.`), not just the working tree. A secret in history is leaked even if deleted.
2. Scan **what ships**: the built web bundle, desktop app resources (asar, Tauri dist), mobile binaries (`strings` on the IPA/APK), source maps (they reveal code and sometimes env), and any `.env` copied into builds. Public-by-design keys are fine (Supabase anon key, Stripe publishable key, Paddle client token, PostHog project key) **only if** the backend behind them is locked down (Phase 2). Service-role keys, secret API keys, webhook secrets, signing keys, database URLs must never ship.
3. Check CI: secrets in workflow logs, `pull_request_target` with checkout of untrusted code, unpinned third-party actions, secrets available to forks, artifact uploads containing env files.
4. Check chat logs, docs and issue trackers for pasted keys when the owner mentions it. Every exposed live secret → rotate, then confirm the old one is dead.

## Phase 2: access control (the biggest real-world leak)

- **Supabase/Postgres:** every table in exposed schemas has RLS enabled; every policy checked for `using (true)`, missing `with check`, policies trusting user-editable columns (e.g. `role` in a profile the user can update), `security definer` functions without `search_path` and without their own auth checks, functions/RPCs callable by `anon`, views bypassing RLS (`security_invoker`), storage buckets public or with broad policies, realtime channels. Test with the anon key and with a second test user: try to read/update/delete another user's rows.
- **Firebase/Firestore/Storage rules:** no `allow read, write: if true`, no rules relying on client fields, test with the emulator.
- **APIs and serverless functions:** every endpoint authenticates (JWT verified, not just decoded), authorises the object (IDOR: change an id in the request), validates input, limits rate (especially login, signup, password reset, OTP, checkout creation, AI calls, email/SMS sends), and never returns more fields than needed. Admin/debug/seed functions still deployed are findings even if "unused".
- **Webhooks:** signatures verified on the raw body with constant-time comparison and a timestamp window; idempotent; unknown events ignored.
- **Auth:** password reset tokens single-use and short-lived; no account enumeration where it matters; OAuth redirect URIs exact; PKCE for native apps; sessions revoked on password change and sign-out-everywhere; email change confirmed on both addresses; magic links/OTPs rate-limited and short-lived; MFA for admin accounts (Supabase dashboard, Paddle/Stripe, GitHub, Apple, Google, domain registrar, DNS).

## Phase 3: data leaks

Logs and error reports (Sentry, console logs shipped in production, server logs) containing emails, tokens, passwords, payment details; analytics events carrying personal data or free text; URLs with tokens or emails (they end up in logs and referrers); caches and offline stores holding data after sign-out; exports and backups without encryption or left public; CORS `*` with credentials; verbose error messages exposing stack traces or SQL; directory listing on the web server; public object storage (S3/R2/GCS) listing.

## Phase 4: platform hardening

Use the platform section of `references/checklists.md`: web (XSS, CSP, security headers, cookies, CSRF, open redirects, SSRF), desktop (Electron `contextIsolation`, `nodeIntegration` off, `sandbox`; Tauri capabilities/allowlist, CSP, `shell.open` scope, IPC commands validating input; the auto-updater's signature check and HTTPS; code signing and notarisation; local database and keychain use), iOS (ATS, Keychain for tokens, no secrets in Info.plist, URL scheme and universal link handling, WebView bridges, background snapshots of sensitive screens, privacy manifest), Android (exported components, intent and deep-link validation, `android:allowBackup`, network security config, Keystore, WebView `addJavascriptInterface`, ProGuard/R8 not a security boundary).

## Phase 5: dependencies and supply chain

Run the dependency scanners; check lockfiles are committed and used in CI (`--frozen-lockfile`); install scripts of new dependencies; typosquats; abandoned packages in sensitive paths (auth, crypto, payments); CDN scripts pinned with integrity hashes; GitHub Actions pinned to commit SHAs for third-party actions.

## Phase 6: fix and verify (step 4: only the items the owner approved)

Fix the root cause in the shared place, add a test or a repeatable check (e.g. an RLS test with two users, a CI secret scan, a bundle scan), deploy the documented way, and re-run the proof that found the hole; it must now fail. Rotate exposed keys and verify the old ones are rejected.

## The report (for a non-developer owner)

Result first, plain words. The App profile in five lines. Coverage ("58 of 58 checks for web + desktop; tools run: gitleaks, osv-scanner"). A table: risk · what someone could do · proven how · severity (critical: data or money at risk now; high; medium; low) · fix · status (❌/⚠️/✅/N/A). Then the **numbered fix list** for approval (and stop there), and after fixing: what I fixed, what only you can do (rotate keys in dashboards, turn on MFA), and what I could not test. Save it in the project's docs; never put secrets in the report.
