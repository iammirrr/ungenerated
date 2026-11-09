---
name: ungenerated-audit-privacy
description: Find and fix the legal and privacy traps in any app before launch, then bring every disclosure in line with what the app really does. Covers web apps, websites, desktop (Mac/Windows), iOS and Android: data inventory, cookies and trackers, analytics/session replay (PostHog, GA, Sentry, pixels), consent, privacy policy, terms, app store privacy labels, children and age gates, email/SMS marketing, subscriptions and auto-renewal, user uploads and DMCA, accessibility, AI disclosures, account deletion, and region rules (GDPR/ePrivacy, UK, CCPA/CPRA and other US states, CIPA wiretap, COPPA, CAN-SPAM/CASL, and more). Use for "privacy audit", "legal check before launch", "are we compliant", "update the privacy policy", "cookie banner", "what data do we collect", "app store privacy labels", or any "can we get sued for this" question. Part of ungenerated; runs alone or through ungenerated-audit.
---

# Privacy and legal audit

**Not legal advice.** This skill finds risks, fixes the mechanical ones, keeps disclosures true, and tells the owner exactly what to ask a lawyer. It never claims something is "compliant"; it says what was checked, against which source, on which date.

Laws, enforcement and penalties change monthly. `references/traps.md` is the catalogue of what to look for; **every legal claim you put in a report or a policy must be re-checked against a current source** (Phase 3). `references/lessons.md` holds the mistakes that shipped in real apps and why each rule exists. Payments loopholes belong to `ungenerated-audit-payments`, technical security to `ungenerated-audit-security`, the AI data path in depth to `ungenerated-audit-ai`, analytics events to `ungenerated-audit-analytics`, and store submission rules to `ungenerated-audit-app-review`.

## Every run goes the same four steps

1. **Learn the app first.** Detect it from the repository and its live surfaces (Phase 0) and write an **App profile**: platforms, users, regions, operator, vendors/SDKs, data flows, user content, email/SMS, payments, AI. Ask the owner only what the code and live site can't answer (company, address, target markets, whether children could use it).
2. **Audit everything.** Phases 1–3, all of them. **Every row** of `references/traps.md` gets a verdict: ❌ confirmed (evidence), ⚠️ suspected (what would settle it), ✅ fine (why, with the source and date), or N/A (why it doesn't apply). Also look for traps the catalogue misses (Phase 3 research); add them to the register. The report shows the coverage count.
3. **Tell the owner and stop.** Deliver the risk register and a **numbered fix list**, each item saying what changes (code, a setting, a published text, a registration) and whether a lawyer should look first. Publish nothing and change nothing before the owner answers with numbers, "all" or "none".
4. **Fix only what was approved** (Phase 4), keep every disclosure consistent with the code, verify (re-run the clean-browser/network check, re-read the texts against the inventory), and send a short final report.

## Hard rules

- **Truth first.** A disclosure must match the code and the live configuration, not the plan. When they differ, the report says which one is wrong and proposes fixing the cheaper side (usually: stop collecting).
- **Collect less before disclosing more.** The best fix for a risky data point is not collecting it.
- **One source of truth for each text** (the policy lives in one file and is rendered everywhere). Changing a policy bumps its version and date, and the app's re-consent rules decide who must agree again; respect them.
- **Owner approval** before publishing any legal text, changing consent behaviour, or removing a feature. Mark wording that needs a lawyer's eyes.
- Follow the repository's own rules (AGENTS.md / CLAUDE.md) when stricter.

## Phase 0: learn the app (step 1)

Detect from the repository: platforms (`package.json`, `src-tauri/`/electron, `*.xcodeproj`, `android/`, `app.json`), backend (`supabase/`, `firebase.json`), every SDK and vendor (grep the list in Phase 1), auth methods, email templates, user-content features (uploads, comments, profiles, public boards), payments, AI calls, the website and its pages (privacy, terms, cookies, imprint), and the project's existing legal/privacy docs. Then fill the gaps by asking:
product and platforms; who the users are (consumers, businesses, children possible?); where they live (sell worldwide? EU/UK/California?); the operator (country, company or individual, postal address); payments provider and whether it is a merchant of record; user-generated content; marketing email/SMS; AI features.

## Phase 1: data inventory (from code and network, never from the policy)

Build a table: **data point · collected where (file:line) · sent to (vendor/endpoint) · why · stored where · retention · shared/sold? · legal basis/consent · disclosed where**.

How to find everything:
1. Grep the code for SDK inits and network calls: analytics (PostHog, GA4, Mixpanel, Amplitude, Segment), errors (Sentry, Bugsnag), replay (PostHog/Hotjar/FullStory/LogRocket/Clarity), ads/pixels (Meta, TikTok, Google Ads, LinkedIn), chat widgets (Intercom, Crisp), auth providers, payments, email (Resend, Postmark, Brevo, Mailchimp), maps, fonts and CDNs (Google Fonts, Typekit, unpkg), embeds (YouTube, Vimeo, X), feature flags, AI APIs.
2. Read each SDK's config: autocapture, session recording, IP and geo collection (PostHog `$geoip_disable`, project "anonymize IPs"), person profiles, cookies vs localStorage vs memory, opt-out by default.
3. Read the backend: tables with personal data, logs, backups, retention jobs, who can read what.
4. For web: load the site in a clean headless browser and list every request and cookie **before any consent click** (cookies set, third-party hosts contacted, fonts from fonts.gstatic.com). For apps: list outbound hosts (proxy or code), permissions requested (Info.plist usage strings, Android manifest), privacy manifests (`PrivacyInfo.xcprivacy`, required-reason APIs).
5. Check vendor dashboards' settings when you have access (session replay on? IP anonymisation? data region? retention?). Settings matter as much as code.

## Phase 2: disclosure inventory

Every place a promise is made: privacy policy, terms, cookie policy/banner, in-app consent screens and settings labels, onboarding copy, app store listing (Apple privacy nutrition labels, Google Play Data safety form, Microsoft Store), checkout and pricing pages, emails (signup, marketing, receipts), help center/FAQ, the website footer (imprint/operator details). Quote each promise and compare it with the inventory; every mismatch is a finding.

## Phase 3: research the current rules (deep, every time)

For each trap in `references/traps.md` that applies to the scope, confirm the current rule, penalty and any recent enforcement:
- Primary sources first: the statute/regulator page (FTC, ICO, CNIL, EDPB, California AG/CPPA, state AGs), Apple App Review Guidelines, Google Play policy, platform developer docs.
- Recent cases and enforcement news: law-firm client alerts (JD Supra, Mondaq, IAPP), court rulings.
- **Field reports:** if **Agent Reach** (github.com/Panniantong/Agent-Reach) is installed, use it to read Reddit, X/Twitter and YouTube for what is actually happening to small apps right now (demand letters, App Store rejections, CIPA suits). If not installed, use WebSearch with `mode: "extended"` and the `deep-research` skill if available. Treat social posts as leads to verify, never as authority.
- Record each source with its date in the report.

## Phase 4: findings, then fixes (fixes only after step 3's approval)

Rank by exposure: penalties that are **per** visitor/session/email/child multiply fast, so a small leak on every page outranks a big one-off. For each finding: what happens, the rule (with source), who is exposed (region/platform), the fix, effort, and whether it needs a lawyer.

Mechanical fixes you can usually make (with the owner's yes): self-host fonts; stop third-party requests before consent; turn off session replay and autocapture or gate them behind consent with input masking; strip IP/geo except what is disclosed; add consent to analytics on web for EU/UK visitors; honour Global Privacy Control; add the age question or a minimum-age term where children could plausibly sign up; unsubscribe link + postal address in every marketing email, sender identity, no pre-ticked marketing boxes; renewal terms next to every subscribe button with price, interval, trial end and how to cancel, a reminder before a trial converts, online cancellation as easy as signup; account deletion in-app (iOS and Google Play require it) plus a web deletion URL; a DMCA agent registered (US Copyright Office, cheap) and a repeat-infringer policy when users upload content; accessibility basics (labels, contrast, keyboard); AI features disclosed as AI; store privacy labels updated; cookie list in the policy matches reality.

Then update the disclosures so they match the code exactly, one source of truth, new version and date, and run the app's re-consent path if the change is material.

## The report (for a non-developer owner)

Result first, plain words. The App profile in five lines. Coverage ("31 of 31 traps checked, 3 found beyond the list"). A risk register: risk · where · what could happen (with the "per" basis) · fix · status (❌/⚠️/✅/N/A) · needs a lawyer? Then the **numbered fix list** for approval (and stop there), and after fixing: what I fixed, what only you can do (registrations, dashboards, a lawyer's review), and the sources with dates. Save it into the project's docs (legal or privacy doc) so the next audit starts from it.
