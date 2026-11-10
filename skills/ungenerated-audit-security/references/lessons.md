# What we learned, and why

Lessons from building and launching Comma (iOS, Supabase backend), Flamely (Mac/Windows/iOS), Pip (iOS) and CutRoom (a Mac desktop app with an AI agent inside), Oct–Nov 2026. Each one came from a real leak, a near miss, or a rule the owner had to repeat. The apps appear only as examples.

## Keys and secrets

**1. A key pasted into chat is a leaked key: store it in an ignored file, never echo, log or commit it, and tell the owner it must be rotated.** Why: owners paste live keys mid-chat; it happened in several projects. Comma, Oct–Nov 2026; Flamely, Oct–Nov 2026; CutRoom, Oct 2026.

**2. Secrets live in ignored local env files and CI secrets, never in the repo, the docs or the logs.** The most powerful keys (database service role) live only in CI secrets. Why: the standing rule became "Service role key ... GitHub Actions secrets ONLY, never local". Comma, Oct–Nov 2026.

**3. One key per environment.** Test keys in Debug, live keys in production, and the build fails if they cross. Why: a Release build with a payments test key alerts and then crashes; a test key that grants access in production is a free pass for everyone. Flamely, Oct 2026.

**4. Never ship a build that carries the owner's own login, keys or session.** Every person who installs it signs in as themselves. Why: "my friend will download this same version, can you tell what if he is also logged into my claude". CutRoom, Oct 2026.

**5. Before a repo goes public, remove keys and personal media from the files and from git history, then add a pre-commit hook that blocks them coming back.** Why: "remove any of the claude api key and stuff, I will put this opensource, plus also remove my pictures and videos". CutRoom, Oct 2026.

**6. A private product repo never becomes public. A public showcase uses images, never the product's code.** Why: "YOU CAN [use] COMMA EXAMPLES IN THE PUBLIC REPO BUT NEVER THE CODE OF ITS GRAPHICS ONLY IMAGES". Comma, Nov 2026.

**7. Uploads and automation sign with a scoped store API key, not a person's account password.** It can be revoked alone and never needs a human session. Comma, Nov 2026.

## Access control

**8. Before opening sign-ups, check every table's row-level policies.** "Full access using true" for any signed-in user, or RLS off on a table, lets anyone with the public key read or wipe it. Why: an audit found internal pipeline tables open to every signed-in account and a backup table with RLS off. Comma, Oct 2026.

**9. Fix open tables with restrictive admin-only policies that AND with the existing ones**, so the owner's own tools keep working while users are locked out. Comma, Oct 2026.

**10. Enforce every limit on the server: money ceilings, minimum input, rate limits, paid gates.** The client shows the limit; the server is the lock. Why: "a per-person money ceiling enforced on the server". Comma, Nov 2026.

**11. Server-to-server brokers sign their requests (HMAC) and refuse unsigned calls.** Comma, Nov 2026.

**12. A new external integration (an MCP connector, a partner API) ships with admission closed** until sign-in, ownership and each gate are verified on a real device. Comma, Nov 2026.

**13. A destructive account action refuses when signed out, before clearing anything locally.** Otherwise it wipes the person's work with no server record. Comma, Nov 2026.

## Production and other projects

**14. Never pause, restore, delete or change a production database, a sibling app or a release workflow without the owner's yes in this conversation.** Migrations are additive and have a rollback. Why: an agent paused the wrong production project: "why you paused flamely prod ... for fuck sake"; "I WOULDNT CHANGE DB AT ALL … YOU CAN TEST IT BUT DONT CHANGE THINGS". Comma, Oct 2026; Flamely, Oct–Nov 2026.

**15. Keep each app's accounts, keys, buckets and projects separate.** A shared org or key means one leak opens both. Why: "THIS IS NEW APP KEEP THIS SEPARATE FROM comma and flamely please". Pip, Oct 2026; Comma, Oct 2026.

**16. Don't switch on an optional production transport just because its server side is deployed.** Each needs its own authenticated release-build check on a device. Why: a signed-in launch crash came from a probe to an endpoint that wasn't deployed. Comma, Nov 2026.

## Agents and AI

**17. An AI agent with web access may read only files inside its own project folders.** A page it reads can tell it to read a secret and send it out. Why: an audit found file reads unrestricted while web fetch was on; "one poisoned web page can send private files out during a normal run". Fixed with path checks. CutRoom, Nov 2026.

**18. Never let the AI provider key reach the client.** Every model call goes through your server, which checks the user, the limit and the input. Comma, Oct–Nov 2026.

## The device

**19. Hide sensitive content when the app goes to the background**, so the app-switcher snapshot iOS writes to disk doesn't hold it. Why: a review found an open private card would land in the snapshot. Pip, Nov 2026.

**20. A test build never fills a real account with sample data**; samples stay on the device and never sync. Why: a build put sample content into the owner's real account. Comma, Oct 2026.

**21. Never test on the owner's real projects or leave test items in their space.** Use private copies and clean up. Why: a "Script test" project appeared in the owner's library; "delete your tests videos". CutRoom, Oct 2026.

## How to run it

**22. Security is a standing pre-launch layer: API leaks, data leaks, hack vulnerabilities**, every time, not once. Why: "SECONDARY LAYER AND AUDIT CHECKER API LEAKS DATA LEAK HACK VULNERABILITIES". Flamely, Nov 2026.

**23. Do the checks yourself when a connector or key on the machine allows it**; send back only the steps that need the owner's hands (a dashboard behind their login, rotating a key, Touch ID), with exact click-by-click steps. Why: "if there is any connector connected to you that you can use for this, probably you don't really need my permission". Comma, Oct 2026.

**24. Start from the app profile, report everything, wait for approval, then fix.** Why: "all skill should start from apps ... COVER EVERYTHING AUDIT AND TELL USER AND AFTER APPROVAL THESE SKILL FIX THESE". Flamely, Nov 2026.

**25. List what is deployed, not just what is in the repo.** Flamely's database project still ran four functions that weren't in the repository (`admin_wipe_paddle`, `admin_seed_paddle_catalog`, …). They turned out to be retired stubs that only answer 410 "gone", but a deployed function nobody owns is where a hole hides: read each one, and delete them before launch. Flamely, Nov 2026.

**26. When the deploy is an upload of a bundled file, read the deployed copy back and probe it.** After uploading a payment webhook through the database connector, Flamely compared the stored source with the bundle and sent an unsigned request (it must answer 401) before trusting it. Flamely, Nov 2026.

**27. A connector that refuses destructive SQL is a guard, not an obstacle.** The database connector declined deleting user accounts; the owner did it in the dashboard. Never work around it with another route. Flamely, Nov 2026.
