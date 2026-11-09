/* Fern, plant care: the first plant (setup-and-tour). Motion style: organic (things grow).
 * Three screens: the camera with a frame that grows like a stem, the plant named with its care
 * growing in as a schedule, and the shelf, where a drop fills while a finger logs a watering. */
(() => {
  'use strict';
  const F = window.F, h = F.h, X = window.X;

  // ---------------------------------------------------------------- what every screen here shares

  const base = { section: 'fern-setup', style: 'organic', flow: true };
  const NEXT = () => X.day(9); // a monstera is watered every 9 days: first today, then this day
  const ms = (v) => (F.reduced() ? 1 : v * F.k());
  let uid = 0;

  const top = (ctx, title, o = {}) => {
    const back = h('button.fs-back', { type: 'button', 'aria-label': o.close ? 'Close' : 'Back' }, F.icon(o.close ? 'x' : 'chevron-left', { size: o.close ? 20 : 22, stroke: 2 }));
    F.press(ctx, back, { row: true, onTap: () => ctx.back() });
    return h('div.fs-top' + (o.light ? '.is-light' : ''), { 'data-keep': '' }, back, h('b', title), h('span'));
  };
  /** When a path drawn on a curve reaches t (0–1), in ms (the inverse of the curve). */
  const reach = (curve, dur, t) => {
    const f = F.bezier(curve);
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (f(m) < t) lo = m; else hi = m; }
    return dur * hi;
  };
  /** A path draws itself, the way a stem grows: from its base, on the grow curve. */
  const draw = (ctx, path, dur, delay = 0) => {
    path.style.strokeDashoffset = 1;
    ctx.at(delay, () => ctx.track(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms(dur), easing: F.css('grow'), fill: 'forwards' })));
  };
  /** A leaf unfolds where the stem has reached: from its stalk, no bounce. */
  const unfold = (ctx, el, delay = 0) => {
    el.style.opacity = 0;
    ctx.at(delay, () => {
      el.style.opacity = '';
      F.move(el, { s: 0.2, r: -24, o: 0 }, { s: 1, r: 0, o: 1 }, { duration: 760, curve: 'grow', ctx, fill: 'backwards' });
    });
  };
  const LEAF = 'M0 0 C 6 -11, 20 -14, 29 -6 C 20 1, 8 2, 0 0 Z';

  // ---------------------------------------------------------------- 1 · the camera

  F.def({
    ...base, id: 'fern-scan', name: 'Add your first plant', loop: 5200, seqHold: 4600,
    intent: 'Setup starts at the first useful thing, the camera: a frame grows in around the plant like four stems and says what to do. The shutter is the only button; a soft flash, and on.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern fs-cam', tone: 'light' });
      const view = X.pic('fern-monstera', { cls: 'fs-view is-dark' });
      const shade = h('i.fs-shade');
      // Four corners, each a stem with its own curve: never quite symmetric.
      const corners = [
        'M50 226 C 49 197, 60 175, 100 171',
        'M290 170 C 326 172, 340 191, 340 222',
        'M341 506 C 340 538, 326 556, 288 559',
        'M104 560 C 66 558, 50 541, 49 508',
      ].map((d) => F.svg('path', { d, class: 'fs-corner', pathLength: 1 }));
      // Two of the stems end in a leaf; the other two don't.
      const sprigs = [[100, 171, -12], [341, 506, 104]].map(([x, y, a]) => {
        const leaf = F.svg('path', { d: LEAF, class: 'fs-sprig' });
        return { g: F.svg('g', { transform: `translate(${x} ${y}) rotate(${a})` }, leaf), leaf };
      });
      const frame = F.svg('svg', { class: 'fs-frame', width: 390, height: 844, viewBox: '0 0 390 844' }, corners, sprigs.map((s) => s.g));
      const hint = h('p.fs-hint', 'Fit the whole plant in the frame');
      const shutter = h('button.fs-shutter', { type: 'button', 'aria-label': 'Take the photo' }, h('i'));
      const flash = h('i.fs-flash');
      body.append(view, shade, frame, top(ctx, 'Add your first plant', { close: true, light: true }), h('div.ph-fill'), h('div.fs-hint-wrap', hint), h('div.fs-cam-foot', shutter), flash);
      [view, shade, frame, flash].forEach((el) => el.setAttribute('data-own', ''));

      // The viewfinder is alive in the hand: the gentlest sway.
      F.move(view, { s: 1.08 }, { s: 1.02 }, { duration: 1400, curve: 'grow', ctx, fill: 'both' });
      if (!F.reduced()) ctx.track(view.animate([{ rotate: '-0.35deg', translate: '-2px 1px' }, { rotate: '0.35deg', translate: '2px -1px' }], { duration: 3600 * F.k(), direction: 'alternate', iterations: Infinity, easing: F.css('calm') }));
      corners.forEach((c, i) => draw(ctx, c, 760, 300 + i * 90));
      sprigs.forEach((s, i) => unfold(ctx, s.leaf, 820 + i * 180));
      F.rise(ctx, [hint, shutter], { delay: 520 });

      // The plant fits: the frame settles round it and the words say so.
      ctx.at(1700, () => {
        F.move(frame, { s: 1, r: 0 }, { s: 0.965, r: 0 }, { duration: 760, curve: 'grow', ctx, fill: 'forwards' });
        frame.classList.add('is-found');
        F.swapText(ctx, hint, 'That’s the whole plant');
        ctx.haptic('selection');
      });

      let taken = false;
      F.press(ctx, shutter, { onTap: () => {
        if (taken) return;
        taken = true;
        ctx.haptic('soft');
        flash.style.opacity = '';
        ctx.track(flash.animate([{ opacity: 0 }, { opacity: 0.88, offset: 0.16 }, { opacity: 0 }], { duration: ms(640), easing: F.css('grow'), fill: 'forwards' }));
        ctx.at(680, () => ctx.next());
      } });
      flash.style.opacity = 0;
      if (ctx.mode !== 'flow') ctx.at(2900, () => F.tapEl(ctx, shutter));
    },
  });

  // ---------------------------------------------------------------- 2 · the plant, named, and its care growing in

  F.def({
    ...base, id: 'fern-id', name: 'It’s a monstera', loop: 6000, seqHold: 5300,
    intent: 'The photo comes back framed like a window, the plant named in plain words and in Latin. Its care grows in as a schedule, a leaf unfolding at each line: water every 9 days with the real next date, the light it wants, when to repot.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const photo = X.pic('fern-monstera', { cls: 'fs-arch' });
      const title = h('h1.fs-h.fs-center', F.rich('It’s a *monstera.*'));
      const latin = h('p.fs-latin', 'Monstera deliciosa');
      const next = NEXT();
      const CARE = [
        ['Water every 9 days', `First today, next on ${X.short(next)}`],
        ['Bright, indirect light', 'Near a window, out of direct sun'],
        ['Repot in spring', 'Every two years, in March or April'],
      ];
      const rows = CARE.map(([b, s]) => h('div.fs-care-row', h('b', b), h('small', s)));
      // The stem: drawn down the left, a leaf unfolding at each line of care.
      const stem = F.svg('path', { d: 'M15 2 C 22 34, 7 58, 14 92 S 22 146, 12 182', class: 'fs-stem', pathLength: 1 });
      const leafAt = [[0.15, -34], [0.5, -22], [0.84, -40]];
      const svg = F.svg('svg', { class: 'fs-care-svg', width: 40, height: 186, viewBox: '0 0 40 186' }, stem);
      const leaves = leafAt.map(([t, a], i) => {
        const leaf = F.svg('path', { d: LEAF, class: 'fs-leaf' + (i === 1 ? ' is-light' : '') });
        svg.append(F.svg('g', { class: 'fs-leaf-g', 'data-t': t, 'data-a': a }, leaf));
        return leaf;
      });
      const care = h('div.fs-care', svg, h('div.fs-care-rows', rows));
      const cta = F.primary(ctx, 'Add to my plants');
      const parts = [photo, title, latin, care];
      body.append(top(ctx, 'New plant'), ...parts, h('div.ph-fill'), h('div.ph-foot', cta));
      parts.forEach((p) => p.setAttribute('data-own', ''));
      // Place each leaf on the stem, now that it is laid out.
      const L = stem.getTotalLength();
      svg.querySelectorAll('.fs-leaf-g').forEach((g) => {
        const p = stem.getPointAtLength(L * +g.dataset.t);
        g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${g.dataset.a}) scale(1.3)`);
      });

      F.rise(ctx, photo, { delay: 120 });
      F.titleIn(ctx, title, { delay: 420 });
      F.rise(ctx, latin, { delay: 560 });
      const GROW = 1500, START = 900;
      draw(ctx, stem, GROW, START);
      leafAt.forEach(([t], i) => {
        const at = START + reach('grow', GROW, t);
        unfold(ctx, leaves[i], at - 60);
        F.rise(ctx, rows[i], { delay: at - 140 });
        ctx.at(at + 900, () => F.idle(ctx, leaves[i].parentNode, 'sway', { delay: i * 500 }));
      });
      F.rise(ctx, cta, { delay: 2100 });
      if (ctx.mode !== 'flow') ctx.at(4300, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- 3 · the shelf, and the first watering

  /** A drop that fills while it is held, its surface rocking like water, never bouncing. */
  const makeDrop = (ctx) => {
    const id = 'fs-drop-' + ++uid;
    const shape = 'M36 3 C 30 16, 6 42, 6 63 A 30 30 0 0 0 66 63 C 66 42, 42 16, 36 3 Z';
    const wave = F.svg('path', { class: 'fs-water', d: 'M-80 10 Q -60 2 -40 10 T 0 10 T 40 10 T 80 10 T 120 10 T 160 10 V 120 H -80 Z' });
    const water = F.svg('g', { class: 'fs-water-g' }, wave);
    const svg = F.svg('svg', { class: 'fs-drop-svg', width: 72, height: 96, viewBox: '0 0 72 96' },
      F.svg('defs', {}, F.svg('clipPath', { id }, F.svg('path', { d: shape }))),
      F.svg('path', { d: shape, class: 'fs-drop-ground' }),
      F.svg('g', { 'clip-path': `url(#${id})` }, water),
      F.svg('path', { d: shape, class: 'fs-drop-line' }));
    const check = h('span.fs-drop-check', F.icon('check', { size: 14, stroke: 3 }));
    const el = h('button.fs-drop', { type: 'button', 'aria-label': 'Log a watering' }, svg, check);
    const level = (f) => water.setAttribute('transform', `translate(0 ${(90 - f * 97).toFixed(2)})`);
    level(0.12);
    if (!F.reduced()) ctx.track(wave.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(40px)' }], { duration: 1800 * F.k(), iterations: Infinity, easing: 'linear' }));
    el.level = level;
    el.check = check;
    return el;
  };

  F.def({
    ...base, id: 'fern-home', name: 'Your shelf', loop: 7000, seqHold: 6400,
    intent: 'The product: the monstera on its shelf with room for the next ones, and the one thing to do today. Hold the drop while you water and it fills; the next date takes its place, and nothing bounces.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const next = NEXT();
      const eyebrow = h('p.fs-eyebrow', X.long(X.day(0)));
      const title = h('h1.fs-h', F.rich('Your *shelf.*'));
      const plant = h('figure.fs-plant', X.pic('fern-monstera', { cls: 'fs-plant-pic' }));
      const empty = () => {
        const b = h('button.fs-empty', { type: 'button', 'aria-label': 'Add a plant' }, F.icon('plus', { size: 20, stroke: 2 }));
        F.press(ctx, b, { scale: 0.95 });
        return b;
      };
      const empties = [empty(), empty()];
      const plank = h('i.fs-plank');
      const status = h('small', 'Water today');
      const labels = h('div.fs-labels', h('div', h('b', 'Monstera'), status), h('div.is-add', h('span', 'Add a plant')));
      const shelf = h('div.fs-shelf', h('div.fs-shelf-row', plant, h('div.fs-empties', empties)), plank, labels);

      const drop = makeDrop(ctx);
      const when = h('b.fs-when', 'Today');
      const whenSub = h('small.fs-when-sub', 'Then every 9 days');
      const hint = h('p.fs-hint-line', 'Hold the drop while you water it.');
      const card = h('div.fs-water-card', h('div.fs-water-top', drop, h('div.fs-water-text', h('small.fs-cap', 'Next watering'), when, whenSub)), hint);
      const tab = (icon, label, on) => h('span.fs-tab' + (on ? '.is-on' : ''), F.icon(icon, { size: 22, stroke: on ? 2 : 1.75 }), h('small', label));
      const tabs = h('nav.fs-tabs', { 'data-keep': '' }, tab('sprout', 'Shelf', true), tab('calendar-days', 'Calendar'), tab('settings-2', 'Settings'));
      const parts = [eyebrow, title, shelf, card];
      body.append(...parts);
      ctx.root.append(tabs);
      parts.forEach((p) => p.setAttribute('data-own', ''));

      F.rise(ctx, eyebrow);
      F.titleIn(ctx, title, { delay: 80 });
      ctx.track(plank.animate([{ clipPath: 'inset(0 100% 0 0 round 3px)' }, { clipPath: 'inset(0 0% 0 0 round 3px)' }], { duration: ms(820), delay: ms(260), easing: F.css('grow'), fill: 'backwards' }));
      F.rise(ctx, [plant, ...empties, labels, card], { delay: 420 });
      ctx.at(1500, () => F.idle(ctx, drop, 'sway'));

      // Hold the drop: it fills while the finger stays; let go full and the watering is logged.
      let fill = 0.12, run = null, done = false;
      const log = () => {
        done = true;
        ctx.haptic('soft');
        drop.classList.add('is-full');
        F.move(drop.check, { s: 0.3, o: 0 }, { s: 1, o: 1 }, { duration: 640, curve: 'grow', ctx, fill: 'backwards' });
        F.swapText(ctx, when, X.long(next));
        F.swapText(ctx, whenSub, 'In 9 days', 80);
        F.swapText(ctx, hint, 'Watered today. Fern will remind you then.', 160);
        F.swapText(ctx, status, `Water on ${X.short(next)}`, 220);
      };
      const down = () => {
        if (done) return;
        run && run();
        run = F.tween(ctx, fill, 1, { duration: 1500 * (1 - fill) / 0.88, curve: 'grow', done: () => { run = null; log(); } }, (v) => { fill = v; drop.level(v); });
      };
      const up = () => {
        if (done || !run) return;
        run();
        run = F.tween(ctx, fill, 0.12, { duration: 700, curve: 'grow' }, (v) => { fill = v; drop.level(v); });
      };
      F.press(ctx, drop);
      ctx.on(drop, 'pointerdown', down);
      ctx.on(drop, 'pointerup', up);
      ctx.on(drop, 'pointerleave', up);
      ctx.on(drop, 'pointercancel', up);
      if (ctx.mode !== 'flow') {
        ctx.at(2300, () => {
          const p = F.pos(drop, ctx.root);
          F.touch(ctx, ctx.root, p.cx, p.cy + 8, { hold: 1500 });
          ctx.at(300, () => drop.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
          ctx.at(1950, () => drop.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })));
        });
        ctx.at(5800, () => ctx.next());
      }
    },
  });
})();
