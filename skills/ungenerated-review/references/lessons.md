# What we learned, and why

Lessons from reviewing real apps with their owner (Comma, a script-writing app; Flamely, a time
tracker; Pip; CutRoom, a video editor). Each one transfers to any app. Best first within each group.

## Proving it works

- **Nothing reaches the owner until it works on a real phone.** Sign-in, AI calls, every button:
  "80% of things are not working"; "it's sloppy itself, nothing is really fixed." (Comma, Oct 2026)
- **"Written, compiles, never seen running" is not done.** Run a clean install, the real launch
  path, every control tapped: "This app's supposed to be production ready, but it's clearly not."
  (Flamely and Pip, Nov 2026)
- **A bug reported twice gets a real-input stress test,** not another look. The age ruler was
  "fixed" and reported again 18 times; a diagonal drag reproduced it. (Comma, Nov 2026)
- **A check counts only if it really exercised the thing.** It must fail on any failure line it
  prints and show its target was reached. One printed FAILED lines and still said "Everything
  held"; another passed because nothing was left to test. (CutRoom, Oct–Nov 2026)
- **Check order for any flow: tap tests, then the events, then the money, then screenshots.**
  Each catches what the one before can't. (Comma, Nov 2026)
- **Confirm events in the analytics tool itself, not in the code.** "PLEASE END TO END CONFIRM THE
  ANALYTICS POSTHOG EVENT." A closed sheet had been logged as "subscribed". (Comma, Nov 2026)
- **Fast double taps must never skip a step, delete twice or flip a rating.** "If I tap quickly,
  it's overlapping with the previous screen"; one star tap removed another. (Comma, Oct 2026)
- **Losing user text is a showstopper.** A pause in dictation wiped a brain dump in a shipped
  build. (Comma, Nov 2026)
- **Test the installed build the way a user would,** not the dev server: "that's how users test."
  The dev server was smooth while the installed app stuttered. (CutRoom, Oct 2026)
- **Test with Reduce Motion on and on the oldest phone in use.** The owner's phone froze the
  character under Reduce Motion and lacked the on-device model. (Comma, Oct 2026)
- **Check every number on screen against its source, then add a guard.** "You wrote wrong prices
  in the second video ... never make these mistakes again." (CutRoom, Oct 2026)
- **Prove it from a clean state.** Wipe the test data, run it end to end, show the owner: "so I can
  clearly see that it is working." (CutRoom and Comma, Oct–Nov 2026)

## Builds

- **Before handing over a build, confirm it is the newest and carries every change.** "WRONG
  BUILD"; "DID YOU CHECK IN ALL THE CODEX CHANGES AS WELL?" Check the version, the build number
  and other agents' work. (Flamely, Comma and CutRoom, Oct–Nov 2026)
- **Test in the simulator before any build, and open it for the owner.** "NEXT TIME OPEN SIMULATOR
  SO I CAN DO IT." (Comma, Nov 2026)
- **One simulator, tests one after another.** "PLEASE ONLY USE 1 simulator." Parallel runs filled
  the disk and made checks flaky. (Comma and CutRoom, Nov 2026)

## The slop gate

- **The default AI look is slop.** Indigo and violet, the trendy serif-plus-grotesk pairing,
  generic gradients, sparkles, persona labels, invented stats, corny promises, faded full-screen
  cards, cards that are only big text: "ALL OF THAT SCREAM AI SLOP TO ME." (Comma and CutRoom,
  Oct–Nov 2026)
- **Hunt the small tells he named:** rounded chips inside text, little nuggets on cards, tabs
  nobody needs, icons added to headers, "Typed just now" stamps, a date header on a screen that
  isn't a calendar, small text, shadows behind icons: "these rounded stuff and within the text,
  like little stuff ... the tabs and the little nuggets." (Comma, Oct–Nov 2026)
- **Never the sparkle icon for AI.** "You do not want to show this weird AI symbol"; "I hate the
  icon of the stars." (Comma, Oct–Nov 2026)
- **No small text.** "No one is gonna read that, so you have to be very clear with the headings."
  (Flamely, Oct 2026)
- **No boxed or double-outlined cards.** "I do not like the boxed look ... I like independent
  look." (Flamely, Oct 2026)
- **No step counters.** "Why do we have step one of four? Why are you showing that?" (Flamely, Oct
  2026)
- **Real brand icons only.** The App Store drawn as a phone emoji, Google Docs as a drawn tile:
  "it's not an icon." (Comma, Oct–Nov 2026)
- **Never add text for the sake of text.** An empty moment, with the reason written down, is a
  valid result: "IT ADDS ASS TEXT ON MY VIDEOS." (CutRoom, Nov 2026)
- **Unslop everything, not only what was named.** Repeats, captions that say nothing, decorative
  icons: "all these little things kind of matter a lot." (Comma, Oct 2026)
- **Turn each repeated tell into a lint rule** so it can't come back. A project's taste notes grew
  about sixty regex checks this way. (Comma, Oct 2026)
- **Measure alignment and gaps; don't eyeball them.** "ALIGNMENT ISSUES"; "there's no right and
  left gap." Anything called fixed must survive a close look. (Comma and Flamely, Oct 2026)
- **Measure jitter frame by frame** on every screen with springs. "SCREEN KINDA JITTERY."
  (Comma, Oct 2026)
- **Capture motion in real time.** Headless virtual time freezes animations mid-way and makes
  working screens look broken. (Comma, Oct 2026)
- **Make quiet elements dark enough to see.** Slider tracks were "nearly invisible" on the phone.
  (Flamely, Oct 2026)

## Showing the owner

- **A round isn't delivered until the owner sees it.** Serve with no caching, version every asset
  link, open a fresh URL and check the served files carry the change: "WTS YOU DID I DIDNT SEE ANY
  CHANGE?" (Comma, Oct 2026)
- **Never ask the owner to pick what he can't see.** Open each option, link each one, side by side:
  "the paywall, I want you to show me, like I can't see." (Comma, Oct 2026)
- **Clear the owner's own test data before a review round.** "I've written a lot of scripts, and I
  do not want them to reflect here." (Comma, Oct–Nov 2026)
- **Short status: where we are, what's next, what's his and what's yours.** "CUT THE CRAP AND TELL
  ME WHERE WE ARE AT." (Comma, Nov 2026)
- **Never go dark on long jobs.** "You're saying you didn't build anything for the past 9 hours?"
  (CutRoom and Comma, Nov 2026)

## Running rounds

- **Log every point of feedback first, then change things.** Number each note; the log is the open
  list: "I'm telling you this again and again." (Comma, Oct 2026)
- **Converge: keep what was picked, change only what was flagged.** "Refine the first design
  instead of changing everything." (Comma, Oct 2026)
- **Apply feedback exactly where it was aimed.** Over-applying a correction across the whole app
  made things worse. (Flamely, Oct 2026)
- **When the owner can't put it into words, show two or three working variants.** (Comma, Oct–Nov
  2026)
- **When the owner says you've misunderstood, stop and restate it in their words.** "YOU NOT
  GETTING ME." (CutRoom, Nov 2026)
- **Every round improves the skill.** Turn every lesson and every bug into a rule the next session
  reads: "SYSTEMIZE IT SO WE DON'T HAVE TO DO IT AGAIN." (Comma, CutRoom and Flamely, Oct–Nov 2026)
