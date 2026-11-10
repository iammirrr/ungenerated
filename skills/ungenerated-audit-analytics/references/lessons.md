# What we learned, and why

Lessons from wiring analytics into Comma (iOS, PostHog and RevenueCat), Flamely (Mac/Windows/iOS) and Pip, Oct–Nov 2026. The tools named are examples; each rule holds for any analytics tool.

## Outcomes, not taps

**1. Log the result, never the tap.** Closing the store's purchase sheet returns no plan; it was logged as "subscribed" until it was caught, and every paywall number was wrong. Log trial, active, closed or failed. Comma, Nov 2026.

**2. "Trial started" and "subscribed" fire only when the paid state really started**, and plan and status go on the person. Comma, Nov 2026.

**3. Cancel is what the server says, not what a screen did.** A stand-in cancel screen marked people "cancelled" while billing went on; the cancel event must come from the billing service's state. Comma, Nov 2026.

## Proven live

**4. Confirm every event in the analytics tool itself, not just in code.** Why: "PLEASE END TO END CONFIRM THE ANALYTICS POSTHOG EVENT". Comma, Nov 2026.

**5. After wiring analytics, check the events arrive and the dashboards exist.** Why: "I don't see anything on the ... post hog. I have no idea like what the hell is happening here". Flamely, Nov 2026.

**6. Check any flow in this order: tap tests, then the events in analytics, then the database and the subscription service for money, then screenshots looked at by hand.** Comma, Nov 2026.

**7. Wire analytics, crash reporting and subscriptions end to end yourself when a connector exists, then verify.** Why: "add RevenueCat, already Sentry and PostHog connectors are there why aren't you doing it"; "hook posthog amazingly". Comma, Oct 2026.

## What to measure

**8. Measure what decides the business: visitors, sources, countries, onboarding completion, drop-off per screen, errors seen in onboarding, conversion.** Why: "how many people converted, how many people came ... where they came from ... which specific screen they are dropping from ... is there they are seeing any sort of error"; "without that, I think we are not able to even run ads". Flamely, Nov 2026.

**9. Keep event volume low.** Why: "keeping the cost of the events a little bit lower". Flamely, Nov 2026.

**10. Every onboarding screen reports a screen event with a stable id, plus a completion event.** Then drop-off per screen is one query. Comma, Nov 2026.

**11. Every step of the paywall and cancel flows sends its event**, including "kept my plan" with the step it happened at. Comma, Nov 2026.

**12. One dashboard for paywall and cancel**, linked from the project docs. Comma, Nov 2026.

**13. List the events per screen next to the design**, so building and measuring stay in step. Comma, Oct 2026.

## People and privacy

**14. Identify by account id only, never name or email.** Comma, Nov 2026.

**15. Analytics get the answers, never the person's words.** A cancel reason is a category plus a "wrote a note" flag; the note goes to a private list. Why: "PostHog gets the answers, never their words". Comma, Nov 2026.

**16. Cancel reasons and notes must actually reach the owner**, in the private list, or the cancel flow's questions are wasted. Comma, Nov 2026.

**17. Sign in before the paywall, and log the payments SDK into the same account id**, so the anonymous onboarding, the purchase and the server's revenue events belong to one person. Comma, Nov 2026.

**18. Filter test builds out of the data, and keep analytics anonymous where it can be.** Flamely, Oct 2026.

**19. Keep analytics off until the person says yes where consent is needed.** Why: "take consent we need it". Pip, Oct 2026.

## Tools

**20. Use the vendors' real SDKs (screens, crashes, hangs), not hand-written HTTP.** Why: "PLUS POSTHOG AND SENTRY, I WANT IT BUILT IN"; hand-written calls missed batching, retries and device context. Comma, Oct 2026.

**21. Read a vendor's pricing and data terms before wiring it in.** Why: "I'm really scared like PostHog will charge me a lot simply because they're asking me for my bank account". Comma, Oct 2026.

**22. Run paywall experiments through the subscription service**, so variants, prices and results stay in one place. Why: "make A/B testing screens from the RevenueCat as well". Comma, Oct 2026.

**23. Propose analytics fixes; never push them silently.** They change the numbers the owner reads. Comma, Nov 2026.

## What the numbers can and can't see (Flamely, 5 Nov 2026)

**24. Where the consent question sits decides what you can ever measure.** Flamely's "Help improve Flamely" tick was screen 8 of 19, so analytics could only ever see screens 8–19: anyone who quit at sign-in or on screens 1–7 was invisible, and the funnel looked better than it was. Measure early drop-off from the server instead: the app synced its onboarding progress (the current step) for every account, consent or not, because it is account data. State in every report which part of the journey analytics can see. Flamely, Nov 2026.

**25. Opt-in analytics are thin by design; say how many people could send data before showing a number.** In its first week of releases, one person on a released app had sent anything: the owner. Released apps sent nothing at all before the build that carried the keys. Sign-ups, trials and payments come from the server for every account; analytics add the in-app detail for those who agreed. Flamely, Nov 2026.

**26. The analytics tool's own dashboards are built for websites.** PostHog's starter dashboard counts page views, so a desktop or mobile app that never sends page views looks dead. Build the app's own dashboard while wiring analytics (opening, onboarding per step, the core action, versions in use) and make it the project's home dashboard. Why: "I'm not even seeing snippets of anything ... on the post hog". Flamely, Nov 2026.

**27. Know the project's default filters before saying "nothing arrived".** PostHog's "filter out test accounts" was on by default and hid every test build's events, so the owner's own testing showed nothing on the charts while the raw events were there. Flamely, Nov 2026.

**28. Check what the tool adds at ingestion, not just what the app sends.** Analytics services can add city, postcode and coordinates from the IP on their side; Flamely's events carried `$geoip_disable` and none, which matched its "no location" promise. Query the stored properties to prove it, and if countries are wanted, keep the country only (a transformation that drops the rest) and update the privacy policy first. Why: "we do need to keep the countries intact". Flamely, Nov 2026.

**29. Product analytics can't tell you age or gender.** Google Analytics gets them from Google's ad tracking, which needs a cookie banner and sends visitors' data to Google. Ad platforms show the age and gender of people who clicked in their own reports; asking in onboarding is a design decision. Why: "if we can get their age groups, like even the Google analytics give better stats". Flamely, Nov 2026.

**30. Chart events the code sends even before anyone has sent them.** An event nobody triggered yet is missing from the tool's event list; build its chart from the verified name in the code so it fills when data arrives, and say it is empty until then. Flamely, Nov 2026.
