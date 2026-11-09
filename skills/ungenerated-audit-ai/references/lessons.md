# What we learned, and why

Lessons from building AI into Comma (an iOS app that helps people write short video scripts), CutRoom (a Mac video editor with an AI agent inside), Flamely and Pip, Oct–Nov 2026. Comma used the smallest Claude model for every job; that is an example of "the cheapest model that does it well", not a rule about a model.

## Cost and limits

**1. Cap what one person can cost, with a hard money ceiling on the server.** Why: "WE CAN'T LET 1 USER COST US [that much] a month ... where we using AI". Comma, Nov 2026.

**2. Cost-test every AI job on light, typical and heavy inputs before trusting a number.** Why: "those 50 cents are just 1 or 2 days testing so basically we need better testing"; "make test users like a fitness creator with his story ... I want to know how much it costs ... and the quality". Comma, Nov 2026.

**3. A cost measured on another model is not evidence.** An early high estimate came from a bigger model than the one that shipped. Comma, Nov 2026.

**4. Use the cheapest model that does the job well, and invest in prompts and guidance rather than a bigger model.** Why: "please use haiku only ever no opus at all" (Comma); "SONNET WITH GOOD BACKUP PROMPTS AND SKILL IS ALL WE NEED" (CutRoom). Comma, Nov 2026; CutRoom, Nov 2026.

**5. Don't add costly tools (live web search) the price can't carry.** Hand the person a brief they can take to their own assistant instead. Why: "we do not want to do web search ... we are not charging people enough for that"; "We are not an LLM tool". Comma, Nov 2026.

**6. Plan for abuse before launch: count credits per person and decide limits.** Why: "how much they abuse AI that is on them and we have to understand the token credits". Flamely, Oct 2026.

**7. A trial gets a smaller AI allowance.** Why: "no free week only 2 days free with very limited ai". Comma, Nov 2026.

**8. Cut cost with caching, a short stored summary per person, and attachments converted to text once.** Why: "caching the context of the users and making summary points"; "it should convert it into MD file". Comma, Nov 2026.

**9. When the output is the same for everyone, generate it once at build time** on the cheapest good model instead of calling it live. Pip, Oct 2026.

**10. Where the person's own assistant can do the heavy work (through MCP), let it, and just store the result.** Why: "that could potentially also save us a token". Comma, Nov 2026.

## Limits people can see

**11. Make limits visible before and after use:** a count by the action, a toast when one is used, a used-up screen, an offline message, and exempt the owner's account. Why: "it's supposed to be very clear that there is a limit ... per week"; "MAKE SURE TOASTS AND ERRORS FOR NO INTERNET AND EXHAUSTED SCREEN"; "clear my limit ... I'm the owner". Comma, Nov 2026.

**12. The usage screen reads the server's own gate, so it can't disagree with what's enforced; show fair use as a share, never in dollars.** Why: "SHOW EXACTLY WHAT IS LEFT". Comma, Nov 2026.

**13. Limit-stopped requests are listed in the history too.** Otherwise a refusal looks like a lost request. Comma, Nov 2026.

## Never on junk, never twice

**14. No AI call on too little input: a minimum of real words in the app, and the server refuses too.** Why: "if I just pick H or gibberish, it's still calling the AI, which is obviously wasting credits". Comma, Nov 2026.

**15. Navigation and resuming never re-run AI; re-running is a button that says it uses credit.** Why: "it starts loading again"; "there should be a button like reprocess the idea". Comma, Nov 2026.

**16. Keep every version the person paid for.** Why: "IF WE WASTED CREDITS ON THAT YES IT WOULD BE BETTER TO KEEP IT". Comma, Nov 2026.

**17. No AI button on an empty document;** offer it once there are words. Why: "it doesn't even know what topic that I want to write in". Comma, Nov 2026.

## Consent

**18. Consent before any text leaves the device, in the app's own sheet that says what goes where.** Swiping it away is no; the answer is saved at the tap (a delayed save lost it when the app closed); revoking keeps the app usable by hand. Comma, Nov 2026.

**19. On iOS, a sheet inside a sheet can't show the root's sheet;** present the consent sheet from both places, or the AI action silently does nothing. Comma, Nov 2026.

## Quality

**20. Bad output is usually bad input: send the whole source, not a slice.** Why: bad scripts came from sending 6 of 16 parts and a prompt that kept the reference's subject, not from the model. Comma, Oct 2026.

**21. Never write blind: every call gets the full context, and context given once is never asked for again.** Why: "it doesn't take context it doesn't take anything"; "I already gave it a context and when I was borrowing the shape it was again asking me". Comma, Nov 2026.

**22. When the input is thin, ask a few plain, non-technical questions that expand the idea**, never re-asking what was said. Why: "I know I didn't give it enough context, so it just started to hallucinate"; "It should let me expand on the ideas instead". Comma, Oct–Nov 2026.

**23. The person's new context outranks old drafts in the prompt.** Why: "If I give it a context, then it's supposed to follow that". Comma, Nov 2026.

**24. Adapting a template transfers the concept and keeps the structure, and swaps the subject completely.** Why: "how does this even relate to software engineering? We have to convert that into something similar"; "the scripts aren't good it needs 1:1". Comma, Oct 2026.

**25. Let the person set how closely to follow a reference** (a closeness control), never one fixed level. Comma, Nov 2026.

**26. Measure fidelity with an eval that counts (line-for-line structure), not by eye.** Comma, Oct 2026.

**27. Output comes back whole; a partial result is fixed at the source, never shown as done.** Why: "neither the AI give the full script". Comma, Nov 2026.

**28. Several takes must be different kinds, chosen first.** Why: "three different drafts, like story, opinion ... Not three drafts in the same". Comma, Nov 2026.

**29. Show one result once;** never a first answer that gets replaced. Why: "it was showing me different research, and then after that, it kind of changes that". Comma, Nov 2026.

**30. AI never invents a fact.** Every claim needs a source the person gave; with none, it says nothing. CutRoom, Nov 2026.

**31. Suggested ideas are specific and researchable, not generic.** Why: "it's gonna talk about the science of lifting weight in a very specific topic". Comma, Nov 2026.

## The person stays in charge

**32. AI proposes; the person approves.** Changes are shown, previewed and approved, all at once or one by one; anything removed can be brought back. Why: "it's cutting automatically. It's not even asking me"; "I STILL CAN'T BRING BACK WHAT YOU CUT". CutRoom, Oct 2026.

**33. When a run produces nothing, say so in one sentence with the reason and one next step.** A vague "try again" loop is a launch blocker. Why: "it said it doesn't work. Try again. I tried again. It doesn't work". Comma, Nov 2026; CutRoom, Nov 2026.

**34. Ask at most one question, then act on the best guess and name it.** CutRoom, Oct–Nov 2026.

## Surfaces and setup

**35. A demo before sign-in calls the real model; never hard-code its output.** Why: "you need to ask the real Haiku model ... it just literally put those lines like hard-coded them". Comma, Oct 2026.

**36. Don't rely on an on-device model for a demo; many phones lack it.** Use a server model capped per device. Comma, Oct 2026.

**37. Design boards and test tools call the same prompts and model as the app.** Why: "I WANNA ACTUAL USABLE APP SO I CAN GIVE YOU GOOD FEEDBACK". Comma, Oct 2026.

**38. Keep every prompt in one file.** Review and parity across surfaces get easy. Comma, Oct 2026.

**39. Ship the AI's guidance (rules, examples) inside the app, not in the developer's folder.** Why: "IT SHOULDN'T BE DEPENDING ON SOME FOLDER, CUTROOM APP IS DISTRIBUTIVE APP". CutRoom, Nov 2026.

**40. An agent with web access reads only inside its own folders.** A fetched page can tell it to send a secret out. CutRoom, Nov 2026.

**41. When a conversation restarts, carry a summary of what was decided into the new one.** CutRoom, Nov 2026.
