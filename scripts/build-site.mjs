// Builds the public page from the skills: site/index.html (the catalogue), site/skills/<name>.html
// (one page per skill, rendered from its SKILL.md), and site/board/ (the example design board).
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
  const text = readFileSync(join(root, 'skills', name, 'SKILL.md'), 'utf8');
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

const shell = (title, desc, body, depth = 0) => {
  const up = depth ? '../' : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
${body}
<footer class="foot"><span>Rebuilt from <a href="${REPO}">the repository</a> on every change. Last update ${esc(when)} · <a href="${REPO}/commit/${commit}">${commit}</a></span><span>MIT licence</span></footer>
<script src="${up}page.js"></script>
</body>
</html>
`;
};

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'skills'), { recursive: true });

// The catalogue.
const skills = Object.fromEntries(groups.flatMap((g) => g.skills).map((n) => [n, readSkill(n)]));
let n = 0;
const catalogue = groups.map((g) => `
<section class="group">
  <h2>${esc(g.title)}<span>${g.skills.length}</span></h2>
  <ol class="list">${g.skills.map((name) => { const s = skills[name]; n++; return `
    <li data-search="${esc((s.name + ' ' + s.description).toLowerCase())}"><a href="skills/${s.name}.html">
      <span class="num">${String(n).padStart(2, '0')}</span>
      <span class="name">${s.name}</span>
      <span class="desc">${inline(s.short)}.</span>
      <span class="go" aria-hidden="true">→</span>
    </a></li>`; }).join('')}
  </ol>
</section>`).join('');

writeFileSync(join(out, 'index.html'), shell('Ungenerated', 'Skills for designing mobile apps with Claude that don’t look generated.', `
<header class="hero">
  <p class="eyebrow">Ungenerated · ${total} skills for Claude Code</p>
  <h1>Design apps that don’t look <em>generated.</em></h1>
  <p class="lede">A live design board for every screen, a motion system, the onboarding, paywall and cancel-flow patterns that work, and a checklist that keeps the result honest. Every rule here was a correction once.</p>
  <div class="install">
    <pre id="install"><code>/plugin marketplace add iammirrr/ungenerated
/plugin install ungenerated@ungenerated</code></pre>
    <button type="button" class="copy" data-copy="install">Copy</button>
  </div>
  <p class="links"><a href="board/">Open the example board</a><a href="${REPO}">Source on GitHub</a></p>
</header>
<main class="catalogue">
  <label class="search"><span>Find a skill</span><input type="search" placeholder="paywall, motion, consent…" autocomplete="off"></label>
  ${catalogue}
  <p class="none" hidden>No skill matches that.</p>
</main>`));

// One page per skill.
groups.forEach((g) => g.skills.forEach((name, i) => {
  const s = skills[name];
  const prev = g.skills[i - 1], next = g.skills[i + 1];
  writeFileSync(join(out, 'skills', `${name}.html`), shell(`${name} · Ungenerated`, s.short, `
<header class="top"><a href="../">← All skills</a><span>${esc(g.title)}</span></header>
<article class="skill">
  <p class="eyebrow">${esc(g.title)}</p>
  <h1 class="mono">${s.name}</h1>
  <p class="lede">${inline(s.description)}</p>
  <p class="meta"><a href="${REPO}/blob/main/skills/${s.name}/SKILL.md">SKILL.md on GitHub</a>${s.refs.map((r) => `<a href="${REPO}/blob/main/skills/${s.name}/references/${r}">${esc(r)}</a>`).join('')}${s.hasTemplate ? `<a href="../board/">The template, live</a>` : ''}</p>
  <div class="prose">${markdown(s.body)}</div>
  <nav class="pager">${prev ? `<a href="${prev}.html">← ${prev}</a>` : '<span></span>'}${next ? `<a href="${next}.html">${next} →</a>` : '<span></span>'}</nav>
</article>`, 1));
}));

writeFileSync(join(out, 'style.css'), readFileSync(join(root, 'scripts/site.css'), 'utf8'));
writeFileSync(join(out, 'page.js'), readFileSync(join(root, 'scripts/site.js'), 'utf8'));

// The example board, without its tools and review store.
const copy = (from, to) => {
  for (const f of readdirSync(from)) {
    if (['tools', 'review'].includes(f)) continue;
    const a = join(from, f), b = join(to, f);
    if (statSync(a).isDirectory()) { mkdirSync(b, { recursive: true }); copy(a, b); } else copyFileSync(a, b);
  }
};
mkdirSync(join(out, 'board'), { recursive: true });
copy(join(root, 'skills/design-board/template'), join(out, 'board'));
console.log(`site/ built: ${total} skills, ${commit}, ${when}`);
