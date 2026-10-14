---
name: real-icons-and-devices
description: Show real app icons and real-looking devices on design screens - fetch official App Store artwork, draw iPhone and Mac frames in code, move them with a camera, and handle trademarks. Use when a screen shows other apps (distractions, integrations, "what do you use today"), a phone, a laptop, or a phone turning into a laptop.
---

# Real icons and devices

## App icons

- **Only real icons.** When a screen names Instagram, Slack or Figma, it shows their official
  artwork. A drawn stand-in that imitates a brand reads as fake and is worse than a letter tile.
- **Fetch them**, don't hunt for them: `node tools/fetch-appicons.mjs slack:618783545 figma=figma`
  (in the `design-board` template). `key:<App Store id>` looks up by id; `key=<term>` searches and
  takes the first app whose name contains the term. Check the printed seller name is the real one.
- **Look at every icon** after fetching. Some sources publish a generic icon under the brand's name.
- **When an icon is not on the App Store** (a desktop-only tool), ask the person to export it from
  their machine, or leave the app out. Never draw one.
- **Trademarks.** Icons are other companies' marks. Use them only to name the app, on a private
  board. Do not commit them to a public repository; keep `assets/appicons/` in `.gitignore` for
  public work.
- **Pick apps that make the point.** A "distractions" screen shows the apps your audience really
  opens; mix in the tools they work in so it reads as their day.

## Devices

- The template draws an iPhone (`F.iphone`) and a MacBook (`F.macbook`) in code: frame, glass,
  Dynamic Island or notch, side buttons. Content goes in `.screen` at its real size and is scaled.
- **Never cut a device off.** Not by the phone frame, not by the layout, not by a crop. If it does
  not fit, scale the whole device down or move the camera.
- **One camera.** Draw the device once at full size inside a rig; move the rig (translate + scale)
  to zoom and pan. Zoom to show a detail, pull back to show the whole.
- **Phone → laptop.** Turn the phone on its side, grow its frame into the laptop's lid, slide the
  base out underneath. Keep the content upright and as large as the glass allows throughout; it is
  the same content, not a swap.
- **Into the screen.** To go inside a device, scale the rig about the glass until the glass fills
  the view while the frame fades. The content then becomes the next screen in place.

- **The screen covers the device, like the real app.** One element whose layout follows the
  glass at a fixed text size: the phone's whole screen under the status bar; while the device
  turns, upright and reflowing to cover the turning glass (the glass crops it, the text never
  shrinks); the laptop's whole screen beside its sidebar. Don't crossfade between two layouts and
  don't add content the story didn't ask for; a phone-shaped card floating in a laptop reads as a
  mock-up. Landing a card on a device, let its corners and shadow melt away as it becomes the
  screen; going back in, reshape the screen into the card as the camera arrives.
- **Shrink while it turns, never at the end.** A rotating phone's bounding box is wider than either
  pose; scale the device about its centre so it stays inside the frame. Size it for its finished
  shape (the laptop with its base) by the time it lies flat, so it forms in place; a refit when the
  base slides in reads as a jump to a smaller size.

## Anti-patterns

- A static phone mockup in the middle of every screen.
- A device sliced by the bottom of the frame "for drama".
- Two devices that change content at different times.
