// Turns the pictures you made (ChatGPT, a camera, an illustrator) into the light WebP files the
// example apps load. Put the originals in examples/images-src/ named by their id from
// examples/images.json (parla-tazza-hello.png, loaf-crumb.jpg, ...); that folder is not committed.
//   node scripts/images.mjs            then node scripts/build-site.mjs
// Needs ffmpeg with libwebp (FFMPEG=/path if it is not on the PATH).
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'examples/images-src'), out = join(root, 'examples/images');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
if (spawnSync(FFMPEG, ['-version']).error) { console.error('ffmpeg not found; set FFMPEG'); process.exit(1); }
if (!existsSync(src)) { console.error('Put the originals in examples/images-src/ first.'); process.exit(1); }
mkdirSync(out, { recursive: true });
const IMAGES = JSON.parse(readFileSync(join(root, 'examples/images.json'), 'utf8')).images;
// The longest side each kind needs on a 2× phone (an app icon is shown at 60 points at most).
const LONG = { photo: 1200, illustration: 1200, mascot: 640, avatar: 256, icon: 256 };
let done = 0;
for (const f of readdirSync(src)) {
  const id = basename(f, extname(f));
  const info = IMAGES.find((i) => i.id === id);
  if (!info || !/\.(png|jpe?g|webp)$/i.test(f)) { console.log('skipped', f, info ? '' : '(no such id in images.json)'); continue; }
  const L = LONG[info.kind] || 1200;
  const args = ['-y', '-loglevel', 'error', '-i', join(src, f), '-vf', `scale='if(gt(iw,ih),min(${L},iw),-2)':'if(gt(iw,ih),-2,min(${L},ih))'`, '-c:v', 'libwebp', '-quality', info.kind === 'icon' ? '90' : '82'];
  if (info.transparent) args.push('-pix_fmt', 'yuva420p');
  args.push(join(out, `${id}.webp`));
  const r = spawnSync(FFMPEG, args);
  if (r.status === 0) { done++; console.log('wrote', `${id}.webp`); } else console.log('failed', f, String(r.stderr));
}
console.log(`${done} picture(s) ready in examples/images/. Rebuild the site to use them.`);
