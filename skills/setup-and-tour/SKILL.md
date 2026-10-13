---
name: setup-and-tour
description: Design the first-run setup and tour - personal setup (how their day goes, permissions) before the price, work admin and the widget after it; start straight at the first useful entity (clients, projects, a goal), let people add several or skip, then a short tour of coach marks on the real app screens. Use for "set up your account", "add your first X", workspace setup, product tours or coach marks.
---

# Setup and tour

## The order: personal before the price, admin after it

The top-earning screen-time apps (studied 2026) all run the *personal* setup before the paywall and
none run work admin there. Split setup in two:

1. **Make it yours, before the plan:** how their day goes, the permissions, the things that pull
   them away, closed by the account that saves it (`account-signup`). They build something of
   their own, the plan can use it, and leaving now costs more. Give these screens the same
   progress bar and answer rows as the questions, so it reads as one journey.
2. Then the plan, right before the paywall, then the paywall.
3. **After they commit** (paid, or closed the paywall): the workspace first (its name, and who it
   is for: just me or my team, the team option marked Soon if teams aren't live, pre-picked from
   the team-size question), then the entities (clients, projects), reminders, the widget, then the
   tour. Show the workspace live as the app's switcher will. By now it feels like unpacking, not a hurdle. A long
   hands-on setup after paying doesn't hurt; one before the price does.

## Setup

1. **No "Let's set up" screen.** Start at the first real question: "Let's get you started. Who do
   you work with?"
2. **Add one, add more, or skip.** A name is enough; details are optional behind a disclosure.
   Each added item appears as a row with its own colour and its key detail.
3. **One entity per screen**, in dependency order (clients before projects).
4. A live preview of where the entity will appear in the app (a calendar block in its colour).
5. Consent comes first after the paywall (`consent-and-permissions`).

- **No step counters.** "Step 2 of 4" adds reading and makes setup feel like paperwork. The
  progress is the screens getting shorter.
- **A project fits on one screen.** Its name, its colour, who it is for, and billing as two
  lines: Billable on or off, then hourly or fixed with the amount and the currency (the client's
  rate already in). Don't send billing to a screen of its own; the amount belongs with the project.
- **Setup is a taste of the app.** Each step is set on the app's real surfaces, drawn at their
  real size and without a device frame: the notifications as they will arrive for the reminders,
  the widgets as they sit on the Home Screen. People learn the app while they set it up, and the
  tour that follows has less to explain. A phone drawn inside the phone reads as a demo.
- **Ask how they work, not which technique.** Use the questions' answer rows, each with the day
  it describes drawn underneath as a thin calendar strip (work, breaks, meetings); the tap answers
  and moves on. The pick sets the numbers,
  said in plain words underneath ("90-minute blocks and 20-minute breaks"). No method names, and
  pre-pick from anything they already answered.
- **The widget ask:** after paying, the widgets at real size on a home-screen ground, the three
  steps to add one, Done and Later. iOS can't add a widget for the person, so never pretend to.
- **Containerless.** Don't wrap setup content in cards. Switches are plain rows; real surfaces
  (a notification, a widget) stand on the ground by themselves, drawn as the platform draws them.
- **The project screen is the form, cleanly:** name, colour, client, then billing as one control
  (Not billed · Hourly · Fixed price) and one large amount line with the currency. A fake
  "tracking now" preview on top only adds noise.
- **Reminders as rows that own their notification.** Each row is the switch, with the notification
  it sends right under it; switching off folds the notification away.
- **The widget ask is the platform's own widget gallery, without the card:** the app's icon, the
  widget's name and one line, the widget at real size on the ground; the sizes slide past with page dots, each
  coming alive. The how-to is three small steps in one row.
- **In-app menus, never the browser's dropdown.** A native select draws outside the phone on a
  design board and looks broken; build the platform menu anchored to its field.

## Tour

- Its own part of the flow, after setup, on the **real app screens**, not illustrations.
- One coach mark at a time: the screen dims except a window around the target; a card says what
  it is in one line; Next, and a quiet Skip.
- **The window's radius = the target's radius + the padding around it.** Mismatched corners are
  the most visible flaw of a tour.
- Three or four marks at most. End with the one action that starts real use.

## Anti-patterns

- A checklist screen that lists the setup steps before doing them.
- Tours over screenshots.
- Ten coach marks.
- Work admin (clients, rates, projects) before the price.
- A technique list ("Pomodoro, 52/17…") where a picture of their day would do.
