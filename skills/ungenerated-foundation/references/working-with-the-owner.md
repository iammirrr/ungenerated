# Working with the owner

How a design round runs, from the first note to the hand-over. These hold for every ungenerated skill.
They come from one owner's rounds on several apps (Comma, Flamely, CutRoom, Pip, Oct–Nov 2026); his own
words are quoted where they say it best.

## Feedback

1. **Log every note first, then change things.** Write each point down (date, verdict, area, the
   quote, the rule, the why) before touching the design. "I'm telling you this again and again" is
   what happens when notes live only in the chat.
2. **Turn repeats into rules.** A note that comes twice becomes a standing rule, checked before
   every new screen, and goes into the skill in the same round. "Systemize it so we never have to do
   it again."
3. **The latest ask wins.** Apply it everywhere it reaches, not only on the screen it was said on,
   and tell the owner when it reverses an older rule. Keep the older rule's condition if both can hold.
4. **Apply it exactly where it was aimed.** Over-correcting one note across the whole app is as bad
   as missing it.
5. **Read past dictation slips.** Owners often talk rather than type. Keep a small glossary of what
   they mean ("corrector" for character) and ask only when the meaning really forks.
6. **When you are told you misunderstood,** stop, restate the request in their words, then act.

## Converge

1. **Keep the picks.** Copy the exact values of anything already chosen (grep the old prototype,
   reuse its CSS), then change only what was flagged. Never re-skin everything.
2. **Keep what they liked whole.** "I like this, but…" means fix the "but" in place. Never split,
   re-layout or re-style a liked screen.
3. **Refine, don't reinvent.** Each round answers one batch of notes. Don't redesign what nobody
   mentioned.

## Show before asking

1. **Never ask the owner to pick something they can't see.** Open each option, link each one, put
   them side by side. "Show me" is the most common reply to a described option.
2. **When they can't say what they want, show two or three working variants** and let them pick by
   feel. Write the pick down as a rule.
3. **Delivered means seen in their own browser.** Serve previews locally with caching off (the board
   template's `tools/serve.mjs` sends `no-store`), open a fresh URL each round, and check the served
   files carry the change. A cached page makes a whole round look like "no change".
4. **Check on the real thing.** Real data, the real AI, the real phone. Feedback on a mock is worth
   little: "I want an actual usable app so I can give you good feedback". Test with Reduce Motion on,
   at the smallest size, in both themes.
5. **Bugs are showstoppers.** Run every check before the owner sees anything. A bug they have to find
   costs more trust than a late round.
6. **Every promise works on the real phone,** or it doesn't ship and isn't shown as done.

## Do the work

1. **Do it yourself when a key or connector allows it.** Only steps that need the owner's hands
   (an Apple key, Touch ID, a payment) go back to them. A to-do list they can see you could do reads
   as stalling.
2. **When they must act, give exact click-by-click steps.**
3. **Builds are your call** once a round passes its checks. Don't ask permission for routine work
   they already approved.
4. **Plan when asked, or when features move around.** Write the plan in their words, get the yes,
   then build. When they say "talk", talk and ask questions; don't build.
5. **Foundation first, one thing at a time.** Finish it before the next.
6. **Use one simulator and few parallel jobs.** Overload makes checks flaky and fills the disk.
7. **Never test on the owner's real data or leave test items behind.** Nothing changes under them:
   don't pop windows onto their screen or flip their settings.
8. **A rename or any wide change waits for a confirmed yes.** Owners change their minds within the hour.

## Talk

1. **Short answers.** Status is: where we are, what's next, what is theirs and what is yours, in order.
   "Cut the crap and tell me where we are at."
2. **Don't go dark.** On long jobs, report progress. Hours with nothing to show are the worst outcome.
3. **Say plainly what is done, what isn't and what you didn't test.** No adjectives about your own work.
4. **Keep a running list of open notes** and show it when asked "what is left".
5. **Raise the topics they called crucial,** and don't decide them alone.

## Handing over a pass

A short list in the owner's terms: what changed on each screen, what you couldn't do and why, and
one or two questions whose answers change what you do next. Lead with the link to the fresh page.
