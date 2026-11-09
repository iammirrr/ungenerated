# Measuring cost, setting ceilings, and the eval set

A couple of days of the owner's own usage is not a cost test. Measure every AI job on realistic inputs, light to heavy, on the model that will ship, then set the limits from the numbers.

## 1. Build test personas

Make 3–6 personas that look like the app's real users, each with real-shaped inputs, never real users' data. For a writing app: a fitness creator with a long personal story, a founder with a short note, someone who pastes a 10-page PDF. For each AI job pick three inputs:

- **Light:** the smallest input the app accepts (just above the minimum).
- **Typical:** what most people will send.
- **Heavy:** the biggest the app allows (the max attachment, the longest history, every option on).

## 2. Run and read the real counts

Call your own server endpoint (so the real prompt, context building and caching run), with a test account, and read the usage the provider returns, not a token estimate:

- Anthropic: `usage.input_tokens`, `usage.output_tokens`, `usage.cache_creation_input_tokens`, `usage.cache_read_input_tokens`.
- OpenAI: `usage.prompt_tokens` / `input_tokens`, `usage.completion_tokens` / `output_tokens`, cached tokens in the details.
- Gemini: `usageMetadata.promptTokenCount`, `candidatesTokenCount`, `cachedContentTokenCount`.

Price each from the provider's current price page (write the date). Run each input 3 times; output length varies.

| Job | Model | Input | In tokens | Out tokens | Cached | Cost | Seconds |
|---|---|---|---|---|---|---|---|

## 3. From cost per action to cost per person

- **Typical month:** what a typical person does in a month (from analytics if the app is live; from the owner's honest guess if not), times the typical cost per action.
- **Worst allowed month:** every per-person limit hit, on heavy inputs. This is the number the ceiling protects.
- **Margin:** plan price, minus the store's cut (15% small-business rate or 30%; check the current rates), minus the worst allowed month, minus other per-person running costs. If it is negative, the limits are wrong, not the maths.
- **Trial:** worst allowed trial cost, times the share of trials that don't convert.
- **Anonymous demo:** cost per demo call, times the per-device cap, times expected installs.

Set the per-person money ceiling a little above the worst allowed month on typical-to-heavy inputs, so the counts stop people before the money ceiling does; the money ceiling is the backstop for bugs and abuse.

## 4. Prove the ceiling live

As a test user on the real server: run the action until it is refused. Record the request that was refused, the server's response, the usage row, and what the app shows. Then run two calls at the same moment at the limit and show only one passes. Then try with a forged plan field in the request and show the server ignores it.

## 5. The eval set

- **Inputs:** 10–30 per AI job, from the personas and the owner's own real examples (with their yes), covering thin, typical and messy inputs. Store them in the repo (for example `evals/<job>/*.json`).
- **Scores a machine can count**, chosen from what the job promises: every expected part present (every beat has a line); structure kept (line count and order match the reference); the reference's subject is gone and the person's subject is there; no names, numbers or facts that aren't in the input; length within bounds; valid JSON for the schema.
- **Run** on every prompt or model change, side by side with the last run, and write the scores and the cost into the report. A model change that saves money but drops a score is the owner's call, with the numbers in front of them.
- Judge by eye only after the counts pass: read 3 outputs per job yourself, and show the owner one.

## 6. Keep the numbers true

Re-run steps 2–4 when the model, the prompt, the context building or the provider's prices change. A cost figure measured on a different model is not evidence (an old estimate came out many times too high because it was measured on a bigger model).
