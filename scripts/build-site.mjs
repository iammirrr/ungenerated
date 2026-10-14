// Builds the public page from the skills and the examples: site/index.html (before and after, the
// projects, the skills), site/projects/<app>.html (one page per example project: before and after,
// its flows playing, its kit part by part, its pictures as ChatGPT prompts), site/skills/<name>.html
// (one page per skill, from its SKILL.md), and site/board/ (the design-board template's engine
// running the example apps, which every page embeds).
// Runs on every push (.github/workflows/pages.yml), so the page always matches the repository.
//   node scripts/build-site.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { readExamples, boardConfig, kitsCss, imagePrompts, prompts } from './board-config.mjs';

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
  const short = meta.description.split(' - ')[0].split('. Use')[0].split(/\.\s/)[0].replace(/\.$/, '');
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
const { APPS, FLOWS, IMAGES, PICS } = EX;
const flows = FLOWS.flows;
const steps = [...new Set(flows.flatMap((f) => f.steps.map((s) => s.id)))];
const src = (f) => readFileSync(join(root, 'site-src', f), 'utf8');
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const json = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');

// The seven motion styles, read from the engine itself so the pages never disagree with it.
const STYLES = (() => {
  const code = readFileSync(join(root, 'skills/design-board/template/js/styles.js'), 'utf8').replace(/\r\n/g, '\n');
  const out = {};
  for (const m of code.matchAll(/^ {4}(\w+): \{\n {6}name: '([^']+)', feel: '([^']+)', use: '([^']+)',\n {6}tokens: '([^']+)',/gm)) out[m[1]] = { name: m[2], feel: m[3], use: m[4], tokens: m[5] };
  return out;
})();

// The apps' own faces (the same stylesheet the kit sheets load, so the browser fetches it once):
// an icon that is not made yet shows the app's initial in its face.
const FONTS = (readFileSync(join(root, 'examples/kitsheet.html'), 'utf8').match(/href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/) || [])[1] || '';

// The projects, in the order the page shows them: the ones whose screens need no photographs
// first, so nothing opens on a placeholder.
const ORDER = ['ripe', 'stride', 'halves', 'parla', 'lull', 'fern', 'loaf'];
const projects = [...APPS.apps].sort((a, b) => (ORDER.indexOf(a.id) + 1 || 99) - (ORDER.indexOf(b.id) + 1 || 99));
const flowsOf = (a) => flows.filter((f) => f.app === a.id);
const flowsFor = (name) => flows.filter((f) => f.skills.includes(name));
const styleName = (a) => (STYLES[a.style] || { name: a.style }).name;
const shot = (name) => existsSync(join(root, 'examples/shots', name + '.webp'));

/** An app's icon: the picture once it is made; until then its initial, in its face and colours. */
const icon = (a, up = '') => PICS[a.icon]
  ? `<span class="pj-ic"><img src="${up}board/${PICS[a.icon]}" alt=""></span>`
  : `<span class="pj-ic" style="background:${a.kit.iconBg};color:${a.kit.iconInk};font-family:${attr(a.kit.fontCss)};font-weight:${a.kit.weight || 400}">${esc(a.name[0])}</span>`;

// ---------------------------------------------------------------- the pictures, as ChatGPT prompts
// Each app's pictures share one style. A project page gives the whole set as one message (the
// style once, then each picture, one at a time) and each picture on its own, style included.
const P = prompts(EX);
const ratio = (i) => (/2:3/.test(i.size) ? '2:3' : /3:2/.test(i.size) ? '3:2' : '1:1');
const picCard = (a, i) => `<article class="pic-card">
  <div class="pic-thumb" style="--r:${ratio(i).replace(':', '/')}">${PICS[i.id] ? `<img src="../board/${PICS[i.id]}" alt="" loading="lazy">` : `<span>${ratio(i)}</span>`}</div>
  <div class="pic-txt"><b>${esc(i.label)}</b><code>${esc(i.id)}.png</code><p>${esc(i.prompt)}</p><button type="button" class="copy" data-text="${attr(P.one(i))}">Copy</button></div>
</article>`;
const picturesOf = (a) => {
  const g = P.groups[a.id];
  if (!g) return '';
  const cards = [...P.pics(a.id), P.iconOf(a)].filter(Boolean);
  const done = cards.filter((i) => PICS[i.id]).length;
  return `<section class="wrap pj-sec" id="pictures">
  <h2>Pictures</h2>
  <p class="pics-how">${done === cards.length ? `${cards.length} pictures, made with ChatGPT from these prompts.` : `${cards.length} pictures to make with ChatGPT${done ? ` (${done} done)` : ''}. Paste the whole set into one chat, or one picture at a time.`}</p>
  <div class="prompt"><p class="prompt-name">The style</p><pre>${esc(g.style)}</pre><button type="button" class="copy" data-text="${attr(P.set(a.id, { icon: true }))}">Copy the set</button></div>
  <div class="pics">${cards.map((i) => picCard(a, i)).join('')}</div>
</section>`;
};

// Empty site/ rather than removing it, so a local server running inside it keeps working.
if (existsSync(out)) readdirSync(out).forEach((f) => rmSync(join(out, f), { recursive: true, force: true }));
mkdirSync(join(out, 'skills'), { recursive: true });
mkdirSync(join(out, 'projects'), { recursive: true });

const skills = Object.fromEntries(groups.flatMap((g) => g.skills).map((n) => [n, readSkill(n)]));
const order = groups.flatMap((g) => g.skills);

// ---------------------------------------------------------------- the home page
const hero = projects.filter((a) => a.before && a.after);
writeFileSync(join(out, 'index.html'), fill(src('index.html'), {
  TOTAL: total, REPO, COMMIT: commit, WHEN: esc(when), FONTS,
  FIRST_BEFORE: hero[0] ? hero[0].before.id : '', FIRST_AFTER: hero[0] ? hero[0].after.id : '',
  HERO_TABS: hero.map((a, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-before="${a.before.id}" data-after="${a.after.id}">${esc(a.name)}</button>`).join(''),
  PROJECTS: `<div class="lineup" style="--n:${projects.length}">
    <div class="lu-col lu-labels" aria-hidden="true"><span></span><span>Before</span><span class="is-after">After</span></div>
    ${projects.map((a) => `<a class="lu-col" href="projects/${a.id}.html">
      <span class="lu-name">${icon(a)}<b>${esc(a.name)}</b></span>
      ${['before', 'after'].map((k) => `<div class="phone">${shot(`${a.id}-${k}`) ? `<img src="shots/${a.id}-${k}.webp" alt="${esc(a.name)}, ${k === 'before' ? 'as Claude draws it alone' : 'with the skills'}" loading="lazy" width="390" height="844">` : ''}</div>`).join('')}
    </a>`).join('')}
  </div>`,
  SKILLS: groups.map((g) => `<div class="group"><h3>${esc(g.title)}</h3><dl>${g.skills.map((name) => `<dt><a href="skills/${name}.html">${name}</a></dt><dd>${inline(skills[name].short)}.</dd>`).join('')}</dl></div>`).join(''),
}));

// ---------------------------------------------------------------- one page per project
const pager = (prev, next) => `${prev ? `<a href="${prev.id}.html">${icon(prev, '../')}<span><small>Previous</small><b>${esc(prev.name)}</b></span></a>` : '<span></span>'}${next ? `<a class="is-next" href="${next.id}.html">${icon(next, '../')}<span><small>Next</small><b>${esc(next.name)}</b></span></a>` : '<span></span>'}`;
projects.forEach((a, i) => {
  const fs = flowsOf(a);
  writeFileSync(join(out, 'projects', `${a.id}.html`), fill(src('project.html'), {
    NAME: esc(a.name), WHAT: esc(a.what), REPO, WHEN: esc(when), FONTS, ID: a.id,
    ICON: icon(a, '../'), CATEGORY: esc(a.category), STYLE: esc(styleName(a)), FONT: esc(a.kit.font),
    BEFORE: a.before.id, AFTER: a.after.id, FLOW_IDS: fs.map((f) => f.id).join(','),
    PICTURES: picturesOf(a),
    PAGER: pager(projects[i - 1], projects[i + 1]),
    DATA: `window.FLOWS = ${json(fs)};\nwindow.APPS = ${json({ apps: [{ id: a.id, name: a.name }] })};`,
  }));
});

// ---------------------------------------------------------------- one page per skill
const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const skillPage = (s, g) => {
  const i = order.indexOf(s.name), prev = order[i - 1], next = order[i + 1];
  const body = markdown(s.body).replace(/<h([23])>(.*?)<\/h\1>/g, (m, lv, t) => `<h${lv} id="${slug(t)}">${t}</h${lv}>`);
  const fs = flowsFor(s.name);
  let example = '';
  if (s.name === 'motion-styles') example = `<section class="sk-example"><h2>Seven styles, part by part</h2><iframe class="sk-sheet" title="The motion styles, part by part" data-src="../board/motionsheet.html"></iframe></section>`;
  else if (s.name === 'design-kit') example = `<section class="sk-example"><h2>Default kit, and a kit per project</h2><div class="sk-tabs" role="tablist">${projects.map((a, k) => `<button type="button" role="tab" aria-selected="${k === 0}" data-kit="${a.id}">${esc(a.name)}</button>`).join('')}</div><iframe class="sk-sheet" title="A kit, before and after" data-src="../board/kitsheet.html#${projects[0].id}"></iframe></section>`;
  else if (fs.length) example = `<section class="sk-example"><h2>In the projects</h2><div class="fl" data-player data-flows="${fs.map((f) => f.id).join(',')}" data-apps></div></section>`;
  return fill(src('skill.html'), {
    TITLE: esc(`${s.name} · Ungenerated`), DESC: esc(s.short), REPO, COMMIT: commit, WHEN: esc(when),
    GROUP: esc(g.title), NAME: s.name, LEDE: inline(s.description),
    META: `<a href="${REPO}/blob/main/skills/${s.name}/SKILL.md">SKILL.md</a>${s.refs.map((r) => `<a href="${REPO}/blob/main/skills/${s.name}/references/${r}">${esc(r)}</a>`).join('')}`,
    SIDE: groups.map((gg) => `<p>${esc(gg.title)}</p>${gg.skills.map((x) => `<a href="${x}.html"${x === s.name ? ' aria-current="page"' : ''}>${x}</a>`).join('')}`).join(''),
    EXAMPLE: example, BODY: body,
    PAGER: `${prev ? `<a href="${prev}.html"><small>Previous</small>${prev}</a>` : '<span></span>'}${next ? `<a class="is-next" href="${next}.html"><small>Next</small>${next}</a>` : '<span></span>'}`,
    DATA: fs.length ? `window.FLOWS = ${json(fs)};\nwindow.APPS = ${json({ apps: APPS.apps.map((a) => ({ id: a.id, name: a.name })) })};` : '',
  });
};
groups.forEach((g) => g.skills.forEach((name) => writeFileSync(join(out, 'skills', `${name}.html`), skillPage(skills[name], g))));

['base.css', 'home.css', 'project.css', 'skill.css', 'home.js', 'project.js', 'page.js', 'flows.js'].forEach((f) => writeFileSync(join(out, f), src(f)));
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
copy(join(root, 'examples'), board, ['apps.json', 'flows.json', 'images.json', 'shots', 'README.md', 'IMAGE-PROMPTS.md', 'images-src']);
writeFileSync(join(board, 'css/kits.css'), kitsCss(EX));
writeFileSync(join(board, 'board.config.js'), boardConfig(EX));
writeFileSync(join(root, 'examples/IMAGE-PROMPTS.md'), imagePrompts(EX));
console.log(`site/ built: ${total} skills, ${projects.length} projects, ${flows.length} flows, ${steps.length} screens, ${Object.keys(PICS).length} of ${IMAGES.images.length} pictures, ${commit}, ${when}`);
