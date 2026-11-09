/* Ripe, a diet app: meals you already like, planned around a weight you can keep.
 * Motion style: fluid (one shape becomes the next). The accent floods from the finger, the weight
 * is a liquid with a wave on it, answers fly into the plan and turn into its values, and between
 * screens the values travel (carry). Honest by design: half a kilo a week, estimates labelled,
 * every food they love kept.
 * Flows: ripe-onboarding (five screens, questions to a plan) and ripe-paywall (three screens). */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  // ---------------------------------------------------------------- the generated draft

  F.def({
    id: 'ripe-generated', section: 'generated', name: 'Ripe · generated', loop: 9000,
    intent: 'The first draft of "show the plan after the diet quiz": a party popper, "Lose up to 10 lbs in 30 days" in gradient text, a metabolism type nobody measured, a 1,200-calorie crash day, a discount that ticks down, an invented testimonial and "Join 5M+ users".',
    build(ctx) {
      const { body } = S.frame(ctx);
      const pill = h('div.s-pill', '🎉 Quiz complete!');
      const title = h('h1.s-h1.rp-s-title', 'Lose up to ', h('span.s-grad', '10 lbs in 30 days!'), ' 🔥');
      const p = h('p.s-p', 'Our AI analyzed your answers to build your perfect plan ✨');
      const type = h('div.rp-s-type.s-glass',
        h('span.rp-s-flame', '🔥'),
        h('div.rp-s-type-text', h('small', 'Your metabolism type'), h('strong', 'Fast Burner'), h('i.rp-s-meter', h('b'))),
        h('em', '87%'));
      const list = h('div.s-list.s-glass.rp-s-list', ['🥗 1,200 calories a day', '⏰ No carbs after 6pm', '💧 7-day detox water'].map((t) => h('div', t)));
      const clock = h('em', '9:59');
      const timer = h('div.s-timer.rp-s-timer', '⏰ 60% OFF ends in ', clock);
      const quote = h('div.rp-s-quote.s-glass', h('span', '⭐⭐⭐⭐⭐'), h('p', '“I lost 12 lbs in 3 weeks without even trying!!”'), h('small', 'Jessica, 34 · Verified'));
      const social = h('p.rp-s-social', 'Join 5M+ users');
      const btn = S.btn(ctx, 'Start My Transformation 🚀', { glow: true });
      const fine = h('p.s-fine.rp-s-fine', '*Results not typical. Individual results may vary.');
      body.append(pill, title, p, type, list, timer, quote, h('div.ph-fill'), social, btn, fine);
      S.in([pill, title, p, type, list, timer, quote, social, btn]);
      S.countdown(ctx, clock, 599);
    },
  });

  // ---------------------------------------------------------------- what every Ripe screen shares

  const onb = { section: 'ripe-onboarding', style: 'fluid', flow: true };
  const pw = { section: 'ripe-paywall', style: 'fluid', flow: true };

  const FOODS = {
    pasta: { pic: 'ripe-pasta', name: 'Pasta', dish: 'Pasta with tomatoes', slot: 'Dinner' },
    cheese: { pic: 'ripe-cheese', name: 'Cheese', dish: 'Cheese and grapes', slot: 'Evening' },
    chocolate: { pic: 'ripe-chocolate', name: 'Chocolate', dish: 'Dark chocolate', slot: 'Dessert' },
    curry: { pic: 'ripe-curry', name: 'Curry', dish: 'Chickpea curry', slot: 'Dinner' },
    toast: { pic: 'ripe-toast', name: 'Toast', dish: 'Ricotta toast', slot: 'Lunch' },
    bowl: { pic: 'ripe-bowl', name: 'Salmon bowls', dish: 'Salmon rice bowl', slot: 'Dinner' },
    yogurt: { pic: 'ripe-yogurt', name: 'Yogurt', dish: 'Yogurt and berries', slot: 'Breakfast' },
  };
  const GOALS = [
    { id: 'better', label: 'Eat better', pic: 'ripe-bowl' },
    { id: 'lose', label: 'Lose some weight', pic: 'ripe-yogurt' },
    { id: 'energy', label: 'Have more energy', pic: 'ripe-toast' },
    { id: 'cook', label: 'Cook more at home', pic: 'ripe-curry' },
  ];
  // How a day goes: [hour, size] (0 a snack, 1 a meal, 2 a big meal), on a strip from 6 am to midnight.
  const DAYS = [
    { id: 'skip', label: 'Skip breakfast, big dinner', short: 'Big dinner', meals: [[13, 1], [19.5, 2]] },
    { id: 'three', label: 'Three meals, snack at 4', short: 'Three meals, a snack at 4', meals: [[8, 1], [12.5, 1], [16, 0], [19, 1]] },
    { id: 'late', label: 'Eat late, after work', short: 'Late dinners', meals: [[7.5, 0], [13, 1], [21.5, 2]] },
    { id: 'varies', label: 'Different every day', short: 'It changes', meals: [[9, 1], [14.5, 1], [20, 1]] },
  ];
  const PACE = 0.5; // kg a week: the only pace Ripe plans at

  /** The answers this flow writes, with the demo's defaults (so any screen can play on its own). */
  const ans = (ctx) => {
    const a = ctx.answers;
    return {
      goal: a.ripeGoal || 'lose',
      now: a.ripeNow ?? 72,
      target: a.ripeTarget ?? 66,
      loves: a.ripeLoves || ['pasta', 'curry', 'chocolate', 'cheese'],
      day: a.ripeDay || 'three',
    };
  };
  const num = (v) => String(Math.round(v * 2) / 2).replace(/\.0$/, '');
  const kg = (v) => `${num(v)} kg`;
  const md = (d) => `${X.monthName(d)} ${d.getDate()}`;
  const paceOf = (now, target) => {
    const weeks = Math.round(Math.abs(now - target) / PACE);
    return { weeks, date: X.day(weeks * 7) };
  };
  /** The week, starting today: pasta tonight, the foods they kept on every other day, the rest between. */
  const weekOf = (A) => {
    const kept = A.loves.filter((f) => f !== 'pasta' && FOODS[f]);
    const rest = ['bowl', 'toast', 'yogurt', 'curry', 'cheese', 'chocolate'].filter((f) => !A.loves.includes(f));
    const out = ['pasta'];
    while (out.length < 7 && (kept.length || rest.length)) {
      const even = out.length % 2 === 0;
      out.push(((even ? kept : rest).length ? (even ? kept : rest) : (even ? rest : kept)).shift());
    }
    return out.map((food, i) => ({ food, i, date: X.day(i), kept: A.loves.includes(food), ...FOODS[food] }));
  };

  const ms = (v) => (F.reduced() ? 1 : v * F.k());
  /** A Web Animation in this screen's life (paused, cancelled and slowed with the rest). */
  const anim = (ctx, el, frames, o = {}) => ctx.track(el.animate(frames, {
    duration: ms(o.ms || 600), delay: F.reduced() ? 0 : (o.delay || 0) * F.k(),
    easing: o.curve === 'linear' ? 'linear' : F.css(o.curve || 'emph'), fill: o.fill || 'both', iterations: o.iterations || 1,
  }));
  /** Parts this screen moves in itself, so a transition does not move them a second time. */
  const own = (...els) => els.flat().forEach((el) => el && el.setAttribute('data-own', ''));

  /**
   * Every Ripe screen: the kit, and its own ground. Under a carry the new screen starts see-through
   * so the old one eases out beneath it; the ground fills in behind, and if the old screen is taken
   * away before it has (a slow frame), it fills at once, so the host never shows through.
   */
  const frame = (ctx) => {
    const fr = F.frame(ctx, { cls: 'k-ripe', bodyCls: 'rp-body' });
    const ground = h('div.rp-ground');
    ctx.root.prepend(ground);
    if (ctx.via === 'carry') {
      const a = anim(ctx, ground, [{ opacity: 0 }, { opacity: 1 }], { ms: 200, curve: 'linear' });
      const host = ctx.root.parentNode;
      if (host && window.MutationObserver) {
        const mo = new MutationObserver((list) => {
          if (ctx.dead) { mo.disconnect(); return; }
          if (!list.some((m) => m.removedNodes.length)) return;
          try { a.finish(); } catch {}
          mo.disconnect();
        });
        mo.observe(host, { childList: true });
        ctx.at(1200, () => mo.disconnect());
      }
    }
    return fr;
  };
  const head = (ctx, text, sub, o = {}) => {
    const t = h('h1.rp-h', F.rich(text));
    const block = h('div.rp-head', t, sub ? h('p.rp-sub', F.rich(sub)) : null);
    F.titleIn(ctx, t, { delay: o.delay ?? 60 });
    if (sub) F.rise(ctx, block.lastChild, { delay: (o.delay ?? 60) + 110 });
    return block;
  };
  const dish = (food, cls) => X.pic(FOODS[food].pic, { cls: 'rp-dish ' + cls, icon: 'utensils' });

  /**
   * The accent floods from the finger: a soft-edged disc grows from where it touched until it
   * fills the shape, and stays as its colour.
   */
  const flood = (ctx, el) => {
    const W = el.offsetWidth, H = el.offsetHeight;
    const x = el._tapX ?? W / 2, y = el._tapY ?? H / 2;
    const D = 2.2 * Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
    let layer = el.querySelector(':scope > .rp-flood');
    if (!layer) { layer = h('span.rp-flood', h('i')); el.prepend(layer); }
    const dot = layer.firstChild;
    Object.assign(dot.style, { width: D + 'px', height: D + 'px', left: x - D / 2 + 'px', top: y - D / 2 + 'px' });
    el.classList.add('is-flooded');
    anim(ctx, dot, [{ transform: 'scale(0) rotate(-24deg)' }, { transform: 'scale(1) rotate(0deg)' }], { ms: 700, curve: 'emph', fill: 'forwards' });
  };

  /** A demo finger that drags up or down: lands at (x, y0), follows to y1, lifts. fn(t) each frame. */
  const dragY = (ctx, x, y0, y1, o, fn) => {
    const dot = h('span.touch', { style: { left: x + 'px', top: y0 + 'px' } });
    ctx.root.append(dot);
    F.move(dot, { o: 0, s: 1.35 }, { o: 1, s: 1 }, { duration: 240, curve: 'strong', ctx, fill: 'backwards' });
    F.move(dot, { s: 1 }, { s: 0.8 }, { duration: 110, delay: 260, curve: 'strong', ctx, fill: 'forwards' });
    const ease = F.bezier(o.curve || 'inout');
    ctx.at(380, () => {
      o.down && o.down();
      const t0 = performance.now();
      const stop = ctx.loop(() => {
        const t = F.clamp((performance.now() - t0) / (o.duration * F.k()), 0, 1);
        const e = ease(t);
        dot.style.top = F.lerp(y0, y1, e) + 'px';
        fn(e);
        if (t >= 1) {
          stop();
          o.up && o.up();
          F.move(dot, { s: 0.8, o: 1 }, { s: 1.5, o: 0 }, { duration: 380, curve: 'strong', ctx, fill: 'forwards' });
          ctx.at(420, () => dot.remove());
        }
      });
    });
  };

  /**
   * A value flies into its place the way carry moves it between screens: the chip and the value
   * travel one path on the emphasised curve as two copies, and the chip melts into the value over
   * the last third of the way, so nothing swaps when it lands. from: the chip's starting centre.
   */
  const flyIn = (ctx, chip, to, from, o = {}) => {
    const root = ctx.root, MS = o.ms || 900, delay = o.delay || 0;
    to.style.visibility = 'hidden';
    ctx.at(delay, () => {
      chip.classList.add('rp-fly');
      root.append(chip);
      const cw = chip.offsetWidth, chH = chip.offsetHeight;
      const b = F.pos(to, root);
      Object.assign(chip.style, { left: from.x - cw / 2 + 'px', top: from.y - chH / 2 + 'px' });
      const twin = to.cloneNode(true);
      twin.removeAttribute('data-shared');
      Object.assign(twin.style, { position: 'absolute', left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', margin: '0', zIndex: '41', pointerEvents: 'none', visibility: 'visible', transformOrigin: '50% 50%' });
      root.append(twin);
      const dx = b.cx - from.x, dy = b.cy - from.y, k = b.h / Math.max(1, chH);
      const [a, b2] = o.cross || [0.72, 0.96];
      anim(ctx, chip, [
        { transform: 'translate(0px, 0px) scale(0.9)', opacity: 0, filter: 'blur(4px)' },
        { opacity: 1, filter: 'blur(0px)', offset: 0.16 },
        { opacity: 1, offset: a },
        { opacity: 0, offset: b2 },
        { transform: `translate(${dx}px, ${dy}px) scale(${k})`, opacity: 0, filter: 'blur(0px)' },
      ], { ms: MS, curve: 'emph', fill: 'forwards' });
      anim(ctx, twin, [
        { transform: `translate(${-dx}px, ${-dy}px) scale(${1 / k})`, opacity: 0 },
        { opacity: 0, offset: a },
        { opacity: 1, offset: b2 },
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
      ], { ms: MS, curve: 'emph', fill: 'forwards' });
      ctx.at(MS + 10, () => {
        to.style.visibility = '';
        chip.remove();
        twin.remove();
        o.onLand && o.onLand();
      });
    });
  };

  /** A liquid with a moving wave on its surface. set(f) puts the surface at f (0 empty, 1 full). */
  const wavePath = (w, amp, period, phase, depth) => {
    const n = Math.round(w / 4);
    let d = '';
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * w;
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (10 + amp * Math.sin((x / period) * Math.PI * 2 + phase)).toFixed(2);
    }
    return `${d} L${w} ${depth} L0 ${depth} Z`;
  };
  const liquid = (ctx, W, H, o = {}) => {
    const depth = H + 60, amp = o.amp ?? 3.4, period = W / (o.waves || 2);
    const wave = (cls, a, phase) => F.svg('svg', { class: 'rp-wave ' + cls, width: W * 2, height: depth, viewBox: `0 0 ${W * 2} ${depth}` }, F.svg('path', { d: wavePath(W * 2, a, period, phase, depth) }));
    const back = wave('is-back', amp * 0.85, 1.9), front = wave('is-front', amp, 0);
    const surf = h('div.rp-surf', back, front);
    const el = h('div.rp-liq' + (o.cls ? '.' + o.cls : ''), surf);
    if (!F.reduced()) {
      ctx.track(back.animate([{ translate: '0px 0px' }, { translate: `${-W}px 0px` }], { duration: (o.slow || 3400) * F.k(), iterations: Infinity, easing: 'linear' }));
      ctx.track(front.animate([{ translate: `${-W}px 0px` }, { translate: '0px 0px' }], { duration: (o.slow || 3400) * 0.72 * F.k(), iterations: Infinity, easing: 'linear' }));
    }
    let level = 0, stop = null;
    const place = (f) => { level = f; el.style.translate = `0px ${((1 - f) * H).toFixed(2)}px`; };
    el.set = (f) => { stop && stop(); stop = null; place(f); };
    el.level = () => level;
    el.to = (f, opt = {}) => { stop && stop(); stop = F.tween(ctx, level, f, opt.spring ? { spring: opt.spring } : { duration: opt.ms || 900, curve: opt.curve || 'emph' }, place); };
    /** The surface sloshes: its waves grow, overshoot and calm. */
    el.slosh = (k = 1) => anim(ctx, surf, [
      { transform: 'scaleY(1)' }, { transform: `scaleY(${1 + 1.3 * k})`, offset: 0.16 }, { transform: `scaleY(${1 - 0.55 * k})`, offset: 0.4 },
      { transform: `scaleY(${1 + 0.45 * k})`, offset: 0.64 }, { transform: `scaleY(${1 - 0.12 * k})`, offset: 0.84 }, { transform: 'scaleY(1)' },
    ], { ms: 1500, curve: 'linear', fill: 'none' });
    return el;
  };

  /** A day drawn as a strip, 6 am to midnight, with its meals on it. */
  const strip = (d, o = {}) => h('span.rp-strip' + (o.mini ? '.is-mini' : '') + (d.id === 'varies' ? '.is-varies' : ''),
    d.meals.map(([hr, size]) => h('i.rp-blk.is-s' + size, { style: { left: (((hr - 6) / 18) * 100).toFixed(2) + '%' } })));

  // ---------------------------------------------------------------- 1 · what would you change?

  F.def({
    ...onb, id: 'ripe-goal', name: 'What would you change?', progress: 0.2, loop: 4600, seqHold: 3700,
    intent: 'Four picture cards and one tap. Raspberry floods the card from the finger, the way juice spreads, and the screen moves on by itself; the flooded card then pours into the next screen’s gauge.',
    build(ctx) {
      const { body } = frame(ctx);
      const top = F.qTop(ctx, { progress: 0.2, back: false });
      const hd = head(ctx, 'What would you like *to change?*');
      let done = false;
      const cards = GOALS.map((g) => {
        const card = h('button.rp-goal', { type: 'button', 'aria-pressed': 'false' }, X.pic(g.pic, { cls: 'rp-dish rp-goal-pic is-small', icon: 'utensils' }), h('b.rp-goal-label', g.label));
        F.press(ctx, card, { onTap: () => {
          if (done) return;
          done = true;
          card.setAttribute('aria-pressed', 'true');
          flood(ctx, card);
          ctx.haptic('selection');
          ctx.answers.ripeGoal = g.id;
          ctx.answers.ripeFlood = F.pos(card, ctx.root);
          cards.forEach((c) => c !== card && anim(ctx, c, [{ opacity: 1 }, { opacity: 0.5 }], { ms: 420, delay: 120, curve: 'standard', fill: 'forwards' }));
          ctx.at(600, () => ctx.next());
        } });
        return card;
      });
      const grid = h('div.rp-goals', cards);
      own(hd, grid);
      body.append(top, hd, grid);
      F.rise(ctx, cards, { delay: 200 });
      if (ctx.mode !== 'flow') ctx.at(1900, () => F.tapEl(ctx, cards[1], { dx: -26, dy: 34 }));
    },
  });

  // ---------------------------------------------------------------- 2 · where you are, where you'd like to be

  const MIN = 56, MAX = 84; // the gauge's scale, in kg
  const VW = 128, VH = 352; // the vessel's inside, in points

  F.def({
    ...onb, id: 'ripe-weight', name: 'Where you are, where you’d like to be', progress: 0.4, loop: 6600, seqHold: 5800,
    intent: 'Two values on one gauge: a tall glass whose raspberry level is the weight you would like, with a dashed line where you are now. The finger drags the surface down; the pace and the date it lands on follow, at half a kilo a week. On release the surface sloshes and settles.',
    build(ctx) {
      const { body } = frame(ctx);
      const A = ans(ctx);
      const top = F.qTop(ctx, { progress: 0.4 });
      const hd = head(ctx, 'Where would you like *to be?*', 'Half a kilo a week is a pace you can keep.');
      let now = A.now;
      let goal = ctx.mode === 'flow' && ctx.answers.ripeTarget != null ? ctx.answers.ripeTarget : now - 2;
      const frac = (v) => F.clamp((v - MIN) / (MAX - MIN), 0, 1);
      const yOf = (v) => (1 - frac(v)) * VH;

      // The glass: a scale of ticks, the liquid, the line where they are now.
      const ticks = h('div.rp-ticks', Array.from({ length: MAX - MIN - 1 }, (_, i) => h('i' + ((MIN + i + 1) % 5 === 0 ? '.is-five' : ''), { style: { top: yOf(MIN + i + 1) + 'px' } })));
      const liq = liquid(ctx, VW, VH, { amp: 4.4 });
      // The thumb rides the surface: it says the level can be dragged.
      const knob = h('span.rp-knob', F.icon('chevron-up', { size: 13, stroke: 2.8 }), F.icon('chevron-down', { size: 13, stroke: 2.8 }));
      liq.append(knob);
      const nowLine = h('i.rp-now-line');
      const inner = h('div.rp-vessel-in', ticks, liq, nowLine, h('i.rp-shine'));
      const vessel = h('div.rp-vessel', inner);
      const nowVal = h('b', kg(now)), goalVal = h('b', kg(goal));
      const nowTag = h('div.rp-tag.is-now', h('small', 'Now'), nowVal);
      const goalTag = h('div.rp-tag.is-goal', h('small', 'Goal'), goalVal);
      const gauge = h('div.rp-gauge', vessel, nowTag, goalTag);

      const weeksEl = h('b'), dateEl = h('b');
      const pace = h('p.rp-pace', 'At half a kilo a week, that’s ', weeksEl, ': ', dateEl);
      const cta = F.primary(ctx, 'Continue', { onTap: () => { ctx.answers.ripeNow = now; ctx.answers.ripeTarget = goal; ctx.next(); } });
      const foot = h('div.ph-foot', cta);
      own(hd, gauge, pace, foot);
      body.append(top, hd, gauge, pace, h('div.ph-fill'), foot);

      const TAG = 25; // half a tag's height
      const placeNow = () => {
        nowLine.style.translate = `0px ${yOf(now).toFixed(1)}px`;
        nowTag.style.translate = `0px ${(yOf(now) - TAG).toFixed(1)}px`;
      };
      let shownWeeks = null;
      const say = (snapped, animate) => {
        goalVal.textContent = kg(snapped);
        const p = paceOf(now, snapped);
        if (p.weeks === shownWeeks) return;
        shownWeeks = p.weeks;
        weeksEl.textContent = p.weeks === 1 ? '1 week' : `${p.weeks} weeks`;
        dateEl.textContent = md(p.date);
        if (animate && !F.reduced()) [weeksEl, dateEl].forEach((el) => el.animate([{ transform: 'translateY(5px)', opacity: 0.4, filter: 'blur(2px)' }, { transform: 'none', opacity: 1, filter: 'blur(0px)' }], { duration: 260 * F.k(), easing: F.css('emph') }));
      };
      /** The goal at v: the surface follows exactly; the words follow its half-kilo steps. */
      const setGoal = (v, live) => {
        goal = F.clamp(v, MIN + 1, MAX - 1);
        if (live) liq.set(frac(goal));
        goalTag.style.translate = `0px ${(yOf(goal) - TAG).toFixed(1)}px`;
        say(Math.round(goal * 2) / 2, true);
      };
      const settle = () => {
        goal = Math.round(goal * 2) / 2;
        liq.to(frac(goal), { spring: { response: 0.5, damping: 0.78 } });
        F.tween(ctx, 0, 1, { spring: { response: 0.5, damping: 0.78 } }, () => (goalTag.style.translate = `0px ${(yOf(goal) - TAG).toFixed(1)}px`));
        liq.slosh(0.9);
        ctx.haptic('soft');
        ctx.answers.ripeNow = now;
        ctx.answers.ripeTarget = goal;
      };
      placeNow();
      goalTag.style.translate = `0px ${(yOf(goal) - TAG).toFixed(1)}px`;
      say(goal, false);

      // A person drags the surface (or the line where they are now, when the finger lands on it).
      let dragging = null;
      const valueAt = (e) => {
        const r = inner.getBoundingClientRect();
        const k = r.height / inner.offsetHeight || 1;
        return MIN + (1 - (e.clientY - r.top) / k / VH) * (MAX - MIN);
      };
      /** Under the finger the thumb and the goal grow a little; on release they settle. */
      const grab = (on) => [knob, goalTag].forEach((el) => F.move(el, { s: on ? 1 : 1.08 }, { s: on ? 1.08 : 1 }, { spring: { response: 0.42, damping: 0.75 }, ctx, fill: 'forwards' }));
      ctx.on(gauge, 'pointerdown', (e) => {
        const v = valueAt(e);
        dragging = Math.abs(v - now) < 1.4 && Math.abs(v - now) < Math.abs(v - goal) ? 'now' : 'goal';
        gauge.setPointerCapture && e.pointerId !== undefined && gauge.setPointerCapture(e.pointerId);
        ctx.haptic('selection');
        if (dragging === 'goal') { grab(true); setGoal(v, true); }
      });
      ctx.on(gauge, 'pointermove', (e) => {
        if (!dragging) return;
        const v = F.clamp(valueAt(e), MIN + 1, MAX - 1);
        if (dragging === 'now') {
          now = Math.round(v * 2) / 2;
          nowVal.textContent = kg(now);
          placeNow();
          shownWeeks = null;
          say(Math.round(goal * 2) / 2, false);
        } else setGoal(v, true);
      });
      const up = () => { if (!dragging) return; const was = dragging; dragging = null; if (was === 'goal') { settle(); grab(false); } };
      ctx.on(gauge, 'pointerup', up);
      ctx.on(gauge, 'pointercancel', up);

      // Arrival: the flooded card from the last screen pours into the glass; on its own, the glass fills.
      F.rise(ctx, [gauge, pace, cta], { delay: 200 });
      [nowTag, goalTag].forEach((t, i) => F.pop(ctx, t, { delay: 1000 + i * 120 }));
      F.pop(ctx, knob, { delay: 1100 });
      ctx.at(1700, () => F.idle(ctx, knob));
      anim(ctx, nowLine, [{ clipPath: 'inset(-4px 100% -4px 0px)' }, { clipPath: 'inset(-4px 0% -4px 0px)' }], { ms: 520, delay: 900, curve: 'emph' });
      const fr = ctx.answers.ripeFlood;
      if (ctx.via === 'carry' && fr && !F.reduced()) {
        // One shape the whole way: the liquid waits unseen while the card's raspberry pours into
        // its place, then takes over from it with its waves.
        liq.set(frac(goal));
        liq.style.opacity = 0;
        const v = F.pos(inner, ctx.root);
        const top0 = v.y + yOf(goal);
        const pour = h('div.rp-pour');
        ctx.root.append(pour);
        const inset = (t, r, b, l, rad) => `inset(${t.toFixed(1)}px ${r.toFixed(1)}px ${b.toFixed(1)}px ${l.toFixed(1)}px round ${rad})`;
        // It pours: the shape narrows to the glass while its foot falls to the bottom, then its
        // top comes down to the level, like juice settling.
        const midTop = Math.min(fr.y + 30, top0 - 60);
        ctx.track(pour.animate([
          { clipPath: inset(fr.y, 390 - fr.x - fr.w, 844 - fr.y - fr.h, fr.x, '24px'), opacity: 0, easing: F.css('emph') },
          { opacity: 1, offset: 0.08, easing: F.css('emph') },
          { clipPath: inset(midTop, 390 - v.x - v.w, 844 - v.y - v.h, v.x, '40px 40px 44px 44px'), opacity: 1, offset: 0.48, easing: F.css('inout') },
          { clipPath: inset(top0, 390 - v.x - v.w, 844 - v.y - v.h, v.x, '0px 0px 44px 44px'), opacity: 1 },
        ], { duration: ms(980), easing: 'linear', fill: 'forwards' }));
        ctx.at(980, () => {
          liq.style.opacity = '';
          liq.slosh(1);
          ctx.haptic('soft');
          anim(ctx, pour, [{ opacity: 1 }, { opacity: 0 }], { ms: 240, curve: 'linear', fill: 'forwards' });
        });
        ctx.at(1260, () => pour.remove());
      } else {
        liq.set(0);
        ctx.at(320, () => liq.to(frac(goal), { ms: 1300, curve: 'emph' }));
        ctx.at(900, () => liq.slosh(0.7));
      }

      if (ctx.mode !== 'flow') {
        const from = goal, to = A.target;
        ctx.at(1800, () => {
          const v = F.pos(inner, ctx.root);
          dragY(ctx, v.cx, v.y + yOf(from), v.y + yOf(to), {
            duration: 1500, curve: 'inout',
            down: () => { ctx.haptic('selection'); grab(true); },
            up: () => { settle(); grab(false); },
          }, (t) => setGoal(F.lerp(from, to, t), true));
        });
        ctx.at(4700, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · foods you'd never give up

  const LOVES = ['pasta', 'cheese', 'chocolate', 'curry', 'toast', 'bowl'];

  F.def({
    ...onb, id: 'ripe-loves', name: 'Foods you’d never give up', progress: 0.6, loop: 5800, seqHold: 5000,
    intent: 'Real photos, picked by tapping: each plate gets a raspberry ring and a heart, the same heart that marks the foods they kept on every screen after. The line under the heading is the promise: the plan keeps every one, so nothing is banned.',
    build(ctx) {
      const { body } = frame(ctx);
      const top = F.qTop(ctx, { progress: 0.6 });
      const hd = head(ctx, 'Foods you’d *never give up*', 'Your plan keeps every one.');
      const picked = [];
      const tiles = LOVES.map((id) => {
        const f = FOODS[id];
        const ring = h('i.rp-love-ring');
        const check = h('span.rp-love-check', F.icon('heart', { size: 15, stroke: 2.4 }));
        const tile = h('button.rp-love', { type: 'button', 'aria-pressed': 'false' }, h('span.rp-love-plate', dish(id, 'rp-love-pic is-small'), ring, check), h('b.rp-love-name', f.name));
        F.press(ctx, tile, { onTap: () => {
          const on = !tile.classList.contains('is-on');
          tile.classList.toggle('is-on', on);
          tile.setAttribute('aria-pressed', String(on));
          if (on) {
            picked.push(id);
            F.pop(ctx, ring);
            F.pop(ctx, check, { delay: 60 });
          } else picked.splice(picked.indexOf(id), 1);
          ctx.answers.ripeLoves = picked.slice();
          ctx.haptic('selection');
        } });
        return tile;
      });
      const rows = [0, 2, 4].map((i) => h('div.rp-loves-row', tiles[i], tiles[i + 1]));
      const cta = F.primary(ctx, 'Continue', { onTap: () => { ctx.answers.ripeLoves = picked.slice(); ctx.next(); } });
      const foot = h('div.ph-foot', cta);
      const grid = h('div.rp-loves', rows);
      own(hd, grid, foot);
      body.append(top, hd, grid, h('div.ph-fill'), foot);
      F.rise(ctx, [...rows, cta], { delay: 180 });
      if (ctx.mode !== 'flow') {
        ['pasta', 'curry', 'chocolate', 'cheese'].forEach((id, i) => ctx.at(1500 + i * 520, () => F.tapEl(ctx, tiles[LOVES.indexOf(id)], { dy: -12 })));
        ctx.at(4200, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- 4 · how your days go

  F.def({
    ...onb, id: 'ripe-day', name: 'How your days go', progress: 0.8, loop: 4600, seqHold: 3700,
    intent: 'Pictures of a day instead of a quiz: four rows, each with a thin strip of the day from 6 am to midnight and its meals on it. One tap floods the row and the screen moves on; the strip they picked flies into the plan.',
    build(ctx) {
      const { body } = frame(ctx);
      const top = F.qTop(ctx, { progress: 0.8 });
      const hd = head(ctx, 'How do your *days go?*', 'Meals move to fit your day.');
      let done = false;
      const rows = DAYS.map((d) => {
        const s = strip(d);
        const row = h('button.rp-day', { type: 'button', 'aria-pressed': 'false' }, h('b.rp-day-label', d.label), s);
        F.press(ctx, row, { onTap: () => {
          if (done) return;
          done = true;
          row.setAttribute('aria-pressed', 'true');
          flood(ctx, row);
          ctx.haptic('selection');
          ctx.answers.ripeDay = d.id;
          s.classList.add('is-lit');
          s.style.minWidth = s.offsetWidth + 'px';
          s.dataset.shared = 'ripe-day';
          rows.forEach((r) => r !== row && anim(ctx, r, [{ opacity: 1 }, { opacity: 0.5 }], { ms: 420, delay: 120, curve: 'standard', fill: 'forwards' }));
          ctx.at(600, () => ctx.next());
        } });
        return row;
      });
      const axis = h('div.rp-axis', ['6 am', 'Noon', '6 pm', 'Midnight'].map((t) => h('span', t)));
      const list = h('div.rp-days', rows, axis);
      own(hd, list);
      body.append(top, hd, list);
      F.rise(ctx, [...rows, axis], { delay: 180 });
      if (ctx.mode !== 'flow') ctx.at(1900, () => F.tapEl(ctx, rows[1], { dx: 40, dy: -6 }));
    },
  });

  // ---------------------------------------------------------------- 5 · the plan

  F.def({
    ...onb, id: 'ripe-plan', name: 'Your plan', progress: 1, loop: 7400, seqHold: 6600,
    intent: 'The plan card arrives with its labels and empty values; each answer flies up into its row and turns into the value, one after another (the day strip flies straight in from the last screen). One check on the mark, one haptic, no confetti. Then their curve, 72 to 66 kg ending on the date, called an estimate in small print.',
    build(ctx) {
      const { body } = frame(ctx);
      const A = ans(ctx);
      const top = F.qTop(ctx, { progress: 1 });
      const goal = GOALS.find((g) => g.id === A.goal) || GOALS[1];
      const day = DAYS.find((d) => d.id === A.day) || DAYS[1];
      const p = paceOf(A.now, A.target);
      const moving = p.weeks > 0;
      const hd = head(ctx, moving ? `How you’ll get *to ${kg(A.target)}.*` : 'Meals you like, *planned.*');

      const check = h('span.rp-mark-check', F.icon('check', { size: 11, stroke: 3.4 }));
      const mark = h('span.rp-mark', X.appIcon('ripe', 42), check);
      const goalVal = h('b.rp-plan-goal', goal.label);
      const cardHead = h('div.rp-plan-head', mark, h('div', goalVal, h('small', `Starting today, ${md(X.day(0))}`)));
      const wVal = h('span.rp-val', moving ? `${num(A.now)} → ${kg(A.target)}` : `Keep ${kg(A.now)}`);
      const pVal = h('span.rp-val', moving ? `½ kg a week, ${p.weeks} weeks` : 'No change');
      const kept = A.loves.filter((f) => FOODS[f]).slice(0, 5);
      const plates = kept.length ? h('span.rp-val.rp-plates', kept.map((f) => dish(f, 'rp-plate is-small'))) : h('span.rp-val', 'Every food');
      const dayVal = strip(day, { mini: true });
      dayVal.classList.add('rp-val');
      dayVal.dataset.shared = 'ripe-day';
      const slot = () => h('i.rp-slot');
      const row = (icon, label, val) => h('div.rp-prow', h('span.rp-prow-ic', F.icon(icon, { size: 16 })), h('span.rp-prow-label', label), h('span.rp-prow-val', slot(), val));
      const rows = [row('gauge', 'Weight', wVal), row('timer', 'Pace', pVal), row('heart', 'Kept', plates), row('sun', 'Your days', dayVal)];
      const card = h('div.rp-plan', cardHead, h('div.rp-prows', rows));

      // The projection: their numbers, a straight line at half a kilo a week, then kept level.
      const W = 342, H = 136, x0 = 8, x1 = moving ? 280 : 8, yTop = 32, yBot = 104;
      const y0 = moving && A.target > A.now ? yBot : yTop, y1 = moving ? (A.target > A.now ? yTop : yBot) : yTop;
      const line = F.svg('path', { d: `M${x0} ${y0} L${x1} ${y1}`, class: 'rp-proj-line' });
      const keep = F.svg('path', { d: `M${x1} ${y1} L${W - 4} ${y1}`, class: 'rp-proj-keep' });
      const area = F.svg('path', { d: `M${x0} ${y0} L${x1} ${y1} L${W - 4} ${y1} L${W - 4} ${H} L${x0} ${H} Z`, class: 'rp-proj-area' });
      // One tick a week along the foot: a weigh-in a week, never a day.
      const ticks = moving ? Array.from({ length: p.weeks + 1 }, (_, i) => {
        const x = x0 + ((x1 - x0) * i) / p.weeks;
        return F.svg('path', { d: `M${x.toFixed(1)} ${H - 7} L${x.toFixed(1)} ${H - 1}`, class: 'rp-proj-tick' });
      }) : [];
      const base = F.svg('path', { d: `M${x0} ${H - 1} L${W - 4} ${H - 1}`, class: 'rp-proj-base' });
      const svg = F.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'rp-proj-svg' }, area, base, ...ticks, line, keep);
      const dotA = h('i.rp-proj-dot', { style: { left: x0 + 'px', top: y0 + 'px' } });
      const dotB = h('i.rp-proj-dot.is-end', { style: { left: x1 + 'px', top: y1 + 'px' } });
      const labA = h('span.rp-proj-lab', { style: { left: '0px', top: y0 - 30 + 'px' } }, h('b', kg(A.now)), ' today');
      const labB = h('span.rp-proj-lab.is-end', { style: { right: '0px', top: y1 - 34 + 'px' } }, h('b', moving ? kg(A.target) : 'Kept'), moving ? ` by ${md(p.date)}` : '');
      const plot = h('div.rp-proj-plot', svg);
      const proj = h('div.rp-proj', plot, dotA, dotB, labA, labB);
      const note = h('p.rp-note', 'An estimate from your answers, at half a kilo a week.');
      const cta = F.primary(ctx, 'See my first week');
      const foot = h('div.ph-foot', cta);
      own(hd, card, proj, note, foot);
      body.append(top, hd, card, proj, note, h('div.ph-fill'), foot);

      // 1. The card arrives with its labels; nothing else yet.
      F.rise(ctx, card, { delay: 140 });
      [dotA, dotB, labA, labB, note].forEach((el) => (el.style.opacity = 0));
      plot.style.clipPath = 'inset(-20px 100% -20px 0px)';
      foot.style.visibility = 'hidden';
      check.style.visibility = 'hidden';

      // 2. Each answer flies up into its row and becomes its value, 170 ms apart.
      const carried = ctx.via === 'carry';
      const chipOf = (val) => {
        const c = h('span.rp-chip');
        if (val === plates && kept.length) c.append(...kept.map((f) => dish(f, 'rp-plate is-small')));
        else if (val === dayVal) c.append(strip(day, { mini: true }));
        else c.textContent = val.textContent;
        return c;
      };
      const vals = [goalVal, wVal, pVal, plates, ...(carried ? [] : [dayVal])];
      const FROM = { x: 195, y: 784 };
      vals.forEach((v) => (v.style.visibility = 'hidden'));
      if (carried) {
        rows[3].querySelector('.rp-slot').style.opacity = 0;
        ctx.at(700, () => ctx.haptic('soft'));
      }
      const START = 920;
      vals.forEach((v, i) => flyIn(ctx, chipOf(v), v, FROM, {
        delay: START + i * 170, ms: 900,
        onLand: () => { const s = v.parentNode && v.parentNode.querySelector(':scope > .rp-slot'); if (s) anim(ctx, s, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 0, transform: 'scaleX(0.4)' }], { ms: 260, curve: 'exit', fill: 'forwards' }); },
      }));
      const landed = START + (vals.length - 1) * 170 + 900;

      // 3. One check on the mark, one haptic.
      ctx.at(landed + 60, () => {
        check.style.visibility = '';
        F.pop(ctx, check);
        ctx.haptic('success');
      });
      // 4. The curve draws on, then its two ends and the small print.
      const C = landed + 260;
      ctx.at(C, () => {
        plot.style.clipPath = '';
        anim(ctx, plot, [{ clipPath: 'inset(-20px 100% -20px 0px)' }, { clipPath: 'inset(-20px 0% -20px 0px)' }], { ms: 1100, curve: 'emph' });
        dotA.style.opacity = '';
        labA.style.opacity = '';
        F.pop(ctx, dotA);
        F.rise(ctx, labA);
      });
      ctx.at(C + 620, () => {
        [dotB, labB, note].forEach((el) => (el.style.opacity = ''));
        F.pop(ctx, dotB);
        F.rise(ctx, [labB, note], { delay: 60 });
        F.idle(ctx, dotB);
      });
      ctx.at(C + 900, () => { foot.style.visibility = ''; F.rise(ctx, cta); });
      if (ctx.mode !== 'flow') ctx.at(C + 2300, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- paywall 1 · your first week

  F.def({
    ...pw, id: 'ripe-week', name: 'Your first week', loop: 4600, seqHold: 3900,
    intent: 'The value beat before any price: their own week, starting tonight, built from the foods they kept (each with a raspberry heart). Nothing is banned and nothing is invented. Moving on, the seven plates fly up into a strip that stays on the price screen.',
    build(ctx) {
      const { body } = frame(ctx);
      const A = ans(ctx);
      const week = weekOf(A);
      const first = A.loves.find((f) => FOODS[f]);
      const hd = head(ctx, first ? `Your first week, *${FOODS[first].name.toLowerCase()} included.*` : 'Your first *week.*', 'Built from the foods you kept.');
      const rows = week.map((d) => {
        const pic = dish(d.food, 'rp-wk-pic is-small');
        pic.dataset.shared = 'dish-' + d.food;
        const when = d.i === 0 ? 'Today' : X.weekday(d.date);
        const heart = d.kept ? h('span.rp-wk-heart', F.icon('heart', { size: 13, stroke: 2.4 })) : null;
        const el = h('div.rp-wk' + (d.i === 0 ? '.is-today' : ''), pic, h('div.rp-wk-text', h('small', when), h('b', d.dish)), h('span.rp-wk-slot', heart, d.slot));
        el.pic = pic;
        el.heart = heart;
        return el;
      });
      const list = h('div.rp-week', rows);
      const cta = F.primary(ctx, 'Continue');
      const foot = h('div.ph-foot', cta);
      own(hd, list, foot);
      body.append(hd, list, h('div.ph-fill'), foot);
      F.rise(ctx, [list, cta], { delay: 200 });
      rows.forEach((r, i) => F.pop(ctx, r.pic, { delay: 380 + i * 70 }));
      rows.forEach((r, i) => r.heart && F.pop(ctx, r.heart, { delay: 1000 + i * 60 }));
      ctx.at(1300, () => F.idle(ctx, rows[0].pic));
      if (ctx.mode !== 'flow') ctx.at(3000, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- paywall 2 · every price

  const PLANS = {
    year: { name: 'Yearly', price: '$59.99', per: 'a year', note: '$5 a month', badge: '7 days free' },
    month: { name: 'Monthly', price: '$9.99', per: 'a month', note: 'No free week' },
  };

  F.def({
    ...pw, id: 'ripe-pay', name: 'Every price', loop: 6600, seqHold: 5800,
    intent: 'Their week of plates is still on screen (it flew here). Both prices before any tap; the free week as a timeline with real dates: today, the reminder, the first charge. Changing the plan slides the selection like a drop of juice, rolls the money and rewrites the timeline. One button, Restore, and how to cancel.',
    build(ctx) {
      const { body } = frame(ctx);
      const A = ans(ctx);
      const week = weekOf(A);
      const close = h('button.rp-close', { type: 'button', 'aria-label': 'Close' }, F.icon('x', { size: 18, stroke: 2.2 }));
      F.press(ctx, close, { scale: 0.92 });
      const hd = head(ctx, 'Eat like this *every week.*');
      const strip7 = h('div.rp-strip7', week.map((d) => {
        const pic = dish(d.food, 'rp-st-pic is-small');
        pic.dataset.shared = 'dish-' + d.food;
        return h('div.rp-st' + (d.i === 0 ? '.is-today' : ''), pic, h('small', X.weekday(d.date).slice(0, 1)));
      }));
      const feats = h('div.rp-feats', [
        ['utensils', 'A week of meals like this, every week'],
        ['shopping-bag', 'One shopping list for the week'],
        ['repeat', 'Swap any meal for one you like'],
      ].map(([ic, t]) => h('div.rp-feat', h('span.rp-feat-ic', F.icon(ic, { size: 16 })), h('span', t))));

      let plan = 'year';
      const sel = h('i.rp-sel');
      const cards = {};
      const plans = h('div.rp-plans', sel, Object.entries(PLANS).map(([id, p]) => {
        const c = h('button.rp-planc' + (id === plan ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(id === plan) },
          h('span.rp-planc-top', h('small', p.name), p.badge ? h('em', p.badge) : null),
          h('b', p.price, h('span', ' ' + p.per)), h('span.rp-planc-note', p.note));
        F.press(ctx, c, { scale: 0.97, onTap: () => choose(id) });
        cards[id] = c;
        return c;
      }));

      const STEPS = {
        year: [['utensils', 'Today', 'Your week starts'], ['bell', X.short(X.day(5)), 'We remind you'], ['receipt', X.short(X.day(7)), '$59.99, unless you cancel']],
        month: [['receipt', 'Today', '$9.99, then monthly'], ['refresh-cw', X.short(X.day(30)), 'Renews at $9.99'], ['x', 'Any time', 'Cancel in Settings']],
      };
      const steps = STEPS.year.map(([ic, when, what], i) => {
        const icon = h('span.rp-step-ic', F.icon(ic, { size: 15 }));
        const w = h('b', when), t = h('small', what);
        const el = h('div.rp-step' + (i === 0 ? '.is-now' : ''), h('div.rp-step-top', icon, i < 2 ? h('i.rp-step-link') : null), w, t);
        el.parts = { icon, w, t };
        return el;
      });
      const timeline = h('div.rp-steps', steps);

      const money = h('span.rp-money');
      const sumA = h('span', '7 days free, then'), sumB = h('span', 'a year');
      const summary = h('p.rp-summary', sumA, money, sumB);
      F.reel(ctx, money, '$59.99', { spins: 0 });
      const cta = F.primary(ctx, 'Start my free week', { haptic: 'medium' });
      const restore = h('button.btn-link.rp-restore', { type: 'button' }, 'Restore purchases');
      F.press(ctx, restore, { row: true });
      const fine = h('p.rp-fine', 'Cancel anytime in Settings');
      const foot = h('div.ph-foot.rp-pay-foot', summary, cta, h('div.rp-pay-links', restore, fine));
      own(hd, strip7, feats, plans, timeline, foot);
      body.append(close, hd, strip7, feats, plans, timeline, h('div.ph-fill'), foot);

      // The selection is one soft shape that slides from plan to plan, stretching as it goes.
      const placeSel = (id, animate) => {
        const c = cards[id];
        const x = c.offsetLeft;
        if (!animate || F.reduced()) { sel.style.transform = `translateX(${x}px)`; return; }
        const from = sel._x ?? x;
        const sc = F.springCurve(0.5, 0.78);
        let prev = from;
        const frames = sc.values.map((v) => {
          const px = from + (x - from) * v;
          const st = Math.min(0.12, Math.abs(px - prev) * 0.012);
          prev = px;
          return { transform: `translateX(${px.toFixed(2)}px) scale(${(1 + st).toFixed(3)}, ${(1 - st * 0.6).toFixed(3)})` };
        });
        ctx.track(sel.animate(frames, { duration: sc.duration * F.k(), easing: 'linear' }));
        sel.style.transform = `translateX(${x}px)`;
        sel._x = x;
      };
      const choose = (id) => {
        if (id === plan) return;
        plan = id;
        ctx.haptic('selection');
        Object.entries(cards).forEach(([k, c]) => { c.classList.toggle('is-on', k === id); c.setAttribute('aria-pressed', String(k === id)); });
        placeSel(id, true);
        F.reel(ctx, money, PLANS[id].price, { spins: 1 });
        F.swapText(ctx, sumA, id === 'year' ? '7 days free, then' : 'Starting today,');
        F.swapText(ctx, sumB, id === 'year' ? 'a year' : 'a month', 40);
        cta.label(id === 'year' ? 'Start my free week' : 'Subscribe for $9.99 a month');
        STEPS[id].forEach(([ic, when, what], i) => {
          const pr = steps[i].parts;
          ctx.at(i * 70, () => {
            const out = F.move(pr.icon, { s: 1, o: 1, blur: 0 }, { s: 0.7, o: 0, blur: 6 }, { duration: 200, curve: 'exit', ctx, fill: 'forwards' });
            ctx.at(210, () => {
              out && out.cancel();
              pr.icon.replaceChildren(F.icon(ic, { size: 15 }));
              F.pop(ctx, pr.icon);
            });
          });
          F.setValue(ctx, pr.w, when, { delay: i * 70 });
          F.swapText(ctx, pr.t, what, i * 70 + 40);
        });
      };
      placeSel(plan, false);
      sel._x = cards[plan].offsetLeft;

      F.rise(ctx, close);
      if (ctx.via !== 'carry') strip7.querySelectorAll('.rp-st').forEach((s, i) => F.pop(ctx, s, { delay: 160 + i * 50 }));
      else ctx.at(700, () => ctx.haptic('soft'));
      F.rise(ctx, [feats, plans, timeline, foot], { delay: 240, stagger: 70 });
      ctx.at(1400, () => F.idle(ctx, strip7));
      if (ctx.mode !== 'flow') {
        ctx.at(2300, () => F.tapEl(ctx, cards.month));
        ctx.at(3700, () => F.tapEl(ctx, cards.year));
        ctx.at(5000, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- paywall 3 · today, the product

  F.def({
    ...pw, id: 'ripe-today', name: 'Today', loop: 5200, seqHold: 4600,
    intent: 'The plan working on day one: three plates flew down from the week into today’s meals (breakfast logged, lunch next, pasta tonight). A finger logs a glass of water and the glass fills, wave and all. The progress line is honest: day 1 of about 84, one weigh-in a week.',
    build(ctx) {
      const { body } = frame(ctx);
      const A = ans(ctx);
      const p = paceOf(A.now, A.target);
      const when = h('p.rp-eyebrow', X.long(X.day(0)));
      const hd = head(ctx, 'Pasta *tonight.*', null, { delay: 80 });
      const MEALS = [['yogurt', 'Breakfast', '8:00', true], ['bowl', 'Lunch', '12:30', false], ['pasta', 'Dinner', '7:30', false]];
      const meals = MEALS.map(([food, slot, time, done]) => {
        const pic = dish(food, 'rp-meal-pic is-small');
        pic.dataset.shared = 'dish-' + food;
        const mark = done ? h('span.rp-meal-done', F.icon('check', { size: 14, stroke: 3 })) : A.loves.includes(food) ? h('span.rp-meal-love', F.icon('heart', { size: 14, stroke: 2.4 })) : h('span.rp-meal-open');
        return h('div.rp-meal' + (done ? '.is-done' : ''), pic, h('div.rp-meal-text', h('small', `${slot} · ${time}`), h('b', FOODS[food].dish)), mark);
      });
      const list = h('div.rp-meals', meals);

      // The glass: it fills as a glass is logged.
      const GW = 58, GH = 84;
      const water = liquid(ctx, GW, GH, { cls: 'is-water', amp: 2.4, waves: 1.5, slow: 2600 });
      const outline = F.svg('svg', { class: 'rp-glass-line', width: GW, height: GH, viewBox: `0 0 ${GW} ${GH}` }, F.svg('path', { d: `M1 1 L${GW - 1} 1 L${GW * 0.85} ${GH - 1} L${GW * 0.15} ${GH - 1} Z` }));
      const glass = h('div.rp-glass', h('div.rp-glass-in', water), outline);
      let count = 3;
      const countEl = h('b', `${count} of 8`);
      const dots = Array.from({ length: 8 }, (_, i) => h('i' + (i < count ? '.is-on' : '')));
      const plus = h('button.rp-plus', { type: 'button', 'aria-label': 'Log a glass of water' }, F.icon('plus', { size: 20, stroke: 2.6 }));
      const log = () => {
        if (count >= 8) return;
        count += 1;
        ctx.haptic('soft');
        water.set(0.02);
        water.to(0.86, { ms: 1100, curve: 'emph' });
        ctx.at(120, () => water.slosh(1));
        F.setValue(ctx, countEl, `${count} of 8`);
        const d = dots[count - 1];
        d.classList.add('is-on');
        F.pop(ctx, d, { delay: 240 });
      };
      F.press(ctx, plus, { onTap: log });
      const waterCard = h('div.rp-water', glass, h('div.rp-water-text', h('small', 'Water'), countEl, h('div.rp-dots', dots)), plus);
      water.set(0.04);

      const left = p.weeks * 7;
      const prog = h('div.rp-prog', h('div.rp-prog-top', h('span', h('b', 'Day 1'), ` of about ${left || 1}`), h('span', `Weigh-in ${X.weekday(X.day(7)).slice(0, 3)}, ${X.short(X.day(7))}`)), h('i.rp-prog-track', h('i')));
      const tabs = h('nav.rp-tabs', [['sun', 'Today', true], ['calendar-days', 'Week'], ['shopping-bag', 'List'], ['user-round', 'You']].map(([ic, t, on]) => h('span.rp-tab' + (on ? '.is-on' : ''), F.icon(ic, { size: 22 }), h('small', t))));
      own(when, hd, list, waterCard, prog);
      body.append(when, hd, list, waterCard, prog);
      ctx.root.append(tabs);

      F.rise(ctx, when);
      F.rise(ctx, [...meals, waterCard, prog], { delay: 160 });
      if (ctx.via === 'carry') ctx.at(700, () => ctx.haptic('soft'));
      anim(ctx, tabs, [{ transform: 'translateY(84px)' }, { transform: 'translateY(0px)' }], { ms: 680, delay: 260, curve: 'emph' });
      ctx.at(1200, () => F.idle(ctx, glass));
      if (ctx.mode !== 'flow') ctx.at(1900, () => F.tapEl(ctx, plus));
    },
  });
})();
