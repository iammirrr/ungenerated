# App Review checklist

Each numbered item: **pass** (proof), **fail** (file:line and the guideline's words), **can't tell from the code** (what would settle it), or N/A (why). ★ = a common first-submission rejection.

Checked against Apple's App Review Guidelines in November 2026. **Re-verify every number and rule against the current page before a run**: developer.apple.com/app-store/review/guidelines, the Upcoming Requirements page (developer.apple.com/news/upcoming-requirements), and for Google, the Play Developer Policy Center. Write the date in the report.

## 0. Get the real build and metadata

```bash
# The archive (Xcode Organizer › Show in Finder) or an exported .ipa
unzip -q App.ipa -d ipa && APP=$(ls -d ipa/Payload/*.app)
plutil -p "$APP/Info.plist" | grep -E "UsageDescription|CFBundle(ShortVersion|Version)|UIBackgroundModes|ITSAppUsesNonExemptEncryption"
codesign -d --entitlements :- "$APP"                                  # app entitlements
for x in "$APP"/PlugIns/*.appex; do echo "$x"; codesign -d --entitlements :- "$x"; done   # every extension
find "$APP" -name PrivacyInfo.xcprivacy                               # app + SDK privacy manifests
strings "$APP/$(basename "$APP" .app)" | grep -iE "lorem|placeholder|coming soon|beta|todo|localhost|staging|test_[a-z0-9]" | sort -u
```
Xcode: Organizer › right-click the archive › **Generate Privacy Report** (all manifests merged). Links: `curl -sIL <url> | grep -E "^HTTP"` for every URL in the app and the listing. Metadata: the App Store Connect API (read-only) or the owner's screenshots of each App Store Connect page.

Walk it like a reviewer: fresh install, signed out, no purchases, on the latest iOS, on an iPhone **and an iPad** (iPhone-only apps still run on iPad in compatibility mode and reviewers use iPads).

## 1. Completeness and the build (2.1, 2.2, 2.3.1, 2.5)

1. ★ Launches and runs the main flows without a crash on a fresh install, on iPhone and iPad (2.1).
2. ★ No placeholder content, lorem ipsum, empty screens, "coming soon" or features that do nothing (2.1).
3. ★ Backend services are live and the demo account works for the whole review window (2.1).
4. ★ In-app purchases are complete: every product is configured, has its review screenshot and review note, is "Ready to Submit", and (for a first subscription) is attached to this version (2.1(b)).
5. ★ No beta, trial-version or test wording, no debug menus, test bars, fixture data or free pass in the Release build (2.2). Scan the archive, not the source.
6. Every link in the app works: privacy, terms, support, help, external pages (2.1).
7. Built with the SDK and Xcode version Apple currently requires (Upcoming Requirements page).
8. Only public APIs (2.5.1); background modes in Info.plist used only for their purpose (2.5.4).
9. No hidden or remotely switched features that change what the reviewer saw; feature flags that matter are described in the review notes (2.3.1).
10. Push notifications are not required to use the app and are not used for marketing without opt-in (4.5.4).

## 2. Purchases and subscriptions (3.1.1, 3.1.2, 3.1.3, Schedule 2)

11. ★ Digital features and content are unlocked only through in-app purchase (3.1.1).
12. No buttons, links or calls to action to other purchase methods, except where the current rules allow them (at the time of writing, the US storefront, or with Apple's external purchase link entitlement in permitted regions; re-verify) (3.1.1, 3.1.3).
13. ★ Before subscribing, the screen states what they get, the title, the length of each period, the price per period (the amount billed most prominent), that it renews automatically until cancelled, and the trial length and what is charged after it (3.1.2(c) and Schedule 2).
14. ★ Functional links to the Terms of Use (EULA) and Privacy Policy on every purchase screen, and in the metadata (the EULA in the description or App Store Connect's licence field; the privacy policy URL field) (3.1.2, 5.1.1(i)).
15. ★ Restore Purchases is visible on the paywall (and in settings).
16. Subscriptions give ongoing value and are at least seven days long (3.1.2(a)).
17. A trial is promised only to accounts eligible for it; ineligible accounts see Subscribe copy.
18. Every discount or offer shown is a real store offer (introductory, promotional, win-back, offer code); nothing is shown that the store won't charge (2.3.1 misleading; 3.1.2).
19. The paywall can be closed, or the hard paywall is clear about what is free and what isn't; nothing tricks the person into buying (3.1.2, 5.6 developer code of conduct).
20. Managing and cancelling uses the platform's own subscription sheet; no stand-in "cancel" that leaves billing running.
21. If sign-in is required before purchase, the subscription has account-based features (sync across devices, an account on the web) and the review notes say so; otherwise a purchase must work without an account (5.1.1(v)).

## 3. Accounts and sign-in (5.1.1(v), 4.8)

22. ★ An app that lets people create an account lets them delete it inside the app, easy to find, actually deleting (not only deactivating) (5.1.1(v)).
23. Deletion explains that the store subscription is not cancelled by deleting, and links to managing it.
24. ★ If a third-party or social login (Google, Facebook) is the primary login, an equivalent option is offered that limits data to name and email, lets people hide their email, and doesn't track for ads without consent; Sign in with Apple meets this (4.8).
25. Sign in with Apple tokens are revoked through Apple's REST API when the account is deleted (Apple's account-deletion requirements; re-verify).
26. The app doesn't require sign-in unless it has significant account-based features (5.1.1(v)).
27. The Sign in with Apple button follows Apple's button guidelines (HIG).

## 4. Privacy (5.1.1, 5.1.2)

28. ★ A privacy policy is linked in App Store Connect and inside the app, and covers what is collected, how it's used, who it's shared with, retention and deletion, and how to withdraw consent (5.1.1(i)).
29. ★ Every permission has a purpose string that says specifically why (not "needs access") (5.1.1(ii)).
30. Permissions are asked in context, not all at launch; declining keeps the app usable with an alternative; no screen forces a yes (5.1.1(iv)).
31. ★ `PrivacyInfo.xcprivacy` is present for the app and every SDK on Apple's list of commonly used SDKs; every required-reason API used (file timestamps, system boot time, disk space, active keyboards, UserDefaults) is declared with an allowed reason.
32. App Store privacy labels match what the code and SDKs actually collect (take the inventory from `ungenerated-audit-privacy`).
33. App Tracking Transparency is asked only if the app tracks; no ATT prompt and no IDFA access if it doesn't (5.1.2).
34. ★ Personal data sent to a third-party AI is clearly disclosed and the person gives explicit permission first (5.1.2(i)).
35. Data is used only for what it was collected for, and not to build profiles for unrelated uses (5.1.2).

## 5. Metadata and store assets (2.3)

36. Name is unique, 30 characters or fewer, with no keyword stuffing; subtitle the same (2.3.7).
37. ★ Screenshots show the app in use, true to this build (not title art, a login page or a splash screen), with no other platforms named (2.3.3, 2.3.10).
38. Icon, screenshots and preview are appropriate for a 4+ audience even if the app is rated higher (2.3.8).
39. The description lists only features this build has; no prices or claims that differ from the app (2.3.1).
40. The app preview uses footage captured from the app (2.3.4).
41. The age rating questionnaire is answered truthfully, including user-generated content, AI chat or generated content, and web access (Apple's age ratings changed in 2025; re-verify the current questions).
42. The support URL works and shows a way to contact the developer.
43. Apple's products and marks (the App Store icon or badge, Apple Pay, Sign in with Apple) use Apple's official artwork, never an imitation or an emoji stand-in (5.2.5 and Apple's marketing guidelines).

## 6. Design and functionality (4.x)

44. ★ The app does more than a website or a single screen: useful, unique, app-like (4.2).
45. Not a copy of another app; the icon and name don't imitate another app or Apple (4.1, 5.2.5).
46. If iPad is supported, layouts work on every iPad size and orientation the app claims.
47. Every extension (share, widget, keyboard, intents) works and is signed with its entitlements (App Groups, push, Sign in with Apple).

## 7. Content and reviews (1.x, 5.6)

48. User-generated content has filtering, reporting with a timely response, blocking of abusive users, and published contact details (1.2).
49. AI-generated content that others can see, or AI chat, has a way to report objectionable output (Apple applies 1.2 to it in practice; re-verify).
50. ★ Ratings are asked only through the system API (`requestReview`); no custom prompt that sends low ratings elsewhere (review gating), no reward for ratings (5.6.1). The system sheet doesn't show in TestFlight; that's expected.
51. No health, medical, legal or financial claims the app can't back up (1.4, 2.3.1).

## 8. Reviewer access

52. ★ A demo account with full access is in the review notes (or the app needs none), with sandbox purchase steps and any hardware, location or content the reviewer needs. Write them from `review-notes.md`.

## 9. The common rejections (check each even if the section passed)

- Crash or bug on the reviewer's device, often iPad or the newest iOS (2.1).
- Demo account missing, expired or without access to paid features (2.1).
- Paywall missing price per period, renewal wording, Terms or Privacy links (3.1.2).
- No in-app account deletion (5.1.1(v)).
- Purpose strings too vague (5.1.1(ii)).
- Screenshots that aren't the app or show features it doesn't have (2.3.3, 2.3.1).
- Placeholder content, beta wording, broken links (2.1, 2.2).
- Privacy labels that don't match the SDKs (5.1.2).
- Missing privacy manifest or required-reason declarations (rejected at upload or review).
- Sign-in required for no account-based reason (5.1.1(v)).
- Minimum functionality: a web wrapper or too thin (4.2).
- In-app purchases not submitted with the version (2.1(b)).

## 10. Google Play (when the app ships on Android)

Data safety form matches the inventory; in-app account deletion **and** a web deletion URL; target API level current; sensitive permissions declared with a reason; Play Billing for digital goods (with the current alternative-billing exceptions; re-verify); subscription terms clear and cancellation easy; App access (demo account) filled in; new personal developer accounts must run a closed test with a minimum number of testers for a minimum period before production (re-verify the current numbers).

Coverage line for the report: "App Review: 52 of 52 checked (N pass, N fail, N can't tell, N N/A), guidelines read on <date>".
