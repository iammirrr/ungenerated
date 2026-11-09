// Sets up the screenshot board in any repo:  node <skill>/scripts/new.mjs <folder> [--brand=#ef7a45] [--title="My app"]
// Copies the kit (base.css, hand.js, the board) and writes theme.css (the brand colours), screens.json (the set),
// a first screenshot to copy from, FEATURES.md (the list the owner edits first) and the native/ and hd/ folders.
// Never overwrites a file that is already there.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=') ?? d;
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('usage: node new.mjs <folder> [--brand=#hex] [--title="App name"]'); process.exit(2); }
const P = resolve(dir), KIT = join(dirname(fileURLToPath(import.meta.url)), '..', 'kit');
const brand = flag('brand', '#ef7a45'), title = flag('title', 'App Store screenshots');
if (!/^#[0-9a-f]{6}$/i.test(brand)) { console.error('--brand must be a hex colour like #ef7a45'); process.exit(2); }
const mix = (hex, to, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k) + to * k).toString(16).padStart(2, '0')).join('');
mkdirSync(join(P, 'native'), { recursive: true });
mkdirSync(join(P, 'hd'), { recursive: true });
const put = (name, text) => { const f = join(P, name); if (existsSync(f)) { console.log(`kept   ${name}`); return; } writeFileSync(f, text); console.log(`wrote  ${name}`); };
for (const f of ['base.css', 'app-screen.css', 'hand.js', 'index.html']) { const to = join(P, f); if (existsSync(to)) console.log(`kept   ${f}`); else { copyFileSync(join(KIT, f), to); console.log(`copied ${f}`); } }
put('theme.css', `/* The brand: every screenshot takes its colours and fonts from here. */
:root {
  --brand: ${brand}; --brand-deep: ${mix(brand, 0, 0.12)}; --brand-light: ${mix(brand, 255, 0.45)}cc; --brand-wash: ${mix(brand, 255, 0.75)}66;
  --brand-ink: #ffffff; --paper: #fbf8f2; --ink: #17181c;
  --display: "Nunito", -apple-system, sans-serif; --ui: "Inter", -apple-system, sans-serif;
  --said-bg: #d3f0df; --said-ink: #1b5e3a;
}
`);
put('screens.json', JSON.stringify({ title, slots: [{ caption: 'Your first screenshot', versions: [{ file: '01-hero', label: 'A · designed' }] }] }, null, 2) + '\n');
put('edits.json', '{}\n');
put('keep.json', '[]\n'); // texts that stay in the original language in every translation (what people write: scripts, captions)
put('01-hero.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Your first screenshot</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Inter:wght@500;600;700;800&display=swap">
<link rel="stylesheet" href="base.css"><link rel="stylesheet" href="app-screen.css"><link rel="stylesheet" href="theme.css">
<style>
  /* this screenshot only: place each piece by hand (left/top in px of the 440 x 956 frame); the owner fine-tunes on the board */
  .phone { left: 50px; top: 262px; width: 340px; height: 736px; }
  .pop { left: 24px; top: 520px; width: 300px; padding: 18px 20px; transform: rotate(-3deg); }
  .pop b { display: block; font: 800 20px/1.2 var(--ui); }
</style></head><body>
<div class="f brand">
  <h1><span>Say the one</span><span>thing it <span class="box">does</span></span></h1>
  <div class="phone"><img src="native/home.png" alt=""></div>
  <div class="card pop"><div class="lab">The feature, lifted out</div><b>Copy the real words from the app's screen</b></div>
</div>
<script src="hand.js"></script></body></html>
`);
put('FEATURES.md', `# ${title}: the features and headlines (for the owner to edit first)

One screenshot per feature. Each headline is two short lines (2 to 6 words), one word boxed. The picture shows exactly
what the headline says, with the app's real screens and real data.

| # | Feature | Headline | What the picture shows |
|---|---|---|---|
| 1 | | | |
`);
put('native/README.md', 'Real screens of the app, captured on the simulator (see the skill: scripts/capture-ios.sh) or from the web app at 1170 x 2532.\n');
put('hd/README.md', 'Full-size media (1080 x 1920 and up). An <img data-hd src=".../name.jpg"> uses hd/name.jpg when it is here.\n');
console.log(`\nNext: from the repo root run  node ${join(dirname(fileURLToPath(import.meta.url)), 'serve.mjs')}  and open http://127.0.0.1:5199/${dir.replace(/^\.\//, '')}/`);
