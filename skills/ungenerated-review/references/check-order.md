# Check order

Nothing is called done, fixed or ready until it has passed these four checks, in this order, on
the real thing. Each check catches what the one before can't.

## Before you start: one shared simulator

- Reuse the one simulator that's already open. Shut down extras; never create one per task.
- Run tests one after another (on iOS: `-parallel-testing-enabled NO
  -maximum-concurrent-test-simulator-destinations 1`). Parallel runs fill the disk and make checks
  flaky.
- Use test data and test accounts, never the owner's real account or projects. Clean up after.
- Tell the owner before a run on a simulator they're looking at. Closing a simulator's window shuts
  it down.

## 1. Tap tests

The flow driven by real input, every path:

- Every button, Later, Skip, the close button, Back, swiping a sheet away.
- Real input that breaks things: fast double taps, taps faster than the animation, fast flings and
  diagonal drags on every drag control, typing with the keyboard up, a pause in dictation.
- A fresh install, and the smallest supported phone.
- A bug reported twice gets a test that reproduces it with real input before it is called fixed.

A test counts only if it fails on any failure it prints and shows that its target was reached
(a stray undo once removed everything before the checks ran, so nothing was tested).

## 2. The analytics events arrive

- Run the flow once with analytics on in a debug build, tagged as debug.
- Open the analytics tool itself and read the events. Not the code: the events.
- Every step is there, in order. Outcomes, not taps (`purchase_result: closed`, not `subscribed`).
- The person is identified by the account id. No names, emails or their own words in any property.
- Turn the flag back off.

## 3. The database and the money

- The rows the flow should write exist, and nothing else changed.
- For money: confirm the sandbox can't charge a real card, then make a sandbox purchase. Check the
  customer in the billing service (trial or active), the webhook's rows mirrored on your server,
  and the products' state in the store's console. Cancel: the server says it won't renew. Restore:
  it comes back.

## 4. Screenshots, looked at by a person

- Every changed screen: at rest, mid-motion, light and dark, the smallest phone
  ([visual-qa.md](visual-qa.md)).
- Look at every one before saying done. Then open it for the owner: the simulator on the changed
  screen, or the board at a fresh URL with no caching.

## Before a build goes out

- The build contains every change, including other agents' work, and matches what runs in the
  simulator.
- The installed version and build number are the newest.
- Test bars and free passes are compiled out.

## Say what you didn't prove

End every report with what wasn't checked: a real device, haptics, frame rate, Reduce Motion,
VoiceOver, a real purchase. Never show a check you didn't run.
