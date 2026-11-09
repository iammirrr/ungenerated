// The audit: the little things an owner should never have to point out, checked on every page, size and language.
//   node <skill>/scripts/audit.mjs <screens folder> [--final] [--size=iphone69,ipad13] [--lang=en,de-DE,ja|all]
//                                   [--base=http://127.0.0.1:5199/<folder>] [--port=5199]
// Loads each page as the export does (same canvas, zoom, device and language) and reports:
//   cut       text cut inside its own box (overflow, a clamp or an ellipsis)
//   clipped   text half hidden by what holds it (a phone's screen, a card)
//   edge      text cut by the canvas's edge
//   overlap   two texts on top of each other
//   pill      the boxed word's letters leaking out of its pill
//   headline  a headline at the canvas's edge, or small on a wide canvas (iPad, Mac: it should use the width)
// Prints one line per finding and writes <folder>/out/audit.json; exits 1 when there is any cut, pill or overlap.
// Run it before showing the owner anything, fix what it finds, and run it again.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=') ?? d;
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('usage: node audit.mjs <screens folder> [--final] [--size=...] [--lang=...] [--base=URL]'); process.exit(2); }
const P = resolve(dir), REL = relative(process.cwd(), P).split('\\').join('/');
const cfg = JSON.parse(readFileSync(join(P, 'screens.json'), 'utf8'));
const SIZES = { iphone69: [1320, 2868], iphone65: [1284, 2778], iphone63: [1206, 2622], iphone55: [1242, 2208], ipad13: [2064, 2752], ipad129: [2048, 2732], mac: [2880, 1800] };
const sizes = flag('size', 'iphone69,iphone65,iphone63,iphone55,ipad13,ipad129').split(',');
let langs = flag('lang', 'en').split(',');
if (langs[0] === 'all') { langs = ['en']; try { langs.push(...readdirSync(join(P, 'strings')).filter((f) => /^[a-z]{2,3}(-[A-Za-z]+)?\.json$/.test(f) && f !== 'en.json').map((f) => f.slice(0, -5))); } catch {} }
const base = flag('base', `http://127.0.0.1:${flag('port', '5199')}/${REL}`);
let picks = {};
try { picks = JSON.parse(readFileSync(join(P, 'edits.json'), 'utf8')); } catch {}
try { if (flag('picks')) picks = JSON.parse(readFileSync(flag('picks'), 'utf8')); } catch {}
const vers = args.includes('--final') ? cfg.slots.map((s, i) => s.versions[picks[`__pick:${i + 1}`] ?? 0]) : cfg.slots.flatMap((s) => s.versions);
const CHROME = process.env.CHROME || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const sleep = (t) => new Promise((r) => setTimeout(r, t));

// runs inside the page
const CHECK = `(() => {
  const f = document.querySelector('.f'), W = innerWidth, H = innerHeight, out = [];
  const shown = (el) => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.2) return false; } return true; };
  const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
  const leaves = [...document.querySelectorAll('.f *')].filter((el) => !el.closest('svg, style, script') && own(el) && shown(el));
  const name = (el) => el.textContent.trim().replace(/\\s+/g, ' ').slice(0, 44);
  const ink = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
  const cv = document.createElement('canvas').getContext('2d');
  // the letters' own box: the line box narrowed to the font's real ascent and descent
  // one rect per line of the element's own text, each narrowed to the letters' real ascent and descent
  const glyphs = (el) => {
    const cs = getComputedStyle(el), out = [];
    cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    const m = cv.measureText('Hgjpy'), fb = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width < 1) continue;
        const z = r.height / fb || 1, base = r.top + m.fontBoundingBoxAscent * z;
        out.push({ left: r.left, right: r.right, top: base - m.actualBoundingBoxAscent * z, bottom: base + m.actualBoundingBoxDescent * z });
      }
    }
    return out;
  };
  // is the text at this point really seen, or under something opaque (a pop-out card covering the app's words)?
  const opaque = (e) => { const c = getComputedStyle(e).backgroundColor.match(/[\d.]+/g); return c && (c.length < 4 || +c[3] > 0.85) && c.slice(0, 3).join() !== '0,0,0' || (e.tagName === 'IMG'); };
  const seenBoth = (a, b, x, y) => {
    const stack = document.elementsFromPoint(x, y);
    const ia = stack.findIndex((e) => a.contains(e) || e === a), ib = stack.findIndex((e) => b.contains(e) || e === b);
    if (ia < 0 || ib < 0) return false;
    const [top, low] = ia < ib ? [ia, ib] : [ib, ia], under = stack[low];
    return !stack.slice(top + 1, low).some((e) => !e.contains(under) && opaque(e));
  };
  const area = (r) => Math.max(0, r.width) * Math.max(0, r.height);
  const meet = (a, b) => ({ width: Math.min(a.right, b.right) - Math.max(a.left, b.left), height: Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) });
  // cut text, measured with every tilt and move switched off for a moment (a tilted box's measure is inflated)
  const flat = document.createElement('style');
  flat.textContent = '.f, .f * { transform: none !important; rotate: none !important; scale: none !important; translate: none !important; }';
  document.head.append(flat);
  for (const el of leaves) {
    const cs = getComputedStyle(el), r = ink(el);
    if (r.width < 2 || r.height < 2) continue;
    // a box clips at its padding edge, so the text may run into the padding
    const bx = el.getBoundingClientRect();
    // under CSS zoom Chrome's text rects don't line up with element boxes: there the layout sizes decide
    const zoomed = document.documentElement.style.zoom || el.closest('[style*="zoom"]');
    const over = zoomed ? el.scrollWidth > el.clientWidth + 1 : r.right > bx.right + 1.5 || r.left < bx.left - 1.5 || r.bottom > bx.bottom + 1.5;
    if ((cs.overflow !== 'visible' || cs.textOverflow === 'ellipsis' || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none')) && (over || el.scrollHeight > el.clientHeight + 4)) out.push(['cut', name(el)]);
  }
  flat.remove();
  for (const el of leaves) {
    const r = ink(el);
    if (r.width < 2 || r.height < 2) continue;
    // half hidden by something that clips it (fully hidden is a choice; half is a mistake)
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ac = getComputedStyle(a);
      if (ac.overflow === 'visible' && ac.clipPath === 'none') continue;
      const b = a.getBoundingClientRect(), m = area(meet(r, b));
      if (m > 1 && m < area(r) - 4) { out.push(['clipped', name(el)]); break; }
    }
    const seen = area(meet(r, { left: 0, top: 0, right: W, bottom: H }));
    if (seen > 1 && seen < area(r) - 4) out.push(['edge', name(el)]);
  }
  for (let i = 0; i < leaves.length; i++) for (let j = i + 1; j < leaves.length; j++) {
    const a = leaves[i], b = leaves[j];
    if (a.contains(b) || b.contains(a) || (a.closest('h1') && a.closest('h1') === b.closest('h1'))) continue;
    let hit = false;
    for (const ra of glyphs(a)) for (const rb of glyphs(b)) {
      const mm = meet(ra, rb), m = area(mm);
      if (hit || m <= 30 || m < 0.2 * Math.min(area(ra), area(rb))) continue;
      const x = Math.max(ra.left, rb.left) + mm.width / 2, y = Math.max(ra.top, rb.top) + mm.height / 2;
      if (x > 0 && y > 0 && x < W && y < H && seenBoth(a, b, x, y)) hit = true;
    }
    if (hit) out.push(['overlap', name(a) + '  ×  ' + name(b)]);
  }
  // measured untilted: a tilted pill's box is inflated
  document.querySelectorAll('.f h1 .box').forEach((bx) => { const tf = bx.style.transform; bx.style.transform = 'none'; const b = bx.getBoundingClientRect(), g = glyphs(bx); bx.style.transform = tf; if (g.some((t) => t.top < b.top - 2 || t.bottom > b.bottom + 2 || t.left < b.left - 2 || t.right > b.right + 2)) out.push(['pill', name(bx)]); });
  const h1 = document.querySelector('.f h1');
  if (h1) {
    const lines = [...h1.children].map(ink), left = Math.min(...lines.map((l) => l.left)), right = Math.max(...lines.map((l) => l.right));
    if (left < 14 || right > W - 14) out.push(['headline', 'at the edge']);
    if (W > H * 0.6 && right - left < 0.45 * W) out.push(['headline', 'small for the canvas: ' + Math.round(((right - left) / W) * 100) + '% of the width']);
  }
  return [...new Map(out.map((o) => [o.join('|'), o])).values()];
})()`;

const port = 9400 + Math.floor(Math.random() * 90);
const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=3200,3200', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'audit-'))}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 120 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
if (!target) { proc.kill(); throw new Error('no Chrome: set CHROME=/path/to/chrome'); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const val = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const report = [];
let bad = 0;
try {
  for (const lang of langs) for (const size of sizes) {
    const [W, H] = SIZES[size];
    const dsf = W % 3 === 0 && H % 3 === 0 ? 3 : 2, vw = W / dsf, vh = H / dsf, z = Math.min(vw / 440, vh / 956), cw = vw / z;
    await send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: 1, mobile: false, screenWidth: vw, screenHeight: vh });
    for (const v of vers) {
      const file = (size.startsWith('ipad') && v.ipad) || v.file;
      await send('Page.navigate', { url: `${base}/${file}.html?shot=1&w=${cw}&z=${z}&lang=${lang}&dev=${size}&t=${Date.now()}` });
      for (let i = 0; i < 200; i++) { await sleep(120); if (await val('document.documentElement.dataset.ready === "1"')) break; }
      await val('document.fonts.ready');
      await sleep(250);
      const found = (await val(CHECK)) || [];
      for (const [kind, what] of found) {
        report.push({ page: file, size, lang, kind, what });
        if (['cut', 'pill', 'overlap'].includes(kind)) bad++;
        console.log(`${kind.padEnd(8)} ${file.padEnd(18)} ${size.padEnd(9)} ${lang.padEnd(6)} ${what}`);
      }
    }
  }
} finally { ws.close(); proc.kill(); }
mkdirSync(join(P, 'out'), { recursive: true });
writeFileSync(join(P, 'out', 'audit.json'), JSON.stringify(report, null, 1));
console.log(`\n${report.length} findings (${bad} must fix: cut, pill, overlap) in ${vers.length} pages x ${sizes.length} sizes x ${langs.length} languages -> out/audit.json`);
process.exit(bad ? 1 : 0);
