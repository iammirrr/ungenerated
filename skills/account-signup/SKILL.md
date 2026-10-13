---
name: account-signup
description: Place and design the sign-up so it feels like saving progress, not a wall - after the plan and right before the paywall, Apple then Google then email, Apple's login and deletion rules, a calm ground, the product still visible, and trust lines that are true. Use for sign-up, sign-in, "create account" or "save your progress" screens.
---

# Account sign-up

## Rules

1. **Never first.** The account comes after the person has seen value: after the plan, right
   before the paywall, so the purchase belongs to a person and not a phone (it restores on a new
   device and unlocks every platform). One door serves new and returning people.
2. **Order:** Continue with Apple, Continue with Google, then Continue with email as a text button.
3. **Say why:** "Save your setup for your phone and computer." One line.
4. **Keep the product visible**: the top of the screen shows the app working (a device under a
   camera, cropped by a gentle curve), on a calm ground: soft gradient, fine grain or a faint
   texture. Offer two or three grounds as a Pick.
5. **Less rounded than the marketing screens**, so it sits with the app (16 pt buttons).
6. **True trust lines only**: "We never sell your data." and the terms line.
7. The email path: one field, then a six-digit code. No password.
8. **If the product works without an account, offer a quiet "Not now".** App Store guideline
   5.1.1(v) can reject a forced login when the core isn't account-based.

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
