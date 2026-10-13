---
name: consent-and-permissions
description: Ask for consent and system permissions honestly and in context - a plain "does and never does" screen with explicit ticks first, then permissions as rows with toggles that open the real system sheet, each with a one-line reason. Covers what iOS and Android actually allow. Use for privacy, terms, consent, notifications, Screen Time, location, camera or tracking prompts.
---

# Consent and permissions

## Consent first

Before anything is saved, one screen in plain words:

- **The app does**: three lines, each a concrete thing ("Keeps your sessions on your device first").
- **The app never does**: three lines ("Read your messages", "Sell your data").
- **Two unticked boxes**: "I accept the Terms of Use" and "I've read the Privacy Policy", each
  linking to the document. Continue stays disabled until both are ticked.
- Optional choices (marketing email, analytics) are separate and **off by default**; in the EU they
  must be opt-in. Keep them on the privacy page or as separate toggles, never bundled with terms.
- Everything on this screen must be true for every platform the account touches.

## Permissions

- **One screen of rows**, each with an icon, the name, one line of why, and a toggle.
- **A toggle cannot grant access by itself** on iOS or Android. Turning it on opens the system
  sheet; the person still taps Allow there. If they deny, the toggle springs back and the row says
  "Not allowed" with a way to Settings.
- **Ask what the next screen needs first.** On iOS, Screen Time access (Family Controls) must be
  granted before the app can show the app picker.
- **Never ask at launch.** Ask where the reason is visible.
- Show the real system sheet text on the board; don't redesign Apple's or Google's dialogs.

## Platform facts worth knowing

- iOS notifications: one system prompt per install; after a denial only Settings can change it.
- iOS Screen Time shields are drawn by the system; apps set the icon, title, subtitle and two
  buttons, not the layout.
- Android 13+: notifications need a runtime permission.

## Anti-patterns

- Pre-ticked consent boxes.
- "Allow everything" buttons.
- A fake permission dialog styled like the system's that leads to the real one.
