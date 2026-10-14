// Builds the public page from the skills and the examples: site/index.html (from site-src/index.html,
// with the six example apps, their kits and the catalogue filled in), site/skills/<name>.html (one
// page per skill, rendered from its SKILL.md), and site/board/ (the design-board template's engine
// running the six example apps from examples/).
// Runs on every push (.github/workflows/pages.yml), so the page always matches the repository.
//   node scripts/build-site.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site');
const REPO = 'https://github.com/iammirrr/ungenerated';
const groups = JSON.parse(readFileSync(join(root, 'scripts/groups.json'), 'utf8')).groups;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${u.replace(/^(skills\/)?([\w-]+)\/SKILL\.md$/, '$2.html')}">${t}</a>`);

/** A small Markdown renderer: headings, paragraphs, lists, tables, code blocks, quotes. */
const markdown = (md) => {
  const lines = md.split('\n');
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const hm = l.match(/^(#{1,4}) (.*)/);
    if (hm) { html.push(`<h${hm[1].length + 1}>${inline(hm[2])}</h${hm[1].length + 1}>`); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const body = rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      html.push(`<div class="table"><table><thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`);
      continue;
    }
    if (/^(\s*)([-*]|\d+\.) /.test(l)) {
      const ordered = /^\s*\d+\./.test(l);
      const items = [];
      while (i < lines.length && (/^(\s*)([-*]|\d+\.) /.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^(\s*)([-*]|\d+\.) /.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.) /, '').replace(/^\[ \] /, '☐ '));
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      html.push(`<${ordered ? 'ol' : 'ul'}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    if (/^> /.test(l)) { html.push(`<blockquote>${inline(l.slice(2))}</blockquote>`); i++; continue; }
    if (!l.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#|```|\||\s*([-*]|\d+\.) |> )/.test(lines[i])) para.push(lines[i++]);
    html.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return html.join('\n');
};

const readSkill = (name) => {
  const text = readFileSync(join(root, 'skills', name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  fm[1].split('\n').forEach((l) => { const m = l.match(/^(\w[\w-]*): (.*)$/); if (m) meta[m[1]] = m[2]; });
  const body = text.slice(fm[0].length).replace(/^\s*# .*\n/, '');
  const short = meta.description.split(' - ')[0].split('. Use')[0].replace(/\.$/, '');
  const refs = existsSync(join(root, 'skills', name, 'references')) ? readdirSync(join(root, 'skills', name, 'references')) : [];
  return { name, description: meta.description.replace(' - ', ': '), short, body, refs, hasTemplate: existsSync(join(root, 'skills', name, 'template')) };
};

let commit = 'local', date = new Date();
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  date = new Date(execSync('git log -1 --format=%cI', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim());
} catch {}
const when = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const total = groups.reduce((n, g) => n + g.skills.length, 0);
const APPS = JSON.parse(readFileSync(join(root, 'examples/apps.json'), 'utf8'));
const src = (f) => readFileSync(join(root, 'site-src', f), 'utf8');
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

// Fonts: the page's two, and the six apps' (the kits and the phones are drawn in them).
const FONTS_SITE = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wdth,wght@87.5..112.5,400..700&display=swap';
const FONTS_ALL = FONTS_SITE.replace('&display=swap', '&family=Baloo+2:wght@600;800&family=Big+Shoulders+Display:wght@800&family=Cormorant+Garamond:wght@600&family=Gloock&family=Inter:wght@400;600;800&family=Schibsted+Grotesk:wght@400;600;700&family=Young+Serif&display=swap');
const BLURB = {
  'Start here': 'How the work runs, and what the app is before anything is drawn.',
  Foundation: 'The kit, the motion, the feel under the finger, and words that sound like a person.',
  'The board': 'Where every screen lives as a working phone, and how it gets reviewed.',
  'The flow': 'Every screen of a subscription app, from the first beat to the cancel button.',
  Quality: 'The checks that keep it honest, and the way to native code and the App Store.',
};
// Which example app shows a skill at work: the first app that lists it.
const appFor = (name) => APPS.apps.find((a) => a.skills.includes(name));
const SYS = 'ui-sans-serif, -apple-system, "SF Pro Text", system-ui, sans-serif';
const kitVars = (k) => [
  `--k-ground:${k.ground}`, `--k-ink:${k.ink}`, `--k-strong:${k.inkStrong}`, `--k-muted:${k.inkMuted}`,
  `--k-font:${k.fontCss.replace(/"/g, "'")}`, `--k-body:${(k.body === 'same' ? k.fontCss : SYS).replace(/"/g, "'")}`,
  `--k-btn:${k.btn}`, `--k-btn-ink:${k.btnInk}`, `--k-r:${k.radius}px`, `--k-weight:${k.weight || 400}`,
  k.case ? `--k-case:${k.case}` : '', k.track ? `--k-track:${k.track}` : '',
].filter(Boolean).join(';');
const kitCard = (a, i) => `<article class="kit" style="${kitVars(a.kit)};--i:${i}">
  <div class="kit-head"><h3 class="kit-name">${esc(a.name)}</h3><span class="kit-step">${esc(a.step)}</span></div>
  <p class="kit-mood">${esc(a.kit.mood)}</p>
  <div class="kit-sw">${a.kit.swatches.map(([n, c]) => `<div><i style="background:${c}"></i><small>${esc(n)}</small></div>`).join('')}</div>
  <div class="kit-type"><b>Aa</b><span><strong>${esc(a.kit.font)}</strong>${a.kit.body === 'same' ? 'for every word' : 'for headings; the system face for the rest'}</span></div>
  <span class="kit-btn">${a.step === 'Leaving' ? 'Continue to cancel' : 'Continue'}</span>
</article>`;
const G = APPS.generated;
const defaultKit = `<article class="kit is-default">
  <div class="kit-head"><h3 class="kit-name">Default ✨</h3><span class="kit-step">Generated</span></div>
  <p class="kit-mood">${esc(G.what)}</p>
  <div class="kit-sw">${G.swatches.map(([n, c]) => `<div><i style="background:${c}"></i><small>${esc(n)}</small></div>`).join('')}</div>
  <div class="kit-type"><b>Aa</b><span><strong>${esc(G.font)}</strong>for every word, in every app</span></div>
  <ul class="kit-wrong">${G.notes.map((t, i) => `<li style="--i:${i}"><span class="pin">${i + 1}</span><span class="kw">${esc(t)}</span></li>`).join('')}</ul>
  <span class="kit-btn">Get Started 🚀</span>
</article>`;
const kitsHtml = `${defaultKit}<div class="kit-grid">${APPS.apps.map(kitCard).join('')}</div>`;

// Empty site/ rather than removing it, so a local server running inside it keeps working.
if (existsSync(out)) readdirSync(out).forEach((f) => rmSync(join(out, f), { recursive: true, force: true }));
mkdirSync(join(out, 'skills'), { recursive: true });

const skills = Object.fromEntries(groups.flatMap((g) => g.skills).map((n) => [n, readSkill(n)]));
const order = groups.flatMap((g) => g.skills);

// ---------------------------------------------------------------- the home page
let n = 0;
const catalogue = groups.map((g, gi) => `
<section class="group">
  <div class="group-head"><span class="g-num">${String(gi + 1).padStart(2, '0')}</span><h3>${esc(g.title)}</h3><p>${esc(BLURB[g.title] || '')}</p></div>
  <div class="g-grid">${g.skills.map((name) => { const s = skills[name]; const a = appFor(name); n++; return `
    <a class="sk" href="skills/${s.name}.html" data-search="${esc((s.name + ' ' + s.description).toLowerCase())}">
      <span><span class="sk-name"><i>${String(n).padStart(2, '0')}</i>${s.name}</span><span class="sk-desc">${inline(s.short)}.</span></span>
      ${a && g.title === 'The flow' ? `<span class="sk-thumb"><img src="shots/${a.id}-after.webp" alt="" loading="lazy" width="52" height="112"></span>` : ''}
    </a>`; }).join('')}
  </div>
</section>`).join('');
const pillVars = (a) => `--a-ground:${a.kit.ground};--a-accent:${a.kit.accent}`;
writeFileSync(join(out, 'index.html'), fill(src('index.html'), {
  TOTAL: total, REPO, COMMIT: commit, WHEN: esc(when), FONTS: FONTS_ALL,
  FIRST_BEFORE: APPS.apps[0].before.id, FIRST_AFTER: APPS.apps[0].after.id,
  HERO_TABS: APPS.apps.map((a, i) => `<button type="button" class="app-pill" role="tab" aria-selected="${i === 0}" style="${pillVars(a)}"><i class="app-dot"></i>${esc(a.name)}</button>`).join(''),
  APP_TABS: APPS.apps.map((a, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" style="${pillVars(a)}"><i class="app-dot"></i>${esc(a.name)} <small>${esc(a.step.toLowerCase())}</small></button>`).join(''),
  STRIP: APPS.apps.map((a) => `<figure class="shot"><div class="dev"><div class="dev-screen"><img class="is-before" src="shots/${a.id}-before.webp" alt="${esc(a.name)}, the generated draft" width="390" height="844" loading="lazy"><img class="is-after" src="shots/${a.id}-after.webp" alt="${esc(a.name)}, with the skills" width="390" height="844" loading="lazy"></div></div><figcaption><b>${esc(a.name)}</b><span>${esc(a.step)}</span></figcaption></figure>`).join(''),
  KITS: kitsHtml,
  SKILLS: catalogue,
  APPS_JSON: JSON.stringify(APPS).replace(/</g, '\\u003c'),
}));

// ---------------------------------------------------------------- one page per skill
const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const skillPage = (s, g) => {
  const i = order.indexOf(s.name), prev = order[i - 1], next = order[i + 1];
  const body = markdown(s.body).replace(/<h([23])>(.*?)<\/h\1>/g, (m, lv, t) => `<h${lv} id="${slug(t)}">${t}</h${lv}>`);
  const toc = [...body.matchAll(/<h3 id="([^"]+)">(.*?)<\/h3>/g)].map(([, id, t]) => `<a href="#${id}">${t.replace(/<[^>]+>/g, '')}</a>`).join('');
  const a = appFor(s.name);
  let example = '';
  if (s.name === 'design-kit') example = `<figure class="sk-example is-kits"><div class="kits is-in">${kitsHtml}</div><figcaption>The default kit every generated draft shares, and the six kits this skill made for the example apps.</figcaption></figure>`;
  else if (a) example = `<figure class="sk-example">
    <div class="sk-pair">
      <div><span class="tag is-gen">Generated draft</span><img src="../shots/${a.id}-before.webp" alt="${esc(a.name)}, the generated draft" width="390" height="844" loading="lazy"></div>
      <div><span class="tag is-ung">With the skills</span><img src="../shots/${a.id}-after.webp" alt="${esc(a.name)}, with the skills" width="390" height="844" loading="lazy"></div>
    </div>
    <figcaption><b>${esc(a.name)}</b>: ${esc(a.what)} <a href="../board/#only-${a.after.id}">Play it live</a></figcaption>
  </figure>`;
  return fill(src('skill.html'), {
    TITLE: esc(`${s.name} · Ungenerated`), DESC: esc(s.short), REPO, COMMIT: commit, WHEN: esc(when),
    FONTS: s.name === 'design-kit' ? FONTS_ALL : FONTS_SITE,
    GROUP: esc(g.title), NAME: s.name, LEDE: inline(s.description),
    META: `<a href="${REPO}/blob/main/skills/${s.name}/SKILL.md">SKILL.md</a>${s.refs.map((r) => `<a href="${REPO}/blob/main/skills/${s.name}/references/${r}">${esc(r)}</a>`).join('')}${s.hasTemplate ? `<a href="../board/">The example board</a>` : ''}`,
    SIDE: groups.map((gg) => `<p>${esc(gg.title)}</p>${gg.skills.map((x) => `<a href="${x}.html"${x === s.name ? ' aria-current="page"' : ''}>${x}</a>`).join('')}`).join(''),
    TOC: toc ? `<p>On this page</p>${toc}` : '', EXAMPLE: example, BODY: body,
    PAGER: `${prev ? `<a href="${prev}.html"><small>Previous</small>${prev}</a>` : '<span></span>'}${next ? `<a class="is-next" href="${next}.html"><small>Next</small>${next}</a>` : '<span></span>'}`,
  });
};
groups.forEach((g) => g.skills.forEach((name) => writeFileSync(join(out, 'skills', `${name}.html`), skillPage(skills[name], g))));

['base.css', 'home.css', 'skill.css', 'home.js', 'page.js'].forEach((f) => writeFileSync(join(out, f), src(f)));
mkdirSync(join(out, 'shots'), { recursive: true });
if (existsSync(join(root, 'examples/shots'))) readdirSync(join(root, 'examples/shots')).forEach((f) => copyFileSync(join(root, 'examples/shots', f), join(out, 'shots', f)));

// The example board: the design-board template's engine, with the six example apps on it
// (examples/). Their kits come from examples/apps.json, so the page and the board share one source.
const copy = (from, to, skip = []) => {
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    if (skip.includes(f)) continue;
    const a = join(from, f), b = join(to, f);
    if (statSync(a).isDirectory()) copy(a, b); else copyFileSync(a, b);
  }
};
const board = join(out, 'board');
copy(join(root, 'skills/design-board/template'), board, ['tools', 'review', 'screens', 'board.config.js', 'index.html']);
copy(join(root, 'examples'), board, ['apps.json', 'shots', 'README.md']);
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
writeFileSync(join(board, 'css/kits.css'), `/* Built from examples/apps.json by scripts/build-site.mjs. Edit the JSON, not this file. */
` + APPS.apps.map(({ id, kit: k }) => `.ph.k-${id} {
  --font: ${k.body === 'same' ? k.fontCss : SYS}; --font-display: ${k.fontCss};
  --ground: ${k.ground}; --panel: ${k.panel}; --inset: ${k.inset}; --hover: ${k.hover}; --sunken: ${k.inset};
  --hair: ${rgba(k.inkStrong, 0.1)}; --hair-2: ${rgba(k.inkStrong, 0.16)};
  --ink-strong: ${k.inkStrong}; --ink: ${k.ink}; --ink-muted: ${k.inkMuted}; --ink-quiet: ${k.inkQuiet};
  --accent: ${k.accent}; --accent-text: ${k.accentText}; --accent-soft: ${rgba(k.accent, 0.14)}; --accent-line: ${rgba(k.accent, 0.5)};
  --btn: ${k.btn}; --btn-down: ${k.btnDown}; --btn-ink: ${k.btnInk}; --home-ind: ${k.inkStrong};
  --r-card: ${k.radius}px; --r-row: ${Math.max(10, k.radius - 4)}px;
  background: var(--ground); color: var(--ink); font-family: var(--font);
}`).join('\n'));
writeFileSync(join(board, 'board.config.js'), `/* Built from examples/apps.json by scripts/build-site.mjs. */
window.APPS = ${JSON.stringify(APPS)};
window.BOARD = {
  name: 'Ungenerated · six apps',
  id: 'ungenerated-examples',
  views: [['screens', 'Screens'], ['kit', 'Kits']],
  startView: 'screens',
  sections: ${JSON.stringify([
    { id: 'ungenerated', title: 'With the skills', intent: 'Six made-up apps, one step of each: the opening, a question, the plan, the paywall, a permission and leaving. Each is designed with the skills named under it on the page. The first card plays all six.' },
    { id: 'generated', title: 'Generated drafts', intent: 'The same six screens as a model draws them from the same brief, with no skills loaded. They are made of one default kit, so they look like one app.' },
    { id: 'kits', view: 'kit', title: 'Seven kits', intent: 'The default kit every generated draft shares, then the six kits the skills made. Nothing is shared between them but the rules.' },
  ], null, 2)},
  research: {},
};
`);
console.log(`site/ built: ${total} skills, ${APPS.apps.length} example apps, ${commit}, ${when}`);
