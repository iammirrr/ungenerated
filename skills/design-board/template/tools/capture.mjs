// Real-time screenshots of a screen or beat, through the Chrome DevTools protocol.
//
//   node tools/capture.mjs <url> <out-prefix> <ms,ms,...> [light|dark] [ms=js ...]
//   node tools/capture.mjs "http://localhost:4173/#only-q-goal" shots/goal 600,1400,2600 dark
//   node tools/capture.mjs "http://localhost:4173/#play" shots/flow 1500 light "2000=document.querySelector('.btn').click()"
//
// Why real time: headless "virtual time" screenshots freeze Web Animations part-way and show
// frames that never happen. This drives a real browser and captures at wall-clock times.
// Needs Chrome or Chromium; set CHROME=/path/to/chrome if it is not found. Screens are 390 × 844
// at 2×; set W, H and DSF to capture the whole board (W=1440 H=900 DSF=1).
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const [url, out, times, theme = 'light', ...acts] = process.argv.slice(2);
if (!url || !out || !times) { console.error('usage: capture.mjs <url> <out-prefix> <ms,ms,...> [light|dark] [ms=js ...]'); process.exit(1); }
const findChrome = () => {
  if (process.env.CHROME) return process.env.CHROME;
  const pw = join(homedir(), 'Library/Caches/ms-playwright');
  const cands = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ];
  if (existsSync(pw)) for (const d of readdirSync(pw).filter((x) => x.startsWith('chromium-'))) cands.push(join(pw, d, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'), join(pw, d, 'chrome-linux/chrome'));
  return cands.find(existsSync);
};
const chrome = findChrome();
if (!chrome) { console.error('No Chrome found. Set CHROME=/path/to/chrome.'); process.exit(1); }
const W = Number(process.env.W || 390), H = Number(process.env.H || 844), DSF = Number(process.env.DSF || 2);
const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--window-size=${W},${H}`, '--user-data-dir=' + join(tmpdir(), 'capture-' + port), 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map(); const logs = [];
for (let i = 0; i < 60 && !ws; i++) {
  try { const pg = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); if (pg) ws = new WebSocket(pg.webSocketDebuggerUrl); } catch {}
  if (!ws) await sleep(100);
}
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') logs.push('Exception: ' + JSON.stringify(d.params.exceptionDetails).slice(0, 400));
  if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) logs.push(d.params.type + ': ' + d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: false });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
await send('Page.enable');
await send('Page.navigate', { url });
const t0 = Date.now();
const steps = times.split(',').map(Number).map((t) => ({ t, kind: 'shot' }));
for (const a of acts) { const [t, ...code] = a.split('='); steps.push({ t: Number(t), kind: 'js', code: code.join('=') }); }
steps.sort((a, b) => a.t - b.t);
mkdirSync(dirname(out) || '.', { recursive: true });
for (const s of steps) {
  const wait = s.t - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
  if (s.kind === 'js') { const r = await send('Runtime.evaluate', { expression: s.code }); if (r.result?.exceptionDetails) logs.push('Script error: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300)); continue; }
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${out}-${s.t}.png`, Buffer.from(r.result.data, 'base64'));
  console.log(`${out}-${s.t}.png`);
}
if (logs.length) console.log(logs.join('\n'));
proc.kill();
process.exit(0);
