# What we learned, and why

Lessons from the code of Comma (SwiftUI app and a web design board), Flamely (Mac/Windows desktop plus an iOS client), Pip (iOS) and CutRoom (Tauri/Rust and native Mac), Oct–Nov 2026. Each came from a bug that shipped or a mess the owner had to point out. The apps appear only as examples.

## Dead and duplicated

**1. Screens cut from the design are deleted from the code, not left as dead routes.** Why: "why the screen I cancelled are not deleted?"; he asked for an audit of "dead screens". Comma, Oct–Nov 2026.

**2. One source for content shared by two surfaces** (a design board and the app, two clients): one course file, one character builder, one text helper, so a change lands in both. Why: the board and the app drifted every time content was copied. Comma, Oct–Nov 2026.

**3. Build the system that does the job; don't hand-edit one case to make it look right.** Why: "ARE YOU SYSTEMIZING IT RIGHT, NOT HARD CODING AND EDITING IT?" CutRoom, Oct–Nov 2026.

**4. Lay down the base that features plug into (one registry, each type only configuring it)** instead of a pile of one-off mock-ups. Why: "this is the architecture that we are following rather than just randomly making some mock-ups". CutRoom, Oct–Nov 2026.

## Risky logic

**5. Talking into a box only ever adds.** A pause, a recogniser restart or a second mic tap never replaces what was there. Why: "WHEN I TAKE PAUSE BRAIN DUMPING IT REMOVES ALL OF THE PREVIOUS TEXT" (shipped data loss). Comma, Nov 2026.

**6. Each item keeps its own state; an answer never carries into the next question.** Why: "it kinda copied the same answer to the second one automatically". Comma, Nov 2026.

**7. One source of truth and one undo history per document.** Two stores with two undo stacks drift; a stray undo wiped files and approved work was silently lost. CutRoom, Oct–Nov 2026.

**8. The approve path carries everything the draft made; test that an approved item survives the next save and redraw.** Why: approved custom graphics disappeared the next time anything was drawn. CutRoom, Nov 2026.

**9. When several processes write the same files, use a lock or a revision check.** Otherwise one silently overwrites the other. CutRoom, Nov 2026.

**10. When two clients share logic, prove parity by running the original's real code on awkward inputs** (midnight, daylight saving, overlaps, rounding) and comparing in tests. Why: "IT HAS 100% SAME LOGIC AS THE DESKTOP APP"; a fixture generator found 7 mismatches in 2,684 cases. Flamely, Oct 2026.

**11. A new client never changes what existing clients compute.** Write new data where old clients don't read it until they're ready. Why: "MAKE SURE THIS ISNT HURTING OUR DESKTOP APP A SINGLE BIT". Flamely, Oct 2026.

**12. Across devices a person has one state** (active anywhere means active; one schedule; settings sync). Why: "WHY LIKE 15 MIN TIMER ASK ON WINDOWS AND MAC SEPARATELY THAT DOESNT MAKE SENSE?" Flamely, Oct–Nov 2026.

**13. Clip anything time-based to its day.** Why: "the work is leaking out of even of the 2 a.m. ... Probably one of the biggest bugs". Flamely, Nov 2026.

**14. A destructive account action refuses when signed out, before clearing anything locally.** Comma, Nov 2026.

## Platform traps (examples of "check the compiler and framework, not just your logic")

**15. Swift 6.2 with Approachable Concurrency could pass garbage to stored `async @Sendable` closures; marking them `@concurrent` fixed a shipped launch crash.** Comma, Nov 2026.

**16. A SwiftUI `Canvas` that reads the clock inside its drawing never redraws;** drive it from a `TimelineView` or a changing input. The character stood still across the app for days. Comma, Oct 2026.

**17. Shared visual helpers must not add layout as a side effect.** A blur helper's side padding pushed every centred text 8 pt right in a shipped build. Comma, Nov 2026.

**18. When you fork an engine, prefix new class names per screen;** reused names inherit the engine's rules (an inherited margin knocked a calendar out of line). Comma, Oct 2026.

**19. A flow's order is its registration order;** keep each screen in its part's file and print the order after moving anything. Comma, Oct 2026.

**20. When porting to another platform, use that platform's native equal for each piece, never a cheaper downgrade, and leave the working platform untouched.** Why: "never replace to cheap stuff". CutRoom, Oct 2026.

## Tests

**21. Keep UI tests current with the UI; fix flaky waits; a failing test may be a real bug.** Bringing 15 failing tests up to date found a real one (an item's fields lost their ids inside an editor). Comma, Nov 2026.

**22. Tap tests prove every flow**, and the check order is tap tests, then analytics events, then the database and payments, then screenshots. Comma, Nov 2026.

**23. For bugs that are hard to reproduce, build a flight recorder into test builds** that logs exactly what happened. Why: "make the test app slightly more intuitive and better so you are able to kinda like understand the problem". Flamely, Oct 2026.

**24. Fix at the root and explain the cause with a before and after.** Why: "you need to recode it and like why it's happening to begin with". Flamely, Oct 2026.

## Releases

**25. Check the signed archive's entitlements for the app and every extension before each upload.** Why: "BRO YOU LITERALLY SEND THIS BUILD WITHOUT ALL THIS"; a build shipped with no Sign in with Apple and no push. Comma, Oct 2026.

**26. Freeze each release on its own branch, after every parallel agent's changes are merged.** Why: "DID YOU CHECK IN ALL THE CODEX CHANGES AS WELL?" Comma, Nov 2026.

**27. Optional backend features stay off in production until verified on a real device.** One unverified probe crashed launch. Comma, Nov 2026.

**28. Store builds carry no debug tools, test menus or fixture data;** scan the archive before upload. Pip, Nov 2026.

**29. A distributed app never depends on the developer's folders or tools;** test a fresh install. CutRoom, Nov 2026.

## Working on the code

**30. One simulator, tests run one after another.** Why: "PLEASE ONLY USE 1 simulator"; parallel builds ran the disk out. Comma, Nov 2026.

**31. Don't let several agents edit one tree at once without lanes; keep to two or three.** Why: a tree stopped compiling because lanes were mid-edit. Pip, Nov 2026; Flamely, Oct 2026.

**32. Code from a delegated model is reviewed and tested before it's applied;** a thinking-only answer is not delivered code. Comma, Nov 2026.

**33. An "insert or ignore" that later code depends on must only be ignorable because the row already exists.** Flamely's desktop created a new account's profile with `INSERT OR IGNORE`; the table had `UNIQUE(email)`, and an older profile on the computer held the email (the account had been deleted and made again), so nothing was inserted and the next statement failed its foreign key. The app showed only "Could not activate local data for this account" on Windows, and it worked on the Mac, which never had the old profile. Same code, different leftover data: check what's on the failing machine. Flamely B-220, Nov 2026.

**34. A catch-all error message hides the cause; keep the real reason where you can read it.** The sign-in failure above was diagnosed from the code, because the app logged the cause only in test builds. Flamely, Nov 2026.

**35. A test for a fix must fail without the fix; check it once.** The first test for the bug above passed without the fix, because reading a missing row returned "null" just like the expected empty email. Flamely, Nov 2026.
