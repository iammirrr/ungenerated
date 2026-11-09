# Draft App Review notes

App Store Connect › the version › App Review Information has a sign-in section (user name, password) and a Notes box. Reviewers read the notes before they open the app; write them so a stranger can see every paid and sensitive feature in five minutes. Plain words, short lines, no marketing. Fill every `<…>` from the audit; delete lines that don't apply.

## Sign-in information

- User name: `<test account email>` (a test account made for review, with realistic sample content; never a real person's)
- Password: `<password>`
- If sign-in is Sign in with Apple only: say so in the notes, and that the reviewer can use their own Apple Account.

## Notes (paste and edit)

```
<App name> helps <who> <do what>, in one sentence.

HOW TO TEST
1. Launch and go through onboarding (<N> short questions).
2. Sign in with <method>. A demo account is above; it already has <sample content>.
3. The paywall appears after <step>. Subscriptions: <product names, lengths>. A free trial of <length> is offered only to accounts that are eligible for it. Purchases work in the sandbox; Restore is on the paywall and in <Settings › Subscription>.
4. The main feature: <where to tap> to <do the core action>.
5. <AI feature>: before any text is sent, the app asks for permission in its own sheet, explaining that <what> is sent to <provider> to <purpose>. Declining keeps every manual feature working. It can be turned off in <Settings › AI>. Each account has a weekly allowance shown in <where>.
6. Account deletion: <Settings › Account › Delete account>. It deletes the account and its data on our server; it explains that the App Store subscription is managed in Settings and is not cancelled by deleting.

ACCOUNT BEFORE PURCHASE (only if sign-in comes before the paywall)
The subscription is tied to the account because <account-based reason: writing syncs across the person's devices / it is available on the web>. This is why we ask people to sign in before subscribing.

PERMISSIONS
- <Microphone>: <used only when they tap the mic to dictate; speech is recognised on the device>.
- <Camera>: <…>.
- We do not track people across apps, so the app does not show the tracking prompt.

OTHER
- <Any hardware, location, content or second device the reviewer needs.>
- <Features controlled remotely, and their state during review.>
- <Extensions: the share extension appears in the share sheet as "<name>"; the widget is "<name>".>

Contact during review: <name>, <phone or email the owner chose>.
```

## Before pasting

- Every step above was done on the build being submitted, from a fresh install, by you.
- The demo account works today and won't expire during review.
- Product names and lengths match App Store Connect exactly.
- Nothing promised in the notes is missing from the build.
