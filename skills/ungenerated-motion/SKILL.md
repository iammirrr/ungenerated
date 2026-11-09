---
name: ungenerated-motion
description: Screen motion design for mobile apps, built from motion that shipped in real apps. Pick a motion style with the owner side by side, set curves and springs by overshoot, plan one hero that travels between screens, give every control a physical feel with haptics by meaning (the jelly press: quick in, springy out), keep it bubbly but never buzzing, make gestures a control owns, bring a mascot or character to life if the app has one, handle Reduce Motion, and port it all to SwiftUI and Compose. Use when someone says "make it feel alive", "animations feel cheap", "it's jerky", "it jitters", "smoother transitions", "bouncy like Duolingo", "the slider glitches", "the drag moves the page", "add a mascot", "the character should do something", "pick a motion style", "haptics", or "the animation isn't in the app".
---

# Motion: how the screens move

How an app moves, chosen with the owner, tuned until it feels physical and calm, and carried into the native app unchanged.

## Steps

1. **Pick a motion style with the owner, side by side.**
   Show the seven styles (calm, snappy, bubbly, precise, fluid, cinematic, organic) as the same few parts moving seven ways, no screen around them. They pick by feel; write it down as a rule. Read `references/motion-styles.md`, tokens in `references/motion-styles-styles.md`.
2. **Set the curves and springs.**
   A handful of named curves, springs only for what the finger touched or earned, tuned by overshoot first, speed second. Read `references/motion-system.md` and the overshoot table in `references/bubbly-motion.md`.
3. **Decide what moves at all.**
   App screens appear still. Motion is for the opening and story, achievements, popups and sheets, the AI working, and a change the person caused. Every move must add meaning.
4. **Plan one hero that travels.**
   Fill the thread sheet: for each change of screen, the one thing passed between them. One camera, one ground, one direction. Read `references/continuity.md` and `references/continuity-thread-sheet.md`.
5. **Give every control its feel and its haptic.**
   The jelly press (quick in, springy out), picks that bloom from the finger, toggles, rulers, sheets; haptics fired on the peak and mapped to meaning. Read `references/interaction-feel.md`.
6. **Keep it bubbly, never buzzing.**
   One lively moment per screen, volume kept when squashed, one overshoot then still. Nothing shakes, bounces back and forth or jitters the layout. Read `references/bubbly-motion.md`, recipes in `references/bubbly-motion-recipes.md`.
7. **Make the gestures.**
   A control owns every drag that starts on it; flicks are capped; reorder by holding the item; a tap speeds an animation up and never skips it. Read `references/gestures.md`.
8. **Bring the character in, if the app has one.**
   One on a screen; it comes, speaks, acts and goes; always alive; reacts to real moments only. Read `references/character.md`.
9. **Handle Reduce Motion.**
   Remove travel, zoom and big jumps; keep fades, small in-place loops and haptics. Never a frozen half-state. Test with it on, because real owners have it on.
10. **Port it, then prove it shipped.**
    The style is a token set: port it once to SwiftUI or Compose (the twins are in each reference). Put the board and the app side by side in the simulator; every animation approved on the board must be in the app. For the port itself, `ungenerated-flows` › board-to-app (references/board-to-app.md).
11. **Check it frame by frame.**
    Full speed, then a quarter speed, and captured mid-motion frames. Count oscillations, look for pops, jitter and empty frames. `ungenerated-review` › visual-qa (references/visual-qa.md).

## Never

- Never animate ordinary app screens in. "If it's not an achievement or a pop-up, I do not want it animated." The onboarding and story do move.
- Never let a tap skip what is playing. It speeds it up, Continue appears at once, a second tap moves on.
- Never let anything buzz: no element bouncing back and forth, no repeated bumps, no layout that shifts while something moves.
- Never flip or mirror a flat drawing. It shows it is a cut-out; a change of state is a swap (old shrinks away, new pops in).
- Never let the page move with a control's drag, and never pick the gesture by direction. A real finger's first points are noisy.
- Never put springs on content: text, prices, cards and charts arrive on curves. Only touched or earned things spring.
- Never pop, jerk or twitch: opacity 0 to 1 in one frame, a jump between parents, two animations fighting one element.
- Never slide-and-blur a number or label that changes while a control moves. It crossfades or flows in place.
- Never add motion that carries no meaning, or two lively moments at once.
- Never park a character, put it in a circle or give it a glow or soft blush.
- Never leave an approved animation on the board only. If it isn't in the app, it didn't ship.
- Never use canned elastic or bounce curves. Real springs carry velocity when interrupted.

## Read when

| You are… | Read |
|---|---|
| choosing the app's motion personality | `references/motion-styles.md` |
| needing the exact tokens of a style, with SwiftUI and Compose | `references/motion-styles-styles.md` |
| setting curves, springs, durations, or fixing "it's jerky" | `references/motion-system.md` |
| connecting screens so one thing carries into the next | `references/continuity.md` |
| filling in the batons for a flow | `references/continuity-thread-sheet.md` |
| tuning how buttons, picks, toggles and sliders feel; haptics | `references/interaction-feel.md` |
| making it soft and alive without looking like a toy | `references/bubbly-motion.md` |
| needing the squish, pop, goo or rubber band in code | `references/bubbly-motion-recipes.md` |
| building drags, flicks, reordering, taps during animation | `references/gestures.md` |
| designing a mascot's visits, moods and reactions | `references/character.md` |
| wanting the reasons behind these rules | `references/lessons.md` |
| needing the board engine and live motion tiles | `../ungenerated-flows/template/js/kit.js`, `../ungenerated-flows/template/js/styles.js`, `../ungenerated-flows/template/js/transitions.js`, `../ungenerated-flows/template/js/screens/motion.js` |

## Works with

- `ungenerated-foundation`: the concept (what the person should feel) picks the style; the parts sheet gets its motion here.
- `ungenerated-flows`: the board runs this motion on every screen, and board-to-app carries it into SwiftUI.
- `ungenerated-review`: mid-motion screenshots, the drag and tap tests, Reduce Motion in the accessibility pass.
- `ungenerated-store`: the trailer uses the same continuity, as one calm continuous film.
