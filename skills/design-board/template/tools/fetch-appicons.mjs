// Fetches the official App Store artwork for the apps your screens show, into assets/appicons/.
//   node tools/fetch-appicons.mjs slack:618783545 notion:1232780281 "figma=figma"
// key:<App Store id> looks the app up by id; key=<search term> searches and takes the first app
// whose name contains the term. Icons are third-party trademarks: use them only to name the app,
// on your private board, and do not commit them to a public repository.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'appicons');
const args = process.argv.slice(2);
if (!args.length) { console.error('usage: fetch-appicons.mjs key:<appStoreId> key=<search term> ...'); process.exit(1); }
const get = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); return r; };
const lookup = async (id) => (await (await get(`https://itunes.apple.com/lookup?id=${id}&country=us`)).json()).results[0];
const search = async (term) => {
  const res = (await (await get(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&country=us&limit=10`)).json()).results;
  return res.find((r) => r.trackName.toLowerCase().includes(term.toLowerCase())) || null;
};
mkdirSync(OUT, { recursive: true });
for (const a of args) {
  const [key, value] = a.includes(':') ? a.split(':') : a.split('=');
  const r = a.includes(':') ? await lookup(value) : await search(value);
  if (!r) { console.log(`MISSING ${key}`); continue; }
  const png = Buffer.from(await (await get(r.artworkUrl512.replace(/\/[^/]+$/, '/180x180bb.png'))).arrayBuffer());
  writeFileSync(join(OUT, `${key}.png`), png);
  console.log(`${key.padEnd(14)} ${r.trackName} — ${r.sellerName}`);
}
