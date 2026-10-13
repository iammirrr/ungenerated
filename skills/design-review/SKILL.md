---
name: design-review
description: Run review passes with a reviewer - read Picks and Notes from the board, log every note with a number, fix in one pass, keep liked layouts whole, and turn repeated corrections into standing rules. Use when the reviewer sends feedback (text, voice transcript, screenshots), when notes pile up, or before starting a new pass.
---

# Design review

## Read the feedback

- Picks and Notes live in the board's store (`review/store.json` when served locally).
- Long spoken feedback: split it into one item per screen. Keep their words for the "what".
- When a note is ambiguous, pick the reading that changes the least, do it, and say which reading
  you took. Ask only when the answer changes what you would build.

## Log it

Keep a feedback log with one table per pass, newest first:

| # | Their note | What changed | Status |
|---|---|---|---|

Numbers continue across passes. Status is "Done (date)", "Waiting for them" or "Superseded by #n".

## Fix it

1. Plan the pass in a short list and say it back.
2. Fix exactly what was named. Keep the rest of a liked screen whole: same layout, same motion.
3. Verify each change with screenshots (`visual-qa`), including mid-motion frames.
4. Report per screen in a few words. Mention anything you could not do and why.

## Standing rules

When the reviewer corrects the same thing twice, write it down as a rule with the reason, in a
rules file the next session will read (for example "No segmented bar at the top of any screen";
"Devices are never cut off"; "Money rolls, time flows"). Check every new screen against the rules
before showing it. A broken standing rule costs more trust than any new idea earns.

## Trim, never strip

When the reviewer says a liked screen has "too much text" or "too much motion", or should be "more
subtle", remove the extras they named and keep everything that makes the screen work: its motion
graphics, its composition, its hero. A screen stripped bare looks worse than the busy one, and the
reviewer will say so. When they pick one variant ("I like the third one"), make it the screen and
retire the others.

## Anti-patterns

- Re-litigating a decision the reviewer already made.
- Splitting a screen they liked into two "to fix" it.
- Reporting work you have not looked at.
- Answering a note with a question you could have answered yourself.
