# AI permission

Before any of the person's words leave the phone for an AI provider, ask once, on the app's own
sheet. It is a promise about their writing, so it gets the same care as the paywall.

## Rules

- **The app's own sheet, never a system alert.** An alert can't show who does the work or what is
  sent, and it looks like an error. The sheet holds:
  - the app's mark (its character, if it has one) in front of the provider's real icon, never a
    sparkle;
  - one heading: "*App* writes with *Provider*";
  - one line on what it's for;
  - what is sent and where, in plain words, every line true and in the privacy policy ("Your words
    go to Anthropic to write. They aren't used for training. Audio and video stay on this phone.");
  - two buttons: **Allow *Provider*** and **Keep writing by hand**.
- **Swiping it away means no.** Treat it exactly like "Keep writing by hand".
- **Save the answer at the tap.** Write it before the sheet's exit animation starts, on the phone
  and on the server (answer, time, the version of the words). A delay lost the answer when the app
  closed.
- **Show it from wherever AI starts.** A sheet can't present the root's sheet, so present it from
  the app's root and from inside every sheet that has an AI action.
- **No means the app still works.** Every manual path keeps working. An AI action tapped later
  shows the sheet again; nothing nags in between.
- **Revocable in Settings,** in the same words ([ai-transparency.md](ai-transparency.md)).
  Revoking stops all sending at once.
- **The server checks too.** An AI request without a recorded yes is refused (fail closed), so a
  bug in the app can't send words.
- **Ask at the first AI moment,** not at launch and not on a permissions screen.

## Where it lives

- The first AI action anywhere (in onboarding, the first real AI demo).
- Settings › AI: the switch, what is sent to whom.

## Events

- `ai_permission_shown` {where}
- `ai_permission_answer` {answer: allow | by_hand | dismissed, where}
- `ai_permission_revoked`

## Mistakes

- The answer was saved after a delay and lost when the app closed. Save at the tap.
- Shown only from the root, it never appeared inside the writing sheet, where it was needed.
- A system-style prompt felt cheap. The owner: "I want that pop-up to be nice ... we use Claude for
  every writing, so it is high quality."
