# What we learned, and why

The motion rules in this skill came from real rounds with one owner. Each lesson: the rule, the reason
(his words where he said it), and where it came from. Comma (a script-writing app), Flamely (a focus
tracker, phone and desktop) and CutRoom (a video editor) are the apps; their exact looks and characters
are examples only.

## What moves at all

- **App screens don't animate in; only achievements, popups and moments of change move.** "If it's not
  an achievement or it's not a pop-up, I do not want it to be animated ... this is an app and I want to
  experience it that way." The onboarding, by contrast, should visibly move. (Comma, Oct 2026)
- **Every animated element adds meaning; never one to fill space.** "Make sure it's clearly adding
  value." (CutRoom, Oct 2026)
- **Make every effect slightly less than your first instinct.** "Make the shake of the icons slightly
  less"; attention belongs on the words, not the effects. (Comma, Oct 2026)
- **One idea per move.** Landing proof and structure in the same motion cost coherence. (Comma, Oct 2026)
- **If text entrances are wanted, one soft blur-in from one shared helper, the same everywhere, and it
  never shifts layout.** "All the text across the app should have that nice animation, the blurred
  one." The first helper's side padding shipped every centred title 8 pt off centre. Ordinary app
  screens still don't move in as a whole. (Comma, Oct–Nov 2026)

## Continuity

- **One hero travels and each scene grows out of the last.** His favourite moment was a phone turning
  into a laptop: "it's seamless. I love it"; "it needs to be seamless, it doesn't need to be a
  transition". (Flamely, Oct 2026)
- **Camera moves are one continuous animation, with no stop between a zoom and a follow and never an
  empty frame between beats.** "It's not smooth, the zoom in on the first frame." (Comma, Oct 2026)
- **Nothing is cut off by the frame by accident.** "It zooms to the point that the Mac cuts out." A
  half-phone crop on purpose was liked. (Flamely, Oct 2026)
- **Let colour carry the story.** A scene that starts grey and gains colour when the hero comes alive
  was loved. (Flamely, Oct 2026)
- **After recording, the camera view settles into the player in one move, no cut.** (Comma, Oct 2026)
- **Keep the frame still and move only the content.** "What reads as polished is a frame that never
  moves"; the owner approved that direction from research into his desktop app. (Flamely, Oct 2026)

## Feel

- **The jelly press: quick in, springy out.** In to about 0.93 and 1.5 pt down in 80 ms, out on a loose
  spring (SwiftUI `.spring(response: 0.42, dampingFraction: 0.4)`). "Buttons are flat" became "I really
  like the feel of the buttons now"; "iOS defaults don't feel good, a little bubble makes it ours".
  (Comma, Oct 2026)
- **Press and selection are fluid, never rigid, clicky or "chittery"; an icon never swaps while
  pressed.** "The feel of clicking everything matters to me." (Flamely, Oct 2026)
- **Bubbly, never childish.** "Bubbly is a modern, catchy, good feel; childish is too much of it."
  (Comma, Oct 2026)
- **Things glide in; they never pop, jerk or twitch.** "The popping out of the stuff in the plan
  doesn't look good, it's just jerking out." (Flamely, Oct 2026)
- **Haptics fire on the peak and by meaning.** A selection tick on a step, success on completion, never
  on everything. (Comma, Flamely, Oct 2026)

## Nothing buzzes

- **No element bounces back and forth or gets bumped repeatedly; when several things land on one
  target, it settles once. Measure frame by frame.** "Screen kinda jittery"; "certain jerks and
  jittering". (Comma, Oct–Nov 2026)
- **Zero layout jitter: nothing resizes or re-flows while something animates or is dragged; test at the
  smallest size.** "It still jitters at a small size"; header text jittered while a slider moved.
  (Flamely, Oct 2026)
- **Offset the phases of looping illustrations so a grid never pulses in unison;** animate only the
  picked ones in a busy grid. (Comma, Oct 2026)
- **Anything that animates on a tap survives taps faster than its animation.** "If I click every week
  and move promptly, it breaks; it shows grey stuff." Set targets declaratively; one cancellable
  animation per element. (Comma, Oct 2026)

## State changes

- **Nothing flat flips; a change of state is a swap.** A drawn character or badge flipping shows it is
  a cut-out: "remove the flipping of the 2D graphic completely". (Comma, Oct 2026)
- **No slide-and-blur swap on changing numbers or labels;** while a control moves they crossfade in
  place. "I generally do not like the text swapping animations." (Comma, Oct 2026)
- **Animate numbers by their meaning: money rolls like a slot machine, time flows.** "For the money I
  wanted a slot machine ... that looks lovely." (Flamely, Oct 2026)
- **When a limited resource is spent, show it moving:** a spark flies from the action to the counter,
  which rolls down, plus a short toast. He picked that from three options side by side. (Comma, Nov 2026)
- **The AI working has one signature:** a thin light running exactly on the edge of the card it is
  reading, the original visible first, then the new words written in. No glow, no spinner, no dark
  trail, no second card behind; every card it reads gets the effect. "I like it, I want that in the
  app." (Comma, Nov 2026)

## Gestures

- **A control owns every drag that starts on it; the page never moves with it.** "I've reported this
  bug eighteen times now." Never pick the gesture by direction: a real finger's first points are noisy.
  (Comma, Oct–Nov 2026)
- **A flick glides straight onto a step, capped, without overshooting and coming back.** "When I slide
  really fast, the 56 kind of shoops in and then moves out." (Comma, Oct–Nov 2026)
- **Drags follow the finger 1:1 and values change smoothly.** "The daily goal and the time is not
  smoothly changing at all." (Flamely, Oct 2026)
- **Reorder by holding the item: it lifts, the others flow around it; no grip handles.** "When I click,
  it just smoothly comes out and I can move it around"; "I do not like the three dots or three bars".
  (Comma, Nov 2026)
- **A tap hurries an animation and never skips it.** "It should bring the animation to the end, but not
  skip it"; Continue appears at once, a second tap moves on. (Comma, Oct 2026)

## Pacing

- **The opening plays itself, with at most one meaningful tap and one final call to action.** After
  every beat was made to need a tap: "That sequence is supposed to play itself." (Flamely, Oct 2026)
- **Keep the opening short (about 20 s), but hold each hard idea long enough to read.** "30 seconds is
  too much"; "this section is so quick I can't comprehend it"; "add about one second to each of these
  frames". (Flamely, Comma, Oct 2026)
- **Explainers are motion that plays through;** Continue comes when the idea has played. (Comma, Oct 2026)
- **No progress or story bars on hook and story screens.** "Remove this." (Flamely, Oct 2026)
- **On a paywall, the motion happens on the way in;** once landed it is nearly still, apart from a
  subtle living background. (Flamely, Oct 2026)
- **Motion graphics over video cut in and out sharply; only the motion inside them is smooth.** "Fade-in
  effects suck ... sharp jumps, and motion within them should be smooth." This is for overlays on video,
  not for app UI. (CutRoom, Oct 2026)

## The character

- **One character on a screen; it visits and is never parked or circled.** "We do not want a lot of
  characters here and there"; "I don't really like the circle around this character". (Comma, Oct 2026)
- **It is always alive and has no glow.** "The character isn't animating in the app"; "I hate the glowy
  character". (Comma, Oct–Nov 2026)
- **It reacts to real moments, not to every tap.** A tick and a jump on sign-in; "if the mascot moves on
  every tap it kills its sacred moments". (Comma, Oct–Nov 2026)
- **Big enough to read, with moods and roaming eyes; no soft blush.** He asked for about 45% bigger
  across the board. (Comma, Oct 2026)
- **The identity mark is used whole, with nothing glowing behind it.** (Flamely, Oct 2026)

## Reduce Motion and shipping

- **Reduce Motion removes big jumps only; small in-place loops still play, and nothing freezes
  half-way.** The owner's own phone had it on, and the character froze in a build. (Comma, Oct 2026;
  Flamely, Oct 2026)
- **Every animation approved on the board ships in the app; check them side by side.** "I'm still not
  able to see the animations that we made on the browser in the app." (Comma, Oct–Nov 2026)
- **For ambient motion natively, drive one timeline at a modest rate** and animate values, not state on
  every frame; it kept a 120 Hz phone cool. (Flamely, Oct 2026)
- **Hand the hero from one section to the next.** When one section takes a single item apart and the next shows the
  collection, open the collection on that same item alone, then let the rest arrive around it ring by ring as you scroll
  (pinned, the count climbing), ending at a generous size. An endless auto-scrolling loop of tiles reads as filler.
  "Every reel has a shape ... should be really nicely translating to that library that grows ... it's just moving like
  vertically ... an endless loop." (Comma, Nov 2026)
