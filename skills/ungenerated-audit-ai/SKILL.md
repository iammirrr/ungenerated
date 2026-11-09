---
name: ungenerated-audit-ai
description: Audit every AI call in an app, in detail: map each call (model, prompt, what is sent, what comes back, who can trigger it), measure the cost per action on real inputs, prove a hard per-person ceiling is enforced on the server, check that usage screens read the same gate, that consent comes before any text leaves the device and revoking it keeps the app usable by hand, that nothing is logged that shouldn't be, prompt injection and output handling, failures and offline that lose no words, the pinned model, rate limits and abuse, no key in the client, and a small eval set on real inputs. Claude, OpenAI, Gemini or any provider; web, desktop, iOS and Android. Use for "audit the AI", "how much does AI cost per user", "can someone run up my AI bill", "check AI limits", "is our AI consent right", "AI cost test", "is the prompt injectable", or before launching an AI feature. Part of ungenerated; runs alone or through ungenerated-audit.
---

# AI audit: every model call capped, consented, honest and safe

For: proving that each AI call in the app costs what you think, can't be abused, asks first, never loses the person's words, and gives good output on real inputs. Not legal advice; the disclosure law sits with `ungenerated-audit-privacy`.

## Steps

1. **Learn the app.** Write the App profile (or take the runner's): platforms, backend, AI providers and SDKs, where calls are made from (client or server), the plans and their limits, the model the owner chose, the AGENTS.md / CLAUDE.md rules. Ask the owner only what the code can't answer: the model they want, the ceiling per person they can afford, the price of each plan.
2. **Map every call.** Grep for the provider SDKs and endpoints (`anthropic`, `openai`, `generativelanguage`, `messages.create`, `chat.completions`, `/v1/messages`, edge functions that proxy them, on-device models). One row per call: trigger (screen and button), who can trigger it (anonymous, free, paid, owner), model id, prompt file:line, what is sent (fields, attachments, history), what comes back and where it is stored, max tokens, timeout, retries, the limit that guards it. Anything deployed but not in the repo is a finding. Template in `references/checklist.md` §1.
3. **Measure cost per action.** Run each call on light, typical and heavy real inputs (test personas, never real users' data) and read token counts from the provider's response, not estimates. Work out cost per action, per typical person per month and per heaviest allowed person per month, and compare with the plan's price after the store's cut. Method in `references/cost-and-evals.md`.
4. **Audit the catalogue.** Every row of `references/checklist.md` gets a verdict: ❌ confirmed (file:line, a request and its response, a database row), ⚠️ suspected (what would settle it), ✅ safe (why, with proof), N/A (why). Prove the ceiling live: as a test user, run the action until the server refuses, and show the refusal and what the app shows. Prove consent live: no request leaves before Allow (network log or server log). Get one independent reviewer agent for the abuse and injection rows, given the files and the checklist, not your conclusions.
5. **Run the eval set.** 10–30 real-shaped inputs per AI job (from test personas and the owner's own examples), scored by a rule a machine can count (structure kept line for line, every beat filled, the subject swapped, no invented facts), not by eye. Save the set in the repo so every model or prompt change re-runs it. See `references/cost-and-evals.md`.
6. **Report and stop.** Result first, plain words. The call map, the cost table (per action, typical month, worst month, margin), coverage ("56 of 56 checked"), findings ranked by money at risk and words at risk, each with proof, then a **numbered fix list** (what it fixes, what it touches: prompt, server limit, client, provider setting, a published text). Change nothing until the owner answers with numbers, "all" or "none".
7. **Fix only what was approved.** Limits and checks go on the server; prompts stay in one file; re-run the cost test and the eval set after any prompt or model change, and the live proof that found each hole. Then a short final report: fixed, still open, what only the owner can do (provider dashboard spend limits, key rotation).

## Never

- Never trust a client-side limit. The server counts and refuses; the app only shows what the server says.
- Never send the person's text before they said yes, and never treat a dismissed consent sheet as yes.
- Never put a provider key in the app, the repo or a log. Calls go through your server.
- Never call a model on too little input; refuse on the server too, or junk taps burn credit.
- Never re-run AI on navigation, resume or reload; a re-run is a button that says it uses credit.
- Never show a partial or empty result as done; a broken AI feature says so in one sentence and offers one next step.
- Never let the model's output run as code, SQL, a URL to fetch or a tool action without a check.
- Never change the model away from the owner's pinned choice, and never trust a cost figure from a different model.
- Never log prompts or outputs with the person's words into analytics or crash reports.
- Never use real users' data for the cost test or the eval set without the owner's yes; build test personas.

## Read when

| You are… | Read |
|---|---|
| Mapping calls and auditing | `references/checklist.md` |
| Measuring cost, setting limits, building the eval set | `references/cost-and-evals.md` |
| Wanting the why behind each rule | `references/lessons.md` |

## Works with

- `ungenerated-audit` runs this with the other seven.
- `ungenerated-audit-security` owns keys, auth and rate limits in general; this audit goes deeper on AI abuse.
- `ungenerated-audit-privacy` owns what the policy and store labels must say about AI providers.
- `ungenerated-audit-analytics` checks AI events carry no user words.
- `ungenerated-audit-payments` checks the plan prices the margin maths uses.
- `ungenerated-flows` › consent-and-permissions (references/consent-and-permissions.md) builds the AI permission sheet and the usage screen.
