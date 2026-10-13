---
name: onboarding-questions
description: Design onboarding questions that are quick and varied - one question per screen, the answer is the button, a mix of formats (rows, tiles, app grids, calendars, dials, sliders, swipe decks), each answer reused later. Use when building a quiz, survey, personalisation or "tell us about you" flow, or when questions feel long, text-heavy or repetitive.
---

# Onboarding questions

## Rules

1. **One question per screen.** A heading of 3–7 words, an optional one-line hint.
2. **Single picks move on by themselves** 340 ms after the tap. Only multi-picks have Continue.
3. **Vary the format** so ten questions feel like five: rows, a 2×2 tile grid, an app grid with
   real icons, a calendar week, a dial, a slider, a swipe deck (yes/no, five cards at most).
4. **Every answer shows up again.** If nothing later uses an answer, cut the question.
5. **Ask for estimates as guesses.** "How long is 'just a minute'?" with plain options, not a
   slider that pretends to measure.
6. **Group long option lists by kind**, each with real icons: Social, Messages, Video, Meetings.
7. **No typing** unless the answer is a name. No login before value.
8. A thin progress bar at the top, a back chevron. Nothing else in the top bar.

## Format catalogue

| Format | Use for | Feel |
|---|---|---|
| Rows | 3–6 options with an icon each | bloom from the finger, check pops |
| Tile grid | 4 options with a strong picture | press 0.97, bloom |
| App grid | "what do you use" with real app icons | tap to pick, a check badge pops |
| Calendar week | work days and hours | each day a block for the hours; tap a day; drag the range |
| Dial | a duration (attention span, session length) | drag round the hero; stops at sensible values with a tick |
| Slider | a quantity with a live consequence | thumb glides; the consequence updates as you drag |
| Swipe deck | yes/no statements | card follows the finger; stamps on the side |
| Chips | several small tags | press 0.95 |

## Anti-patterns

- Twelve list screens in a row.
- A paragraph under every question.
- "Which of the following best describes your current workflow?" Write "How do you work?"
- Asking for information the app could detect.
