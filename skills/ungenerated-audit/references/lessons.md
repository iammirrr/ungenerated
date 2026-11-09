# What we learned, and why

How an audit should run, from the owner's reactions while launching Comma (iOS), Flamely (Mac/Windows/iOS), Pip (iOS) and CutRoom (Mac), Oct–Nov 2026. The apps appear only as examples. Each audit's own `references/lessons.md` holds its subject lessons; these are about the job itself.

## Start from the app, end with approval

**1. Every audit starts by profiling the app, reports everything, waits for approval, then fixes.** Why: "all skill should start from apps ... COVER EVERYTHING AUDIT AND TELL USER AND AFTER APPROVAL THESE SKILL FIX THESE". Flamely, Nov 2026.

**2. Cover the things nobody thought to test.** The catalogue is a floor, not a ceiling; add what you find beyond it. Why: "the hidden 53k mistake are usually the things nobody thought to test ... EVEN THINGS I MISSED". Flamely, Nov 2026.

**3. Aim for zero holes, both ways.** Why: "WE CANT LEAVE A SINGLE DROP OF LOOP HOLES". Flamely, Nov 2026.

**4. Read the plan or spec the owner already gave before judging.** A finding against a decision the owner made on purpose is noise. Why: "have you even look at the pdf?"; "or the plan?". CutRoom, Oct 2026.

## Proof

**5. Nothing pretends: a claim is proven on the real thing.** A flow "works" when the tap test passes, the event arrives, the row is in the database and the screenshot was looked at, in that order. Why: "legitly, nothing is working to begin with"; the standing check order became tap tests → analytics events → database and payments → screenshots. Comma, Oct–Nov 2026.

**6. Cite the exact rule before warning about a rejection or a fine.** Why: "why are you saying that will be rejected from the App Store? Tell me the one reason." Flamely, Oct 2026.

**7. Fix sync, timing and money bugs at the root, and explain the cause with a before and after in plain words.** Why: "you need to recode it and like why it's happening to begin with"; "Tell me the before and after bro". Flamely, Oct 2026.

**8. Treat a failing test as a possible real bug, not noise.** Bringing 15 stale UI tests up to date found a real bug (an item's fields lost their ids inside an editor). Comma, Nov 2026.

## Doing it

**9. Do it yourself when a connector or key on the machine allows it; only steps that need the owner's hands go back.** Why: "connectors are there, why aren't you doing it"; a to-do list he can see you could do reads as stalling. Comma, Oct 2026; Flamely, Nov 2026.

**10. When the owner must act, give exact click-by-click steps.** Why: "where should I find a Supabase access token?"; "please give me extensive steps, each step by step". Comma, Oct–Nov 2026.

**11. Read-only means read-only.** Never pause, restore, delete or change a production project, a sibling app or a release workflow without a yes in this conversation. Why: an agent paused the wrong production project ("why you paused flamely prod"); "YOU CAN TEST IT BUT DONT CHANGE THINGS". Comma, Oct 2026; Flamely, Nov 2026.

**12. Never test on the owner's real projects or leave test items in their space.** Use test accounts and clean up. Why: a test project appeared in the owner's library: "delete your tests videos". CutRoom, Oct 2026.

**13. Nothing changes under the owner.** Don't flip their settings, rebuild an app they have open, or pop windows onto their screen; a check once flipped a saved theme. CutRoom, Oct–Nov 2026.

**14. Run one simulator and run tests one after another.** Parallel simulators and builds ran the disk out and made checks flaky. Why: "PLEASE ONLY USE 1 simulator". Comma, Nov 2026; CutRoom, Nov 2026.

**15. Keep reviewer agents to two or three, each with its own lane.** Why: overloaded machines made checks time out; "At most 2–3 agents; don't waste tokens". Flamely, Oct 2026; CutRoom, Nov 2026.

## The report

**16. Result first, short, plain words.** Where we are, what's next, what's the owner's versus yours, in order. Why: "CAN YOU CUT THE CRAP AND TELL ME WHERE WE ARE AT"; "TASK IS FOR ME OR FOR YOU?"; "put them in the chronological order". Comma, Nov 2026.

**17. Don't hand the owner open questions he can't parse.** Ask only what the code can't answer, in easy words. Why: "I don't understand the open questions you're asking me". Flamely, Oct 2026.

**18. Say plainly what is done, what isn't, and what you have not tested.** Why: "SO YOU TELLING ME YOU DID NOTHING"; hours with nothing to show made every owner angriest. CutRoom, Nov 2026; Pip, Nov 2026.

**19. Don't go dark on a long audit; report progress.** Why: "wtf are you doing from past 5 hours?". Comma, Nov 2026.

**20. Save findings into the project's docs, and turn every lesson into a skill update in the same round.** Why: "update in the skill regarding all of these bugs"; "SYSTEMIZE IT SO WE DON'T HAVE TO NEVER DO IT AGAIN". Flamely, Oct 2026; CutRoom, Nov 2026.

**21. Don't re-ask what the owner already approved.** Why: "I already said yes to everything that you want to do, so please go ahead and do it." Flamely, Oct 2026.

**22. Apply a fix exactly where it was aimed.** Over-correcting one rule across the whole app made it worse. Flamely, Oct 2026.

**23. Spend from the funding source the owner names, and stop when the job is done.** Why: "ONCE DONE PLEASE STOP OK?? DONT WASTE MY TOKENS". CutRoom, Oct 2026; Comma, Nov 2026.
