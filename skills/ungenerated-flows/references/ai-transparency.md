# AI transparency

When AI is limited, show exactly what is left, in the same numbers the server enforces. A limit
nobody can see turns every refusal into "the app is broken".

## Rules

- **What's left, in the units people think in.** The main allowance big ("41 AI scripts left this
  week"), when it refills in their own time zone ("Fills up Monday at midnight"), then the smaller
  ones (this month, edits, requests today).
- **Fair use as a percentage, never dollars.** If there is a money ceiling behind the scenes, show
  how much of it is used as a share. Dollars tell them your costs, not their allowance.
- **What each action uses.** One line per action (a script uses 1, an edit uses none).
- **The last 20 requests,** newest first: the action, when, the result (done, failed, stopped by a
  limit, and which limit), what it used. Requests a limit stopped are listed too.
- **The numbers come from the server's own gate,** the same function that allows or refuses a
  request. Never a count kept on the phone. If the server can't be reached, say "Can't check right
  now", never a guess.
- **Unlimited accounts say so** (the owner's, a tester's), instead of showing fake limits.
- **What is sent to whom,** and the permission switch ([ai-permission.md](ai-permission.md)).
- **Spending is visible where it happens:** a count by each AI action, a short toast when one is
  used (its motion is in `ungenerated-motion`).
- **Used up is a screen, not an error:** which limit, when it refills, what still works by hand,
  and the plan that has more if there is one. Offline is a different message ("No connection.
  Nothing was used.").

## Where it lives

- Settings › AI writing (the full page).
- The count beside every AI action.
- The used-up screen and the offline toast.

## Events

- `ai_usage_opened`
- `ai_action` {action, result: done | failed | limited | offline}
- `ai_limit_hit` {limit, action}

Never the person's words in any of them.

## Mistakes

- A refused request said only "It doesn't work. Try again." The owner tried again, and again.
  Name the limit and the refill time.
- The owner asked for it in capitals: "SHOW EXACTLY WHAT IS LEFT." Approximate bars weren't enough.
- A usage screen that counts on the phone drifts from what the server enforces. Read the gate.
