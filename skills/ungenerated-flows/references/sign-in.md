# Sign in

The door for new and returning people. Where the account screen sits and how it looks is in
[account-signup.md](account-signup.md); this page is what the door must do.

## Rules

- **Late, and before the paywall.** Never the first screen. The account closes the personal setup,
  then the plan, then the paywall. A purchase made before sign-in belongs to a phone, not a person.
- **Log the payment SDK into the account id** the moment sign-in succeeds (RevenueCat
  `Purchases.logIn(accountId)`, or StoreKit's `appAccountToken`). A purchase made signed out stays
  on an anonymous id, and the server's webhook can't match it to anyone.
- **Apple first.** Sign in with Apple is required once any other social login is offered (App
  Review 4.8). Google is wanted by most audiences. Email, if at all, is a one-time code, never a
  password.
- **Only the doors that work.** A provider that doesn't work in this build is hidden until it does
  (Google stays hidden until its OAuth client exists and the backend accepts it). A button that
  fails is worse than no button.
- **The success moment lands.** A tick closes, the app's character (if it has one) reacts once,
  one success haptic. Then move on. Not a toast, not a silent jump to the next screen.
- **Returning people hear "Welcome back."** Signing in from the opening skips the questions they
  already answered, restores their data and takes them to the app, not back through onboarding.
- **Apple sends the name only on the first sign-in.** Save it then. "Hide My Email" gives a relay
  address: register your sending domain with Apple's relay or your emails won't arrive.
- **A cancelled sheet is not an error.** If they close Apple's or Google's sheet, stay on the
  screen quietly. A real failure gets one line and a retry.
- **Signing out** logs the payment SDK out too and clears this account's local data. It deletes
  nothing on the server ([account-deletion.md](account-deletion.md) does that).

## Where it lives

- Onboarding: the account screen after "make it yours", before the plan and the paywall.
- The opening: a small "I already have an account" that opens the same door.
- Settings › Account: who is signed in, Sign out, Delete account.

## Events

- `signin_shown` {where}
- `signin_started` {provider}
- `signin_result` {provider, result: new | returning | cancelled | failed}
- `signed_up` once, for a new account
- `signed_out`

Identify the person with the account id at `signin_result`, so the anonymous onboarding events
merge into them. Never identify by name or email.

## Mistakes

- A purchase made signed out stayed on an anonymous id and the webhook answered "no user". Sign in
  before the paywall, then log the payment SDK in.
- The success went by with no moment. The owner: "it's supposed to show a tick."
- Provider buttons that didn't work yet were on screen: "legitly, nothing is working." Hide them.
- Identifying by email put personal data into analytics.
