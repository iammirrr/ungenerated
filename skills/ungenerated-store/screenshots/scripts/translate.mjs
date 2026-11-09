// Translates a board's words into the App Store's languages:  node <skill>/scripts/translate.mjs <screens folder> [--lang=de-DE,ja] [--redo=ja]
// Reads strings/en.json (shoot.mjs --collect), writes strings/<lang>.json, translating only texts not yet there, so an
// English change costs one line per language. Headlines keep their " / " lines and the one [boxed] word. Only the
// headlines and the app's interface words are sent: content people write (scripts, captions) stays English, since the
// app doesn't write in other languages yet. Needs ANTHROPIC_API_KEY (environment or .env in the repo root).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// App Store Connect's localizations (English variants reuse the English set)
const LOCALES = ['ar-SA', 'bn-BD', 'ca', 'cs', 'da', 'de-DE', 'el', 'es-ES', 'es-MX', 'fi', 'fr-FR', 'fr-CA', 'gu-IN', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kn-IN', 'ko', 'ml-IN', 'mr-IN', 'ms', 'nl-NL', 'no', 'or-IN', 'pa-IN', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sl-SI', 'sv', 'ta-IN', 'te-IN', 'th', 'tr', 'uk', 'ur-PK', 'vi', 'zh-Hans', 'zh-Hant'];
const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=')[1];
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('usage: node translate.mjs <screens folder> [--lang=de-DE,ja] [--redo=ja]'); process.exit(2); }
const P = resolve(dir);
let key = process.env.ANTHROPIC_API_KEY;
if (!key && existsSync('.env')) key = readFileSync('.env', 'utf8').match(/^ANTHROPIC_API_KEY=["']?([^"'\n]+)/m)?.[1];
if (!key) { console.error('set ANTHROPIC_API_KEY'); process.exit(2); }
const en = JSON.parse(readFileSync(join(P, 'strings', 'en.json'), 'utf8'));
let keep = [];
try { keep = JSON.parse(readFileSync(join(P, 'keep.json'), 'utf8')); } catch {}
const todo = en.filter((t) => !keep.includes(t));
const redo = (flag('redo') || '').split(',');
const box = (t) => (t.match(/\[/g) || []).length + '|' + (t.match(/ \/ /g) || []).length;

for (const lang of flag('lang')?.split(',') || LOCALES) {
  const file = join(P, 'strings', `${lang}.json`);
  let out = {};
  try { out = JSON.parse(readFileSync(file, 'utf8')); } catch {}
  const need = redo.includes(lang) ? todo : todo.filter((t) => !out[t]);
  if (!need.length) { console.log(`${lang}  up to date`); continue; }
  const prompt = `Translate these App Store screenshot texts for an iOS app into the language with code ${lang}, as a native app marketer would write them: short, punchy, natural, never longer than needed (headlines are huge type: each line must be about as short as the English one. In Japanese, Chinese and Korean, at most 6 characters per line and the bracketed word 1–4 characters; in Indic, Thai and Arabic scripts, at most 2–3 short words per line. Choose a punchy native ad phrase over a literal translation${redo.includes(lang) ? '; make them shorter than usual' : ''}). Headlines are written "line one / line two" with one word in [brackets]: keep exactly one " / " where it is and put the matching word in [brackets]. Other texts are the app's buttons and labels: translate them as the localized app would. Keep @handles, numbers, brand and product names as they are. Never imply the app writes scripts in ${lang}.\nReturn only JSON: an object mapping each English text to its translation.\n\n${JSON.stringify(need)}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 20000, messages: [{ role: 'user', content: prompt }] }) });
  const j = await res.json();
  if (!res.ok) { console.error(lang, j.error?.message || res.status); continue; }
  let got = {};
  const txt = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  try { got = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1)); } catch { console.error(lang, 'unreadable answer, run again:', txt.slice(0, 200)); continue; }
  let bad = 0;
  for (const t of need) { if (typeof got[t] === 'string' && box(got[t]) === box(t)) out[t] = got[t]; else bad++; }
  writeFileSync(file, JSON.stringify(out, null, 1));
  console.log(`${lang}  ${need.length - bad} translated${bad ? `, ${bad} refused (brackets or lines lost): run again` : ''}`);
}
// the board's language picker lists what exists
writeFileSync(join(P, 'strings', 'langs.json'), JSON.stringify(readdirSync(join(P, 'strings')).filter((f) => /^[a-z]{2,3}(-[A-Za-z]+)?\.json$/.test(f) && f !== 'en.json').map((f) => f.slice(0, -5)).sort()));
