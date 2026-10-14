/* The Kits view: the default kit every generated draft shares, then the six kits the skills made.
 * Each tile is drawn from examples/apps.json (window.APPS, written into board.config.js). */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S;
  if (!window.APPS) return;
  const { generated, apps } = window.APPS;

  // The whole part: the six screens one after another, with the board's own transitions.
  F.def({
    id: 'seq-ungenerated', section: 'ungenerated', name: 'All six · the whole part', seq: apps.map((a) => a.after.id),
    intent: 'Plays the six ungenerated screens in a row, each through its demo, then loops. Six apps, six kits, one set of rules.',
  });

  F.def({
    id: 'kit-generated', section: 'kits', name: 'The default kit',
    intent: generated.what + ' Every generated draft on this board is made of it, which is why they all look alike.',
    build(ctx) {
      const { body } = S.frame(ctx);
      const title = h('h1.s-h1', { style: { textAlign: 'left', fontSize: '40px' } }, h('span.s-grad', 'Default'), ' ✨');
      const what = h('p.s-p', { style: { textAlign: 'left', marginTop: '4px' } }, generated.what);
      const sw = h('div.kt-swatches', generated.swatches.map(([n, c]) => h('div.kt-sw', h('i', { style: { background: c } }), h('b', n), h('small', c))));
      const type = h('div.kt-type.is-slop', h('b', 'Aa'), h('div', h('strong', generated.font), h('small', 'for every word')));
      const parts = h('div.kt-parts', S.btn(ctx, 'Get Started 🚀'), h('div.s-feat.s-glass', h('span.s-feat-ic', '✨'), h('div', h('strong', 'AI-Powered'), h('span', 'Seamless & effortless'))));
      body.append(title, what, sw, type, parts);
      S.in([title, what, sw, type, parts]);
    },
  });

  apps.forEach((a) => {
    const k = a.kit;
    F.def({
      id: 'kit-' + a.id, section: 'kits', name: `${a.name} · ${k.font}`,
      intent: `${a.what} The kit: ${k.mood.toLowerCase()}. ${k.font} with ${k.swatches.map(([n]) => n.toLowerCase()).join(', ')}; ${k.radius} pt corners.`,
      build(ctx) {
        const { body } = F.frame(ctx, { cls: 'k-' + a.id + ' kt', tone: a.id === 'stride' || a.id === 'parla' ? 'light' : undefined });
        const title = h('h1.kt-name', a.name);
        const mood = h('p.kt-mood', k.mood);
        const sw = h('div.kt-swatches', k.swatches.map(([n, c]) => h('div.kt-sw', h('i', { style: { background: c } }), h('b', n), h('small', c))));
        const type = h('div.kt-type', h('b', 'Aa'), h('div', h('strong', k.font), h('small', k.body === 'same' ? 'for every word' : 'for headings, the system face for the rest')));
        const btn = F.primary(ctx, a.step === 'Leaving' ? 'Continue to cancel' : 'Continue');
        const row = F.answer(ctx, { label: a.what.split(',')[0].split(' that ')[0], icon: 'check', onTap: (r) => F.picked(ctx, r, !r.classList.contains('is-on')) });
        const parts = h('div.kt-parts', btn, row);
        body.append(title, mood, sw, type, parts);
        F.titleIn(ctx, title);
        F.rise(ctx, [mood, ...sw.children, type, btn, row], { delay: 120, stagger: 40 });
        ctx.at(1600, () => F.tapEl(ctx, row));
      },
    });
  });
})();
