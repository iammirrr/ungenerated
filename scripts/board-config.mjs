// The example board's generated files, from examples/apps.json, flows.json and images.json.
// Used by build-site.mjs (into site/board/) and dev.mjs (served live from source).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const KINDS = [
  { id: 'opening', title: 'Openings', blurb: 'The first fifteen seconds, before a single question.' },
  { id: 'onboarding', title: 'Onboarding', blurb: 'The questions, and the answers turning into a plan.' },
  { id: 'paywall', title: 'Paywalls', blurb: 'One value beat, every price, the trial on a timeline.' },
  { id: 'setup', title: 'Setup and permissions', blurb: 'The first minute of the product, and every ask in context.' },
  { id: 'leaving', title: 'Leaving', blurb: 'One question, a matched offer or none, an honest goodbye.' },
];

const SYS = 'ui-sans-serif, -apple-system, "SF Pro Text", system-ui, sans-serif';
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };

export const readExamples = (root) => {
  const ex = join(root, 'examples');
  const read = (f, fallback) => (existsSync(join(ex, f)) ? JSON.parse(readFileSync(join(ex, f), 'utf8')) : fallback);
  const APPS = read('apps.json', { apps: [] });
  const FLOWS = read('flows.json', { flows: [] });
  const IMAGES = read('images.json', { images: [] });
  const dir = join(ex, 'images');
  const files = existsSync(dir) ? readdirSync(dir) : [];
  const PICS = {};
  for (const img of IMAGES.images) {
    const f = ['webp', 'png', 'jpg', 'jpeg'].map((e) => `${img.id}.${e}`).find((n) => files.includes(n));
    if (f) PICS[img.id] = `images/${f}`;
  }
  return { APPS, FLOWS, IMAGES, PICS };
};

/** The kit classes: one per app, from apps.json. */
export const kitsCss = ({ APPS }) => `/* Built from examples/apps.json by scripts/board-config.mjs. Edit the JSON, not this file. */\n` + APPS.apps.map(({ id, kit: k }) => `.ph.k-${id} {
  --font: ${k.body === 'same' ? k.fontCss : SYS}; --font-display: ${k.fontCss};
  --ground: ${k.ground}; --panel: ${k.panel}; --inset: ${k.inset}; --hover: ${k.hover}; --sunken: ${k.inset};
  --hair: ${rgba(k.inkStrong, 0.1)}; --hair-2: ${rgba(k.inkStrong, 0.16)};
  --ink-strong: ${k.inkStrong}; --ink: ${k.ink}; --ink-muted: ${k.inkMuted}; --ink-quiet: ${k.inkQuiet};
  --accent: ${k.accent}; --accent-text: ${k.accentText}; --accent-soft: ${rgba(k.accent, 0.14)}; --accent-line: ${rgba(k.accent, 0.5)};
  --btn: ${k.btn}; --btn-down: ${k.btnDown}; --btn-ink: ${k.btnInk}; --home-ind: ${k.inkStrong};
  --r-card: ${k.radius}px; --r-row: ${Math.max(10, k.radius - 4)}px;
  --display-weight: ${k.weight || 400}; --display-track: ${k.track || '-0.02em'}; --display-case: ${k.case || 'none'};
  background: var(--ground); color: var(--ink); font-family: var(--font);
}`).join('\n') + '\n';

/** board.config.js: the sections (one per flow, by kind), the data the screens and the page read. */
export const boardConfig = ({ APPS, FLOWS, IMAGES, PICS }) => {
  const appOf = (id) => APPS.apps.find((a) => a.id === id) || { name: id };
  const sections = [];
  KINDS.forEach((k) => FLOWS.flows.filter((f) => f.kind === k.id).forEach((f) => {
    const a = appOf(f.app);
    sections.push({ id: f.id, title: `${a.name} · ${f.title}`, intent: `${k.title}, in ${a.name} (${a.style}). ${f.summary}` });
  }));
  sections.push({ id: 'generated', title: 'Generated drafts', intent: 'The same apps as a model draws them from the same brief, with no skills loaded. They are made of one default kit, so they look like one app.' });
  sections.push({ id: 'kits', view: 'kit', title: 'Kits', intent: 'The default kit every generated draft shares, then a kit made for each app.' });
  sections.push({ id: 'kit-styles', view: 'kit', title: 'Motion styles', intent: 'One screen in seven personalities, each in the kit of the app that moves that way (the motion-styles skill).' });
  const info = Object.fromEntries(IMAGES.images.map((i) => [i.id, { label: i.label, kind: i.kind, app: i.app }]));
  return `/* Built from examples/*.json by scripts/board-config.mjs. Edit the JSON, not this file. */
window.APPS = ${JSON.stringify(APPS)};
window.FLOWS = ${JSON.stringify(FLOWS.flows)};
window.F = window.F || {};
window.F.PICS = ${JSON.stringify(PICS)};
window.F.PIC_INFO = ${JSON.stringify(info)};
window.F.STYLE_KITS = ${JSON.stringify(Object.fromEntries(APPS.apps.map((a) => [a.style, 'k-' + a.id])))};
window.F.STYLE_TONES = ${JSON.stringify(Object.fromEntries(APPS.apps.filter((a) => a.kit.tone === 'light').map((a) => [a.style, 'light'])))};
window.BOARD = {
  name: 'Ungenerated · ${APPS.apps.length} apps',
  id: 'ungenerated-examples',
  views: [['screens', 'Flows'], ['kit', 'Kits']],
  startView: 'screens',
  sections: ${JSON.stringify(sections, null, 2)},
  research: {},
};
`;
};

/**
 * The pictures as ChatGPT prompts. one(img): a picture whole (its style, the picture, its size),
 * to paste anywhere. set(id): a whole set as one message (who it is for, the style once, then each
 * picture in order), for one chat; set(appId, {icon: true}) adds the app's icon at the end, and
 * set('icons') is every app's icon.
 */
export const prompts = ({ APPS, IMAGES }) => {
  const G = Object.fromEntries((IMAGES.groups || []).map((g) => [g.app, g]));
  const sizeOf = (i) => `${i.size}${i.transparent ? ', transparent background (PNG)' : ''}.`;
  const pics = (id) => IMAGES.images.filter((i) => i.app === id);
  const iconOf = (a) => IMAGES.images.find((i) => i.id === a.icon);
  const ORDER = 'Make them one at a time, each as its own image, in this order. Start with 1; when I say “next”, make the next one.';
  const one = (i) => `${G[i.app].style}\n\n${i.prompt}\n\n${sizeOf(i)}`;
  const set = (id, o = {}) => {
    if (id === 'icons') {
      const list = APPS.apps.filter(iconOf);
      return [`I’m making the app icons for ${list.length} different apps, each its own brand. Every icon follows this style:\n\n${G.icons.style}`, G.icons.note, ORDER,
        list.map((a, n) => `${n + 1}. ${a.name} (${a.category.toLowerCase()}). ${iconOf(a).prompt} ${sizeOf(iconOf(a))}`).join('\n\n')].filter(Boolean).join('\n\n');
    }
    const a = APPS.apps.find((x) => x.id === id), g = G[id];
    const items = pics(id).map((i, n) => `${n + 1}. ${i.label}. ${sizeOf(i)} ${i.prompt}`);
    if (o.icon && iconOf(a)) items.push(`${items.length + 1}. ${a.name}’s app icon, in its own style: ${G.icons.style} ${iconOf(a).prompt}`);
    return [`I’m making the pictures for an app called ${a.name}. ${a.what}`, `Every picture shares this style:\n\n${g.style}`, g.note, ORDER, items.join('\n\n')].filter(Boolean).join('\n\n');
  };
  const files = (id) => (id === 'icons' ? APPS.apps.map(iconOf).filter(Boolean) : pics(id));
  return { one, set, files, pics, iconOf, groups: G, sizeOf };
};

/** IMAGE-PROMPTS.md: every set, most visible first, ready to paste into ChatGPT. */
export const imagePrompts = (EX) => {
  const { APPS, IMAGES, PICS } = EX;
  const P = prompts(EX);
  const name = (id) => (id === 'icons' ? 'App icons' : `${APPS.apps.find((a) => a.id === id).name}: ${P.groups[id].title}`);
  // The icons show on every page; Tazza carries Parla; then the apps whose screens show the most pictures.
  const sets = ['icons', 'parla', 'ripe', 'loaf', 'fern', 'lull', 'stride', 'halves'].filter((id) => P.groups[id]);
  const out = [`# Image prompts

The pictures the example projects use, as ChatGPT prompts: ${Object.keys(PICS).length} of ${IMAGES.images.length} made.

1. Open a new ChatGPT chat for each set and paste the set. It makes picture 1; say “next” for each one after.
2. Save each picture as \`examples/images-src/<name>.png\`, with the names listed under its set, in order.
3. Run \`node scripts/images.mjs\` (it writes light WebP files to \`examples/images/\`), then rebuild.

Until a picture exists, the screens show a placeholder in its place. To redo one picture, copy it
alone from its project page on the site: each prompt there carries the style.
`];
  sets.forEach((id, n) => {
    const list = P.files(id);
    out.push(`## ${n + 1}. ${name(id)}

\`\`\`text
${P.set(id)}
\`\`\`

Save as: ${list.map((i) => `\`${i.id}.png\`${PICS[i.id] ? ' (done)' : ''}`).join(', ')}.
`);
  });
  return out.join('\n');
};
