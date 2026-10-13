---
name: accessibility-pass
description: Check app screens for accessibility before approval - contrast in both themes, tap targets, text that scales, reduced motion, labels for screen readers, and colour that is never the only signal. Use before any screen is approved or built, or when asked about a11y, VoiceOver, TalkBack, Dynamic Type or contrast.
---

# Accessibility pass

## Check

1. **Contrast**: body text 4.5:1, large text and icons 3:1, in light and dark.
2. **Targets**: 44 × 44 pt minimum on iOS, 48 × 48 dp on Android, with space between.
3. **Text size**: layouts survive 130% text (Dynamic Type, font scale); nothing truncates the meaning.
4. **Reduced motion**: every move lands on its final frame; nothing important happens only in motion.
5. **Labels**: every control has a name; icons-only buttons have labels; decorative art is hidden.
6. **Order**: reading order matches the visual order; focus moves into sheets and back out.
7. **Colour is never the only signal**: picked rows also show a check; errors also show text.
8. **Time**: nothing the person must read disappears on its own in under 5 seconds.

## On the board

The template's parts already handle press states, focus rings, `aria-pressed` and reduced motion.
Check custom screens with keyboard focus (Tab) and with the system's reduce-motion setting on.

## Report

List what passed, what failed with the fix, and what needs a real device to prove (VoiceOver,
TalkBack, physical text sizes).
