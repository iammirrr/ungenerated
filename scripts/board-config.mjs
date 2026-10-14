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

/** The image prompts, for whoever makes the pictures (ChatGPT, a photographer, an illustrator). */
export const imagePrompts = ({ APPS, IMAGES, PICS }) => {
  const appName = (id) => (APPS.apps.find((a) => a.id === id) || { name: id }).name;
  const out = [`# Image prompts

Every picture the example apps use. Until a picture exists, the screens show a labelled
placeholder in its place. To add one: make it, save the original as \`examples/images-src/<id>.png\`
(or .jpg), run \`node scripts/images.mjs\` (it writes a light WebP to \`examples/images/\`), then
rebuild. The screens pick it up by its id.

Made with ChatGPT: each block below is a whole prompt (the app's style, the picture, its size),
ready to paste. Make one app's pictures in one chat, in order, so they match; for the mascot, make
the first pose, then paste the others in the same chat.

Done: ${Object.keys(PICS).length} of ${IMAGES.images.length}.
`];
  const groups = IMAGES.groups || [];
  for (const g of groups) {
    const imgs = IMAGES.images.filter((i) => i.app === g.app);
    if (!imgs.length) continue;
    out.push(`\n## ${appName(g.app)}${g.title ? ': ' + g.title : ''}\n\n${g.note || ''}\n`);
    for (const i of imgs) {
      const size = `${i.size}${i.transparent ? ', transparent background (PNG)' : ''}.`;
      out.push(`### \`${i.id}\`${PICS[i.id] ? ' (done)' : ''}\n\n${i.label}. Save as \`examples/images-src/${i.id}.png\`. Used in: ${i.used}.\n\n\`\`\`\n${g.style}\n\n${i.prompt}\n\n${size}\n\`\`\`\n`);
    }
  }
  return out.join('\n');
};
