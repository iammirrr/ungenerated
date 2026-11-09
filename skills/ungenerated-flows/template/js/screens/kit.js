/* The kit row: tiles that show the parts in their states, live. */
(() => {
  'use strict';
  const F = window.F, h = F.h;

  F.def({
    id: 'kit-colour', section: 'kit-foundations', name: 'Colour and type',
    intent: 'The tokens every screen reads. Change css/tokens.css and every phone on the board follows.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const title = h('h1.t-q', F.rich('Colour and *type.*'));
      const sw = h('div.kit-swatches', ['ground', 'panel', 'inset', 'accent', 'ink-strong', 'ink-muted', 'good', 'bad'].map((t) => h('div', h('i', { style: { background: `var(--${t})` } }), t)));
      body.append(title, sw);
      F.titleIn(ctx, title);
      F.rise(ctx, [...sw.children], { delay: 120, stagger: 30 });
    },
  });

  F.def({
    id: 'kit-buttons', section: 'kit-foundations', name: 'Buttons',
    intent: 'Every button presses the same way: in to 0.97 with a point of depth, back on a spring.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const title = h('h1.t-q', F.rich('Buttons, *every state.*'));
      const p = F.primary(ctx, 'Primary', { onTap: () => ctx.haptic('light') });
      const quiet = F.primary(ctx, 'Quiet', { kind: 'quiet', onTap: () => ctx.haptic('soft') });
      const off = F.primary(ctx, 'Disabled', { disabled: true });
      const tog = F.toggle(ctx, true);
      const stack = h('div.kit-stack', p, quiet, off, tog);
      body.append(title, stack);
      F.titleIn(ctx, title);
      F.rise(ctx, [...stack.children], { delay: 120 });
      ctx.at(1200, () => F.tapEl(ctx, p));
    },
  });
})();
