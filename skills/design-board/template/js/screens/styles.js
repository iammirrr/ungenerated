/* The motion styles row of the kit (the motion-styles skill): one screen, laid out the same way
 * seven times, moving in seven personalities. Only the motion differs, so the reviewer picks a
 * personality by feel. Each tile plays itself on a loop; tap to try it.
 * A project can show each tile in its own kit: F.STYLE_KITS = { calm: 'my-kit-class', ... }. */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  if (!F.STYLES) return;

  Object.keys(F.STYLES).forEach((key) => {
    const S = F.STYLES[key];
    F.def({
      id: 'style-' + key, section: 'kit-styles', name: S.name, style: key,
      intent: `${S.feel} For ${S.use.toLowerCase()}. ${S.tokens}. The same screen in every tile: only the motion changes.`,
      build(ctx) {
        const kit = (F.STYLE_KITS || {})[key];
        const { body } = F.frame(ctx, { cls: 'sty' + (kit ? ' ' + kit : ''), tone: (F.STYLE_TONES || {})[key] });
        const title = h('h1.sty-name', S.name + '.');
        const feel = h('p.sty-feel', S.feel);
        const value = h('b.sty-value', '25 min');
        const orb = h('i.sty-orb');
        const track = h('i.sty-track', h('i.sty-fill'));
        const card = h('div.sty-card', h('div.sty-card-top', h('div', h('small', 'Today’s session'), value), orb), track);
        const rows = [['Warm up', '5 min'], ['Main set', '15 min'], ['Cool down', '5 min']].map(([a, b]) => h('div.sty-row', h('span', a), h('b', b)));
        const chips = ['Morning', 'Evening', 'Weekend'].map((t) => {
          const c = h('button.sty-chip', { type: 'button' }, h('span', t), h('i.sty-tick', F.icon('check', { size: 12, stroke: 3 })));
          F.press(ctx, c, { scale: 0.95, onTap: () => {
            const on = !c.classList.contains('is-on');
            chips.forEach((x) => x.classList.remove('is-on'));
            c.classList.toggle('is-on', on);
            if (on) F.pop(ctx, c.querySelector('.sty-tick'));
            ctx.haptic('selection');
          } });
          return c;
        });
        let short = false;
        const cta = F.primary(ctx, 'Start', { onTap: () => {
          short = !short;
          F.setValue(ctx, value, short ? '18 min' : '25 min');
          ctx.haptic('light');
        } });
        const tokens = h('p.sty-tokens', S.tokens);
        body.append(h('p.t-eyebrow.sty-eyebrow', 'Motion style'), title, feel, card, h('div.sty-rows', rows), h('div.sty-chips', chips), h('div.ph-fill'), tokens, h('div.ph-foot', cta));
        F.titleIn(ctx, title, { delay: 80 });
        F.rise(ctx, [feel, card, ...rows], { delay: 260 });
        chips.forEach((c, i) => F.pop(ctx, c, { delay: 700 + i * 70 }));
        F.rise(ctx, [tokens, cta], { delay: 900 });
        ctx.at(1500, () => F.idle(ctx, orb));
        if (ctx.mode !== 'flow') {
          ctx.at(2300, () => F.tapEl(ctx, chips[1]));
          ctx.at(3500, () => F.tapEl(ctx, cta));
          if (ctx.mode === 'board') ctx.at(7600, () => ctx.restart());
        }
      },
    });
  });
})();
