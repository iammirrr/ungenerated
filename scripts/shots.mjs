// Screenshots and recordings of the examples, for the page and the README, taken from the live
// board in real time. Run after a build:
//   node scripts/build-site.mjs && node scripts/shots.mjs [part ...]
// Parts (default: all): steps, pairs, board, posters, reels, motion. Or name screen ids.
// Needs Chrome or Chromium (CHROME=/path if not found) and, for the animated pictures, ffmpeg
// with libwebp (FFMPEG=/path; skipped without it). Writes examples/shots/.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, mkdtempSync, statSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import { readExamples } from './board-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'site');
const outDir = join(root, 'examples/shots');
['', 'steps'].forEach((d) => mkdirSync(join(outDir, d), { recursive: true }));
const args = process.argv.slice(2);
const want = (part) => !args.length || args.includes(part);
const wantId = (id) => !args.length || args.includes(id) || args.includes('steps');
const { APPS, FLOWS } = readExamples(root);
const flows = FLOWS.flows;

// The generated drafts: when each shows what it is (ms after it starts).
const DRAFTS = { loaf: 2600, stride: 3100, ripe: 2800, halves: 1500, lull: 2600, parla: 2700, fern: 2600 };

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  // A stage of several live phones side by side, for the README's moving pictures.
  if (url.pathname === '/stage.html') {
    const items = (url.searchParams.get('items') || '').split(',').filter(Boolean);
    const speed = url.searchParams.get('speed') || '1';
    const body = items.map((it) => `<div class="p"><iframe src="/board/embed.html?speed=${speed}#${it}"></iframe></div>`).join('');
    res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:${url.searchParams.get('bg') || '#f4f4f1'}}.s{display:flex;gap:36px;padding:40px}.p{flex:none;width:390px;height:844px;border-radius:52px;overflow:hidden;box-shadow:0 0 0 10px #0a0a09,0 30px 60px -30px rgba(0,0,0,.5)}iframe{width:390px;height:844px;border:0;display:block}</style><div class="s">${body}</div>`);
  }
  let f = join(site, decodeURIComponent(url.pathname));
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

const open = async (url, w, h, scheme = 'light', dsf = 2) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await send('Page.navigate', { url: 'about:blank' });
  await sleep(150);
  await send('Page.navigate', { url });
  for (let i = 0; i < 40; i++) { await sleep(150); if (await evaluate('document.readyState === "complete" && document.fonts.status === "loaded"')) break; }
};
const shoot = async (file, clip, quality = 84) => {
  const r = await send('Page.captureScreenshot', { format: 'webp', quality, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  writeFileSync(join(outDir, file), Buffer.from(r.result.data, 'base64'));
  console.log('wrote', file);
};
/** One screen, restarted once its fonts are in, captured at its moment. */
const screen = async (screenId, ms, file) => {
  await open(`${base}board/embed.html#${screenId}`, 390, 844);
  await evaluate(`window.postMessage({ cmd: 'restart' }, '*')`);
  await sleep(ms);
  await shoot(file);
};

// ---------------------------------------------------------------- every step of every flow
const seen = new Set();
for (const f of flows) for (const s of f.steps) {
  if (seen.has(s.id) || !wantId(s.id)) continue;
  seen.add(s.id);
  await screen(s.id, s.shot || 3000, `steps/${s.id}.webp`);
}

// ---------------------------------------------------------------- before and after, per app
if (want('pairs')) for (const a of APPS.apps) {
  if (a.before && a.before.id) await screen(a.before.id, DRAFTS[a.id] || 2600, `${a.id}-before.webp`);
  const step = join(outDir, 'steps', `${a.after.id}.webp`);
  if (existsSync(step)) copyFileSync(step, join(outDir, `${a.id}-after.webp`));
}

// ---------------------------------------------------------------- the board
if (want('board')) {
  await open(`${base}board/`, 1440, 900, 'dark');
  await sleep(7000);
  await shoot('board.webp', null, 82);
}

// ---------------------------------------------------------------- README posters: parts of the pages
const element = async (sel) => evaluate(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
// [file, page, the part, when (ms), width, height, and optionally: a step to run, then how long to wait]
const posters = [
  // The live phones restarted together, then taken when the after screen is finished (its shot time).
  ['readme-hero.webp', '?still', '.hero-stage', 3000, 1280, 1300, `document.querySelectorAll('.hero iframe').forEach((f) => f.contentWindow.postMessage({ cmd: 'restart' }, '*'))`, 4500],
  ['readme-lineup.webp', '?still', '.lineup', 2500, 1440, 1300],
  // Taller than the sheet: a clip beyond the window comes out blank.
  ['readme-kit.webp', 'board/kitsheet.html?autoplay#ripe', '.ks', 7600, 1040, 2200],
];
if (want('posters')) for (const [file, page, sel, ms, w, h, step, then] of posters) {
  await open(`${base}${page}`, w, h);
  await evaluate(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'start' })`);
  await sleep(ms);
  if (step) { await evaluate(step); await sleep(then); }
  const box = await element(sel);
  await shoot(file, { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 2600) }, 84);
}

// ---------------------------------------------------------------- moving pictures (animated WebP)
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const hasFF = !spawnSync(FFMPEG, ['-version']).error;
const encode = (dir, fps, file, q = 62) => {
  spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(dir, 'f%04d.png'), '-c:v', 'libwebp_anim', '-lossless', '0', '-quality', String(q), '-loop', '0', join(outDir, file)]);
  rmSync(dir, { recursive: true, force: true });
  console.log('wrote', file);
};

// A page recorded in slow motion (it reads ?speed) and played back at real speed.
const film = async (file, url, W, H, seconds, { speed = 0.25, scale = 0.55, q = 62, fps = 20, skip = 0, wait = 1800, fit = false } = {}) => {
  await open(url, W, H, 'light', 1);
  // fit: as tall as the page, so nothing is cut off.
  if (fit) { H = await evaluate('Math.ceil(document.documentElement.scrollHeight)'); await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }); }
  await sleep(wait + skip / speed);
  const dir = mkdtempSync(join(tmpdir(), 'reel-'));
  // One frame every 1/fps of content time: in slow motion that is (1000 / fps) / speed ms of wall time.
  const dt = 1000 / fps / speed, frames = Math.round(seconds * fps);
  const t0 = Date.now();
  for (let n = 0; n < frames; n++) {
    const wait = t0 + n * dt - Date.now();
    if (wait > 0) await sleep(wait);
    const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale } });
    writeFileSync(join(dir, `f${String(n).padStart(4, '0')}.png`), Buffer.from(r.result.data, 'base64'));
  }
  encode(dir, fps, file, q);
};
/** Live phones side by side. */
const record = (file, items, seconds, o = {}) => {
  const { speed = 0.25, bg = '#f4f4f1' } = o;
  const W = items.length * 390 + (items.length - 1) * 36 + 80, H = 844 + 80;
  return film(file, `${base}stage.html?speed=${speed}&bg=${encodeURIComponent(bg)}&items=${items.map(encodeURIComponent).join(',')}`, W, H, seconds, o);
};
if (want('reels') && hasFF) {
  await record('readme-paywalls.webp', ['flow=lull-paywall', 'flow=ripe-paywall', 'flow=stride-paywall'], 16);
  await record('readme-leaving.webp', ['flow=fern-leaving', 'flow=halves-leaving', 'flow=parla-leaving'], 16);
  await record('readme-openings.webp', ['flow=stride-open', 'flow=parla-open', 'flow=loaf-open'], 12);
}
// The motion sheet: one round of its four parts, in all seven styles and the default.
if (want('motion') && hasFF) {
  await film('readme-motion.webp', `${base}board/motionsheet.html?autoplay&speed=0.25`, 960, 1000, 7.6, { scale: 0.6, wait: 1500, fit: true });
}

ws.close();
chrome.kill();
server.close();
