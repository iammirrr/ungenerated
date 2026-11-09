# Account deletion

Deleting the account lives in the app (App Review 5.1.1(v)) and is not cancelling. It is the one
action that can't be undone, so it is slow on purpose and honest about what it does.

## Rules

- **Separate from cancelling.** Settings › Account › Delete account. The plan and Cancel live in
  Settings › Subscription ([cancel-flow.md](cancel-flow.md)).
- **Say the subscription first.** "Deleting your account doesn't cancel your App Store
  subscription." Offer **Manage subscription** (the platform's own sheet) before Delete.
- **Export first.** Offer their work as a file they keep, before anything is deleted.
- **Say what is erased and from where:** this phone, the server, backups within a stated number of
  days, the analytics person, crash reports tied to them, their feedback posts. Say what stays (the
  store keeps its own purchase records).
- **Hold to delete.** A press held for two or three seconds that fills the button. Not one tap,
  not typing "DELETE".
- **Refuse before touching anything.** Signed out, offline or with an expired session, refuse
  before clearing a single thing. Never wipe the phone and then fail on the server.
- **Server first, then the phone.** Delete on the server, revoke Sign in with Apple's token (Apple
  requires it), log the payment SDK and analytics out, then clear the phone.
- **A grace period only if the server keeps it** ("Undo within 10 days"). Otherwise say it's now.
- **Web steps too:** a page that says how to delete without the app (Google Play requires a web
  link; it helps everyone else).
- **After:** a short goodbye, then the opening, signed out.

## Where it lives

- Settings › Account › Delete account.
- A public web page with the same steps.

## Events

- `delete_account_opened`
- `delete_export_tapped`
- `delete_account_result` {result: deleted | failed | refused_signed_out}

Send the result before the analytics person is deleted, then reset.

## Mistakes

- A signed-out delete cleared the phone's writing before the server refused it. Refuse first.
- Deleting without cancelling leaves people paying for an account that no longer exists. The top
  apps say it first in their delete sheet ([cancel-flow-field-study.md](cancel-flow-field-study.md)).
