# Feedback board

A public board where people post ideas and bugs, vote and see what happens to them, plus an admin
page to run it. Cancel feedback goes to the same place but is never public.

## Rules

- **Public posts, votes and statuses.** Kinds: Idea and Bug. Statuses: Under review · Planned ·
  In progress · Completed. Most votes first. One vote per person (account, or device on the web);
  a second tap removes it.
- **Nothing shows until approved.** New posts wait as Pending, so spam and abuse never reach the
  board.
- **Posting needs no account on the web:** a title, the details, a name, an email kept private.
  Signed-in posts from the app carry the account id instead. A hidden honeypot field and rate
  limits (a few an hour, per account or per network) stop bots.
- **Statuses are true.** Completed means shipped. Tell the people who voted when it ships.
- **The admin page:** approve, move between statuses (drag between columns), archive, search, and
  the private fields (email, account, country) in the detail. Behind a server secret or an admin
  sign-in, and kept out of search engines.
- **Cancel feedback is private.** The reason, the follow-up answer and the note from the cancel
  flow are a private kind: never listed, never votable, shown only in the admin's Cancellations
  list, marked handled when read. They must actually reach the owner.
- **Analytics get the answer, never the words.**
- **Store as little as you need.** Hash IP addresses and device ids. Deleting an account deletes
  its posts ([account-deletion.md](account-deletion.md)).

## Where it lives

- The website: `/feedback` (public) and `/feedback/admin` (private), linked in every page's footer.
- The app: Settings › Send feedback opens the board, or a form that posts to it.
- The cancel flow's reason step writes the private entry ([cancel-flow.md](cancel-flow.md)).

## Events

- `feedback_opened` {where}
- `feedback_submitted` {kind: idea | bug | cancel}
- `feedback_voted`

## Mistakes and traps

- Reading approved posts straight from a database table exposes the private columns by accident.
  Serve the public list from a function that returns only public fields.
- Cancel reasons that land in analytics only are never read. Put them where the owner reads them.
