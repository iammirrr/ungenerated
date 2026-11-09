// Every icon the board really draws, per screen, with its size in points. The icon list starts here, never from memory.
//
//   node kit/icon-audit.mjs <board url> <out.json> [ms per screen = 1500]
//   node kit/icon-audit.mjs http://localhost:4173/ review/icons.json
//
// Works on the ungenerated board (the `ungenerated-flows` template): it opens each app screen alone (#only-<id>, one
// phone at its real size, so 1 CSS px = 1 pt) and records, inside the phone:
//   line   an icon drawn with F.icon, by its name in js/icons.js
//   brand  a real app tile (F.appTile); "missing" when the board fell back to a letter because the artwork isn't fetched
//   image  any other <img> (an illustrated icon, a picture), named by its file
//   emoji  an emoji character in the text: a placeholder until it gets an icon or stays on purpose
// Kit and transition rows are skipped. Writes <out.json> and a table next to it (<out>.md) for the brief.
// Needs Chrome or Chromium (set CHROME=/path when it isn't found).
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [base, out, ms = '1500'] = process.argv.slice(2);
if (!base || !out) { console.error('usage: node icon-audit.mjs <board url> <out.json> [ms per screen]'); process.exit(2); }
const chromePath = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chromePath) { console.error('No Chrome found. Set CHROME=/path/to/chrome.'); process.exit(2); }
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'icon-audit-'))}`, '--window-size=600,1000', 'about:blank'], { stdio: 'ignore' });
const sleep = (t) => new Promise((r) => setTimeout(r, t));
let ws;
for (let i = 0; i < 80 && !ws; i++) {
  await sleep(150);
  try { const pg = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); if (pg) ws = new WebSocket(pg.webSocketDebuggerUrl); } catch {}
}
if (!ws) { console.error('Chrome did not start'); chrome.kill(); process.exit(2); }
await new Promise((r) => (ws.onopen = r));
let id = 0; const waits = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waits.has(m.id)) { waits.get(m.id)(m.result); waits.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; waits.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true }))?.result?.value;
const open = async (url) => { await send('Page.navigate', { url }); await sleep(+ms); };

await send('Page.enable');
// Before the board boots (its own DOMContentLoaded listener comes later), tag every icon and app tile with its name.
await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('DOMContentLoaded', () => {
  if (!window.F) return;
  const icon = F.icon, tile = F.appTile;
  if (icon) F.icon = (n, o) => { const el = icon(n, o); el.dataset.icon = n; return el; };
  if (tile) F.appTile = (n, s) => { const el = tile(n, s); el.dataset.app = n; return el; };
});` });
await open(base);
// App screens only: not whole-part sequences, not kit or transition rows.
const screens = await run(`(() => { const view = Object.fromEntries((window.BOARD?.sections || []).map((s) => [s.id, s.view || 'screens']));
  return (window.F?.SCREENS || []).filter((s) => !s.seq && (view[s.section] || 'screens') === 'screens').map((s) => ({ id: s.id, name: s.name || s.id, section: s.section })); })()`);
if (!screens?.length) { console.error(`No screens found at ${base}: is it the ungenerated board?`); chrome.kill(); process.exit(1); }

const COLLECT = `(() => {
  const ph = document.querySelector('.ph'); if (!ph) return [];
  const size = (el) => { const r = el.getBoundingClientRect(); return Math.round(Math.max(r.width, r.height)); };
  const file = (src) => (src || '').split('/').pop().replace(/\\.[a-z0-9]+(\\?.*)?$/i, '');
  const found = [];
  ph.querySelectorAll('svg.ic').forEach((el) => found.push({ kind: 'line', name: el.dataset.icon || '?', pt: size(el) }));
  ph.querySelectorAll('.app-tile').forEach((el) => found.push({ kind: 'brand', name: el.dataset.app || '?', pt: size(el), missing: el.classList.contains('is-letter') }));
  ph.querySelectorAll('img').forEach((el) => { if (!el.closest('.app-tile')) found.push({ kind: 'image', name: file(el.getAttribute('src')), pt: size(el) }); });
  const walk = document.createTreeWalker(ph, NodeFilter.SHOW_TEXT);
  for (let t; (t = walk.nextNode());) for (const m of t.textContent.match(/\\p{Extended_Pictographic}/gu) || [])
    found.push({ kind: 'emoji', name: m, pt: Math.round(parseFloat(getComputedStyle(t.parentElement).fontSize)) });
  return found;
})()`;

const perScreen = [];
for (const [n, s] of screens.entries()) {
  const u = new URL(base); u.searchParams.set('only', String(n)); u.hash = 'only-' + s.id; // the query forces a real reload
  await open(u.toString());
  perScreen.push({ ...s, icons: (await run(COLLECT)) || [] });
  process.stdout.write(`\r${n + 1}/${screens.length} ${s.id}                    `);
}
console.log();

const by = new Map();
for (const s of perScreen) for (const i of s.icons) {
  const k = i.kind + ':' + i.name;
  const e = by.get(k) || { kind: i.kind, name: i.name, screens: new Set(), sizes: [], missing: false };
  e.screens.add(s.id); if (i.pt > 0) e.sizes.push(i.pt); e.missing ||= !!i.missing;
  by.set(k, e);
}
const icons = [...by.values()].map((e) => ({ kind: e.kind, name: e.name, screens: [...e.screens], min: e.sizes.length ? Math.min(...e.sizes) : null,
  max: e.sizes.length ? Math.max(...e.sizes) : null, missing: e.missing || undefined })).sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
writeFileSync(out, JSON.stringify({ base, screens: perScreen, icons }, null, 1));

// The table the brief starts from. Plan is a first guess; the owner's call wins.
const plan = (i) => i.kind === 'brand' ? (i.missing ? 'original: MISSING, fetch it or ask' : 'original')
  : i.kind === 'line' ? ((i.max || 0) >= 32 ? 'decide: line or illustrated' : 'line') : 'decide';
const pt = (i) => i.min == null ? 'hidden' : i.min === i.max ? `${i.min}` : `${i.min}–${i.max}`;
const md = ['| Kind | Name | Screens | pt | Plan |', '|---|---|---|---|---|',
  ...icons.map((i) => `| ${i.kind} | \`${i.name}\` | ${i.screens.join(', ')} | ${pt(i)} | ${plan(i)} |`)].join('\n');
writeFileSync(out.replace(/\.json$/, '') + '.md', md + '\n');
const count = (k) => icons.filter((i) => i.kind === k).length;
console.log(`${perScreen.length} screens: ${count('line')} line, ${count('image')} image, ${count('emoji')} emoji, ${count('brand')} brand (${icons.filter((i) => i.missing).length} missing) -> ${out}`);
ws.close(); chrome.kill(); process.exit(0);
