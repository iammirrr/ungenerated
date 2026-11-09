/* Loaf, a sourdough companion. Motion style: cinematic (a camera, not a cursor).
 * Flows: the opening (one take: the crumb, the camera finds the jar, the rise, the plan) and the
 * first bake (the last feed on a ribbon where time flows, the day as a schedule with the reminder
 * asked in context, Today with one coach mark). Generated: a feature carousel. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

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

  // ---------------------------------------------------------------- what every Loaf screen shares

  /** Minutes since midnight → "1:40 pm". */
  const fmt12 = (m) => {
    m = ((Math.round(m) % 1440) + 1440) % 1440;
    const hh = Math.floor(m / 60), mm = m % 60;
    return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'am' : 'pm'}`;
  };
  const hm = (m) => fmt12(m).split(' ')[0];
  const ap = (m) => fmt12(m).split(' ')[1];
  const hourLabel = (m) => `${((Math.floor(m / 60) + 11) % 12) + 1} ${m < 720 ? 'am' : 'pm'}`;
  const span = (m) => { const a = Math.floor(m / 60), b = Math.round(m % 60); return a ? (b ? `${a} h ${b} min` : `${a} h`) : `${b} min`; };
  /** Today's bake from the last feed: it peaks 4 h 40 min later (the opening's example), the dough
   * is mixed then, shaped after 3 h 30 min of bulk, baked after 1 h 20 min of proof, 45 min in the pot. */
  const dayOf = (fed = 540) => ({ fed, peak: fed + 280, shape: fed + 490, bake: fed + 570, out: fed + 615 });
  const fedOf = (ctx) => ctx.answers.loafFed ?? 540;
  /** The status bar says 9:41; Today is drawn at that minute so every number on it adds up. */
  const NOW = 9 * 60 + 41;
  const ms = (v) => (F.reduced() ? 1 : v * F.k());

  /** Where an element is on the phone right now, transforms included (a camera moves the world). */
  const onScreen = (ctx, el) => {
    const r = el.getBoundingClientRect(), R = ctx.root.getBoundingClientRect();
    const k = R.width / (ctx.root.offsetWidth || 390) || 1;
    return { cx: (r.left + r.width / 2 - R.left) / k, cy: (r.top + r.height / 2 - R.top) / k };
  };

  /** Leaving, in the style: each line rises out of a mask fixed at its top. */
  const maskOut = (ctx, els, o = {}) => (Array.isArray(els) ? els : [els]).filter(Boolean).forEach((el, i) => {
    const hh = el.offsetHeight || 40;
    ctx.track(el.animate([
      { transform: 'translateY(0px)', clipPath: 'inset(-12px -24px -12px -24px)' },
      { transform: `translateY(${-hh}px)`, clipPath: `inset(${hh}px -24px -12px -24px)` },
    ], { duration: ms(o.ms || 420), delay: ms((o.delay || 0) + i * (o.stagger ?? 60)), easing: F.css('cine'), fill: 'forwards' }));
  });

  /** A heading with its line breaks chosen, so no line ends on a lone word; F.titleIn raises each
   * line out of its own mask (the engine reads el._lines). */
  const setLines = (el, lines) => {
    el._lines = lines.map((t) => h('span.ln', F.rich(t)));
    el.replaceChildren(...el._lines);
    return el;
  };
  /** A title changes like a film card: the old lines leave through their masks, the new ones rise. */
  const retitle = (ctx, el, lines, delay = 0) => ctx.at(delay, () => {
    const old = el._lines && el._lines.every((l) => l.isConnected) ? el._lines : [];
    maskOut(ctx, old);
    ctx.at(old.length ? 420 + (old.length - 1) * 60 + 40 : 0, () => {
      setLines(el, lines);
      F.titleIn(ctx, el);
    });
  });

  /** A camera on a rig: the world moves and the frame stays. A fast tilt picks up a little motion blur. */
  const camera = (ctx, world, origin) => {
    const pose = { y: 0, s: 1, blur: 0 };
    world.style.transformOrigin = origin;
    const paint = () => {
      world.style.transform = `translateY(${pose.y.toFixed(2)}px) scale(${pose.s.toFixed(4)})`;
      world.style.filter = pose.blur > 0.05 ? `blur(${pose.blur.toFixed(2)}px)` : '';
    };
    paint();
    let stop = null;
    return {
      pose,
      move(to, dur, o = {}) {
        stop && stop();
        const from = { ...pose };
        let lastY = pose.y, lastT = performance.now();
        stop = F.tween(ctx, 0, 1, { duration: dur, curve: o.curve || 'cine', done: () => { pose.blur = 0; paint(); o.done && o.done(); } }, (t) => {
          pose.y = from.y + ((to.y ?? from.y) - from.y) * t;
          pose.s = from.s + ((to.s ?? from.s) - from.s) * t;
          const now = performance.now();
          const v = Math.abs(pose.y - lastY) / Math.max(8, now - lastT);
          lastY = pose.y;
          lastT = now;
          pose.blur = o.blur ? Math.min(o.blur, v * 1.8) : 0;
          o.each && o.each(t);
          paint();
        });
      },
    };
  };

  /** The jar: glass, the starter inside (moved only by transform), the rubber band at the fed level, the 2× mark. */
  const GLASS_H = 196;
  const makeJar = () => {
    const bubbles = Array.from({ length: 18 }, (_, i) => {
      const r = F.rand(i + 11);
      const size = 3 + Math.round(r() * 7);
      return h('i.lf-bub', { style: { left: 12 + r() * 136 + 'px', top: 16 + r() * 150 + 'px', width: size + 'px', height: size + 'px' } });
    });
    const starter = h('div.lf-starter', h('i.lf-surface'), bubbles);
    const glass = h('div.lf-glass', starter, h('i.lf-shine'));
    const band = h('i.lf-band');
    const twice = h('div.lf-twice', h('i'), h('span', '2×'));
    const el = h('div.lf-jar', h('i.lf-jar-shadow'), h('div.lf-lid', h('i'), h('i'), h('i')), glass, band, twice);
    // Levels move with the separate translate property, so a style move on transform never fights them.
    const y = (f) => `0px ${((1 - f) * GLASS_H).toFixed(1)}px`;
    return {
      el, glass, band, twice, bubbles,
      level: (f) => (starter.style.translate = y(f)),
      bandAt: (f) => (band.style.translate = y(f)),
      twiceAt: (f) => (twice.style.translate = y(f)),
    };
  };

  /** The rise as Loaf draws it, from the feed to 6 pm: a smooth climb to the peak, then a slow fall
   * (dashed: the forecast). Returns {el, draw(f 0–1), peak: [x, y], peakAt}. */
  const makeRise = (W, H, fed, o = {}) => {
    const SPAN = 18 * 60 - fed;
    const PK = 280 / SPAN;
    const ts = [...new Set([...Array.from({ length: 61 }, (_, i) => i / 60), PK])].sort((a, b) => a - b);
    const pt = (t) => {
      const s = F.clamp((t - 0.02) / (PK - 0.02), 0, 1);
      const v = t <= PK ? s * s * (3 - 2 * s) : 1 - Math.pow((t - PK) / (1 - PK), 2) * 0.32;
      return [t * W, H - (o.bottom ?? 6) - v * (H - (o.top ?? 16) - (o.bottom ?? 6))];
    };
    const d = (a, b) => ts.filter((t) => t >= a - 1e-6 && t <= b + 1e-6).map((t, i) => { const [x, y] = pt(t); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
    const split = o.split ?? PK;
    const solid = F.svg('path', { d: d(0, split), class: 'lf-line' });
    const dash = F.svg('path', { d: d(split, 1), class: 'lf-line is-forecast' });
    const area = F.svg('path', { d: `${d(0, 1)} L${W} ${H} L0 ${H} Z`, class: 'lf-area' });
    const svg = F.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, area, dash, solid);
    const el = h('div.lf-plot', { style: { width: W + 'px', height: H + 'px' } }, svg);
    return {
      el, peakAt: PK, peak: pt(PK), at: pt,
      draw: (f) => (el.style.clipPath = `inset(-40px ${((1 - F.clamp(f, 0, 1)) * 100).toFixed(2)}% -12px -4px)`),
    };
  };

  const top = (ctx) => {
    const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22 }));
    F.press(ctx, back, { row: true, onTap: () => ctx.back() });
    return h('div.lf-top', { 'data-keep': '' }, back);
  };

  // ---------------------------------------------------------------- the opening: one take

  F.def({
    id: 'loaf-opening', section: 'loaf-open', style: 'cinematic', flow: true, name: 'Bread on its own clock', loop: 13800, seqHold: 13200,
    intent: 'A short film, not a slideshow: it fades in on the crumb in a letterbox as the lights come up, then the camera tilts down to the jar. The jar carries the rest (fed, rising while the clock flows, today’s peak at 1:40, the plan), and only then the button.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-loaf' });
      const D = 700; // the tilt: the jar waits one screen down, under the bread
      const P = dayOf(540);

      // Shot one: the crumb, in a letterbox, before the lights come up.
      const night = h('i.lf-night');
      const pic = X.pic('loaf-crumb', { cls: 'lf-crumb-pic' });
      const shot = h('div.lf-crumb', pic);
      const titleA = setLines(h('h1.lf-film'), ['Bread on', '*its own clock.*']);
      const subA = h('p.lf-film-sub', 'Loaf times every bake to your starter.');

      // Shot two, one screen down: the jar, the clock, the rise, the plan.
      const jar = makeJar();
      jar.el.classList.add('lf-op-jar');
      jar.level(0.21);
      jar.bandAt(0.21);
      jar.twiceAt(0.84);
      const clock = h('b.lf-clock-t', fmt12(P.fed));
      const clockChip = h('div.lf-clock', F.icon('clock', { size: 15 }), clock);
      const rise = makeRise(342, 92, P.fed);
      const dot = h('i.lf-peak-dot', { style: { left: rise.peak[0] + 'px', top: rise.peak[1] + 'px' } });
      const tag = h('span.lf-peak-tag', { style: { left: rise.peak[0] + 14 + 'px', top: rise.peak[1] - 30 + 'px' } }, 'Peak ' + fmt12(P.peak));
      const axis = h('div.lf-axis', ['9 am', '12 pm', '3 pm', '6 pm'].map((t) => h('span', t)));
      const chart = h('div.lf-op-chart', h('div.lf-plot-wrap', rise.el, dot, tag), axis);
      const plan = h('div.lf-call.lf-op-call', [['Mix', P.peak], ['Shape', P.shape], ['Bake', P.bake]].map(([a, m]) => h('div', h('small', a), h('b', fmt12(m)))));
      const world = h('div.lf-world', { style: { height: D + 844 + 'px' } }, shot, titleA, subA, jar.el, clockChip, chart, plan);
      // Shot two sits D below shot one, laid out as it will be framed when the camera arrives.
      [[jar.el, 200], [clockChip, 444], [chart, 508], [plan, 652]].forEach(([el, y]) => (el.style.top = D + y + 'px'));

      const titleB = h('h1.lf-film.is-top');
      const cta = F.primary(ctx, 'Start with my starter');
      const foot = h('div.lf-op-foot', cta);
      body.append(h('div.lf-cine', night, world, titleB, foot));
      // The lights: a light status bar and home indicator over the dark, fading out with it.
      const lightBar = F.statusBar({ tone: 'light' });
      lightBar.classList.add('lf-over');
      const lightHome = h('div.ph-home.is-light.lf-over');
      ctx.root.append(lightBar, lightHome);

      [clockChip, chart, plan, dot, tag, jar.twice].forEach((el) => (el.style.opacity = 0));
      jar.bubbles.slice(6).forEach((b) => (b.style.opacity = 0));
      foot.style.visibility = 'hidden';
      F.timeText(ctx, clock, P.fed, { fmt: fmt12 });
      rise.draw(0);

      const T = { reveal: 150, lights: 950, titleA: 1450, subA: 1950, outA: 3150, tilt: 3300, tiltMs: 1400, feed: 4650, tap: 5050, rise: 6350, riseMs: 2600, peak: 9000, last: 10350, cta: 11350, tapCta: 12250 };

      // FADE IN. The crumb is revealed from the bottom up while the camera settles on it.
      ctx.track(shot.animate([{ clipPath: 'inset(100% 0px 0px 0px)' }, { clipPath: 'inset(0% 0px 0px 0px)' }], { duration: ms(1300), delay: ms(T.reveal), easing: F.css('cine'), fill: 'backwards' }));
      F.move(pic, { s: 1.2, y: 26 }, { s: 1.05, y: 0 }, { duration: 1800, delay: T.reveal, curve: 'cine', ctx, fill: 'both' });
      ctx.at(T.reveal + 1800, () => F.idle(ctx, pic, 'drift'));
      // The lights come up on the kitchen; the first line rises out of its mask.
      [night, lightBar, lightHome].forEach((el) => F.move(el, { o: 1 }, { o: 0 }, { duration: 1300, delay: T.lights, curve: 'cine', ctx, fill: 'both' }));
      F.titleIn(ctx, titleA, { delay: T.titleA });
      F.rise(ctx, subA, { delay: T.subA });

      // The camera tilts down to the jar. The crumb travels a little slower than its frame (depth).
      ctx.at(T.outA, () => {
        maskOut(ctx, titleA._lines || [titleA]);
        maskOut(ctx, subA, { delay: 120 });
      });
      // It lands a little short, with the jar alone in the middle of the frame…
      const LAND = 92;
      const cam = camera(ctx, world, `195px ${D + 311}px`);
      ctx.at(T.tilt, () => cam.move({ y: -D + LAND }, T.tiltMs, { blur: 1.8, each: (t) => (pic.style.translate = `0px ${(t * 36).toFixed(1)}px`) }));
      // …then creeps in on the jar while the first jar line rises.
      ctx.at(T.tilt + T.tiltMs, () => cam.move({ s: 1.12 }, 1900));
      ctx.at(T.feed, () => {
        setLines(titleB, ['Feed your *starter.*']);
        F.titleIn(ctx, titleB);
      });

      // The hands-on moment: a tap feeds it. The level doubles, the band follows, the 2× mark settles.
      ctx.at(T.tap, () => {
        const p = onScreen(ctx, jar.glass);
        F.touch(ctx, ctx.root, p.cx, p.cy + 30);
      });
      ctx.at(T.tap + 300, () => {
        ctx.haptic('soft');
        F.move(jar.el, { s: 1 }, { s: 0.975 }, { duration: 120, curve: 'cine', ctx, fill: 'forwards' });
        ctx.at(130, () => F.move(jar.el, { s: 0.975 }, { s: 1 }, { duration: 420, curve: 'cine', ctx, fill: 'forwards' }));
        F.tween(ctx, 0.21, 0.42, { duration: 1100, curve: 'cine' }, jar.level);
        ctx.at(450, () => F.tween(ctx, 0.21, 0.42, { duration: 900, curve: 'cine' }, jar.bandAt));
        ctx.at(300, () => {
          clockChip.style.opacity = '';
          F.rise(ctx, clockChip);
        });
        ctx.at(700, () => {
          jar.twice.style.opacity = '';
          F.pop(ctx, jar.twice);
        });
      });

      // It rises while the clock flows; the camera pulls back and cranes down to find the curve,
      // which draws in step with it.
      ctx.at(T.rise, () => {
        retitle(ctx, titleB, ['Loaf watches *it rise.*']);
        cam.move({ y: -D, s: 1 }, T.riseMs + 400);
        chart.style.opacity = '';
        F.rise(ctx, chart);
        ctx.at(350, () => {
          F.tween(ctx, 0, 1, { duration: T.riseMs, curve: 'cine' }, (t) => {
            jar.level(0.42 + 0.42 * t);
            F.timeText(ctx, clock, P.fed + 280 * t, { fmt: fmt12, tau: 60 });
            rise.draw(rise.peakAt * t);
          });
          jar.bubbles.slice(6).forEach((b, i) => {
            b.style.opacity = '';
            F.move(b, { y: 10, s: 0.4, o: 0 }, { y: 0, s: 1, o: 1 }, { duration: 900, delay: 200 + i * 170, curve: 'cine', ctx, fill: 'backwards' });
          });
        });
      });

      // Today's peak, marked; the rest of the day is the forecast, dashed.
      ctx.at(T.peak, () => {
        retitle(ctx, titleB, ['Today it peaks', `*at ${hm(P.peak)}.*`]);
        dot.style.opacity = '';
        tag.style.opacity = '';
        F.pop(ctx, dot);
        F.pop(ctx, tag, { delay: 120 });
        ctx.haptic('soft');
        ctx.at(500, () => F.tween(ctx, rise.peakAt, 1, { duration: 1300, curve: 'cine' }, rise.draw));
      });

      // The last line, the plan as a call sheet, and only now the button.
      ctx.at(T.last, () => {
        retitle(ctx, titleB, ['Bake when', '*it’s ready.*']);
        plan.style.opacity = '';
        F.rise(ctx, [...plan.children], { delay: 260 });
      });
      ctx.at(T.cta, () => {
        foot.style.visibility = '';
        F.rise(ctx, cta);
      });
      if (ctx.mode !== 'flow') ctx.at(T.tapCta, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- the first bake (setup)

  const setup = { section: 'loaf-setup', style: 'cinematic', flow: true };

  // 1 · the last feed: time flows on a ribbon of minutes under one needle

  F.def({
    ...setup, id: 'loaf-fed', name: 'Your last feed', loop: 6200, seqHold: 5500,
    intent: 'One question in a baker’s words, answered on a ribbon where time flows under one needle (never a slot machine). The answer comes straight back as what it means: the hour it should peak.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-loaf' });
      const MIN = 300, MAX = 720, PXM = 2, START = 450, GOAL = 540; // 5 am to noon, 2 pt a minute
      let fed = START;
      const pic = X.pic('loaf-jar', { cls: 'lf-letter-pic' });
      const shot = h('div.lf-letter', pic);
      const title = setLines(h('h1.lf-h.is-center'), ['When did you', '*last feed it?*']);
      const tVal = h('b.lf-when-t', hm(START));
      const tAp = h('span.lf-when-ap', ap(START));
      const when = h('div.lf-when', h('small', 'Today, ' + X.weekday(X.day(0))), h('div.lf-when-row', tVal, tAp));
      const strip = h('div.lf-strip', { style: { width: (MAX - MIN) * PXM + 'px' } });
      for (let m = MIN; m <= MAX; m += 10) {
        const hour = m % 60 === 0;
        strip.append(h('i.lf-tick' + (hour ? '.is-hour' : m % 30 === 0 ? '.is-half' : ''), { style: { left: (m - MIN) * PXM + 'px' } }));
        if (hour) strip.append(h('span.lf-tick-label', { style: { left: (m - MIN) * PXM + 'px' } }, hourLabel(m)));
      }
      const ribbon = h('div.lf-ribbon', strip, h('i.lf-needle'));
      const peakT = h('b', fmt12(START + 280));
      const meaning = h('p.lf-meaning', 'It should peak around ', peakT, '.');
      const cta = F.primary(ctx, 'Continue');
      body.append(top(ctx), shot, title, when, ribbon, meaning, h('div.ph-fill'), h('div.ph-foot', cta));

      const place = (m) => (strip.style.transform = `translateX(${(195 - (m - MIN) * PXM).toFixed(2)}px)`);
      const setTime = (m) => {
        fed = m;
        place(m);
        F.timeText(ctx, tVal, m, { fmt: hm, tau: 70 });
        F.timeText(ctx, peakT, m + 280, { fmt: fmt12, tau: 70 });
        if (tAp.textContent !== ap(m)) tAp.textContent = ap(m);
        ctx.answers.loafFed = Math.round(m / 5) * 5;
      };
      F.timeText(ctx, tVal, START, { fmt: hm });
      F.timeText(ctx, peakT, START + 280, { fmt: fmt12 });
      setTime(START);
      // Let go and it settles on the nearest five minutes.
      let settling = null;
      const settle = () => {
        const to = Math.round(fed / 5) * 5;
        settling && settling();
        settling = F.tween(ctx, fed, to, { duration: 420, curve: 'cine' }, setTime);
        ctx.haptic('selection');
      };
      // The real gesture: the ribbon follows the finger exactly.
      let drag = null;
      ctx.on(ribbon, 'pointerdown', (e) => {
        settling && settling();
        const k = ctx.root.getBoundingClientRect().width / 390 || 1;
        drag = { x: e.clientX, m: fed, k };
        ribbon.setPointerCapture && e.pointerId !== undefined && ribbon.setPointerCapture(e.pointerId);
      });
      ctx.on(ribbon, 'pointermove', (e) => {
        if (!drag) return;
        setTime(F.clamp(drag.m - (e.clientX - drag.x) / drag.k / PXM, MIN, MAX));
      });
      const end = () => { if (drag) { drag = null; settle(); } };
      ctx.on(ribbon, 'pointerup', end);
      ctx.on(ribbon, 'pointercancel', end);

      F.rise(ctx, shot);
      F.titleIn(ctx, title, { delay: 220 });
      F.rise(ctx, [when, ribbon, meaning, cta], { delay: 520 });
      ctx.at(1400, () => F.idle(ctx, pic, 'drift'));
      if (ctx.mode !== 'flow') {
        ctx.at(1900, () => {
          const y = F.pos(ribbon, ctx.root).cy;
          X.drag(ctx, ctx.root, 282, 282 - (GOAL - START) * PXM, y, { duration: 1500, curve: 'inout', up: settle }, (e) => setTime(START + (GOAL - START) * e));
        });
        ctx.at(4500, () => F.tapEl(ctx, cta));
      }
    },
  });

  // 2 · the day, drawn as the schedule it is; the reminder asked for with the peak on screen

  F.def({
    ...setup, id: 'loaf-schedule', name: 'Your bake', loop: 9000, seqHold: 8300,
    intent: 'The answer becomes today, written out like a call sheet: each step at its hour, the waits between them, a photo of each. The reason for notifications is on screen before Apple’s own alert asks: the tap at 1:40, when it peaks.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-loaf' });
      const P = dayOf(fedOf(ctx));
      const eyebrow = h('p.lf-eyebrow', X.long(X.day(0)));
      const title = setLines(h('h1.lf-h.is-one'), ['Today’s *bake.*']);
      const row = (m, name, note, pic, done) => h('div.lf-step' + (done ? '.is-done' : ''),
        h('div.lf-step-time', h('b', hm(m)), h('small', ap(m))),
        h('div.lf-step-text', h('b', name), h('small', note)),
        pic ? X.pic(pic, { cls: 'lf-step-pic is-small' }) : h('span.lf-step-done', F.icon('check', { size: 14, stroke: 2.4 })));
      const link = (m, what) => h('div.lf-link', h('i'), h('span', `${span(m)} ${what}`));
      const steps = [
        row(P.fed, 'Fed', 'Your starter, this morning', null, true),
        link(P.peak - P.fed, 'rising'),
        row(P.peak, 'Peak, then mix', 'While it’s at its highest', 'loaf-jar'),
        link(P.shape - P.peak, 'bulk'),
        row(P.shape, 'Shape', 'A tight round, seam up', 'loaf-hands'),
        link(P.bake - P.shape, 'proof'),
        row(P.bake, 'Bake', `45 min, out at ${fmt12(P.out)}`, 'loaf-oven'),
      ];
      const sched = h('div.lf-sched', steps);
      const banner = h('div.lf-notif',
        X.appIcon('loaf', 38),
        h('div.lf-notif-text',
          h('div.lf-notif-top', h('b', 'Loaf'), h('span', fmt12(P.peak).replace(' ', '\u00a0').toUpperCase())),
          h('strong', 'Your starter has peaked'),
          h('p', 'Mix the dough now, at its highest.')));
      const ask = h('p.lf-ask', `Loaf will tap you at ${hm(P.peak)}, when it peaks.`);
      let asked = false;
      const cta = F.primary(ctx, `Remind me at ${hm(P.peak)}`, { onTap: () => (asked ? ctx.next() : askNow()) });
      body.append(top(ctx), eyebrow, title, sched, h('div.ph-fill'), banner, ask, h('div.ph-foot', cta));

      const answered = (allowed) => {
        asked = true;
        ctx.answers.loafReminders = allowed;
        F.swapText(ctx, ask, allowed ? `Loaf will tap you at ${hm(P.peak)}.` : 'No reminders. Settings can turn them on.', 120);
        ctx.at(380, () => cta.label('Continue'));
      };
      const askNow = () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Loaf” Would Like to Send You Notifications',
          message: 'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
          buttons: [
            { label: 'Don’t Allow', onTap: () => { al.close(); ctx.haptic('light'); answered(false); } },
            { label: 'Allow', bold: true, onTap: () => { al.close(); ctx.haptic('soft'); answered(true); } },
          ],
        });
        if (ctx.mode !== 'flow') ctx.at(1700, () => F.tapEl(ctx, al.buttons[1]));
      };

      F.rise(ctx, eyebrow);
      F.titleIn(ctx, title, { delay: 90 });
      // The day writes itself down, step by step: each row is revealed from its foot, each wait draws down.
      const rows = steps.filter((s) => s.classList.contains('lf-step'));
      F.rise(ctx, rows, { delay: 220, stagger: 240 });
      steps.filter((s) => s.classList.contains('lf-link')).forEach((l, i) => {
        const line = l.firstChild;
        ctx.track(line.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: ms(520), delay: ms(460 + i * 240), easing: F.css('cine'), fill: 'backwards' }));
        F.rise(ctx, l.lastChild, { delay: 500 + i * 240 });
      });
      F.rise(ctx, [banner, ask, cta], { delay: 1300 });
      ctx.at(1700, () => F.idle(ctx, rows[1].querySelector('.pic'), 'drift'));
      if (ctx.mode !== 'flow') {
        ctx.at(3500, () => F.tapEl(ctx, cta));
        ctx.at(7300, () => F.tapEl(ctx, cta));
      }
    },
  });

  // 3 · Today: the product, like a magazine, and one coach mark on the peak

  /** One coach mark, in the style: the room dims slowly around the card, the note rises under it. */
  const coach = (ctx, target, o) => {
    const r = F.pos(target, ctx.root);
    const pad = 8, rad = 22 + pad;
    const hole = h('div.coach-hole.lf-coach-hole', { style: { left: r.x - pad + 'px', top: r.y - pad + 'px', width: r.w + pad * 2 + 'px', height: r.h + pad * 2 + 'px', borderRadius: rad + 'px' } });
    const ok = h('button.lf-coach-ok', { type: 'button' }, o.ok || 'Got it');
    const tip = h('div.lf-coach-tip', { style: { top: r.y + r.h + pad + 16 + 'px' } },
      h('i.lf-coach-arrow', { style: { left: Math.round(r.w * 0.5) + 'px' } }),
      h('b', o.title), h('p', o.text), h('div.lf-coach-row', h('small', o.step || ''), ok));
    const layer = h('div.coach.lf-coach', hole, tip);
    ctx.root.append(layer);
    F.move(hole, { o: 0 }, { o: 1 }, { duration: 900, curve: 'cine', ctx, fill: 'backwards' });
    F.rise(ctx, tip, { delay: 360 });
    F.press(ctx, ok, { onTap: () => {
      ctx.haptic('light');
      F.move(layer, { o: 1 }, { o: 0 }, { duration: 420, curve: 'exit', ctx, fill: 'forwards' });
      ctx.at(440, () => layer.remove());
      o.onDone && o.onDone();
    } });
    layer.ok = ok;
    return layer;
  };

  F.def({
    ...setup, id: 'loaf-home', name: 'Today', loop: 8000, seqHold: 7300,
    intent: 'The product, laid out like a magazine: the starter’s peak as the one card that matters, then today’s bake in big photographs at their hours. One coach mark, on the peak card, says what it is and why it moves.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-loaf' });
      const P = dayOf(fedOf(ctx));
      const eyebrow = h('p.lf-eyebrow', X.long(X.day(0)));
      const title = h('h1.lf-mast', 'Today');

      // The peak card: what the starter is doing now, and when it peaks.
      const W = 302, H = 64;
      const rise = makeRise(W, H, P.fed, { split: (NOW - P.fed) / (18 * 60 - P.fed), top: 12, bottom: 4 });
      const [nx] = rise.at((NOW - P.fed) / (18 * 60 - P.fed));
      const pk = rise.peak;
      const spark = h('div.lf-spark', rise.el,
        h('i.lf-now', { style: { left: nx + 'px' } }, h('small', 'Now')),
        h('i.lf-peak-dot.is-small', { style: { left: pk[0] + 'px', top: pk[1] + 'px' } }),
        h('span.lf-spark-tag', { style: { left: pk[0] + 'px', top: pk[1] - 26 + 'px' } }, fmt12(P.peak)));
      const card = h('div.lf-peakcard',
        h('p.lf-card-eyebrow', `Starter · fed at ${fmt12(P.fed)}`),
        h('h2.lf-card-h', F.rich(`Peaks at *${fmt12(P.peak)}*`)),
        h('p.lf-card-sub', `In ${span(P.peak - NOW)}. Then mix the dough.`),
        spark);

      // Today's bake, in pictures, each at its hour.
      const shots = [['loaf-jar', P.peak, 'Mix', 'Next'], ['loaf-hands', P.shape, 'Shape'], ['loaf-oven', P.bake, 'Bake']].map(([id, m, name, next]) =>
        h('figure.lf-shot', X.pic(id, { cls: 'lf-shot-pic' }), next ? h('span.lf-shot-next', next) : null,
          h('figcaption', h('b', fmt12(m)), h('span', name))));
      const strip = h('div.lf-shots', shots);
      const head = h('div.lf-sec', h('b', 'Today’s bake'), h('span', `Country loaf · out at ${fmt12(P.out)}`));
      const tab = (icon, label, on) => h('span.lf-tab' + (on ? '.is-on' : ''), F.icon(icon, { size: 22, stroke: on ? 2 : 1.75 }), h('small', label));
      const tabs = h('nav.lf-tabs', { 'data-keep': '' }, tab('sunrise', 'Today', true), tab('timer', 'Starter'), tab('notebook-pen', 'Bakes'));
      body.append(eyebrow, title, card, head, strip);
      ctx.root.append(tabs);

      F.rise(ctx, eyebrow);
      F.titleIn(ctx, title, { delay: 80 });
      F.rise(ctx, [card, head, ...shots], { delay: 260 });
      rise.draw(0);
      ctx.at(700, () => F.tween(ctx, 0, 1, { duration: 1500, curve: 'cine' }, rise.draw));
      ctx.at(1500, () => F.idle(ctx, shots[0].querySelector('.pic'), 'drift'));

      ctx.at(2500, () => {
        const c = coach(ctx, card, {
          title: 'This is your starter’s peak',
          text: 'Loaf watches it rise and moves the whole bake if it peaks early or late.',
          onDone: () => ctx.at(700, () => ctx.next()),
        });
        if (ctx.mode !== 'flow') ctx.at(3100, () => F.tapEl(ctx, c.ok));
      });
    },
  });
})();
