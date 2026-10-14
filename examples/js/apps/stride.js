/* Stride, a running coach. The step: a question (onboarding-questions, interaction-feel).
 * Generated: a goal list with emoji and Next. Ungenerated: the run you did, on a ruler you drag,
 * with its consequence updating as you drag. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'stride-generated', section: 'generated', name: 'Stride · generated', loop: 7600,
    intent: 'The first draft of "ask the runner about their level": Step 3 of 12, a goal every fitness app asks, emoji rows, radio buttons and Next.',
    build(ctx) {
      const { body } = S.frame(ctx, { blobs: false });
      const top = h('div', h('div.s-step', h('span', '← Back'), h('span', 'Step 3 of 12')), h('div.s-bar', h('i')));
      const q = h('h1.s-q', 'What’s your fitness goal? 💪');
      const sub = h('p.s-sub', 'Select the option that best describes your current fitness journey!');
      const opts = [['🏃', 'Lose weight'], ['💪', 'Build muscle'], ['⚡', 'Improve endurance'], ['🧘', 'Reduce stress'], ['🎯', 'Other']].map(([e, t]) => {
        const b = h('button.s-opt', { type: 'button' }, h('span.e', e), h('span', t), h('i.r'));
        ctx.on(b, 'click', () => opts.forEach((o) => o.classList.toggle('is-on', o === b)));
        return b;
      });
      const btn = S.btn(ctx, 'Next →');
      body.append(top, q, sub, h('div.s-opts', opts), h('div.ph-fill'), btn);
      S.in([top, q, sub, ...opts, btn]);
      ctx.at(2000, () => F.tapEl(ctx, opts[2]));
      ctx.at(3300, () => F.tapEl(ctx, btn));
    },
  });

  // ---------------------------------------------------------------- the ruler

  const KM = 50; // points per kilometre on the ruler
  const MAX = 21;
  const firstRun = (v) => Math.max(1, Math.round(v * 0.7 * 2) / 2);

  F.def({
    id: 'stride-distance', section: 'ungenerated', name: 'Stride · a question', flow: true, progress: 0.42, loop: 9500, seqHold: 8900,
    intent: 'Asks the thing itself. The ruler glides under the finger, the number flows (it never rolls while dragging), and what it means updates live: laps of a track, then the first long run of week one.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const a = ctx.answers;
      let v = a.longest || 3;
      const head = F.qHead(ctx, 'Your longest run *this month?*', 'A guess is fine. Week one starts from it.');
      const num = h('b.sd-num', v.toFixed(1));
      const readout = h('div.sd-readout', num, h('span.sd-unit', 'km'));
      const laps = h('b');
      const lapsLine = h('p.sd-laps', F.icon('rotate-ccw', { size: 16 }), h('span', 'About ', laps, ' laps of a track'));

      // The strip: a tick every 200 m, a label every kilometre. It moves by transform only.
      const strip = h('div.sd-strip', { style: { width: MAX * KM + 'px' } });
      for (let i = 0; i <= MAX * 5; i++) {
        const km = i / 5;
        const major = i % 5 === 0;
        strip.append(h('i.sd-tick' + (major ? '.is-major' : ''), { style: { left: km * KM + 'px' } }));
        if (major) strip.append(h('span.sd-label', { style: { left: km * KM + 'px' } }, String(km)));
      }
      const ruler = h('div.sd-ruler', strip, h('i.sd-needle'));
      const first = h('b');
      const plan = h('div.sd-plan', h('span', 'Your first long run'), first);
      const cta = F.primary(ctx, 'Continue');

      let lastWhole = Math.floor(v);
      const set = (val, quiet) => {
        v = F.clamp(val, 0.5, MAX);
        a.longest = Math.round(v * 10) / 10;
        num.textContent = v.toFixed(1);
        strip.style.transform = `translateX(${(-v * KM).toFixed(2)}px)`;
        laps.textContent = String(Math.round(v / 0.4));
        first.textContent = `${firstRun(v)} km`;
        if (!quiet && Math.floor(v) !== lastWhole) { lastWhole = Math.floor(v); ctx.haptic('selection'); }
      };
      set(v, true);

      // Real dragging: 1:1 under the finger, then it settles on the nearest 100 m with a small spring.
      let drag = null, stopSettle = null;
      ctx.on(ruler, 'pointerdown', (e) => {
        stopSettle && stopSettle();
        drag = { x: e.clientX, v, k: ruler.getBoundingClientRect().width / ruler.offsetWidth };
        ruler.setPointerCapture(e.pointerId);
        ruler.classList.add('is-held');
      });
      ctx.on(ruler, 'pointermove', (e) => { if (drag) set(drag.v - (e.clientX - drag.x) / drag.k / KM); });
      const release = () => {
        if (!drag) return;
        drag = null;
        ruler.classList.remove('is-held');
        stopSettle = F.tween(ctx, v, Math.round(v * 10) / 10, { spring: { response: 0.3, damping: 0.86 } }, (x) => set(x, true));
      };
      ctx.on(ruler, 'pointerup', release);
      ctx.on(ruler, 'pointercancel', release);

      body.append(F.qTop(ctx, { progress: 0.42 }), head, readout, lapsLine, ruler, plan, h('div.ph-fill'), h('div.ph-foot', cta));
      F.rise(ctx, [readout, lapsLine, ruler, plan, cta], { delay: 220 });

      if (ctx.mode !== 'flow') {
        // The demo: a thumb drags the ruler from 3 km to 8.4 km, and lets go.
        ctx.at(1700, () => {
          const y = F.pos(ruler, ctx.root).cy;
          const from = v;
          ruler.classList.add('is-held');
          X.drag(ctx, ctx.root, 318, 48, y, { duration: 1700, curve: 'inout', up: () => { ruler.classList.remove('is-held'); F.tween(ctx, v, 8.4, { spring: { response: 0.3, damping: 0.86 } }, (x) => set(x, true)); } }, (t) => set(from + (8.4 - from) * t));
        });
      }
    },
  });
})();
