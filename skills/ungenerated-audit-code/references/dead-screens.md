# Finding dead screens

A screen is dead when nothing reachable from the app's entry can show it. Two kinds:
- **Orphan:** nothing in the code constructs or routes to it (or only previews and tests do).
- **Unreachable:** something routes to it, but that something is itself unreachable (a button on an orphan, a case of an enum nothing sets, a route behind a flag that is always off).

The method is the same everywhere: (1) list every screen, (2) list every edge (who shows whom), (3) walk from the entry points, (4) what's left is dead. Then read each one; tools miss dynamic routes.

**Entry points to start the walk from:** the app's launch scene, every tab, deep links and universal links, push notification handlers, widgets, App Intents/Shortcuts, share and other extensions, Siri, Spotlight, onboarding resume points, and debug-only menus (count those as Debug-only, not live).

## SwiftUI and UIKit

List screens (top-level views and view controllers):
```bash
grep -rnE "struct [A-Za-z0-9_]+(Screen|View|Page|Sheet)\b.*: *View" --include=*.swift . | grep -v Tests
grep -rnE "class [A-Za-z0-9_]+ *: *UI(View|Table|Collection|Navigation|Tab)?Controller" --include=*.swift .
```
List edges:
```bash
grep -rnE "NavigationLink|\.navigationDestination\(|\.sheet\(|\.fullScreenCover\(|\.popover\(|\.inspector\(|TabView|\.tabItem|Tab\(|WindowGroup|present\(|pushViewController|performSegue|instantiateViewController" --include=*.swift .
```
Then, for each screen name, find where it is constructed outside its own file, previews and tests:
```bash
name=SomeScreen
grep -rnE "\b$name\(" --include=*.swift . | grep -vE "Tests/|#Preview|PreviewProvider|struct $name"
```
No hit = orphan. Watch for **router enums** (`enum Route { case settings, paywall }` with a `switch` that builds views): a case nothing assigns is a dead screen even though the switch constructs it; grep each case's assignments (`.paywall` used as a value). Storyboards and XIBs: grep their identifiers too. `periphery scan` finds unused types, functions and properties for Swift (configure the targets and keep public APIs of extensions in mind).

## React Native with Expo Router

Every file under `app/` is a route, except `_layout` and `+not-found`; files inside `(group)` folders are still routes. List routes:
```bash
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" \) ! -name "_layout*" | sort
```
List edges: `router.push(`, `router.replace(`, `router.navigate(`, `<Link href=`, `<Redirect href=`, `Tabs.Screen`/`Stack.Screen name=`, and deep-link configuration (`scheme` in `app.json`, notification handlers that route). A route that no link, push, tab or deep link names is dead. Watch for **typed or built routes** (`` `/item/${id}` ``): match by pattern. `npx knip` finds unused files, exports and dependencies across the project.

## React Native with React Navigation

Screens are registered: `<Stack.Screen name="Paywall" component={PaywallScreen} />`. Edges are `navigation.navigate("Paywall")`, `push`, `replace`, `reset`, `linking` config. A registered name nothing navigates to is unreachable; a component file never registered is an orphan. `npx knip` for the files.

## Flutter

Screens are widgets pushed by `Navigator.push(MaterialPageRoute(builder: …))`, named routes in `MaterialApp(routes:)`, or a router package (`go_router`: `GoRoute(path:)`, edges are `context.go`, `context.push`). List each and match. `dart analyze` flags unused code; DCM's `check-unused-files` and `check-unused-code` find unused files and members.

## Android (Compose and Views)

Compose Navigation: `composable("route") { … }` destinations; edges `navController.navigate("route")`. Views: activities and fragments in `AndroidManifest.xml` and navigation graphs (`res/navigation/*.xml`); edges `startActivity(Intent(…, X::class.java))`, `findNavController().navigate(R.id.…)`. An exported activity is an entry point. `./gradlew lint` reports unused resources; Detekt and the IDE's "unused declaration" inspection find dead code.

## Web routers

- **Next.js:** every `app/**/page.tsx` (and `pages/**`) is a route. Edges: `<Link href>`, `router.push`, `redirect()`, sitemap, middleware rewrites, and links from outside (emails, ads, the store listing). A page nothing links to may still be live if it's linked from outside; ask.
- **React Router / TanStack Router / Vue Router / SvelteKit:** read the route config or the file-based routes, then grep `navigate(`, `<Link to=`, `<a href=`.
- `npx knip` for unused files and exports; the server's access logs (last 30 days) show which routes real people hit.

## The report row

| Screen | File | Kind (orphan / unreachable / preview-only / debug-only) | Proof (the search with no hit, or the edge chain) | In the design? | Proposed action |
|---|---|---|---|---|---|
