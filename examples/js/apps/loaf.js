/* Loaf, a sourdough companion. The step: the opening (opening-hook, continuity).
 * Generated: a feature carousel. Ungenerated: one jar carries four beats, and the button waits. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S;

  F.def({
    id: 'loaf-generated', section: 'generated', name: 'Loaf · generated', loop: 9000,
    intent: 'The first draft a model makes from "an onboarding for a sourdough app": a welcome carousel with emoji features, gradient text and Get Started on screen one.',
    build(ctx) {
      const { body } = S.frame(ctx);
      const skip = h('button.s-skip', { type: 'button' }, 'Skip');
      const hero = h('div.s-emoji', { style: { width: '96px', height: '96px', margin: '34px auto 0', fontSize: '48px', borderRadius: '28px' } }, '🍞');
      const title = h('h1.s-h1', { style: { marginTop: '28px' } }, 'Welcome to ', h('span.s-grad', 'Loaf'), ' ✨');
      const p = h('p.s-p', 'Your AI-powered sourdough companion for the perfect bake, every single time!');
      const feats = h('div.s-feats', [
        ['🧠', 'Smart Scheduling', 'AI predicts the perfect time to bake'],
        ['📊', 'Track Your Progress', 'Beautiful insights & analytics'],
        ['🔔', 'Never Miss a Feed', 'Smart reminders that adapt to you'],
      ].map(([e, t, s]) => h('div.s-feat.s-glass', h('span.s-feat-ic', e), h('div', h('strong', t), h('span', s)))));
      const dots = S.dots(3, 0);
      const btn = S.btn(ctx, 'Get Started 🚀', { glow: true });
      body.append(hero, title, p, feats, h('div.ph-fill'), dots, h('div', { style: { height: '18px' } }), btn);
      ctx.root.append(skip);
      S.in([hero, title, p, ...feats.children, dots, btn]);
      ctx.at(4200, () => F.tapEl(ctx, btn));
    },
  });

  // ---------------------------------------------------------------- the opening, one jar

  const fmt12 = (m) => {
    const hh = Math.floor(m / 60) % 24, mm = Math.round(m % 60);
    return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'am' : 'pm'}`;
  };
  const GLASS_H = 196;

  F.def({
    id: 'loaf-opening', section: 'ungenerated', name: 'Loaf · the opening', flow: true, loop: 13500, seqHold: 12900,
    intent: 'One hero, the jar, carries four beats on one stage: it waits, it is fed (the hands-on moment), it rises while the clock flows and the rise draws itself, and only then the plan and the button.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-loaf' });
      const title = h('h1.lf-title', F.rich('Your starter keeps *its own time.*'));

      // The jar: glass, the starter inside (moved only by transform), a rubber band at the fed level.
      const bubbles = Array.from({ length: 16 }, (_, i) => {
        const r = F.rand(i + 7);
        const size = 4 + Math.round(r() * 7);
        return h('i.lf-bub', { style: { left: 10 + r() * 132 + 'px', top: 14 + r() * 150 + 'px', width: size + 'px', height: size + 'px' } });
      });
      bubbles.slice(5).forEach((b) => (b.style.opacity = 0));
      const starter = h('div.lf-starter', h('i.lf-surface'), bubbles);
      const glass = h('div.lf-glass', starter, h('i.lf-shine'));
      const band = h('i.lf-band');
      const twice = h('div.lf-twice', h('i'), h('span', '2×'));
      const jar = h('div.lf-jar', h('div.lf-lid', h('i'), h('i'), h('i')), glass, band, twice);
      const setLevel = (f) => (starter.style.transform = `translateY(${((1 - f) * GLASS_H).toFixed(1)}px)`);
      setLevel(0.3);
      band.style.transform = `translateY(${((1 - 0.4) * GLASS_H).toFixed(1)}px)`;
      twice.style.transform = `translateY(${((1 - 0.8) * GLASS_H).toFixed(1)}px)`;

      const fed = h('div.lf-chip', F.icon('droplet', { size: 15 }), h('span', 'Fed at 9:00 am'));
      const clock = h('b.lf-clock-time', '9:00 am');
      const clockChip = h('div.lf-clock', F.icon('clock', { size: 15 }), clock);

      // The rise, as the app draws it: hours along the bottom, the peak marked.
      const W = 318, H = 92;
      // The axis runs 9 am to 6 pm; today's peak, 1:40 pm, sits at 4 h 40 m of 9 h.
      const PEAK = 280 / 540;
      const pts = Array.from({ length: 49 }, (_, i) => {
        const t = i / 48;
        const s = F.clamp((t - 0.04) / (PEAK - 0.04), 0, 1);
        const v = t <= PEAK ? s * s * (3 - 2 * s) : 1 - Math.pow((t - PEAK) / (1 - PEAK), 2) * 0.32;
        return [t * W, H - 8 - v * (H - 22)];
      });
      const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
      const peak = [PEAK * W, pts[Math.round(PEAK * 48)][1]];
      const line = F.svg('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.6, 'stroke-linecap': 'round' });
      const area = F.svg('path', { d: `${d} L${W} ${H} L0 ${H} Z`, class: 'lf-area' });
      const svg = F.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, area, line);
      const dot = h('i.lf-peak', { style: { left: peak[0] + 'px', top: peak[1] + 'px' } });
      const peakTag = h('span.lf-peak-tag', { style: { left: peak[0] + 16 + 'px', top: peak[1] - 12 + 'px' } }, 'Peak 1:40 pm');
      const plot = h('div.lf-plot', svg, dot, peakTag);
      const axis = h('div.lf-axis', ['9 am', '12 pm', '3 pm', '6 pm'].map((t) => h('span', t)));
      const chart = h('div.lf-chart', plot, axis);

      const plan = h('div.lf-plan', [['Mix', '1:40 pm'], ['Shape', '5:10 pm'], ['Bake', '6:30 pm']].map(([a, b]) => h('div', h('small', a), h('b', b))));
      const cta = F.primary(ctx, 'Start with my starter');
      const foot = h('div.ph-foot', cta);
      const stage = h('div.lf-stage', title, jar, fed, clockChip, chart, plan);
      body.append(stage, h('div.ph-fill'), foot);
      foot.style.visibility = 'hidden';
      [fed, clockChip, chart, plan, twice, dot, peakTag].forEach((el) => (el.style.opacity = 0));

      // Beat 1: the jar arrives alone.
      F.move(jar, { s: 0.9, o: 0, y: 14 }, { s: 1, o: 1, y: 0 }, { duration: 820, curve: 'emph', ctx, fill: 'backwards' });
      F.titleIn(ctx, title, { delay: 260 });

      // Beat 2: the hands-on moment. The finger feeds it; the jar gives a little, like a bubble.
      ctx.at(2300, () => F.swapText(ctx, title, 'Feed it, and Loaf *starts watching.*'));
      ctx.at(3000, () => {
        const p = F.pos(glass, ctx.root);
        F.touch(ctx, ctx.root, p.cx, p.cy + 30);
      });
      ctx.at(3300, () => {
        ctx.haptic('soft');
        F.move(jar, { sx: 1, sy: 1 }, { sx: 1.04, sy: 0.95 }, { duration: 90, curve: 'strong', ctx, fill: 'forwards' });
        ctx.at(100, () => F.move(jar, { sx: 1.04, sy: 0.95 }, { sx: 1, sy: 1 }, { spring: { response: 0.34, damping: 0.6 }, ctx, fill: 'forwards' }));
        F.tween(ctx, 0.3, 0.4, { spring: { response: 0.5, damping: 0.7 } }, setLevel);
        fed.style.opacity = '';
        F.move(fed, { s: 0.5, o: 0, y: 18 }, { s: 1, o: 1, y: 0 }, { spring: { response: 0.38, damping: 0.62 }, ctx, fill: 'backwards' });
        twice.style.opacity = '';
        F.move(twice, { o: 0, x: -8 }, { o: 1, x: 0 }, { duration: 420, delay: 300, curve: 'strong', ctx, fill: 'backwards' });
      });

      // Beat 3: it rises. The clock flows and the curve draws in step with it.
      ctx.at(5000, () => {
        F.swapText(ctx, title, 'Today it peaks *at 1:40.*');
        F.move(fed, { o: 1, y: 0 }, { o: 0, y: -8 }, { duration: 200, curve: 'exit', ctx, fill: 'forwards' });
        clockChip.style.opacity = '';
        chart.style.opacity = '';
        F.rise(ctx, [clockChip, chart], { delay: 120 });
        F.timeText(ctx, clock, 540, { fmt: fmt12 });
        const t0 = 400;
        ctx.at(t0, () => {
          F.tween(ctx, 0, 1, { duration: 2800, curve: 'inout' }, (t) => {
            setLevel(0.4 + 0.4 * t);
            F.timeText(ctx, clock, 540 + 280 * t, { fmt: fmt12, tau: 60 });
            plot.style.clipPath = `inset(-40px ${((1 - PEAK * t) * 100).toFixed(1)}% -10px 0)`;
          });
          bubbles.slice(5).forEach((b, i) => F.move(b, { y: 10, s: 0.4, o: 0 }, { y: 0, s: 1, o: 1 }, { duration: 700, delay: 200 + i * 190, curve: 'strong', ctx }));
        });
        plot.style.clipPath = 'inset(-40px 100% -10px 0)';
        ctx.at(t0 + 2700, () => {
          dot.style.opacity = '';
          peakTag.style.opacity = '';
          F.pop(ctx, dot, { from: 0.4 });
          F.rise(ctx, peakTag, { distance: 6 });
          ctx.haptic('light');
          // The rest of the day is the forecast: it draws on, quieter.
          ctx.at(500, () => F.tween(ctx, PEAK, 1, { duration: 900, curve: 'strong' }, (f) => (plot.style.clipPath = `inset(-40px ${((1 - f) * 100).toFixed(1)}% -10px 0)`)));
        });
      });

      // Beat 4: the plan, as the app shows it; the last line; only now the button.
      ctx.at(8900, () => {
        F.swapText(ctx, title, 'Bake when it’s ready, *not when the recipe says.*');
        plan.style.opacity = '';
        F.rise(ctx, [...plan.children], { delay: 200, stagger: 90 });
      });
      ctx.at(10300, () => {
        foot.style.visibility = '';
        F.rise(ctx, cta, { distance: 10 });
      });
    },
  });
})();
