# Code audit checklist

Every numbered item: ❌ confirmed, ⚠️ suspected, ✅ fine, N/A. Proof is a file:line, a tool's output, or the search that found no caller. ★ = commonly missed. Say which tools ran; don't install any without saying so.

## Tools (use what fits the stack)

```bash
periphery scan                                    # Swift: unused types, functions, properties, parameters
npx knip                                          # JS/TS: unused files, exports, dependencies, types
npx depcheck                                      # JS: unused and missing dependencies
npx jscpd --min-lines 15 --reporters console .    # duplicated blocks, any language
dart analyze                                      # Flutter/Dart
./gradlew lint                                    # Android: UnusedResources, unused code
cloc . --exclude-dir=node_modules,Pods,build,.build,DerivedData   # size by language
```

## 1. Dead screens (method in `dead-screens.md`)

1. ★ Every screen is reachable from an entry point; orphans and unreachable screens listed with proof.
2. Screens reached only from previews, tests or debug menus are labelled as such.
3. Screens the owner cut from the design are gone from the code (not left as dead routes), once the owner confirms.
4. Every screen the owner approved in the design exists in the app (the reverse check).

## 2. Dead code

5. Unused types, functions and properties (periphery, knip, lint), each read before listing.
6. ★ Feature flags that are always on or always off, and the branch that can never run.
7. Commented-out code blocks longer than a few lines.
8. Old versions of a component or service left beside the new one (`ScreenV2`, `oldPaywall`, `legacy*`).

## 3. Unused assets, strings and dependencies

9. ★ Asset catalogue images, colours, fonts, sounds, videos and JSON not referenced anywhere:
   ```bash
   # iOS asset names, then search each (also check string-built names like "icon-\(name)")
   find . -path "*.xcassets/*.imageset" -type d | sed 's#.*/##; s#\.imageset##' | while read n; do grep -rqF "\"$n\"" --include=*.swift --include=*.storyboard --include=*.xib . || echo "unused? $n"; done
   ```
10. Localised strings no code uses, and strings in code that aren't localised (if the app is localised).
11. Dependencies declared but not imported (Package.swift/SPM, Podfile, package.json, pubspec.yaml, build.gradle), and duplicate libraries doing one job (two date or HTTP libraries).
12. Fonts bundled but not registered or not used.

## 4. Duplicates

13. ★ The same component built more than once (three buttons, two sheets, two cards that differ by a colour); list each copy with file:line and the one to keep.
14. Duplicated logic (price formatting, date maths, limit checks) in more than one place, especially across client and server or two clients.
15. Content shared by two surfaces (a design board and the app, web and mobile) kept in one source, not copied.

## 5. Risky logic with no test

16. ★ Money and entitlements: purchase result handling, entitlement decisions, trial eligibility, offers, webhook handlers.
17. Auth and account: sign-in, sign-out, token refresh, account deletion (refuses when signed out before clearing anything).
18. ★ The person's words: text input, dictation (a pause, a restart or a second tap only ever adds, never replaces), drafts, autosave, undo, every version kept.
19. Sync and merge: conflicts, offline queues, two writers on the same data (locks or revision checks), one source of truth and one undo history per document.
20. Time and dates: midnight, time zones, daylight saving, week resets in the person's own time, anything clipped to a day.
21. Limits and counters (AI credits, rate limits), and shared logic between two clients (prove parity with the original's code on awkward inputs).
22. Per-item state that must not leak to the next item (an answer carried into the next question).
23. UI tests are current with the UI; stale or flaky tests are listed (a failing test may be a real bug: read it).

## 6. Size and shape

24. Huge files (over ~500 lines for a view, ~800 for anything), and functions over ~80 lines:
    ```bash
    find . -type f \( -name "*.swift" -o -name "*.ts" -o -name "*.tsx" -o -name "*.kt" -o -name "*.dart" \) -not -path "*/node_modules/*" -not -path "*/Pods/*" -not -path "*/build/*" | xargs wc -l | sort -n | tail -25
    ```
25. Shared helpers with side effects beyond their name (a blur helper that adds padding; a formatter that writes to disk).

## 7. Debt comments

26. Every `TODO`, `FIXME`, `HACK`, `XXX` and `shortcut:` comment listed with its age (`git blame`) and whether it blocks launch:
    ```bash
    grep -rnE "TODO|FIXME|HACK|XXX|shortcut:" --include=*.{swift,ts,tsx,js,kt,dart,py,rs,sql} . | grep -vE "node_modules|Pods|/build/"
    ```

## 8. Release hygiene

27. ★ Debug UI, test bars, free passes, fixture data and test keys are compiled out of Release (check `#if DEBUG`, build configurations, and `strings` on the archive).
28. ★ Each release is frozen on its own branch or tag, includes every parallel agent's merged work, and its signed archive has the entitlements the app and every extension need (sign-in, push, app groups). Optional backend features stay off in release until verified on a real device.

Coverage line for the report: "Code: 28 of 28 checked; N screens, M dead; tools run: …".
