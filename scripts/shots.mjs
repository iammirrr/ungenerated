// Screenshots of the examples for the page and the README, taken from the live board in real
// time (no virtual time, so motion lands where it would for a person). Run after a build:
//   node scripts/build-site.mjs && node scripts/shots.mjs
// Needs Chrome or Chromium (set CHROME to its path if it is not found), and ffmpeg with libwebp for
// the animated scan (set FFMPEG; skipped without it). Writes examples/shots/. Name parts to redo only
// those: node scripts/shots.mjs lull board readme-scan
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, mkdtempSync, statSync, rmSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'site');
const outDir = join(root, 'examples/shots');
mkdirSync(outDir, { recursive: true });
const only = process.argv.slice(2);

// When each screen shows what it is for (ms after it starts).
const MOMENTS = {
  'loaf-generated': 2600, 'loaf-opening': 11900,
  'stride-generated': 3100, 'stride-distance': 5600,
  'halves-generated': 1500, 'halves-plan': 4300,
  'lull-generated': 2600, 'lull-paywall': 2700,
  'parla-generated': 2700, 'parla-mic': 9000,
  'fern-generated': 2600, 'fern-leaving': 5100,
};

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(site, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const CANDIDATES = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
const CHROME = CANDIDATES.find((c) => existsSync(c));
if (!CHROME) { console.error('Chrome not found; set CHROME'); process.exit(1); }
const port = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'shots-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result.value;
await send('Page.enable');

const open = async (url, w, h, scheme = 'light') => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await send('Page.navigate', { url: 'about:blank' });
  await sleep(150);
  await send('Page.navigate', { url });
  // Wait for fonts, then start the clock from there.
  for (let i = 0; i < 40; i++) { await sleep(150); if (await evaluate('document.readyState === "complete" && document.fonts.status === "loaded"')) break; }
};
const shoot = async (file, clip, quality = 90) => {
  const r = await send('Page.captureScreenshot', { format: 'webp', quality, captureBeyondViewport: !!clip, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  writeFileSync(join(outDir, file), Buffer.from(r.result.data, 'base64'));
  console.log('wrote', file);
};
const want = (name) => !only.length || only.some((o) => name.includes(o));

// Every phone, at its moment. The embed restarts the screen once the fonts are in.
for (const [screen, ms] of Object.entries(MOMENTS)) {
  const app = screen.split('-')[0];
  const file = `${app}-${/generated/.test(screen) ? 'before' : 'after'}.webp`;
  if (!want(file)) continue;
  await open(`${base}board/embed.html#${screen}`, 390, 844);
  await evaluate(`window.postMessage({ cmd: 'restart' }, '*')`);
  await sleep(ms);
  await shoot(file);
}

// The board, as a visitor first sees it.
if (want('board')) {
  await open(`${base}board/`, 1440, 900, 'dark');
  await sleep(7000);
  await shoot('board.webp', null, 84);
}

// README posters: parts of the home page itself, in a still state (?still).
const element = async (sel) => evaluate(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
const posters = [
  ['readme-hero.webp', '.hero', 1440, 900, 6200],
  ['readme-pairs.webp', '#before-after', 1440, 1100, 2500],
  ['readme-fix.webp', '#apps', 1440, 1100, 3500],
  ['readme-kits.webp', '#kits', 1440, 1100, 2500],
  ['readme-feel.webp', '#feel', 1440, 1100, 2500],
];
for (const [file, sel, w, h, ms] of posters) {
  if (!want(file)) continue;
  await open(`${base}?still=${encodeURIComponent(sel)}`, w, h);
  await evaluate(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'start' })`);
  await sleep(ms);
  const box = await element(sel);
  // Start under the section's top padding, clear of the shadows of the phones above it.
  const trim = sel === '.hero' ? 0 : 96;
  await shoot(file, { x: box.x, y: box.y + trim, width: box.width, height: Math.min(box.height - trim, 2600) }, 86);
}

// The README's moving picture: the strip's red line applying the skills, painted frame by frame
// (deterministic at any frame rate), then encoded as an animated WebP.
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
if (want('readme-scan') && !spawnSync(FFMPEG, ['-version']).error) {
  await open(base, 1280, 1000);
  await evaluate(`document.querySelector('#before-after').scrollIntoView({ block: 'start' })`);
  await sleep(1200);
  await evaluate(`document.querySelector('#strip-seg [data-mode="gen"]').click()`);
  await sleep(900);
  await evaluate(`window.__paint = (L, label, on) => {
    const row = document.querySelector('.strip-row'), scan = document.getElementById('scan');
    scan.style.transition = 'none'; scan.style.opacity = on ? 1 : 0; scan.querySelector('span').textContent = label;
    document.querySelectorAll('.shot').forEach((s) => { const sc = s.querySelector('.dev-screen'); const x = s.offsetLeft + sc.offsetLeft, w = sc.offsetWidth; s.style.setProperty('--f', Math.min(1, Math.max(0, (L - x) / w))); });
    scan.style.transform = 'translateX(' + (row.offsetLeft + L) + 'px)';
  }; 1`);
  const W = await evaluate(`document.querySelector('.strip-row').offsetWidth`);
  // Clip inside the viewport: capturing beyond it resizes the page, and the page repaints on resize.
  const box = await evaluate(`(() => { const r = document.querySelector('.strip').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY - 10, width: r.width, height: r.height - 46 }; })()`);
  const inout = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const plan = [];
  for (let i = 0; i < 10; i++) plan.push([-20, 'skills applied', false]);
  for (let i = 0; i <= 36; i++) plan.push([-20 + (W + 40) * inout(i / 36), 'skills applied', true]);
  for (let i = 0; i < 20; i++) plan.push([W + 20, 'skills applied', false]);
  for (let i = 0; i <= 26; i++) plan.push([W + 20 - (W + 40) * inout(i / 26), 'generated', true]);
  const dir = mkdtempSync(join(tmpdir(), 'scan-'));
  let n = 0;
  for (const [L, label, on] of plan) {
    await evaluate(`window.__paint(${L}, ${JSON.stringify(label)}, ${on})`);
    await sleep(30);
    const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } });
    writeFileSync(join(dir, `f${String(n++).padStart(4, '0')}.png`), Buffer.from(r.result.data, 'base64'));
  }
  spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', '12', '-i', join(dir, 'f%04d.png'), '-c:v', 'libwebp_anim', '-lossless', '0', '-quality', '70', '-loop', '0', join(outDir, 'readme-scan.webp')]);
  rmSync(dir, { recursive: true, force: true });
  console.log('wrote readme-scan.webp');
}

ws.close();
chrome.kill();
server.close();
