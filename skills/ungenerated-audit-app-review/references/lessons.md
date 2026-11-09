# What we learned, and why

Lessons from preparing Comma (iOS), Flamely (Mac/Windows/iOS), Pip (iOS) and CutRoom (Mac) for the stores, Oct–Nov 2026. The apps appear only as examples.

## Nothing promises what the build can't do

**1. Nothing in the app or the listing promises what the build can't do on the phone** (sign-in, AI, share extension, widget, voice, rating). Why: "legitly, nothing is working to begin with". Comma, Oct 2026.

**2. No stand-in store sheets and no offers the store can't grant.** A pretend step is a refund, a one-star review and a rejection. Comma, Nov 2026.

**3. Screenshots are true to the app.** Why: "Apple wants you to show real screenshots". Comma, Nov 2026.

**4. Don't claim a platform until it has been built and run on it.** Why: "SO YOU TELLING ME ITS STILL NOT CROSS PLATFORM". CutRoom, Nov 2026.

## Purchases

**5. Every paywall shows Restore, the auto-renewal terms, and Terms and Privacy links.** It is guideline 3.1.2 and the auto-renewal laws. Flamely, Oct 2026; Comma, Nov 2026.

**6. Every subscription product needs its review screenshot and is "Ready to Submit" before the version is sent.** Comma, Nov 2026.

**7. Sign in before the paywall only when the purchase is tied to the account for a reason** (sync, the web); then say so in the review notes. Comma, Nov 2026.

## Accounts and sign-in

**8. Where another social sign-in is offered, offer Sign in with Apple too, placed above it.** Flamely, Oct 2026; Comma, Oct 2026.

**9. In-app account deletion, separate from cancelling, saying the subscription isn't cancelled.** Comma, Nov 2026.

## Before submitting

**10. Privacy and terms URLs are live and linked on the paywall and in the listing.** Why: the listing's privacy URL was empty and both pages returned 404 the day before submission. Comma, Nov 2026.

**11. Store builds carry no debug tools, test menus or fixture data; scan the archive before upload.** Why: a Release configuration shipped the test bar and fixtures; "remove any sort of these settings bars". Pip, Nov 2026; Comma, Nov 2026.

**12. Check the signed archive's entitlements (Sign in with Apple, push, app groups) for the app and every extension before upload.** Why: "BRO YOU LITERALLY SEND THIS BUILD WITHOUT ALL THIS"; a build went out unsigned, with no Sign in with Apple and no push. Comma, Oct 2026.

**13. A distributed app runs on a clean machine without the developer's folders, tools or login; test a fresh install.** Why: "IT SHOULDN'T BE DEPENDING ON SOME FOLDER ... SHARED ACROSS THE DIFFERENT USER WHO INSTALLED MY APPS". CutRoom, Nov 2026.

**14. Optional backend features stay off in the release build until verified on a real device.** One unverified probe crashed launch for signed-in people. Comma, Nov 2026.

## Ratings

**15. A custom rating screen opens the store's real rating flow and never gates or biases it.** A prompt that sends 1–3 stars to private feedback and 4–5 to the store is review gating (5.6.1). Why: "it's not taking me to the App Store". Comma, Oct 2026.

**16. The system rating sheet never shows in TestFlight; the test build says so instead of looking broken.** Comma, Oct 2026.

## Brand and wording

**17. Use the store's real brand icon or badge wherever you refer to it**, never an emoji or a lookalike. Comma, Nov 2026.

**18. Cite the exact guideline before warning about a rejection.** Why: "why are you saying that will be rejected from the App Store? Tell me the one reason." Flamely, Oct 2026.

## AI and data

**19. Ask before personal data goes to a third-party AI, in the app's own sheet, and say what goes where.** It is guideline 5.1.2(i) as well as trust. Comma, Nov 2026.

**20. Show no tracking prompt the app doesn't need.** Why: "MAKE SURE IT DOESN'T ASK ANY WEIRD POPUP TRACKING". Comma, Nov 2026.
