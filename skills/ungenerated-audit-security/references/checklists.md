# Security checklists

Standards behind these lists: OWASP Top 10 (web), OWASP ASVS (detailed web/API requirements), OWASP API Security Top 10, OWASP MASVS/MASTG (mobile), the Electron security checklist, Tauri's security docs, Supabase's RLS and API security guides. Fetch the current versions when a detail matters. ★ = commonly missed.

## Quick commands (use what is installed; say what you ran)

```bash
gitleaks detect --source . --log-opts="--all" --redact        # secrets in all history
trufflehog git file://. --only-verified                        # verified live secrets
semgrep scan --config auto                                     # code patterns
osv-scanner -r .                                               # dependencies, any ecosystem
pnpm audit --prod  |  npm audit --omit=dev  |  cargo audit  |  pip-audit
grep -rEo "(sk_live|sk_test|rk_live|pdl_(live|sdbx)_apikey|sb_secret|service_role|AKIA|ghp_|xox[bp]-|AIza)[A-Za-z0-9_\-]{8,}" dist build out .next 2>/dev/null   # keys in what ships
```
Supabase: run the database advisors (security lint), then list `pg_policies`, tables without RLS in exposed schemas, `security definer` functions, grants to `anon`.

## Web and API

- ★ Secrets in the client bundle or source maps; source maps served publicly.
- Auth: JWT signature and expiry verified server-side; no `alg: none`; tokens not in URLs or localStorage if XSS risk is high (prefer httpOnly cookies on the web).
- ★ IDOR: every object id in a request is checked against the caller.
- Mass assignment: the server picks writable fields; users can't set `role`, `plan`, `is_admin`, `user_id`.
- Input validation and output encoding; parameterised SQL; no `dangerouslySetInnerHTML`/`v-html` with user content; Markdown rendered safely.
- Security headers: CSP (no `unsafe-inline` scripts where avoidable), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`; cookies `Secure`, `HttpOnly`, `SameSite`.
- CSRF on cookie-authenticated state changes.
- CORS: no `*` with credentials; exact origins.
- ★ Rate limits on login, signup, password reset, OTP, invite, contact forms, checkout creation, AI and email/SMS-sending endpoints (cost abuse).
- SSRF: server fetches of user-supplied URLs restricted (no internal IPs, metadata endpoints).
- Open redirects in auth flows (`?next=`).
- File uploads: type and size checked server-side, stored outside the web root or on a separate domain, no SVG/HTML served inline from your domain, malware scan if shared.
- ★ Leftover endpoints: admin, debug, seed, test, old API versions, staging deployed to prod domains.
- Error responses don't leak stack traces, SQL, internal ids.

## Supabase / Postgres specifics

- ★ RLS enabled on every table in `public` (and any exposed schema); a table without RLS is readable by anyone with the anon key.
- Policies: `select` scoped to `auth.uid()`; `insert/update` with `with check`; no policy trusting columns the user can write.
- `security definer` functions: `set search_path = ''`, own auth checks, `revoke execute from public, anon` where not needed.
- Views: `security_invoker = true` or no exposure.
- Storage: buckets private unless meant public; policies by owner path.
- Service-role key only in server functions; never in the app, never in CI logs.
- Edge functions with `verify_jwt = false` must authenticate themselves (webhook signature, API key, or JWT check in code).
- Realtime/broadcast channels authorised.

## Desktop: Electron

`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`; a minimal `preload` with validated IPC; no `remote` module; `webSecurity` on; navigation and `window.open` restricted; `shell.openExternal` only for vetted URLs; CSP set; auto-updater over HTTPS with signature verification (electron-updater with code signing); ASAR is not encryption; code signing + notarisation (Mac) and Authenticode (Windows) to avoid tampered builds.

## Desktop: Tauri

Capabilities/permissions scoped per window (Tauri 2) or allowlist (Tauri 1); every `#[command]` validates input and never trusts the webview; filesystem and shell scopes narrow; CSP set in config; `dangerousRemoteDomainIpcAccess`/remote IPC off; updater public key pinned and endpoints HTTPS; secrets in the OS keychain (keyring), not in plain files; local SQLite holds no secrets; deep links validated.

## iOS

★ The build carries no developer session, login or personal key (install it fresh and check you are signed out); ATS on (no arbitrary loads); tokens in Keychain with the right accessibility class; nothing secret in Info.plist, the bundle or `UserDefaults`; universal links/URL schemes validated (no auth tokens accepted from URLs blindly); WebViews: no JS bridges exposing native actions to untrusted pages; sensitive screens hidden in the app switcher snapshot; logging without personal data in release; jailbreak detection is not a security boundary; StoreKit/receipt validation on the server; privacy manifest accurate.

## Android

`android:exported` explicit on every component, intent filters validated; deep links verified (App Links); `android:allowBackup` false or rules excluding secrets; Network Security Config (no cleartext, no user CAs in release); Keystore for keys; WebView: `setJavaScriptEnabled` only when needed, no `addJavascriptInterface` on untrusted content, file access off; no secrets in `strings.xml`/BuildConfig; Play Integrity for sensitive actions if needed; purchases verified on the server.

## CI/CD and supply chain

★ Test and live keys separated per build configuration (a payments `test_` key in Release is a finding); a repo going public is scrubbed in history first and guarded by a pre-commit secret hook; Lockfiles committed and enforced; Dependabot/Renovate on; third-party GitHub Actions pinned to SHAs; `permissions:` minimal per workflow; no `pull_request_target` + checkout of PR code; secrets not echoed; release signing keys only in protected environments; artifacts don't include `.env`; branch protection on the release branch.

## Data leaks

Logs, crash reports, analytics events, URLs, caches, exports, backups, emails (BCC mistakes), support tools, AI prompts sent to third-party models — each checked for personal data, tokens and free text. Telemetry scrubbers (Sentry `beforeSend`, PostHog `before_send`) strip emails and ids.

## AI features

Prompt injection from user content or fetched pages; tools/functions the model can call are scoped and confirm destructive actions; API keys server-side; per-user spend limits; outputs never executed as code or SQL unchecked; user data sent to model providers disclosed (see `ungenerated-audit-privacy`; the full AI catalogue is in `ungenerated-audit-ai`). An agent with web access reads only inside its own project folders (a fetched page can ask it to send a secret out).
