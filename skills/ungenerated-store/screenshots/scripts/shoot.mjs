// The App Store files:  node <skill>/scripts/shoot.mjs <screens folder> [--size=iphone69,iphone65,iphone63,ipad13] [--lang=en,de-DE,ja|all] [--port=5199] [--final] [--collect]
// Every size keeps the frame's proportions: scaled uniformly to the canvas, centred, its field running edge to edge
// (iPad 13" gets the same composition, wider field; nothing stretched). --lang renders each language from
// strings/<lang>.json (translate.mjs) into out/<lang>/<size>/. --collect writes strings/en.json, the words to translate.
// Renders every version of every slot in <folder>/screens.json (with the owner's edits) at Apple's exact pixels as PNG
// (opaque: Apple refuses alpha) into <folder>/out/<size>/<file>.png; --final renders only the version picked on the
// board for each slot (edits.json "__pick:<slot>", the first when none) as out/<size>/final/NN.png, the set that ships.
// Needs serve.mjs running from the repo root, and Chrome (CHROME=/path/to/chrome when it isn't in /Applications).
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split('=')[1] ?? d;
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('usage: node shoot.mjs <screens folder> [--size=iphone69,iphone65,iphone63] [--port=5199] [--true]'); process.exit(2); }
const P = resolve(dir), REL = relative(process.cwd(), P).split('\\').join('/');
const cfg = JSON.parse(readFileSync(join(P, 'screens.json'), 'utf8'));
// Apple's accepted sizes in pixels (App Store Connect, screenshot specifications)
const SIZES = { iphone69: [1320, 2868], iphone65: [1284, 2778], iphone63: [1206, 2622], iphone55: [1242, 2208], ipad13: [2064, 2752], ipad129: [2048, 2732], mac: [2880, 1800] };
const sizes = flag('size', 'iphone69').split(',');
let langs = flag('lang', 'en').split(',');
if (langs[0] === 'all') { langs = ['en']; try { langs.push(...readdirSync(join(P, 'strings')).filter((f) => f.endsWith('.json') && f !== 'en.json').map((f) => f.slice(0, -5))); } catch {} }
const COLLECT = args.includes('--collect');
const PORT = flag('port', '5199');
const CHROME = process.env.CHROME || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const sleep = (t) => new Promise((r) => setTimeout(r, t));

const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=3200,3200', '--force-color-profile=srgb', '--remote-debugging-port=9497', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'shots-'))}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 120 && !target; i++) { await sleep(250); try { target = (await (await fetch('http://127.0.0.1:9497/json/list')).json()).find((t) => t.type === 'page'); } catch {} }
if (!target) { proc.kill(); throw new Error('no Chrome: set CHROME=/path/to/chrome'); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const val = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
let picks = {};
try { picks = JSON.parse(readFileSync(join(P, 'edits.json'), 'utf8')); } catch {}
const FINAL = args.includes('--final');
// a version can name its own iPad page ("ipad" in screens.json): iPad sizes use it, under the version's own name
const ipadOf = Object.fromEntries(cfg.slots.flatMap((s) => s.versions.filter((v) => v.ipad).map((v) => [v.file, v.ipad])));
const pages = FINAL ? cfg.slots.map((s, i) => [i + 1, s.versions[picks[`__pick:${i + 1}`] ?? 0].file]) : cfg.slots.flatMap((s, i) => s.versions.map((v) => [i + 1, v.file]));
const load = async (url) => {
  await send('Page.navigate', { url: `${url}&t=${Date.now()}` });
  for (let i = 0; i < 200; i++) { await sleep(150); if (await val('document.documentElement.dataset.ready === "1"')) break; }
  await val('document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => 0))))');
  await sleep(300);
};
const base = `http://127.0.0.1:${PORT}/${REL}`;
try {
  if (COLLECT) {
    await send('Emulation.setDeviceMetricsOverride', { width: 440, height: 956, deviceScaleFactor: 1, mobile: false });
    const all = new Set();
    for (const [, file] of pages) { await load(`${base}/${file}.html?shot=1`); const c = await val('window.__collect && window.__collect()'); if (c) { if (c.h1) all.add(c.h1); c.texts.forEach((t) => all.add(t)); } }
    mkdirSync(join(P, 'strings'), { recursive: true });
    writeFileSync(join(P, 'strings', 'en.json'), JSON.stringify([...all], null, 1));
    console.log(`strings/en.json  ${all.size} texts (headlines as "line / [boxed] line"); keep a text English by adding it to keep.json`);
  }
  for (const lang of COLLECT ? [] : langs) for (const size of sizes) {
    const [W, H] = SIZES[size] || (() => { throw new Error('unknown size ' + size); })();
    // a whole-number scale (Chrome ignores a viewport that isn't whole CSS pixels): 3x for iPhone, 2x for iPad and Mac,
    // the viewport exactly Apple's pixels / that scale, and the frame zoomed to fit inside (z), so the PNG is exact
    const dsf = W % 3 === 0 && H % 3 === 0 ? 3 : 2, vw = W / dsf, vh = H / dsf, z = Math.min(vw / 440, vh / 956), cw = vw / z;
    // a fresh page per size: a changed scale factor doesn't always reach a page already open
    await send('Emulation.clearDeviceMetricsOverride');
    await send('Page.navigate', { url: 'about:blank' });
    await sleep(300);
    await send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: dsf, mobile: false, screenWidth: vw, screenHeight: vh });
    const dirOut = langs.length > 1 || lang !== 'en' ? join(P, 'out', lang, size) : join(P, 'out', size);
    mkdirSync(join(dirOut, 'final'), { recursive: true });
    for (const [n, file] of pages) {
      await load(`${base}/${(size.startsWith('ipad') && ipadOf[file]) || file}.html?shot=1&w=${cw}&z=${z}&lang=${lang}&dev=${size}`);
      const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: vw, height: vh, scale: 1 } });
      const name = FINAL ? join('final', `${String(n).padStart(2, '0')}.png`) : `${file}.png`;
      writeFileSync(join(dirOut, name), Buffer.from(r.result.data, 'base64'));
      console.log(`${relative(P, dirOut)}/${name}  ${W} x ${H}`);
    }
  }
} finally { ws.close(); proc.kill(); }
