/* The motion rows of the kit: bubbly (the bubbly-motion skill) and continuity (the continuity
 * skill), live. Each tile plays itself on a loop; tap to try it. Copy a tile, tune it, Pick. */
(() => {
  'use strict';
  const F = window.F, h = F.h;

  const SPRINGS = [
    ['Firm', { response: 0.3, damping: 0.86 }],
    ['Bubbly', { response: 0.38, damping: 0.62 }],
    ['Lively', { response: 0.45, damping: 0.55 }],
  ];
  const head = (ctx, title, sub) => {
    const t = h('h1.t-q', F.rich(title));
    F.titleIn(ctx, t);
    return h('div.mo-head', t, h('p.t-sub', sub));
  };
  const loop = (ctx, ms) => ctx.mode === 'board' && ctx.at(ms, () => ctx.restart());

  /** Squash that keeps its volume on the way down, a spring back up, the icon a beat behind. */
  const squishy = (ctx, el, icon, spring) => {
    el.style.transformOrigin = '50% 100%';
    let down = null;
    ctx.on(el, 'pointerdown', () => {
      down = F.move(el, { sx: 1, sy: 1 }, { sx: 1.06, sy: 0.92 }, { duration: 90, curve: 'strong', fill: 'forwards', ctx });
    });
    ctx.on(el, 'click', () => {
      down && down.cancel();
      F.move(el, { sx: 1.06, sy: 0.92 }, { sx: 1, sy: 1 }, { spring, fill: 'none', ctx });
      F.move(icon, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring, delay: 35, fill: 'backwards', ctx });
      ctx.haptic('light');
    });
  };

  // ================================================================== bubbly

  F.def({
    id: 'mo-squish', section: 'kit-bubbly', name: 'Squish, three tunings',
    intent: 'The same press on three springs. Down: wider and shorter, so it keeps its volume. Up: a spring, the icon a beat behind, the haptic on the release. Firm overshoots about 0.5%, Bubbly 8%, Lively 13%. Pick the one that feels right.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const balls = SPRINGS.map(([label, spring]) => {
        const icon = h('span.mo-ball-ic', F.icon('check', { size: 26, stroke: 2.4 }));
        const ball = h('button.mo-ball', { type: 'button', 'aria-label': label }, icon);
        squishy(ctx, ball, icon, spring);
        return h('div.mo-ball-col', ball, h('b', label), h('small', `${spring.response} / ${spring.damping}`));
      });
      body.append(head(ctx, 'Squish, *three ways.*', 'Same press, three springs.'), h('div.mo-balls', balls));
      F.rise(ctx, balls, { delay: 140 });
      balls.forEach((b, i) => ctx.at(900 + i * 1300, () => F.tapEl(ctx, b.firstChild)));
      loop(ctx, 5600);
    },
  });

  F.def({
    id: 'mo-pop', section: 'kit-bubbly', name: 'Pop from its source',
    intent: 'What a button makes grows out of the button: scale 0.5 to 1 on the bubbly spring, from the point it came from, opacity in over the first third. Never from scale 0, never from its own centre.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const save = F.primary(ctx, 'Save', { onTap: () => {
        const chip = h('div.mo-toast', h('span.mo-toast-ic', F.icon('check', { size: 15, stroke: 2.6 })), h('span', 'Saved'));
        stage.append(chip);
        chip.style.transformOrigin = '50% 100%';
        F.move(chip, { s: 0.5, o: 0, y: 14 }, { s: 1, o: 1, y: 0 }, { spring: SPRINGS[1][1], fill: 'backwards', ctx });
        F.move(chip.firstChild, { s: 0.4 }, { s: 1 }, { spring: SPRINGS[1][1], delay: 40, fill: 'backwards', ctx });
        ctx.at(1500, () => F.move(chip, { o: 1, y: 0 }, { o: 0, y: -8 }, { duration: 200, curve: 'exit', fill: 'forwards', ctx }));
        ctx.at(1720, () => chip.remove());
      } });
      const stage = h('div.mo-pop', save);
      body.append(head(ctx, 'Born from *the button.*', 'It grows out of what made it.'), stage);
      ctx.at(1000, () => F.tapEl(ctx, save));
      ctx.at(3000, () => F.tapEl(ctx, save));
      loop(ctx, 5000);
    },
  });

  F.def({
    id: 'mo-goo', section: 'kit-bubbly', name: 'One pill becomes two',
    intent: 'Surface tension: a blur and a sharp alpha threshold on the shapes’ layer, so two pills pull apart with a neck that snaps, and melt back together. The labels sit on their own layer, outside the filter, so the text never melts.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const id = 'goo-' + Math.random().toString(36).slice(2, 8);
      const svg = F.svg('svg', { width: 0, height: 0, class: 'mo-defs', 'aria-hidden': 'true' },
        F.svg('filter', { id }, F.svg('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 7 }), F.svg('feColorMatrix', { values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10' })));
      const a = h('i.mo-blob'), b = h('i.mo-blob');
      const layer = h('div.mo-goo-layer', { style: { filter: `url(#${id})` } }, a, b);
      const start = h('span.mo-goo-label', 'Start');
      const pause = h('span.mo-goo-label', 'Pause'), stop = h('span.mo-goo-label', 'Stop');
      const hit = h('button.mo-goo-hit', { type: 'button', 'aria-label': 'Start' });
      const wrap = h('div.mo-goo', svg, layer, start, pause, stop, hit);
      const S = SPRINGS[1][1];
      let open = false;
      pause.style.opacity = stop.style.opacity = '0';
      const set = (on) => {
        open = on;
        const dx = on ? 82 : 0;
        F.move(a, { x: on ? 0 : -82 }, { x: -dx }, { spring: S, fill: 'forwards', ctx });
        F.move(b, { x: on ? 0 : 82 }, { x: dx }, { spring: S, fill: 'forwards', ctx });
        F.move(pause, { x: on ? 0 : -82, o: on ? 0 : 1 }, { x: -dx, o: on ? 1 : 0 }, { spring: S, fill: 'forwards', ctx });
        F.move(stop, { x: on ? 0 : 82, o: on ? 0 : 1 }, { x: dx, o: on ? 1 : 0 }, { spring: S, fill: 'forwards', ctx });
        F.move(start, { o: on ? 1 : 0, s: on ? 1 : 0.9 }, { o: on ? 0 : 1, s: on ? 0.9 : 1 }, { duration: on ? 140 : 260, delay: on ? 0 : 160, curve: on ? 'exit' : 'strong', fill: 'forwards', ctx });
        ctx.haptic(on ? 'medium' : 'light');
      };
      ctx.on(hit, 'click', () => set(!open));
      body.append(head(ctx, 'One pill, *then two.*', 'A neck stretches, then snaps.'), wrap);
      ctx.at(1100, () => F.tapEl(ctx, hit));
      ctx.at(3300, () => F.tapEl(ctx, hit, { dx: 82 }));
      loop(ctx, 5400);
    },
  });

  F.def({
    id: 'mo-stretch', section: 'kit-bubbly', name: 'Stretch in flight',
    intent: 'A travelling thing stretches along its path with its speed (at most 1.2) and settles round on arrival. The spring carries the speed, so a new tap mid-flight never jerks.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const tabs = ['Today', 'Week', 'Month', 'Year'];
      const pill = h('i.mo-tab-pill');
      const btns = tabs.map((t, i) => {
        const b = h('button.mo-tab', { type: 'button' }, t);
        ctx.on(b, 'click', () => go(i));
        return b;
      });
      const bar = h('div.mo-tabs', pill, btns);
      const W = 342 / 4;
      let x = 0, last = 0, stop = null, at = 0;
      const paint = (v, st) => { pill.style.transform = `translateX(${v.toFixed(2)}px) scale(${(1 + st).toFixed(3)}, ${(1 - st * 0.45).toFixed(3)})`; };
      const go = (i) => {
        if (i === at) return;
        at = i;
        btns.forEach((b, k) => b.classList.toggle('is-on', k === i));
        stop && stop();
        last = x;
        stop = F.tween(ctx, x, i * W, { spring: { response: 0.42, damping: 0.7 } }, (v) => {
          const st = Math.min(0.2, Math.abs(v - last) * 0.03);
          last = x = v;
          paint(v, st);
        });
        ctx.haptic('selection');
      };
      btns[0].classList.add('is-on');
      paint(0, 0);
      body.append(head(ctx, 'Stretch *with speed.*', 'Long when fast, round when it lands.'), bar);
      [3, 1, 2, 0].forEach((i, k) => ctx.at(900 + k * 1100, () => F.tapEl(ctx, btns[i])));
      loop(ctx, 5600);
    },
  });

  // ================================================================== continuity

  F.def({
    id: 'mo-carry', section: 'kit-continuity', name: 'A choice flies into its place',
    intent: 'The value thread: the picked chip flies to its slot on one eased path. Two copies share the path and cross between 35% and 65%, so the chip becomes the slot’s words in the air and nothing swaps when it lands.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const value = h('b.mo-slot-v', '—');
      const card = h('div.mo-card', h('span', 'Your goal'), value);
      const chips = ['Focus longer', 'Plan the week', 'Build a habit'].map((t) => h('button.chip.mo-chip', { type: 'button' }, t));
      const fly = (chip) => {
        const from = F.pos(chip, ctx.root);
        value.textContent = chip.textContent;
        const to = F.pos(value, ctx.root);
        value.style.visibility = 'hidden';
        const ghost = chip.cloneNode(true), twin = value.cloneNode(true);
        [ghost, twin].forEach((el) => { Object.assign(el.style, { position: 'absolute', left: '0', top: '0', margin: '0', zIndex: '20', visibility: 'visible', pointerEvents: 'none' }); ctx.root.append(el); });
        const MS = 720, ease = F.css('inout');
        const dx = to.x - from.x, dy = to.y - from.y;
        ghost.animate([{ transform: `translate(${from.x}px, ${from.y}px)`, opacity: 1 }, { opacity: 1, offset: 0.35 }, { opacity: 0, offset: 0.65 }, { transform: `translate(${from.x + dx}px, ${from.y + dy}px)`, opacity: 0 }], { duration: MS * F.k(), easing: ease, fill: 'forwards' });
        twin.animate([{ transform: `translate(${to.x - dx}px, ${to.y - dy}px)`, opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1, offset: 0.65 }, { transform: `translate(${to.x}px, ${to.y}px)`, opacity: 1 }], { duration: MS * F.k(), easing: ease, fill: 'forwards' });
        chip.classList.add('is-gone');
        ctx.at(MS + 10, () => { value.style.visibility = ''; ghost.remove(); twin.remove(); ctx.haptic('light'); });
      };
      chips.forEach((c) => F.press(ctx, c, { scale: 0.95, onTap: () => fly(c) }));
      body.append(head(ctx, 'It flies *to its place.*', 'Your choice is the thing that moves.'), card, h('div.mo-chips', chips));
      F.rise(ctx, [card, ...chips], { delay: 120, stagger: 50 });
      ctx.at(1100, () => F.tapEl(ctx, chips[0]));
      loop(ctx, 3600);
    },
  });

  F.def({
    id: 'mo-camera', section: 'kit-continuity', name: 'Draw once, move the camera',
    intent: 'The camera thread: four screens drawn once at full size inside a rig. Going in scales and moves the rig until one fills the frame; coming back out is the same move reversed. Nothing is re-laid-out or cropped to fake a zoom.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const screen = (title, bars) => h('div.mo-scr', h('b', title), h('div.mo-bars', bars.map((v) => h('i', { style: { height: v * 100 + '%' } }))));
      const scrs = [screen('Today', [0.4, 0.7, 0.5, 0.9, 0.6]), screen('Week', [0.8, 0.5, 0.9, 0.6, 0.7]), screen('Month', [0.3, 0.6, 0.8, 0.5, 0.9]), screen('Year', [0.6, 0.9, 0.4, 0.7, 0.8])];
      const rig = h('div.mo-rig', scrs);
      const view = h('div.mo-view', rig);
      const words = h('p.t-sub.mo-cam-words', 'Four screens, drawn once.');
      body.append(head(ctx, 'Move the *camera.*', 'Never the layout.'), view, words);
      // The rig is 2 × 2 screens of 300 × 330 with a 20 pt gap. Out: half size. In: one screen fills the view.
      const OUT = { x: 40, y: 10, s: 0.5 }, IN = { x: -275, y: 15, s: 1 };
      Object.assign(rig.style, { transformOrigin: '0 0', transform: F.tf(OUT) });
      ctx.at(900, () => { F.move(rig, OUT, IN, { duration: 820, curve: 'inout', fill: 'forwards', ctx }); F.swapText(ctx, words, 'In: the rig scales and moves.'); });
      ctx.at(2900, () => { F.move(rig, IN, OUT, { duration: 760, curve: 'inout', fill: 'forwards', ctx }); F.swapText(ctx, words, 'Out: the same move, reversed.'); });
      loop(ctx, 4800);
    },
  });
})();
