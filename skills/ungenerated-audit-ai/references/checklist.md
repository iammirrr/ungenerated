# AI audit checklist

Every numbered item gets a verdict: ❌ confirmed, ⚠️ suspected, ✅ safe, N/A. Proof is a file:line, a request and its response, a database row or a log line. ★ = commonly missed. Provider facts (model ids, prices, caching rules, rate limits) change: check the provider's current docs and pricing page and write the date you checked.

## 1. The call map (fill one row per call before judging anything)

| Call | Trigger (screen › action) | Who can trigger | Runs where | Model id | Prompt file:line | Sent | Returned / stored | Max tokens · timeout · retries | Guarded by |
|---|---|---|---|---|---|---|---|---|---|

Find them all:
```bash
grep -rnE "anthropic|openai|generativelanguage|messages\.create|chat\.completions|/v1/messages|responses\.create|FoundationModels|LanguageModelSession|mlc|llama" --include=*.{ts,js,mjs,swift,kt,py,dart,rs} .
```
Also list deployed server functions (Supabase `functions list`, Vercel, Cloudflare Workers) and compare with the repo. A demo or "try it" in onboarding is a call too, usually reachable before sign-in.

1. ★ Every call is in the map, including demos, background jobs, retries and build-time batches.
2. Nothing deployed calls a model that isn't in the repo.
3. Every prompt lives in one file (or one folder) shared by every surface that calls it: app, web, design board, test tools.

## 2. Cost and ceilings

4. Cost per action is measured from real token counts on light, typical and heavy inputs (see `cost-and-evals.md`), and written down with the date and model.
5. ★ A hard per-person money ceiling (per day and per month, or per week) is enforced on the server, in the same transaction that records usage, so two parallel calls can't both pass.
6. Per-action counts (scripts, edits, messages) are enforced on the server, per plan, with the plan read from the server's entitlement, not from the client.
7. A global daily ceiling for the whole app exists, so a bug or attack can't spend the month in an hour.
8. Calls per minute per person are limited (bursts and scripts).
9. ★ Anonymous or pre-sign-in calls (onboarding demos) are capped per device or install and per IP, and the cap survives reinstall where it can.
10. Trials get a smaller AI allowance than paid plans, so a trial can't be farmed.
11. The owner's or staff accounts are exempt by an explicit server-side list, not by a client flag.
12. Usage is counted on success only, or refunded on failure, as the owner decided; a failed call never silently burns credit.
13. The worst allowed person's month (every limit hit) costs less than the plan's price after the store's cut. Show the maths.
14. Cost levers are used where they apply: prompt caching for repeated context, a short stored summary instead of the full history, attachments converted to text once, output length capped.
15. ★ Navigation, resume, reload and re-opening a screen never re-run a call; re-running is an explicit action that says it uses credit.
16. Results the person paid for are kept (every version), so nobody pays twice to get back what they had.

## 3. What the person sees about usage

17. ★ The usage screen reads the server's own gate (the same function or table that enforces it), so the screen can't disagree with what is enforced.
18. The count shows before use (next to the AI action) and changes after use; the reset time is shown in the person's own time zone.
19. A used-up state has its own screen or sheet that says when it refills and what they can still do by hand.
20. A refused call (limit, too little input, offline, provider down) never looks like a bug; each has its own plain message.
21. Requests a limit stopped appear in the history too.
22. Fair use is shown as a share or a count, never in dollars.

## 4. Consent and disclosure

23. ★ No user text leaves the device before the person tapped Allow (prove with a network or server log on a fresh install).
24. Consent is the app's own sheet (or screen), says what is sent, to whom, whether it is used for training, and what stays on the device.
25. Dismissing the sheet means no; the answer is saved at the tap, not after a delay.
26. The sheet can show from every place an AI action starts (on iOS a sheet inside a sheet can't present the root's sheet: present it from both).
27. Revoking in settings stops all calls at once and leaves every manual feature working.
28. The privacy policy and store labels name the AI provider and the data sent (owned by `ungenerated-audit-privacy`; check them here for truth). Apple's guidelines ask for clear disclosure and explicit permission before personal data goes to a third-party AI (5.1.2(i) at the time of writing; re-verify).
29. AI output is labelled as AI where the person could mistake it for their own or a human's words.

## 5. Data in and out

30. ★ No prompt, output or user text in analytics events, crash reports, breadcrumbs or server logs. Log ids, sizes, model, tokens, cost, outcome.
31. Only what the job needs is sent (no whole account, no other people's data, no secrets from the device).
32. Provider settings checked: data retention, zero-data-retention or no-training terms where promised, region.
33. ★ No AI call on too little input: a minimum of real words (not characters; gibberish and one letter fail) checked in the app and refused on the server.

## 6. Prompt injection and output handling

34. ★ User content, attachments and fetched pages are passed as data (clearly delimited), never concatenated into the system instructions.
35. Tools or functions the model can call are scoped to the person's own data and confirm destructive actions.
36. An agent with web or file access can only read inside its own folders; a fetched page can't make it read a secret and send it out.
37. Output is validated against a schema before use; malformed output is retried once or reported, never half-applied.
38. Output is never executed as code, SQL, shell or a URL to fetch without a check; rendered Markdown/HTML is sanitised.
39. The model never invents a fact presented as real: claims need a source the person gave, and with none it says nothing.

## 7. Failures, offline and completeness

40. ★ A timeout, a provider error, going offline or the app closing mid-call loses none of the person's words: input is saved before the call, and the call can be retried.
41. ★ Output comes back whole: every part the prompt promised (every beat, every field) is present, checked in code; a partial result is a failure, not shown as done.
42. One result is shown once; nothing appears and then gets replaced by a different answer.
43. Timeouts are set and shorter than the platform's request limit; retries are bounded and idempotent (a retry doesn't charge twice).
44. Offline is detected before the call and shown as offline, not as an AI error.

## 8. Model, keys and abuse

45. ★ The model id is pinned in one place and matches the owner's choice; every surface (app, server, test tools, evals) uses the same one. Aliases that move to a new model silently are a finding.
46. No provider key in the client bundle, binary, repo history or CI logs (`ungenerated-audit-security` runs the scanners).
47. The server authenticates every AI request (verified JWT, not decoded) and ties it to a person.
48. Replay: a captured request can't be re-sent to spend credit (auth required, nonce or idempotency key for paid actions).
49. A spend alert exists at the provider (and a hard monthly limit if the provider offers one).

## 9. Quality

50. An eval set of 10–30 real-shaped inputs per AI job is in the repo and re-runs after any prompt or model change (see `cost-and-evals.md`).
51. The whole source is sent, not a sample (a "6 of 16 parts" prompt gives bad output that looks like a model problem).
52. Context the person gave once (onboarding answers, the idea, earlier notes) reaches every later call; the app never asks for it again.
53. The person's newest context outranks older drafts in the prompt.
54. When input is thin, the app asks a few plain questions instead of letting the model guess.
55. Several takes are different kinds (chosen first), not three of the same.
56. A demo shown before sign-in calls the real model; no hard-coded output dressed up as AI.

Coverage line for the report: "AI: 56 of 56 checked, N calls mapped, cost measured on M inputs, eval set K inputs".
