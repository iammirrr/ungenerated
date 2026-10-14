// Builds the public page from the skills and the examples: site/index.html (from site-src/index.html,
// with the example apps, their flows, kits and motion styles and the catalogue filled in),
// site/skills/<name>.html (one page per skill, rendered from its SKILL.md, with the flows that show
// it at work), and site/board/ (the design-board template's engine running the example apps).
// Runs on every push (.github/workflows/pages.yml), so the page always matches the repository.
//   node scripts/build-site.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { readExamples, boardConfig, kitsCss, imagePrompts, KINDS } from './board-config.mjs';

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
const EX = readExamples(root);
const { APPS, FLOWS, PICS } = EX;
const flows = FLOWS.flows;
const steps = [...new Set(flows.flatMap((f) => f.steps.map((s) => s.id)))];
const src = (f) => readFileSync(join(root, 'site-src', f), 'utf8');
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
const shot = (id) => existsSync(join(root, 'examples/shots/steps', id + '.webp'));

// The seven motion styles, read from the engine itself so the page never disagrees with it.
const STYLES = (() => {
  const code = readFileSync(join(root, 'skills/design-board/template/js/styles.js'), 'utf8').replace(/\r\n/g, '\n');
  const out = {};
  for (const m of code.matchAll(/^ {4}(\w+): \{\n {6}name: '([^']+)', feel: '([^']+)', use: '([^']+)',\n {6}tokens: '([^']+)',/gm)) out[m[1]] = { name: m[2], feel: m[3], use: m[4], tokens: m[5] };
  return out;
})();

// Fonts: the page's two, and the apps' (their kits and phones are drawn in them).
const FONTS_SITE = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wdth,wght@87.5..112.5,400..700&display=swap';
const FONTS_ALL = FONTS_SITE.replace('&display=swap', '&family=Baloo+2:wght@600;800&family=Big+Shoulders+Display:wght@800&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Cormorant+Garamond:wght@600&family=Gloock&family=Inter:wght@400;600;800&family=Schibsted+Grotesk:wght@400;600;700&family=Young+Serif&display=swap');
const BLURB = {
  'Start here': 'How the work runs, and what the app is before anything is drawn.',
  Foundation: 'The kit, the motion and its styles, the feel under the finger, and words that sound like a person.',
  'The board': 'Where every screen lives as a working phone, and how it gets reviewed.',
  'The flow': 'Every screen of a subscription app, from the first beat to the cancel button.',
  Quality: 'The checks that keep it honest, and the way to native code and the App Store.',
};
const flowsFor = (name) => flows.filter((f) => f.skills.includes(name));
const SYS = 'ui-sans-serif, -apple-system, "SF Pro Text", system-ui, sans-serif';
const q = (s) => s.replace(/"/g, "'");
const kitVars = (k) => [
  `--k-ground:${k.ground}`, `--k-ink:${k.ink}`, `--k-strong:${k.inkStrong}`, `--k-muted:${k.inkMuted}`,
  `--k-font:${q(k.fontCss)}`, `--k-body:${q(k.body === 'same' ? k.fontCss : SYS)}`,
  `--k-btn:${k.btn}`, `--k-btn-ink:${k.btnInk}`, `--k-r:${k.radius}px`, `--k-weight:${k.weight || 400}`,
  k.case ? `--k-case:${k.case}` : '', k.track ? `--k-track:${k.track}` : '',
].filter(Boolean).join(';');
const appVars = (a) => [
  `--a-ground:${a.kit.ground}`, `--a-ink:${a.kit.ink}`, `--a-strong:${a.kit.inkStrong}`, `--a-muted:${a.kit.inkMuted}`,
  `--a-accent:${a.kit.accent}`, `--a-btn-ink:${a.kit.btnInk}`, `--a-font:${q(a.kit.fontCss)}`, `--a-weight:${a.kit.weight || 400}`,
  a.kit.case ? `--a-case:${a.kit.case}` : '', a.kit.track ? `--a-track:${a.kit.track}` : '',
].filter(Boolean).join(';');
const appIcon = (a, size, up = '') => PICS[a.id + '-icon']
  ? `<span class="fl-ic" style="width:${size}px;height:${size}px"><img src="${up}board/${PICS[a.id + '-icon']}" alt=""></span>`
  : `<span class="fl-ic" style="width:${size}px;height:${size}px;background:${a.kit.accent};color:${a.kit.btnInk};font-size:${Math.round(size * 0.46)}px">${esc(a.name[0])}</span>`;
const styleOf = (a) => STYLES[a.style] || { name: a.style };
const kitCard = (a, i) => `<article class="kit" style="${kitVars(a.kit)};--i:${i}">
  <div class="kit-head"><h3 class="kit-name">${esc(a.name)}</h3><span class="kit-step">${esc(styleOf(a).name)} motion</span></div>
  <p class="kit-mood">${esc(a.kit.mood)}</p>
  <div class="kit-sw">${a.kit.swatches.map(([n, c]) => `<div><i style="background:${c}"></i><small>${esc(n)}</small></div>`).join('')}</div>
  <div class="kit-type"><b>Aa</b><span><strong>${esc(a.kit.font)}</strong>${a.kit.body === 'same' ? 'for every word' : 'for headings; the system face for the rest'}</span></div>
  <span class="kit-btn">Continue</span>
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
const styleTiles = (up = '') => Object.entries(STYLES).map(([key, S]) => {
  const a = APPS.apps.find((x) => x.style === key);
  const f = a && flows.find((x) => x.app === a.id);
  return `<article class="style-tile">
  <div class="dev"><div class="dev-screen"><iframe title="${esc(S.name)} motion, live" tabindex="-1" loading="lazy" data-src="${up}board/embed.html?paused#style-${key}"></iframe></div></div>
  <h3>${esc(S.name)}</h3>
  <p class="st-feel">${esc(S.feel)}</p>
  <p>${esc(S.use)}.</p>
  <p class="st-tokens">${esc(S.tokens)}</p>
  ${a ? `<p class="st-seen">Seen in <a href="${up}${up ? 'index.html' : ''}#flows" data-flow="${f ? f.id : ''}">${esc(a.name)}</a></p>` : ''}
</article>`;
}).join('') + `<article class="style-tile is-note">
  <h3>Pick by feel.</h3>
  <p>What should someone feel when the app works?</p>
  <ul class="st-choose">${[['Rested', 'calm'], ['Strong', 'snappy'], ['Delighted', 'bubbly'], ['In control', 'precise'], ['Light', 'fluid'], ['Inspired', 'cinematic'], ['Nurtured', 'organic']].map(([f, k]) => `<li><span>${f}</span><b>${k}</b></li>`).join('')}</ul>
  <p>Then one line on the board, and every heading, list, press, value and screen change follows it.</p>
  <pre>window.BOARD = { style: 'calm' };</pre>
  <p><a href="${up}skills/motion-styles.html">Read motion-styles →</a></p>
</article>`;
const DATA = (extra = {}) => `window.APPS = ${JSON.stringify(APPS)};
window.FLOWS = ${JSON.stringify(flows)};
window.KINDS = ${JSON.stringify(KINDS)};
window.STYLES = ${JSON.stringify(STYLES)};
window.PICS = ${JSON.stringify(PICS)};`.replace(/<\//g, '<\\/');

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
  <div class="g-grid">${g.skills.map((name) => { const s = skills[name]; const fs = flowsFor(name); n++; const th = fs.map((f) => f.steps[0].id).filter(shot).slice(0, 3); return `
    <a class="sk" href="skills/${s.name}.html" data-search="${esc((s.name + ' ' + s.description).toLowerCase())}">
      <span><span class="sk-name"><i>${String(n).padStart(2, '0')}</i>${s.name}</span><span class="sk-desc">${inline(s.short)}.</span>${fs.length ? `<span class="sk-count">${fs.length} flow${fs.length > 1 ? 's' : ''} to watch</span>` : ''}</span>
      ${th.length && g.title === 'The flow' ? `<span class="sk-thumbs">${th.map((id) => `<span class="sk-thumb"><img src="shots/steps/${id}.webp" alt="" loading="lazy" width="52" height="112"></span>`).join('')}</span>` : ''}
    </a>`; }).join('')}
  </div>
</section>`).join('');
const drift = (ids) => {
  const items = ids.map((id) => {
    const f = flows.find((x) => x.steps.some((s) => s.id === id));
    const a = APPS.apps.find((x) => x.id === f.app);
    const st = f.steps.find((s) => s.id === id);
    return `<a class="dphone" href="#flows" data-flow="${f.id}"><div class="dev"><div class="dev-screen"><img src="shots/steps/${id}.webp" alt="${esc(a.name)}: ${esc(st.name)}" loading="lazy" width="390" height="844"></div></div><span>${esc(a.name)} · ${esc(st.name)}</span></a>`;
  }).join('');
  return items + items.replace(/<a class="dphone"/g, '<a class="dphone" aria-hidden="true" tabindex="-1"');
};
const shotSteps = steps.filter(shot);
const half = Math.ceil(shotSteps.length / 2);
const interleave = (list) => { const byApp = {}; list.forEach((id) => { const app = id.split('-')[0]; (byApp[app] = byApp[app] || []).push(id); }); const out = []; let more = true; for (let i = 0; more; i++) { more = false; for (const k of Object.keys(byApp)) if (byApp[k][i]) { out.push(byApp[k][i]); more = true; } } return out; };
const mixed = interleave(shotSteps);
const pairs = APPS.apps.filter((a) => existsSync(join(root, 'examples/shots', `${a.id}-before.webp`)) && existsSync(join(root, 'examples/shots', `${a.id}-after.webp`)));
// The hero starts on the apps whose screens need no photographs, so it never opens on a placeholder.
const HERO = ['ripe', 'stride', 'halves', 'parla', 'lull', 'fern', 'loaf'];
const heroPairs = [...pairs].sort((a, b) => (HERO.indexOf(a.id) + 1 || 99) - (HERO.indexOf(b.id) + 1 || 99));
writeFileSync(join(out, 'index.html'), fill(src('index.html'), {
  TOTAL: total, REPO, COMMIT: commit, WHEN: esc(when), FONTS: FONTS_ALL,
  N_APPS: APPS.apps.length, N_FLOWS: flows.length, N_STEPS: steps.length,
  FIRST_BEFORE: heroPairs[0] ? heroPairs[0].before.id : '', FIRST_AFTER: heroPairs[0] ? heroPairs[0].after.id : '', FIRST_APP: heroPairs[0] ? heroPairs[0].id : '',
  HERO_TABS: heroPairs.map((a, i) => `<button type="button" class="app-pill" role="tab" aria-selected="${i === 0}" data-app="${a.id}" style="--a-ground:${a.kit.ground};--a-accent:${a.kit.accent}"><i class="app-dot"></i>${esc(a.name)}</button>`).join(''),
  DRIFT_A: drift(mixed.slice(0, half)), DRIFT_B: drift(mixed.slice(half)),
  APPS_ROW: APPS.apps.map((a) => `<button type="button" class="app-card" data-app="${a.id}" style="${appVars(a)}">${appIcon(a, 46)}<b>${esc(a.name)}</b><small>${esc(a.category)} · ${((k) => `${k} flow${k > 1 ? 's' : ''}`)(flows.filter((f) => f.app === a.id).length)}</small><span class="app-style">${esc(styleOf(a).name)}</span><span class="app-dots">${a.kit.swatches.map(([, c]) => `<i style="background:${c}"></i>`).join('')}</span></button>`).join(''),
  STYLE_TILES: styleTiles(),
  APP_TABS: heroPairs.map((a, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-app="${a.id}" style="--a-ground:${a.kit.ground};--a-accent:${a.kit.accent}"><i class="app-dot"></i>${esc(a.name)} <small>${esc(a.category.toLowerCase())}</small></button>`).join(''),
  N_PAIRS: pairs.length,
  STRIP: pairs.map((a) => `<figure class="shot"><div class="dev"><div class="dev-screen"><img class="is-before" src="shots/${a.id}-before.webp" alt="${esc(a.name)}, the generated draft" width="390" height="844" loading="lazy"><img class="is-after" src="shots/${a.id}-after.webp" alt="${esc(a.name)}, with the skills" width="390" height="844" loading="lazy"></div></div><figcaption><b>${esc(a.name)}</b><span>${esc(a.category)}</span></figcaption></figure>`).join(''),
  KITS: kitsHtml,
  SKILLS: catalogue,
  DATA: DATA(),
}));

// ---------------------------------------------------------------- one page per skill
const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const skillPage = (s, g) => {
  const i = order.indexOf(s.name), prev = order[i - 1], next = order[i + 1];
  const body = markdown(s.body).replace(/<h([23])>(.*?)<\/h\1>/g, (m, lv, t) => `<h${lv} id="${slug(t)}">${t}</h${lv}>`);
  const toc = [...body.matchAll(/<h3 id="([^"]+)">(.*?)<\/h3>/g)].map(([, id, t]) => `<a href="#${id}">${t.replace(/<[^>]+>/g, '')}</a>`).join('');
  const fs = flowsFor(s.name);
  let example = '';
  if (s.name === 'motion-styles') example = `<figure class="sk-example is-styles"><div class="styles">${styleTiles('../')}</div></figure>`;
  else if (s.name === 'design-kit') example = `<figure class="sk-example is-kits"><div class="kits is-in">${kitsHtml}</div><figcaption>The default kit every generated draft shares, and the kits this skill made for the example apps.</figcaption></figure>`;
  else if (fs.length) example = `<figure class="sk-example is-flows"><figcaption class="sk-flows-cap">This skill at work in ${fs.length} flow${fs.length > 1 ? 's' : ''}. The phone plays the real screens.</figcaption><div class="fl" data-player data-flows="${fs.map((f) => f.id).join(',')}"></div></figure>`;
  return fill(src('skill.html'), {
    TITLE: esc(`${s.name} · Ungenerated`), DESC: esc(s.short), REPO, COMMIT: commit, WHEN: esc(when),
    FONTS: fs.length || ['design-kit', 'motion-styles'].includes(s.name) ? FONTS_ALL : FONTS_SITE,
    GROUP: esc(g.title), NAME: s.name, LEDE: inline(s.description),
    META: `<a href="${REPO}/blob/main/skills/${s.name}/SKILL.md">SKILL.md</a>${s.refs.map((r) => `<a href="${REPO}/blob/main/skills/${s.name}/references/${r}">${esc(r)}</a>`).join('')}${s.hasTemplate ? `<a href="../board/">The example board</a>` : ''}`,
    SIDE: groups.map((gg) => `<p>${esc(gg.title)}</p>${gg.skills.map((x) => `<a href="${x}.html"${x === s.name ? ' aria-current="page"' : ''}>${x}</a>`).join('')}`).join(''),
    TOC: toc ? `<p>On this page</p>${toc}` : '', EXAMPLE: example, BODY: body,
    PAGER: `${prev ? `<a href="${prev}.html"><small>Previous</small>${prev}</a>` : '<span></span>'}${next ? `<a class="is-next" href="${next}.html"><small>Next</small>${next}</a>` : '<span></span>'}`,
    DATA: fs.length || s.name === 'motion-styles' ? DATA() : '',
  });
};
groups.forEach((g) => g.skills.forEach((name) => writeFileSync(join(out, 'skills', `${name}.html`), skillPage(skills[name], g))));

['base.css', 'home.css', 'skill.css', 'home.js', 'page.js', 'flows.js'].forEach((f) => writeFileSync(join(out, f), src(f)));
const copy = (from, to, skip = []) => {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    if (skip.includes(f)) continue;
    const a = join(from, f), b = join(to, f);
    if (statSync(a).isDirectory()) copy(a, b); else copyFileSync(a, b);
  }
};
copy(join(root, 'examples/shots'), join(out, 'shots'));

// The example board: the design-board template's engine running the example apps (examples/).
// Its config and kit styles are generated from examples/*.json (scripts/board-config.mjs), the
// same way the dev server (scripts/dev.mjs) serves them.
const board = join(out, 'board');
copy(join(root, 'skills/design-board/template'), board, ['tools', 'review', 'screens', 'board.config.js', 'index.html']);
mkdirSync(join(board, 'js/screens'), { recursive: true });
copyFileSync(join(root, 'skills/design-board/template/js/screens/styles.js'), join(board, 'js/screens/styles.js'));
copy(join(root, 'examples'), board, ['apps.json', 'flows.json', 'images.json', 'shots', 'README.md', 'IMAGE-PROMPTS.md']);
writeFileSync(join(board, 'css/kits.css'), kitsCss(EX));
writeFileSync(join(board, 'board.config.js'), boardConfig(EX));
writeFileSync(join(root, 'examples/IMAGE-PROMPTS.md'), imagePrompts(EX));
console.log(`site/ built: ${total} skills, ${APPS.apps.length} apps, ${flows.length} flows, ${steps.length} screens (${shotSteps.length} with screenshots), ${commit}, ${when}`);
