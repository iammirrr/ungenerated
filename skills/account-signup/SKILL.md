---
name: account-signup
description: Place and design the sign-up so it feels like saving progress, not a wall - at the end of the personal setup, before the plan and the paywall, showing what they keep; Apple then Google then email, Apple's login and deletion rules, a calm ground, the product still visible, and trust lines that are true. Use for sign-up, sign-in, "create account" or "save your progress" screens.
---

# Account sign-up

## Rules

1. **Never first.** The account closes the personal setup ("make it yours"): they have just built
   something worth keeping, so saving it is the obvious next step. Then the plan and the paywall,
   so the purchase belongs to a person and not a phone (it restores on a new device and unlocks
   every platform). One door serves new and returning people.
2. **Order:** Continue with Apple, Continue with Google, then Continue with email as a text button.
3. **Say why:** "Save your setup for your phone and computer." One line.
4. **Play the use case in the centre.** "Almost done." at the top (title size, not a poster), then
   the opening's own picture playing the product in three short beats, one caption line each. For
   a focus tracker: the hero lights up, the distracting apps float in round it
   with their badges; a focus ring draws, a clock runs and the apps fade ("Focus. The pull
   fades."); the ring becomes today's projects and the hours count up ("Every minute, tracked.").
   Chips listing their settings looked static and said nothing about what the product does; the
   App Store icon alone said even less. The same picture that opened onboarding now saves it.
5. **Clean.** Three blocks and air between them: the words at the top, the one picture in the
   middle, the buttons at the bottom. No dividing curve, no device frame, no cards, no second
   caption, one small terms line. Clean is what makes the moving picture read as the product.
6. **Less rounded than the marketing screens**, so it sits with the app (16 pt buttons).
7. **True trust lines only**: "We never sell your data." and the terms line.
8. The email path: one field, then a six-digit code. No password.
9. **Required or skippable is a product decision.** App Store guideline 5.1.1(v) asks for a way in
   without a login only when the app has no significant account-based features. Sync across
   devices, a companion app or a subscription that follows the person all count, so a required
   account is fine; say so plainly ("By continuing, you accept the Terms and Privacy Policy.").
   Google Play has no such rule. Plan for a first launch with no signal.

## Platform facts worth knowing

- **Sign in with Apple is required** when you offer Google or another third-party login
  (guideline 4.8), and it should be first.
- **Apple sends the name only on the first sign-in.** Save it then.
- **"Hide My Email" gives a relay address.** Register your sending domain with Apple's private
  email relay or your codes and receipts won't arrive. The relay won't match the email they use
  elsewhere, so every platform needs the same Apple button or people end up with two accounts.
- **Purchases follow the account:** log the purchase SDK in with the account id after sign-in, and
  keep Restore purchases on the paywall.
- **Account deletion lives in the app** (guideline 5.1.1(v)).

## Anti-patterns

- A login screen at launch.
- A loud brand-colour field behind the buttons.
- "Sign up to continue" with nothing to continue to.
