# Image prompts

The pictures the example projects use, as ChatGPT prompts: 0 of 34 made.

1. Open a new ChatGPT chat for each set and paste the set. It makes picture 1; say “next” for each one after.
2. Save each picture as `examples/images-src/<name>.png`, with the names listed under its set, in order.
3. Run `node scripts/images.mjs` (it writes light WebP files to `examples/images/`), then rebuild.

Until a picture exists, the screens show a placeholder in its place. To redo one picture, copy it
alone from its project page on the site: each prompt there carries the style.

## 1. App icons

```text
I’m making the app icons for 7 different apps, each its own brand. Every icon follows this style:

An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

Full square with no rounded corners (iOS adds them). Nothing small: an icon is read at 60 points.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Loaf (baking). A simple stylised sourdough boule seen from the side, cream-coloured with one curved score, on a flat deep crust-brown #BF4F1A background, minimal flat illustration with a soft inner shadow. Square, 1024 × 1024.

2. Stride (running). One bold volt-yellow #D4FF3F stroke leaning forward like a lane line in motion, on a flat asphalt-black #0E0F0C background. Square, 1024 × 1024.

3. Ripe (diet). A single glossy raspberry, softly stylised, on a flat butter-yellow #FFF4D6 background, soft 3D render. Square, 1024 × 1024.

4. Halves (money for two). A circle split down the middle into an ink-black #111110 half and a marigold #F2B705 half, on an off-white #F3F3EE background, flat. Square, 1024 × 1024.

5. Lull (sleep). A thin crescent moon that glows like a lamp, soft orange #D9822B, on a deep midnight-blue #121D33 background, a gentle gouache texture. Square, 1024 × 1024.

6. Parla (language). Tazza’s face close up (a white espresso cup with big glossy black eyes and a tiny smile) on a flat tomato-red #E4472E background, soft 3D render. Square, 1024 × 1024.

7. Fern (plant care). A single unfurling fern frond in deep green #16221A rising from a small terracotta #B4572F pot, on a flat sage #DFE6D8 background, minimal flat illustration. Square, 1024 × 1024.
```

Save as: `loaf-icon.png`, `stride-icon.png`, `ripe-icon.png`, `halves-icon.png`, `lull-icon.png`, `parla-icon.png`, `fern-icon.png`.

## 2. Parla: Tazza, the mascot

```text
I’m making the pictures for an app called Parla. Italian you say out loud, a phrase at a time, to a coach that listens.

Every picture shares this style:

A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

Make the first pose (hello), then ask for the others in the same chat: “the same character, now …”. Transparent backgrounds, so Tazza can stand on any screen. Keep the saucer’s base at the same height in every pose, about 90% of the way down, centred: the poses swap in place.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Tazza waving hello. Square, 1024 × 1024, transparent background (PNG). Tazza standing on its saucer, waving hello with its right arm raised high, eyes wide and happy, a tiny curl of steam above the rim. Full body, centred, transparent background.

2. Tazza listening. Square, 1024 × 1024, transparent background (PNG). The same Tazza, leaning slightly to its left, one arm cupped beside its body as if listening closely, eyes curious and looking up. Full body, centred, transparent background.

3. Tazza cheering. Square, 1024 × 1024, transparent background (PNG). The same Tazza cheering, both arms up, eyes closed in two happy curves, mouth open in a smile, two small curls of steam rising. Full body, centred, transparent background.

4. Tazza asleep. Square, 1024 × 1024, transparent background (PNG). The same Tazza asleep, tilted gently to one side on its saucer, eyes closed as two soft lines, arms resting, one slow curl of steam. Full body, centred, transparent background.

5. Tazza waving goodbye. Square, 1024 × 1024, transparent background (PNG). The same Tazza waving goodbye with one arm, holding a tiny crema #FFE7B8 suitcase with a brick-red handle in the other, a warm small smile. Full body, centred, transparent background.
```

Save as: `parla-tazza-hello.png`, `parla-tazza-listen.png`, `parla-tazza-cheer.png`, `parla-tazza-sleep.png`, `parla-tazza-wave.png`.

## 3. Ripe: Food photographs

```text
I’m making the pictures for an app called Ripe. Meals you already like, planned around a weight you can keep.

Every picture shares this style:

Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

Straight down, the same yellow surface in every picture, so the foods line up as a set. The screens crop each photo to a circle, so keep the bowl or plate centred.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Pasta with tomatoes. Square, 1024 × 1024. A bowl of spaghetti with cherry tomatoes, basil and shaved parmesan.

2. Salmon rice bowl. Square, 1024 × 1024. A rice bowl with seared salmon, avocado slices, cucumber, edamame and sesame seeds.

3. Three cheeses. Square, 1024 × 1024. A small round board of three cheeses with red grapes and a few crackers.

4. Dark chocolate. Square, 1024 × 1024. A few broken squares of dark chocolate with a handful of raspberries.

5. Chickpea curry. Square, 1024 × 1024. A bowl of chickpea and spinach curry with a spoon of yogurt, rice on the side.

6. Toast with ricotta. Square, 1024 × 1024. A slice of toasted sourdough with ricotta, honey and a few thyme leaves.

7. Yogurt with raspberries. Square, 1024 × 1024. A bowl of thick yogurt with raspberries, granola and a drizzle of honey.
```

Save as: `ripe-pasta.png`, `ripe-bowl.png`, `ripe-cheese.png`, `ripe-chocolate.png`, `ripe-curry.png`, `ripe-toast.png`, `ripe-yogurt.png`.

## 4. Loaf: Photographs

```text
I’m making the pictures for an app called Loaf. A sourdough companion that bakes on your starter's schedule, not the recipe's.

Every picture shares this style:

Editorial food photography for a sourdough baking app: natural window light from the left, warm and soft, deep shadows, a dusting of flour, a dark rye-brown wooden surface, shallow depth of field, a 50 mm lens, subtle film grain, a muted warm palette of cream, crust brown and rye black. No faces, no text, no logos, no brand packaging.

One chat, so the light and the board match across the four photos.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Sourdough crumb, close. Portrait 2:3, 1024 × 1536. Close-up of a sliced sourdough loaf showing an open, glossy crumb with irregular holes and a dark caramelised crust with a sharp ear, the cut face towards the camera, on a floured board.

2. Starter rising in its jar. Portrait 2:3, 1024 × 1536. A tall glass jar of bubbly sourdough starter that has doubled, large bubbles pressed against the glass, a red-orange rubber band around the jar where it started, a folded linen cloth beside it. Keep the bubbles and the rubber band in the middle third of the frame, so the picture also works cropped to a wide strip.

3. Hands shaping dough. Portrait 2:3, 1024 × 1536. Seen from above: two floured hands shaping a round of dough on a wooden board, only hands and forearms in the frame, sleeves rolled up.

4. A boule out of the oven. Portrait 2:3, 1024 × 1536. A freshly baked sourdough boule in an open cast-iron pot, a little steam rising, a deep brown crust with a burst ear, oven gloves out of focus at the edge.
```

Save as: `loaf-crumb.png`, `loaf-jar.png`, `loaf-hands.png`, `loaf-oven.png`.

## 5. Fern: Plant photographs

```text
I’m making the pictures for an app called Fern. Watering, light and repotting for every plant you own, from one photo.

Every picture shares this style:

Natural plant photography for a plant-care app: one houseplant in a plain terracotta pot against a soft sage-green #DFE6D8 wall, diffused daylight from a window on the left, calm, true colours, the plant centred with space around it. No people, no text, no logos.

The same wall, pot and light for every plant, so the shelf looks like one home.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Monstera. Portrait 2:3, 1024 × 1536. A healthy Monstera deliciosa with large split leaves. Centred, with generous space on every side: it fills a camera viewfinder that shows only the middle of the picture.

2. Golden pothos. Portrait 2:3, 1024 × 1536. A golden pothos with leaves trailing over the edge of the pot.

3. Fiddle-leaf fig. Portrait 2:3, 1024 × 1536. A fiddle-leaf fig about a metre tall.

4. Snake plant. Portrait 2:3, 1024 × 1536. A snake plant with tall upright striped leaves.
```

Save as: `fern-monstera.png`, `fern-pothos.png`, `fern-fig.png`, `fern-snake.png`.

## 6. Lull: Illustrations

```text
I’m making the pictures for an app called Lull. Sleep sounds and a wind-down that learns how long you take to drift off.

Every picture shares this style:

Quiet painterly illustration for a sleep app: soft gouache texture, a muted palette of dusk blue #DCE4EC, midnight #121D33 and one warm lamp orange #D9822B, calm and sparse. No people, no text.

Painted, not photographed: Lull should feel like a picture book at bedtime.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. A window at night, rain. Portrait 2:3, 1024 × 1536. A window at night seen from inside a dark bedroom, rain drops on the glass, the lights of a town blurred outside, a small warm lamp on the sill at the lower left, the lower middle quiet and dark, the main subject in the centre square.

2. Rain on a tin roof. Square, 1024 × 1024. Rain falling on a tin roof at night, seen close, soft and grey-blue.

3. A night train. Square, 1024 × 1024. A night train crossing a dark valley, its windows warm and lit.

4. The sea at night. Square, 1024 × 1024. A calm sea at night under a low moon, small soft waves.
```

Save as: `lull-window.png`, `lull-rain.png`, `lull-train.png`, `lull-sea.png`.

## 7. Stride: Photograph

```text
I’m making the pictures for an app called Stride. A running coach that builds the first week from the run you already did.

Every picture shares this style:

Night running photography: a wet track at night, cold stadium light, deep blacks, one volt-yellow #D4FF3F streak of light, motion blur, high contrast, grain. No faces, no logos on shoes or clothes, no text.

One picture, for the opening. Tall, so it can fill the phone.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Running on a wet track at night. Portrait 2:3, 1024 × 1536. A runner’s legs and shoes mid-stride on a wet running track at night, the lane lines glowing, the stadium lights streaked by motion blur behind. Keep the lower 40% mostly dark wet track: the opening’s words sit there.
```

Save as: `stride-track.png`.

## 8. Halves: Avatars

```text
I’m making the pictures for an app called Halves. A budget two people keep together, without a spreadsheet or an argument.

Every picture shares this style:

Flat illustrated avatar for a budgeting app: simple geometric shapes, friendly, ink-black #111110 outlines, a flat marigold #F2B705 circle behind the head, no shading, no text.

Flat, so they sit well at 40 points.

Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.

1. Mia. Square, 1024 × 1024. Portrait avatar of a woman in her early thirties with short dark curly hair and round glasses, shoulders up, smiling.

2. Sam. Square, 1024 × 1024. Portrait avatar of a man in his early thirties with a short beard and a striped shirt, shoulders up, smiling.
```

Save as: `halves-mia.png`, `halves-sam.png`.
