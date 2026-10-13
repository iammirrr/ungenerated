# Parts checklist

Each part appears on a kit tile in every state below, live, in light and dark.

| Part | States | Motion |
|---|---|---|
| Primary button | default, pressed, disabled, loading | press to 0.97 and 1 pt down in 90 ms; release on a spring (response 0.34, damping 0.6) |
| Quiet / secondary button | default, pressed | same press |
| Text button | default, pressed | highlight only, never scale |
| Row (single pick) | default, under the finger, picked | the pick blooms from the touch point; the check pops (spring 0.34 / 0.6); moves on after 340 ms |
| Row (multi pick) | default, picked | bloom in, drain out |
| Card pick (grid) | default, picked | press 0.97; bloom |
| Chip | default, picked | press 0.95; bloom |
| Input | empty, focused (caret), filled, error (one shake), valid | focus ring eases in 160 ms |
| Six-digit code | empty, typing, filled, wrong (shake) | each box fills as typed |
| Toggle | off, on, under the finger | the knob stretches toward the side it will go, lands on two springs |
| Slider | resting, under the finger (thumb grows, value bubble) | the thumb glides to the finger; the value settles on release |
| Range (two thumbs) | resting, dragging | the nearer thumb glides to the finger |
| Segmented control | each option | the thumb slides on a spring, stretching slightly with speed |
| Progress bar | 0, mid, done | eases forward over 700 ms |
| Toast / status | appear, leave | rise 8 pt in; fade up out |
| Sheet | open, dragging, dismissing | spring up (0.5 / 0.88); follows the finger down |
