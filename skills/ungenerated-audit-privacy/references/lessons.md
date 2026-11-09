# What we learned, and why

Lessons from launching Comma (iOS, AI writing), Flamely (Mac/Windows/iOS), Pip (iOS) and CutRoom (Mac), Oct–Nov 2026. The apps appear only as examples; each rule holds for any app.

## Deleting the account

**1. Deleting the account is separate from cancelling, and says plainly that it does not cancel the store subscription.** Link to the platform's subscription settings next to it. Why: people assume deletion stops billing; it doesn't, and the store keeps charging. Comma, Nov 2026.

**2. Deletion refuses when signed out, before clearing anything.** Otherwise it wipes the person's work on the phone with no server record and no deletion actually done. Comma, Nov 2026.

**3. Offer export first, then hold to delete, and publish web deletion steps.** Apple requires in-app deletion; Google Play requires in-app and web. Comma, Nov 2026.

## AI and consent

**4. Ask before any of the person's text leaves the device for a third-party model.** The app's own sheet says what is sent, to whom, and what stays on the phone (for example "not used for training; audio and video stay on the phone"). Comma, Nov 2026.

**5. Save the consent answer at the tap.** Why: a delayed save lost the answer when the app closed, and the person was asked again (or worse, treated as yes). Comma, Nov 2026.

**6. Swiping the consent sheet away means no.** Only a tap on Allow is a yes. Comma, Nov 2026.

**7. Consent is revocable in settings, and revoking keeps the app usable by hand.** Why: AI is a help, not a gate; a person who says no still writes. Comma, Nov 2026.

**8. Show people what the AI did and what was sent where, in settings.** Why: "AI TRANSPARENCY A LOT, SHOW EXACTLY WHAT IS LEFT". Comma, Nov 2026.

**9. Use the platform's on-device speech recognition where it can; never route a person's voice through your servers without need.** Why: "this microphone is supposed to be local using local iOS stuff". Comma, Oct 2026.

## Analytics and crash reports

**10. Analytics get the answers, never the person's own words.** A cancel reason goes to analytics as the picked category plus a "wrote a note" flag; the note itself goes to a private store. Why: "PostHog gets the answers, never their words". Comma, Nov 2026.

**11. Identify analytics users by account id only, never name or email.** Comma, Nov 2026.

**12. Keep analytics and crash reports off until the person says yes**, where the law or the promise requires it. Why: "take consent we need it". Pip, Oct 2026.

**13. Show no tracking prompt the app doesn't need.** If nothing tracks across apps, there is no App Tracking Transparency prompt. Why: "MAKE SURE IT DOESN'T ASK ANY WEIRD POPUP TRACKING". Comma, Nov 2026.

**14. Filter test builds out of the data, and keep analytics anonymous where it can be.** Flamely, Oct 2026.

**15. Read an analytics or crash vendor's pricing and data terms before wiring it in.** Why: "I'm really scared like PostHog will charge me a lot simply because they're asking me for my bank account ... we should read this through". Comma, Oct 2026.

## Collect less

**16. Store the minimum the feature needs.** Keep the book's cover, not the photo of the person's shelf. Why: "we only save their covers ... never the picture of them ... until its necessary". Pip, Oct 2026.

**17. A test build never fills a real account with sample data.** Samples stay on the device and never sync. Why: a build put sample content into the owner's real account. Comma, Oct 2026.

**18. In a personal tool, every network call is one the user triggered, and each is logged.** CutRoom's standing rule: "no accounts, no telemetry; network calls logged". CutRoom, Oct 2026.

**19. The owner's personal media stays local:** out of git, previews only on localhost, never published. Before publishing anything built from logs, strip ids, hosts, timestamps and paths. CutRoom, Oct–Nov 2026.

## Disclosures

**20. Privacy and terms pages are live and linked before launch**, from the store listing and from every purchase screen. Why: the listing's privacy URL was empty and both pages returned 404 a day before submission. Comma, Nov 2026.

**21. When data practice changes, update every disclosure in the same change:** the privacy policy, the web pages, the store labels, the cookie notice. Why: "UPDATE THE WEB PAGES ... AND ANY OTHER DISCLOSURE WHERE NEEDED". Flamely, Nov 2026.

**22. Check the launch traps nobody tests**: an age gate (COPPA), self-hosted fonts (GDPR), session replay with consent and masking (CIPA), unsubscribe link and postal address (CAN-SPAM), renewal terms by the button, a DMCA agent for uploads. Why: "the hidden 53k mistake are usually the things nobody thought to test ... FOR ALL THESE LEGAL SHIT EVEN THINGS I MISSED". Flamely, Nov 2026.

**23. Cancel feedback stays private even when the feedback board is public.** Comma, Nov 2026.
