# Image prompts

Every picture the example apps use. Until a picture exists, the screens show a labelled
placeholder in its place. To add one: make it, save the original as `examples/images-src/<id>.png`
(or .jpg), run `node scripts/images.mjs` (it writes a light WebP to `examples/images/`), then
rebuild. The screens pick it up by its id.

Made with ChatGPT: each block below is a whole prompt (the app's style, the picture, its size),
ready to paste. Make one app's pictures in one chat, in order, so they match; for the mascot, make
the first pose, then paste the others in the same chat.

Done: 0 of 34.


## Parla: Tazza, the mascot

Make the first pose (hello), then ask for the others in the same chat: “the same character, now …”. Transparent backgrounds, so Tazza can stand on any screen. Keep the saucer’s base at the same height in every pose, about 90% of the way down, centred: the poses swap in place.

### `parla-tazza-hello`

Tazza waving hello. Save as `examples/images-src/parla-tazza-hello.png`. Used in: the opening, Day one.

```
A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

Tazza standing on its saucer, waving hello with its right arm raised high, eyes wide and happy, a tiny curl of steam above the rim. Full body, centred, transparent background.

Square, 1024 × 1024, transparent background (PNG).
```

### `parla-tazza-listen`

Tazza listening. Save as `examples/images-src/parla-tazza-listen.png`. Used in: the first phrase, the opening’s mic beat.

```
A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

The same Tazza, leaning slightly to its left, one arm cupped beside its body as if listening closely, eyes curious and looking up. Full body, centred, transparent background.

Square, 1024 × 1024, transparent background (PNG).
```

### `parla-tazza-cheer`

Tazza cheering. Save as `examples/images-src/parla-tazza-cheer.png`. Used in: “Perfetto”, day one.

```
A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

The same Tazza cheering, both arms up, eyes closed in two happy curves, mouth open in a smile, two small curls of steam rising. Full body, centred, transparent background.

Square, 1024 × 1024, transparent background (PNG).
```

### `parla-tazza-sleep`

Tazza asleep. Save as `examples/images-src/parla-tazza-sleep.png`. Used in: taking a break.

```
A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

The same Tazza asleep, tilted gently to one side on its saucer, eyes closed as two soft lines, arms resting, one slow curl of steam. Full body, centred, transparent background.

Square, 1024 × 1024, transparent background (PNG).
```

### `parla-tazza-wave`

Tazza waving goodbye. Save as `examples/images-src/parla-tazza-wave.png`. Used in: the goodbye.

```
A mascot for a language app: Tazza, a small white espresso cup with a rounded body, one curved handle on its right, a thin tomato-red band around the rim, two big glossy black eyes with a white highlight, a tiny smile and soft pink cheeks, two short rounded arms, standing on a cream #FFE7B8 saucer with a thin tomato-red rim. Soft matte 3D vinyl-toy render, gentle studio light from the top left, a very soft contact shadow, rounded shapes everywhere, warm and simple. No text, no letters, no logos.

The same Tazza waving goodbye with one arm, holding a tiny crema #FFE7B8 suitcase with a brick-red handle in the other, a warm small smile. Full body, centred, transparent background.

Square, 1024 × 1024, transparent background (PNG).
```


## Loaf: Photographs

One chat, so the light and the board match across the four photos.

### `loaf-crumb`

Sourdough crumb, close. Save as `examples/images-src/loaf-crumb.png`. Used in: Loaf’s opening, today.

```
Editorial food photography for a sourdough baking app: natural window light from the left, warm and soft, deep shadows, a dusting of flour, a dark rye-brown wooden surface, shallow depth of field, a 50 mm lens, subtle film grain, a muted warm palette of cream, crust brown and rye black. No faces, no text, no logos, no brand packaging.

Close-up of a sliced sourdough loaf showing an open, glossy crumb with irregular holes and a dark caramelised crust with a sharp ear, the cut face towards the camera, on a floured board.

Portrait 2:3, 1024 × 1536.
```

### `loaf-jar`

Starter rising in its jar. Save as `examples/images-src/loaf-jar.png`. Used in: the first bake, the opening, today.

```
Editorial food photography for a sourdough baking app: natural window light from the left, warm and soft, deep shadows, a dusting of flour, a dark rye-brown wooden surface, shallow depth of field, a 50 mm lens, subtle film grain, a muted warm palette of cream, crust brown and rye black. No faces, no text, no logos, no brand packaging.

A tall glass jar of bubbly sourdough starter that has doubled, large bubbles pressed against the glass, a red-orange rubber band around the jar where it started, a folded linen cloth beside it. Keep the bubbles and the rubber band in the middle third of the frame, so the picture also works cropped to a wide strip.

Portrait 2:3, 1024 × 1536.
```

### `loaf-hands`

Hands shaping dough. Save as `examples/images-src/loaf-hands.png`. Used in: today’s bake, the schedule.

```
Editorial food photography for a sourdough baking app: natural window light from the left, warm and soft, deep shadows, a dusting of flour, a dark rye-brown wooden surface, shallow depth of field, a 50 mm lens, subtle film grain, a muted warm palette of cream, crust brown and rye black. No faces, no text, no logos, no brand packaging.

Seen from above: two floured hands shaping a round of dough on a wooden board, only hands and forearms in the frame, sleeves rolled up.

Portrait 2:3, 1024 × 1536.
```

### `loaf-oven`

A boule out of the oven. Save as `examples/images-src/loaf-oven.png`. Used in: today’s bake, the schedule.

```
Editorial food photography for a sourdough baking app: natural window light from the left, warm and soft, deep shadows, a dusting of flour, a dark rye-brown wooden surface, shallow depth of field, a 50 mm lens, subtle film grain, a muted warm palette of cream, crust brown and rye black. No faces, no text, no logos, no brand packaging.

A freshly baked sourdough boule in an open cast-iron pot, a little steam rising, a deep brown crust with a burst ear, oven gloves out of focus at the edge.

Portrait 2:3, 1024 × 1536.
```


## Ripe: Food photographs

Straight down, the same yellow surface in every picture, so the foods line up as a set. The screens crop each photo to a circle, so keep the bowl or plate centred.

### `ripe-pasta`

Pasta with tomatoes. Save as `examples/images-src/ripe-pasta.png`. Used in: foods they keep, the week.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A bowl of spaghetti with cherry tomatoes, basil and shaved parmesan.

Square, 1024 × 1024.
```

### `ripe-bowl`

Salmon rice bowl. Save as `examples/images-src/ripe-bowl.png`. Used in: foods they keep, the week, today.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A rice bowl with seared salmon, avocado slices, cucumber, edamame and sesame seeds.

Square, 1024 × 1024.
```

### `ripe-cheese`

Three cheeses. Save as `examples/images-src/ripe-cheese.png`. Used in: foods they keep.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A small round board of three cheeses with red grapes and a few crackers.

Square, 1024 × 1024.
```

### `ripe-chocolate`

Dark chocolate. Save as `examples/images-src/ripe-chocolate.png`. Used in: foods they keep.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A few broken squares of dark chocolate with a handful of raspberries.

Square, 1024 × 1024.
```

### `ripe-curry`

Chickpea curry. Save as `examples/images-src/ripe-curry.png`. Used in: foods they keep, the week.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A bowl of chickpea and spinach curry with a spoon of yogurt, rice on the side.

Square, 1024 × 1024.
```

### `ripe-toast`

Toast with ricotta. Save as `examples/images-src/ripe-toast.png`. Used in: foods they keep.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A slice of toasted sourdough with ricotta, honey and a few thyme leaves.

Square, 1024 × 1024.
```

### `ripe-yogurt`

Yogurt with raspberries. Save as `examples/images-src/ripe-yogurt.png`. Used in: the week, today.

```
Bright overhead food photography for a meal-planning app: shot straight down on a pale butter-yellow #FFF4D6 surface, soft daylight, short gentle shadows, fresh and colourful, one simple cream ceramic bowl or plate, generous space around it. No hands, no text, no logos.

A bowl of thick yogurt with raspberries, granola and a drizzle of honey.

Square, 1024 × 1024.
```


## Stride: Photograph

One picture, for the opening. Tall, so it can fill the phone.

### `stride-track`

Running on a wet track at night. Save as `examples/images-src/stride-track.png`. Used in: Stride’s opening.

```
Night running photography: a wet track at night, cold stadium light, deep blacks, one volt-yellow #D4FF3F streak of light, motion blur, high contrast, grain. No faces, no logos on shoes or clothes, no text.

A runner’s legs and shoes mid-stride on a wet running track at night, the lane lines glowing, the stadium lights streaked by motion blur behind. Keep the lower 40% mostly dark wet track: the opening’s words sit there.

Portrait 2:3, 1024 × 1536.
```


## Lull: Illustrations

Painted, not photographed: Lull should feel like a picture book at bedtime.

### `lull-window`

A window at night, rain. Save as `examples/images-src/lull-window.png`. Used in: tonight, all set.

```
Quiet painterly illustration for a sleep app: soft gouache texture, a muted palette of dusk blue #DCE4EC, midnight #121D33 and one warm lamp orange #D9822B, calm and sparse. No people, no text.

A window at night seen from inside a dark bedroom, rain drops on the glass, the lights of a town blurred outside, a small warm lamp on the sill at the lower left, the lower middle quiet and dark, the main subject in the centre square.

Portrait 2:3, 1024 × 1536.
```

### `lull-rain`

Rain on a tin roof. Save as `examples/images-src/lull-rain.png`. Used in: sounds.

```
Quiet painterly illustration for a sleep app: soft gouache texture, a muted palette of dusk blue #DCE4EC, midnight #121D33 and one warm lamp orange #D9822B, calm and sparse. No people, no text.

Rain falling on a tin roof at night, seen close, soft and grey-blue.

Square, 1024 × 1024.
```

### `lull-train`

A night train. Save as `examples/images-src/lull-train.png`. Used in: sounds.

```
Quiet painterly illustration for a sleep app: soft gouache texture, a muted palette of dusk blue #DCE4EC, midnight #121D33 and one warm lamp orange #D9822B, calm and sparse. No people, no text.

A night train crossing a dark valley, its windows warm and lit.

Square, 1024 × 1024.
```

### `lull-sea`

The sea at night. Save as `examples/images-src/lull-sea.png`. Used in: sounds.

```
Quiet painterly illustration for a sleep app: soft gouache texture, a muted palette of dusk blue #DCE4EC, midnight #121D33 and one warm lamp orange #D9822B, calm and sparse. No people, no text.

A calm sea at night under a low moon, small soft waves.

Square, 1024 × 1024.
```


## Fern: Plant photographs

The same wall, pot and light for every plant, so the shelf looks like one home.

### `fern-monstera`

Monstera. Save as `examples/images-src/fern-monstera.png`. Used in: the camera, the first plant, the shelf, coming back.

```
Natural plant photography for a plant-care app: one houseplant in a plain terracotta pot against a soft sage-green #DFE6D8 wall, diffused daylight from a window on the left, calm, true colours, the plant centred with space around it. No people, no text, no logos.

A healthy Monstera deliciosa with large split leaves. Centred, with generous space on every side: it fills a camera viewfinder that shows only the middle of the picture.

Portrait 2:3, 1024 × 1536.
```

### `fern-pothos`

Golden pothos. Save as `examples/images-src/fern-pothos.png`. Used in: the plan, coming back.

```
Natural plant photography for a plant-care app: one houseplant in a plain terracotta pot against a soft sage-green #DFE6D8 wall, diffused daylight from a window on the left, calm, true colours, the plant centred with space around it. No people, no text, no logos.

A golden pothos with leaves trailing over the edge of the pot.

Portrait 2:3, 1024 × 1536.
```

### `fern-fig`

Fiddle-leaf fig. Save as `examples/images-src/fern-fig.png`. Used in: the plan, coming back.

```
Natural plant photography for a plant-care app: one houseplant in a plain terracotta pot against a soft sage-green #DFE6D8 wall, diffused daylight from a window on the left, calm, true colours, the plant centred with space around it. No people, no text, no logos.

A fiddle-leaf fig about a metre tall.

Portrait 2:3, 1024 × 1536.
```

### `fern-snake`

Snake plant. Save as `examples/images-src/fern-snake.png`. Used in: the plan.

```
Natural plant photography for a plant-care app: one houseplant in a plain terracotta pot against a soft sage-green #DFE6D8 wall, diffused daylight from a window on the left, calm, true colours, the plant centred with space around it. No people, no text, no logos.

A snake plant with tall upright striped leaves.

Portrait 2:3, 1024 × 1536.
```


## Halves: Avatars

Flat, so they sit well at 40 points.

### `halves-mia`

Mia. Save as `examples/images-src/halves-mia.png`. Used in: who’s in (64 pt), what comes in (38 pt), the goodbye (92 pt).

```
Flat illustrated avatar for a budgeting app: simple geometric shapes, friendly, ink-black #111110 outlines, a flat marigold #F2B705 circle behind the head, no shading, no text.

Portrait avatar of a woman in her early thirties with short dark curly hair and round glasses, shoulders up, smiling.

Square, 1024 × 1024.
```

### `halves-sam`

Sam. Save as `examples/images-src/halves-sam.png`. Used in: who’s in (64 pt), what comes in (38 pt), the goodbye (92 pt).

```
Flat illustrated avatar for a budgeting app: simple geometric shapes, friendly, ink-black #111110 outlines, a flat marigold #F2B705 circle behind the head, no shading, no text.

Portrait avatar of a man in his early thirties with a short beard and a striped shirt, shoulders up, smiling.

Square, 1024 × 1024.
```


## icons: App icons

Full square with no rounded corners (iOS adds them). Nothing small: an icon is read at 60 points.

### `loaf-icon`

Loaf’s icon. Save as `examples/images-src/loaf-icon.png`. Used in: the page, the paywall.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

A simple stylised sourdough boule seen from the side, cream-coloured with one curved score, on a flat deep crust-brown #BF4F1A background, minimal flat illustration with a soft inner shadow.

Square, 1024 × 1024.
```

### `stride-icon`

Stride’s icon. Save as `examples/images-src/stride-icon.png`. Used in: the page, the paywall.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

One bold volt-yellow #D4FF3F stroke leaning forward like a lane line in motion, on a flat asphalt-black #0E0F0C background.

Square, 1024 × 1024.
```

### `ripe-icon`

Ripe’s icon. Save as `examples/images-src/ripe-icon.png`. Used in: the page, the paywall.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

A single glossy raspberry, softly stylised, on a flat butter-yellow #FFF4D6 background, soft 3D render.

Square, 1024 × 1024.
```

### `halves-icon`

Halves’ icon. Save as `examples/images-src/halves-icon.png`. Used in: the page.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

A circle split down the middle into an ink-black #111110 half and a marigold #F2B705 half, on an off-white #F3F3EE background, flat.

Square, 1024 × 1024.
```

### `lull-icon`

Lull’s icon. Save as `examples/images-src/lull-icon.png`. Used in: the page, the paywall.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

A thin crescent moon that glows like a lamp, soft orange #D9822B, on a deep midnight-blue #121D33 background, a gentle gouache texture.

Square, 1024 × 1024.
```

### `parla-icon`

Parla’s icon. Save as `examples/images-src/parla-icon.png`. Used in: the page.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

Tazza’s face close up (a white espresso cup with big glossy black eyes and a tiny smile) on a flat tomato-red #E4472E background, soft 3D render.

Square, 1024 × 1024.
```

### `fern-icon`

Fern’s icon. Save as `examples/images-src/fern-icon.png`. Used in: the page.

```
An iOS app icon, 1024 × 1024, full square with no rounded corners, one bold simple subject centred with generous margin, flat colour background. No text, no letters.

A single unfurling fern frond in deep green #16221A rising from a small terracotta #B4572F pot, on a flat sage #DFE6D8 background, minimal flat illustration.

Square, 1024 × 1024.
```
