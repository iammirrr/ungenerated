/* The motion styles row of the kit (the motion-styles skill): seven tiles, and in each the same
 * four parts (a heading, a button, a toggle, a value) moving in one personality. No screen around
 * them: only the motion differs, so the reviewer picks a personality by feel. Each tile plays its
 * parts one after another, on a loop; tap any part to try it.
 * A project can show each tile in its own kit: F.STYLE_KITS = { calm: 'my-kit-class', ... }. */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  if (!F.STYLES) return;
  const HEADING = 'Ready when you are.';
  const VALUES = ['25 min', '18 min'];

  Object.keys(F.STYLES).forEach((key) => {
    const S = F.STYLES[key];
    F.def({
      id: 'style-' + key, section: 'kit-styles', name: S.name, style: key,
      intent: `${S.feel} For ${S.use.toLowerCase()}. ${S.tokens}. The same four parts in every tile: only the motion changes.`,
      build(ctx) {
        const kit = (F.STYLE_KITS || {})[key];
        ctx.root.classList.add('sty', ...(kit ? kit.split(' ') : []));
        const cell = (label, ...kids) => h('div.sty-cell', h('small', label), ...kids);
        let head = h('p.sty-head', HEADING);
        const headCell = cell('Heading', head);
        const btn = F.primary(ctx, 'Continue', { onTap: () => ctx.haptic('light') });
        const tog = F.toggle(ctx, false, () => ctx.haptic('selection'));
        const value = h('b.sty-value', VALUES[0]);
        let vi = 0;
        const swap = () => { vi = 1 - vi; F.setValue(ctx, value, VALUES[vi]); };
        F.press(ctx, value, { scale: 0.97, onTap: swap });
        const name = h('h1.sty-name', S.name), feel = h('p.sty-feel', S.feel), tokens = h('p.sty-tokens', S.tokens);
        ctx.root.append(h('div.sty-body', name, feel, headCell, cell('Button', btn), cell('Toggle', h('div.sty-tog', h('span', 'Sound'), tog)), cell('Value', value), tokens));
        F.titleIn(ctx, name, { delay: 80 });
        F.rise(ctx, [feel, ...ctx.root.querySelectorAll('.sty-cell'), tokens], { delay: 240 });
        if (ctx.mode === 'flow') return;
        // One part after another, then round again while the tile is alive.
        const beats = [
          () => {
            F.exit(ctx, head);
            ctx.at(((S.out && S.out.ms) || 200) + 80, () => {
              const fresh = h('p.sty-head', HEADING);
              head.replaceWith(fresh);
              head = fresh;
              F.titleIn(ctx, head);
            });
          },
          () => F.tapEl(ctx, btn),
          () => F.tapEl(ctx, tog),
          swap,
        ];
        const round = (i) => ctx.at(i === 0 ? 2600 : 1700, () => { beats[i](); round((i + 1) % beats.length); });
        round(1);
      },
    });
  });
})();
