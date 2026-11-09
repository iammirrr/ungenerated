# AI writing

Patterns for any app where people write with AI's help (scripts, posts, notes, emails). The person
is the author; the AI helps them say what they already mean. The prompts, models and costs behind
these screens are checked by `ungenerated-audit-ai`.

## Rules

- **The person is the author.** Their words lead; the AI fills only what they ask for. Everything
  it writes is editable in place, tap a line and type. The app is not a generator.
- **Never a blank page.** Creating starts from their own material: the thing's name, a brain dump
  (typed, spoken or attached, as many as they like, before and after the AI's questions), and a few
  questions. Then ask how to write it: myself, an AI first draft, or borrow a proven shape.
- **Enough input before any AI call.** A minimum of real words on the phone, and the server refuses
  below it too. Gibberish never spends a credit.
- **Questions expand the idea.** Four or five plain, non-technical questions about this idea (the
  story, the proof, the moment, who it's for), each with its own answer box. An answer never
  carries into the next question.
- **Context given once is never asked again.** Everything said about the thing (dumps, answers,
  files) travels with it into every later AI step, and is one tap away, readable and copyable.
- **The AI never writes blind.** Every call gets the whole context: the idea, the plan, the work so
  far. No AI button on an empty document; a refine button appears once there are words. Every AI
  button opens a small prompt with what and where already filled in, and an empty Enter runs the
  default.
- **New context outranks old drafts.** What they just told it wins over what it wrote before.
- **Drafts come back whole.** Every section or beat gets its line. A partial draft is a failure to
  fix at the source, never shown as done.
- **Several takes are different kinds,** chosen first (a story, an opinion, a how-to), not three
  versions of one.
- **Stages along the top.** In a multi-step sheet every stage is a tappable icon with a word.
  Going back to change an answer never re-runs the AI; re-running is a button that says it uses a
  credit.
- **Nothing they typed is lost.** Closing or cancelling keeps what was typed; a draft reopens where
  it was left; a failure or no connection keeps every word and says so in one calm line.
- **Dictation never loses words.** A pause, a restart of the recogniser or another tap on the mic
  only ever adds. Never replace the box with the latest transcript.
- **Every version is kept.** Each AI rewrite becomes a version they can name and go back to, and
  the original stays readable ("Show original").
- **Paste from anywhere.** Text written in another tool is split into the app's structure, keeping
  their words.
- **Adapting a reference swaps the subject completely** and keeps its structure; let them set how
  closely to follow it (a closeness slider).
- **Show the AI working on the thing it's changing,** in place (its motion is in
  `ungenerated-motion`), and show one result once, never a first answer that gets replaced.

## Where it lives

- The create sheet (name → tell it about this → questions → how to write it).
- The editor (refine, write another way, versions, show original).
- Every text box with a mic.

## Events

- `write_started` {from: blank_name | brain_dump | paste | reference}
- `ai_action` {action, result: done | failed | limited | offline}
- `version_restored`
- `dictation_used`

Counts and choices only. Never the person's words.

## Mistakes

- Dictation wiped everything written before a pause: "THERE is MAJOR BUG ... WHEN I TAKE PAUSE ...
  IT REMOVE ALL OF THE PREVIOUS TEXT". Shipped in a build, fixed in the next.
- Borrowing a shape asked for the idea's context again: "I already gave it a context."
- "Ask the AI to write in my voice" sent no context: "it doesn't take context, it doesn't take
  anything."
- Drafts came back with beats left empty: "neither the AI give the full script."
- One answer was copied into the next question automatically.
- A research list appeared, then changed under the reader.
- Reopening a draft started the brain dump again, and cancelling lost it.
