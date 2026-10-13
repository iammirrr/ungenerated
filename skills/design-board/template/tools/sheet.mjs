// A contact sheet: several screenshots side by side in one image, labelled, to compare frames.
//   node tools/sheet.mjs out.png shots/goal-600.png shots/goal-1400.png ...
import { writeFileSync, mkdtempSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const [out, ...imgs] = process.argv.slice(2);
if (!out || !imgs.length) { console.error('usage: sheet.mjs out.png img1.png img2.png ...'); process.exit(1); }
const cols = Math.min(5, imgs.length), rows = Math.ceil(imgs.length / cols);
const html = `<!doctype html><body style="margin:0;background:#8a8a88;display:flex;flex-wrap:wrap;gap:6px;padding:6px;font:12px system-ui">${imgs.map((p) => `<figure style="margin:0"><img src="file://${resolve(p)}" style="width:300px;display:block"><figcaption>${basename(p)}</figcaption></figure>`).join('')}</body>`;
const dir = mkdtempSync(join(tmpdir(), 'sheet-'));
const page = join(dir, 'sheet.html');
writeFileSync(page, html);
const r = spawnSync(process.execPath, [new URL('./capture.mjs', import.meta.url).pathname, 'file://' + page, join(dir, 'shot'), '1200', 'light'], { env: { ...process.env, W: String(cols * 306 + 6), H: String(rows * 690 + 10), DSF: '1' }, encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
spawnSync('cp', [join(dir, 'shot-1200.png'), out]);
console.log(out);
