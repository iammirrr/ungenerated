<!-- Part of ungenerated-store. Was the `app-store-trailer` skill. -->
> **When:** Make an app's App Store preview trailer (and any short product film) as motion graphics in Remotion - one continuous movement where each part grows out of the last, the app's real UI and data as designed objects, the AI and the core features exaggerated, cut to a measured soundtrack, checked frame by frame at every hand-over, exported at Apple's exact spec. Use when asked for an App Store preview, app trailer, product video, launch film or "make the trailer better" for any app, in any repo. Not for screenshots (`references/screenshots.md`).

# App Store trailer

Learned over five cuts with a picky owner (Comma, 8 Nov 2026). Three were rejected outright, and the fourth opened on
what he called "the best starting". The method rests on [saas-product-demo-video](https://github.com/noamdorr/saas-product-demo-video)
(beats from the soundtrack, a Stage camera, one text move, stills before anyone watches, real motion blur). What this
skill adds is what the owner taught on top of it. Read `references/trailer-lessons.md` before the first frame: it has his words and
what each rejected cut did wrong.

## What a good one is

- **Motion graphics.** Designed objects that move and morph beautifully, built from the app's real UI and real data.
  It is **not** a walkthrough of the app in a phone. Nor is it the screenshots animated one after another: the owner,
  disappointed "to my core", said "THIS TRAILER IS LITERALLY THE SCREENSHOTS COMPILED".
- **One movement.** Every part grows out of the last part's object: the reel becomes its beats, the beats merge into
  the brain dump, the dump shrinks while the questions come, the chosen draft opens into the writer, and the page goes
  dark into the teleprompter. There are no hard cuts between unrelated pictures and no slide-deck rhythm.
- **One feature on screen at a time, big and calm.** Exaggerate the feature itself: make it huge, make the thing that
  changes the thing you see, and light it. Never pile decoration around it: no chips, stickers, scissors, flying pills,
  arrows or extra cards. The owner said "CLUTTERED WITH USELESS STUFF". Hold each feature long enough to read.
- **The AI is the star.** Show the moments a screenshot can't: talking into a brain dump, the app asking its
  questions, writing several drafts at once, rewriting a line. Wear the app's own AI light on those moments: a band
  running round the edge, each colour fading into itself and never into black.
- **The opening moves from its first frame.** Content the app is about (for Comma, real reels) glides on a tilted
  plane, rows running against each other, the far ones soft. One item lifts off, straightens and plays. Then comes the
  signature move: it splits into its parts (a reel into its beats). That was the opening the owner loved.
- **The headline type is the screenshots' type.** Use their face, their pill and their grounds. When the owner says so,
  that overrides the demo-video skill's no-highlighted-word rule. A headline that has left is gone: no sliver of its
  pill may stay under the mask.
- **Vary the real content.** Use different creators and items across the film; don't lean on one.
- **The app's character, if it has one, runs through the whole film** on one path above every scene: walking,
  flying, pointing, listening, clapping, cheering. It is never parked in a corner and never jumps on a cut.
- **AI moments: the light, then typing.** The same running light round the card every time, then the words type in.
- **Show the choice and both paths** when the app offers several ways to do its main job.
- **Only what the app does.** If the app can't edit video, the film never says "edit".
- **Smooth.** Every move eases in and out with no snapping, and nothing jumps on a cut. Momentum carries across.

## The flow

1. **Read the app**: its real screens, copy and sample data, and which features are AI. List the story in the
   owner's own order. Ask what he wants advertised that the screenshots don't cover.
2. **Music**: measure 10 to 13 licensed tracks (Mixkit's free licence allows commercial use without attribution) with
   the demo-video skill's `detect-beats.py`. Pick one rated `good` at 118 to 128 BPM, loud from the first bar, with a
   lift inside the film. Put the film's strongest moment on that lift. Nobody has heard the track until the owner does, so
   say so.
3. **Scaffold**: copy the demo-video skill's `assets/scaffold/` and its `Stage`/`Title` components, then
   `npm install`. Set the canvas to **886 × 1920** (Apple's App Preview size for 6.9"/6.5" iPhones). Copy this skill's
   `trailer/kit/frame.tsx` for the headline, grounds, cards, light and finger. Copy `trailer/kit/tile.py` for contact sheets.
4. **Checkpoint first**: build only the opening (about 10 s, up to the signature move), render it with the music, and
   send it. The owner judges the motion from that. A whole film built on an unapproved feel was the costly mistake
   here, made twice.
5. **The rest**, each part a scene in `timing.ts` ending on a backbeat. A part's first frames **draw the previous part's
   last frame and carry it** (fade it, fold it, morph it): the objects are shared components used by both parts (in Comma's film: the brain-dump card, the
   questions, the draft card and the writer page).
6. **Check every hand-over**: render the last frame of each part beside the first frame of the next
   (the scaffold's `tools/stills.mjs Master <end-1> <end> ...`, then this skill's `trailer/kit/tile.py`). Nothing may vanish, appear or jump. Then look at
   a contact sheet of the whole film. Fix, then look again.
7. **Final**: the ordinary master (it carries the audio), then real motion blur (the scaffold's `tools/mb/`), then the Apple encode
   (`node <skill>/trailer/scripts/encode.mjs`). Check frames **of the encoded file** before sending: a blur pass that silently
   failed once shipped the previous cut.
8. **Log every note** in the app's taste ledger first and fold the lesson into `references/trailer-lessons.md`.

## Apple's preview spec

886 × 1920 portrait (iPhone 6.9"/6.5"), 15 to 30 s (Comma's runs 29.0 s), 30 fps, H.264 High at level 4.0 or below,
about 11 Mbps, AAC stereo at 48 kHz with an audio track (silence if needed). `trailer/scripts/encode.mjs` writes exactly this and
prints the probe. One preview per locale. Apple wants previews to show the app, so judge how far motion graphics can go
from today's guidelines before submitting.

## Pitfalls that cost a render here

- Piping a long command through `tail` hides its failure from `set -e`. Use `set -o pipefail` and check the frame
  count before encoding.
- On macOS, `bash` scripts lose `DYLD_LIBRARY_PATH` (SIP), so a bundled ffmpeg (Remotion's) can't find its libraries
  inside `encode.sh`. Run ffmpeg from node (`trailer/scripts/encode.mjs`) or inline.
- The scaffold's blur blend (`tools/mb/blend.py`) needs numpy: set `PYTHON` to a venv that has it.
- zsh doesn't split an unquoted `$VAR` holding several frame numbers: use `${=VAR}`.
- A measured width can run before a web font has reflowed the text. Let words sit in their own flow and measure only
  while they animate.

## Files

- `trailer/kit/frame.tsx`: the screenshots' headline (`Head`), the grounds, `Card`, `Lab`, `Said`, the finger (`Tap`), the jelly
  press, `usePop`. Every scene is laid out in the screenshots' 440 × 956 units and scaled to the film.
- The character, if the app has one, is not in the kit: build it as one layer above every scene, posed per frame from
  the owner's own drawing cut into parts and pivots (walk, fly, point, clap, look, happy, blink), moving on one smooth
  path through the whole film.
- `trailer/kit/tile.py`: a labelled contact sheet of stills.
- `trailer/scripts/encode.mjs`: the Apple encode from a master (or from blurred frames plus a master's audio).
- `references/trailer-lessons.md`: the five cuts, what the owner said about each, and why.
- Comma's film is the worked example in words: `references/trailer-lessons.md` walks through every cut.
