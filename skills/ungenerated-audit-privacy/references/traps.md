# Legal and privacy traps

A catalogue of what to look for. **Every row must be re-verified against a current source before it goes in a report** (penalties and rules here are starting points, as of late 2026, and change). ★ = commonly missed.

## Privacy and tracking

| Trap | Applies to | Check | Fix |
|---|---|---|---|
| ★ Google Fonts / CDNs load from Google's servers (sends the visitor's IP; a Munich court awarded damages per visitor, 2022) | Web, Electron/Tauri webviews, emails | Network log before consent; `fonts.googleapis.com` in CSS | Self-host fonts and scripts |
| ★ Session replay / keystroke capture on by default (California CIPA "wiretap" suits; per-session damages claimed) | Web, apps with replay SDKs, chat widgets, some pixels | SDK config; vendor dashboard | Off, or consent + full input masking + disclosure |
| Analytics/ad cookies or local storage set before consent (EU ePrivacy, UK PECR) | Web; apps storing device identifiers | Clean-browser cookie list before any click | Consent banner with real "reject", nothing before consent; or cookieless, no-identifier analytics |
| ★ IP address and location collected by analytics/error tools though the policy says no | All | PostHog GeoIP, Sentry IP, server logs | Disable or disclose; minimise |
| Pixels (Meta, TikTok, Google) sharing page/visit data; "sale/share" under CCPA/CPRA; VPPA if video viewing is shared | Web | Pixel inits, what events carry | Consent/opt-out, "Do Not Sell or Share" link, honour Global Privacy Control ★ |
| Data subject rights: access, deletion, correction, portability (GDPR/UK, CCPA and ~20 US state laws) | All | A working request path and response process | Contact address + in-app deletion + export |
| International transfers (EU → US vendors) without a basis | All with EU users | Vendor regions, DPAs, EU-US Data Privacy Framework status | DPAs signed, EU data region where available, listed in the policy |
| Privacy policy missing required items (operator identity, contact, purposes, bases, retention, recipients, rights, complaints authority, children, changes) | All | Read it against the inventory | Rewrite from the inventory |
| ★ Biometric data (face/voice) without written consent (Illinois BIPA, per-person damages) | Apps with face/voice features | Any face detection, voiceprints | Avoid, or explicit consent and retention schedule |
| Health, precise location, children's data: "sensitive" categories with stricter rules (e.g. Washington My Health My Data) | Wellness/health apps, location apps | Inventory categories | Separate consent, minimise |

## Children and age

| Trap | Check | Fix |
|---|---|---|
| ★ No age question while children could sign up (US COPPA, large per-violation civil penalties; UK Age Appropriate Design Code; EU age of digital consent 13–16) | Signup flow, terms minimum age, app store age rating | Age gate or minimum-age term + neutral age question; no data from under-13s without verifiable parental consent; delete when discovered |
| App store "Kids" category or ads to children | Store listing | Don't, unless built for it |

## Marketing messages

| Trap | Check | Fix |
|---|---|---|
| ★ Launch/newsletter email without unsubscribe link or postal address (US CAN-SPAM, per-email penalties) | Email templates | Unsubscribe in every marketing email, honoured within 10 business days; physical postal address; honest subject and sender |
| Emailing EU/UK/Canada people without prior consent (GDPR/PECR, Canada CASL) | Signup checkboxes (pre-ticked?) | Unticked opt-in, double opt-in for EU, records of consent |
| SMS/calls without written consent (US TCPA, per-message damages) | Any SMS feature | Express written consent, STOP handling |

## Subscriptions and money

| Trap | Check | Fix |
|---|---|---|
| ★ Renewal terms not clear and next to the subscribe button (California Automatic Renewal Law, amended by AB 2863 from 1 July 2025: express consent, online cancellation, reminders; unconsented renewals can be treated as gifts; other states similar; FTC ROSCA nationally; the FTC's 2024 click-to-cancel rule was vacated in July 2025 and the FTC restarted rulemaking, so verify the current state) | Checkout, plan window, onboarding paywall | Price, interval, trial end date, that it renews until cancelled, and how to cancel, right by the button; confirmation email with the terms; reminder before a trial converts and before annual renewals; cancel online in as few steps as signup |
| EU/UK 14-day withdrawal right for digital services | Checkout, terms | Explicit request to start now + acknowledgement that the right is lost on full performance, or refunds |
| Price shown ≠ price charged (currency conversion, tax added) | Checkout vs app | Show the buyer's real price, tax-inclusive where required |
| Sales tax / VAT obligations | Payments setup | A merchant of record (Paddle, Lemon Squeezy, app stores) handles most; otherwise register/collect |
| Refund policy promised but not in terms, or contradicting the store's rules | Terms, store listing | Align |

## Content, platforms and product

| Trap | Check | Fix |
|---|---|---|
| ★ User uploads without a registered DMCA agent (lose safe harbor; statutory damages per work) | Any user content (images, files, comments, profiles) | Register an agent with the US Copyright Office (small fee, renew every 3 years), publish takedown contact, repeat-infringer policy |
| ★ No in-app account deletion (Apple App Review 5.1.1(v); Google Play requires in-app and web deletion) | Settings, store listing | In-app delete that also cancels subscriptions or explains store cancellation; web deletion URL for Play |
| ★ Account deletion that clears local data while signed out (no server deletion happens), or that implies the store subscription is cancelled | Delete flow code; its copy | Refuse when signed out before clearing anything; say plainly that the subscription is managed in the store and link to it; export first |
| ★ Consent answer saved late (lost when the app closes) or a dismissed consent sheet treated as yes | Where the answer is written; dismiss handler | Save at the tap; dismiss = no |
| ★ User's own words (notes, cancel reasons, prompts) or name/email in analytics events or person properties | Every capture/identify call | Categories and flags only; identify by account id; words to a private store |
| Test builds writing sample data into real accounts | Seed/sample code paths, build flags | Samples local only, never synced |
| Apple: privacy nutrition labels, privacy manifest + required-reason APIs, App Tracking Transparency before tracking, Sign in with Apple when other social logins exist (4.8) | Xcode project, App Store Connect | Fill from the inventory; ATT prompt if any tracking |
| Google Play: Data safety form, target API level, permissions declarations | Play Console | Fill from the inventory |
| Accessibility lawsuits (US ADA web suits; EU Accessibility Act applies from 28 June 2025 to many consumer digital services) | Web and app UI | WCAG 2.1/2.2 AA basics; an accessibility statement |
| AI: undisclosed AI chat or generated content (EU AI Act transparency duties phase in from 2025–2026; some US state bot-disclosure laws); sending user data to AI providers not in the policy | AI features | Label AI, disclose providers, opt-outs where required |
| Testimonials, reviews, "fake" social proof (FTC endorsement guides, fake-review rule 2024) | Website, store listing | Real, disclosed, no incentivised fakes |
| Germany/Austria: imprint (Impressum) with operator details | Website targeting DE/AT | Publish the operator's legal details |
| Terms: governing law, limitation of liability, arbitration, acceptable use, termination; consumer law limits these in the EU/UK | Terms | Lawyer review |
| Security incident without a breach-notification plan (GDPR 72 hours to the authority; US state laws) | Ops | A one-page incident plan |
| Open-source licenses: GPL/AGPL code in a closed app; missing attribution notices | Dependencies | License scan; notices screen |
| Export/sanctions: selling to sanctioned regions | Payments | The merchant of record usually blocks; confirm |

## Desktop specifics (Mac/Windows)

Activity/app/window-title tracking, screenshots, keystroke counts and microphone checks are monitoring-like: disclose precisely what is read and what is never read, keep it local where promised, and make every collection switchable. Auto-start and background behaviour disclosed. Update channel (what the updater sends: IP in server logs). Crash reports opt-in where promised.
