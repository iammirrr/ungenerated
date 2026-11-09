/* Stride, a running coach that builds week one from the run you already did.
 * Motion style: snappy (every move lands on the beat): slams, stiff springs, fast counts, hard cuts.
 * Flows: the opening (four beats of kinetic type on one stage, carried by the volt lane), the
 * onboarding (a ruler, a week, a race, then week one) and the paywall (week one free, then Apple
 * Health in context). Generated draft: a goal list with emoji, radio buttons and Next. */
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

  // ---------------------------------------------------------------- what every Stride screen shares

  const base = { style: 'snappy', flow: true };
  const LAND = { response: 0.24, damping: 0.72 }; // the style's pop: it lands, it does not grow
  const SLAM = { response: 0.26, damping: 0.7 }; // the style's title spring
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  /** Week one is today and the six days after it, so “week one is free” matches the trial dates. */
  const WEEK = () => Array.from({ length: 7 }, (_, i) => X.day(i));
  const ANY3 = [2, 4, 0]; // Tue, Thu, Sun: spread out, the long run on the weekend
  const PRESETS = [
    { id: 'weekdays', label: 'Weekdays', days: [1, 2, 3, 4, 5] },
    { id: 'weekends', label: 'Weekends', days: [6, 0] },
    { id: 'any3', label: 'Any 3', days: ANY3 },
  ];
  const GOALS = [
    { id: '5k', name: '5K', km: 5, dist: '5 km', cap: 6, fast: '8 × 200 m', kind: 'Intervals', toward: 'For your 5K' },
    { id: '10k', name: '10K', km: 10, dist: '10 km', cap: 8, fast: '6 × 400 m', kind: 'Intervals', toward: 'For your 10K' },
    { id: 'half', name: 'Half marathon', km: 21.1, dist: '21.1 km', cap: 12, fast: '3 × 1 km', kind: 'Tempo', toward: 'For your half' },
    { id: 'run', name: 'Just running', km: 0, dist: 'No race', cap: 6, fast: '6 × 1 min', kind: 'Pick-ups', toward: 'At your own pace' },
  ];
  const kmText = (v) => String(Math.round(v * 10) / 10);
  /** The easy runs come from the longest run; the long run from the goal, never far past what they ran. */
  const easyKm = (longest) => F.clamp(Math.round(longest * 0.6), 2, 10);
  const longKm = (longest, goal) => Math.min(goal.cap, Math.max(easyKm(longest) + 1, Math.round(longest * 1.1)));
  const read = (a) => ({
    longest: a.sdLongest || 8.4,
    days: a.sdDays && a.sdDays.length ? a.sdDays : ANY3,
    goal: GOALS.find((g) => g.id === a.sdGoal) || GOALS[1],
  });
  /** Week one: up to three runs on the chosen days, in date order. */
  const weekOne = (a) => {
    const { longest, days, goal } = read(a);
    let picks = WEEK().map((d, i) => ({ d, i })).filter((x) => days.includes(x.d.getDay()));
    if (picks.length > 3) {
      // Three of them, spread out: the long run on the weekend if there is one, the first day, and the
      // day furthest from both.
      const long = picks.find((x) => x.d.getDay() === 0) || picks.find((x) => x.d.getDay() === 6) || picks[picks.length - 1];
      const rest = picks.filter((x) => x !== long);
      const gap = (x) => Math.min(Math.abs(x.i - rest[0].i), Math.abs(x.i - long.i));
      const mid = rest.slice(1).reduce((best, x) => (gap(x) > gap(best) ? x : best), rest[1]);
      picks = [rest[0], mid, long].sort((p, q) => p.i - q.i);
    }
    let li = picks.findIndex((x) => x.d.getDay() === 0);
    if (li < 0) li = picks.findIndex((x) => x.d.getDay() === 6);
    if (li < 0) li = picks.length - 1;
    const easy = easyKm(longest), long = longKm(longest, goal);
    let easyDone = false;
    return picks.map((p, k) => {
      if (k === li && picks.length > 1) return { ...p, type: 'long', n: long, unit: 'km', label: 'Long run', note: goal.toward };
      if (!easyDone) { easyDone = true; return { ...p, type: 'easy', n: easy, unit: 'km', label: 'Easy', note: `From your ${kmText(longest)} km` }; }
      return { ...p, type: 'fast', text: goal.fast, label: goal.kind, note: 'Easy jogs between' };
    });
  };

  /** Digits in fixed-width slots: the display face has no tabular figures of its own. */
  const tab = (el, text) => el.replaceChildren(...[...String(text)].map((c) => (/\d/.test(c) ? h('span.sd-dg', c) : h('span.sd-pc', c === ' ' ? '\u00a0' : c))));
  /** A value that ticks fast to its target. */
  const tick = (ctx, el, a, b, fmt, o = {}) => F.tween(ctx, a, b, { duration: o.ms || 520, curve: o.curve || 'strong', done: o.done }, (v) => tab(el, fmt(v)));
  /** A hard landing: down from above, a touch big, onto its place. */
  const slam = (ctx, el, o = {}) => F.move(el, { s: o.s ?? 1.12, y: o.y ?? -8, o: o.o ?? 0 }, { s: 1, y: 0, o: 1 }, { spring: o.spring || LAND, delay: o.delay || 0, fill: 'backwards', ctx });
  /** One live pose for a value moved by tweens: every move starts from where it is now. */
  const live = (ctx, init, apply) => {
    let v = init, stop = null;
    apply(v);
    return (b, o) => {
      stop && stop();
      const a = v;
      stop = F.tween(ctx, a, b, o, (x) => { v = x; apply(x); });
    };
  };
  /** A clip that opens on a sampled spring (SwiftUI's spring, the same numbers as everywhere else). */
  const clipOpen = (ctx, el, at, spring, o = {}) => {
    if (F.reduced()) return null;
    const sc = F.springCurve(spring.response, spring.damping);
    return ctx.track(el.animate(sc.values.map((v) => ({ clipPath: at(v) })), { duration: sc.duration * F.k(), delay: (o.delay || 0) * F.k(), easing: 'linear', fill: o.fill || 'backwards' }));
  };
  const clipShut = (ctx, el, from, to, ms = 140) => (F.reduced() ? null : ctx.track(el.animate([{ clipPath: from }, { clipPath: to }], { duration: ms * F.k(), easing: F.css('exit') })));

  // ---------------------------------------------------------------- the opening

  F.def({
    ...base, id: 'stride-open', section: 'stride-open', name: 'Run at your pace', loop: 12600, seqHold: 11600,
    intent: 'The opening, four beats on one stage and one rhythm. RUN slams onto the volt lane over a night track; your pace ticks down to 5:42; the plans from a book slam in and the lane crosses each one out; week one, from your last run, lands and the lane opens into the button. A tap anywhere jumps to the next beat.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride sd-op', tone: 'light' });
      const photo = X.pic('stride-track', { cls: 'sd-op-photo is-dark' });
      const dim = h('div.sd-op-dim');
      const shade = h('div.sd-op-shade');
      ctx.root.prepend(photo, dim, shade);
      const stage = h('div.sd-op-stage');
      const bar = h('i');
      const beat = h('span.sd-op-beatbox', bar); // the pulse lives here, apart from the lane's own move
      const lane = h('div.sd-op-lane', beat);
      const tapLayer = h('div.sd-op-tap', { role: 'button', 'aria-label': 'Next' });
      const cta = F.primary(ctx, 'Build my week one', { haptic: 'medium' });
      const label = cta.querySelector('span');
      const mark = h('p.sd-op-mark', 'Stride'); // the name, once, for the whole opening
      body.append(mark, stage, lane, tapLayer, h('div.ph-fill'), h('div.ph-foot.sd-op-foot', cta));
      mark.style.opacity = '0';

      // The camera on the photo, the dim over it, and the lane: one live pose each.
      photo.style.opacity = '0';
      const cam = live(ctx, 1.12, (s) => (photo.style.transform = `scale(${s.toFixed(4)})`));
      const dimTo = live(ctx, 0, (o) => (dim.style.opacity = o.toFixed(3)));
      const REST = 736; // the lane rests under the type slot (the type ends at 720)
      const hero = { x: 0, y: REST, w: 0 };
      const paint = () => {
        lane.style.transform = `translate(${hero.x.toFixed(2)}px, ${hero.y.toFixed(2)}px)`;
        bar.style.transform = `scaleX(${Math.max(0, hero.w).toFixed(4)})`;
      };
      paint();
      let heroStop = null;
      const heroTo = (to, o) => {
        heroStop && heroStop();
        const from = { ...hero };
        heroStop = F.tween(ctx, 0, 1, o, (t) => {
          Object.keys(to).forEach((k) => (hero[k] = from[k] + (to[k] - from[k]) * t));
          paint();
        });
      };
      let pulse = null;

      // Beats: each builds its words in the type slot; the lane moves between them.
      let cur = -1, t0 = 0, timers = [], words = null;
      const after = (ms, fn) => timers.push(ctx.at(ms, fn));
      const clear = () => {
        timers.forEach(clearTimeout);
        timers = [];
        if (words) {
          const w = words;
          F.exit(ctx, w);
          ctx.at(200, () => w.remove());
          words = null;
        }
      };
      const put = (...kids) => {
        words = h('div.sd-op-beat', kids);
        stage.append(words);
        return words;
      };
      const line = (text, cls = '') => h('span.sd-op-ln' + cls, F.rich(text));

      // Each beat cuts on the downbeat (camera, dim, lane); its words land once the last ones are gone (d).
      const run = (d) => {
        const t = h('h1.sd-op-h.is-run', 'Run.');
        put(t);
        photo.style.opacity = '1'; // a hard cut in from black, with a punch of the camera
        cam(1, { duration: 560, curve: 'snap' });
        heroTo({ w: 1 }, { duration: 260, curve: 'snap' });
        F.titleIn(ctx, t, { delay: d + 150 });
        after(d + 150, () => ctx.haptic('rigid'));
        // The style's pulse on the beat (every 1.2 s, the first 8%), as a thump of the line's weight so it
        // stays inside the gutter.
        if (!F.reduced()) pulse = ctx.track(beat.animate([{ scale: '1 1' }, { scale: '1.02 1.8', offset: 0.08 }, { scale: '1 1', offset: 0.2 }, { scale: '1 1' }], { duration: 1200 * F.k(), delay: 1200 * F.k(), iterations: Infinity }));
      };

      const pace = (d) => {
        const num = h('b');
        const meter = h('div.sd-op-pace', num, h('span.sd-op-unit', '/km'));
        const t = h('h1.sd-op-h', F.rich('Your *pace.*'));
        put(meter, t);
        tab(num, '7:05');
        cam(1.16, { duration: 300, curve: 'snap' });
        dimTo(0.32, { duration: 220, curve: 'snap' });
        F.titleIn(ctx, t, { delay: d });
        F.titleIn(ctx, meter, { delay: d + 180 });
        after(d, () => ctx.haptic('rigid'));
        // 7:05 → 5:42 a kilometre, ticking like a watch, landing on the beat.
        after(d + 280, () => tick(ctx, num, 425, 342, (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`, {
          ms: 1060,
          done: () => { F.move(meter, { s: 1.06 }, { s: 1 }, { spring: LAND, ctx, fill: 'none' }); ctx.haptic('rigid'); },
        }));
      };

      const book = (d) => {
        const lines = ['16 weeks.', '5 days a week.', 'Start at 10 km.'].map((s) => line(s));
        const list = h('h2.sd-op-h.is-book', lines);
        const note = h('p.sd-op-note', 'Written for someone else.');
        put(list, note);
        pulse && pulse.cancel();
        cam(1.07, { duration: 300, curve: 'snap' });
        dimTo(0.74, { duration: 220, curve: 'snap' });
        lines.forEach((l, i) => {
          F.titleIn(ctx, l, { delay: d + i * 300 });
          after(d + i * 300, () => ctx.haptic('rigid'));
        });
        // The lane crosses each one out, on the beat, and goes back to its place.
        const strike = (l) => {
          const p = F.pos(l, ctx.root);
          const stamp = h('i.sd-op-strike'); // left behind where the lane landed
          heroTo({ x: p.x - 24 - 6, y: p.y + p.h * 0.5 - 5.5, w: (p.w + 12) / 342 }, { duration: 130, curve: 'snap' });
          ctx.at(130, () => {
            l.append(stamp);
            l.classList.add('is-struck');
            ctx.haptic('rigid');
          });
        };
        lines.forEach((l, i) => after(900 + i * 300, () => strike(l)));
        after(1800, () => heroTo({ x: 0, y: REST, w: 1 }, { spring: LAND }));
        note.style.opacity = '0';
        after(1850, () => { note.style.opacity = ''; F.rise(ctx, note); });
      };

      const last = (d) => {
        const lines = [line('Week one,'), line('from your'), line('*last run.*')];
        put(h('h1.sd-op-h.is-last', lines));
        cam(1, { duration: 360, curve: 'snap' });
        dimTo(0.42, { duration: 220, curve: 'snap' });
        heroTo({ x: 0, y: REST, w: 1 }, { spring: LAND });
        lines.forEach((l, i) => {
          F.titleIn(ctx, l, { delay: d + i * 200 });
          after(d + i * 200, () => ctx.haptic('rigid'));
        });
        // The lane drops onto the button's line and opens into the button.
        after(760, () => {
          const b = F.pos(cta, ctx.root);
          heroTo({ x: b.x - 24, y: b.y + b.h / 2 - 4, w: b.w / 342 }, { duration: 140, curve: 'snap' });
        });
        after(900, () => {
          cta.style.visibility = 'visible';
          clipOpen(ctx, cta, (v) => `inset(${(24 * (1 - v)).toFixed(2)}px 0px ${(24 * (1 - v)).toFixed(2)}px 0px round ${(4 + 24 * v).toFixed(2)}px)`, { response: 0.3, damping: 0.74 });
          ctx.haptic('rigid');
          F.move(label, { s: 1.16, y: -2, o: 0 }, { s: 1, y: 0, o: 1 }, { spring: SLAM, delay: 120, fill: 'backwards', ctx });
          ctx.at(200, () => (lane.style.opacity = '0'));
          // The style's pulse, on the beat, sized for a full-width button (7% would spill past the gutter).
          if (!F.reduced()) ctx.track(cta.animate([{ scale: '1' }, { scale: '1.025', offset: 0.08 }, { scale: '1', offset: 0.2 }, { scale: '1' }], { duration: 1200 * F.k(), delay: 900 * F.k(), iterations: Infinity }));
        });
      };

      const BEATS = [run, pace, book, last];
      const AT = [300, 2700, 5100, 8100]; // on a 100 bpm grid: two bars, two bars, two and a half, then the end
      const go = (i) => {
        if (i >= BEATS.length || i === cur) return;
        const lag = words ? 110 : 0; // the old words leave in 120 ms: a hard cut, never two beats at once
        clear();
        cur = i;
        t0 = performance.now();
        BEATS[i](lag);
        if (i + 1 < BEATS.length) after(AT[i + 1] - AT[i], () => go(i + 1));
      };
      // The beats start once the display face is in (at once on the board), so RUN never slams in a
      // fallback font on a cold load.
      let started = false;
      const begin = () => {
        if (started || ctx.dead) return;
        started = true;
        mark.style.opacity = '';
        F.rise(ctx, mark, { delay: 720 }); // after RUN lands, and it stays
        ctx.at(AT[0], () => go(0));
        if (ctx.mode !== 'flow') {
          ctx.at(AT[2] - 420, () => F.tapEl(ctx, tapLayer, { dx: 70, dy: -150 })); // a tap moves to the next beat
          ctx.at(10500, () => F.tapEl(ctx, cta));
        }
      };
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(begin);
      ctx.at(1200, begin); // never wait longer than this
      ctx.on(tapLayer, 'click', () => {
        if (cur < 0 || cur >= BEATS.length - 1 || performance.now() - t0 < 300 * F.k()) return;
        ctx.haptic('light');
        go(cur + 1);
      });
    },
  });

  // ---------------------------------------------------------------- onboarding · 1 · the ruler

  const KM = 50; // points per kilometre on the ruler
  const MAX = 21;

  F.def({
    ...base, id: 'stride-distance', section: 'stride-onboarding', name: 'Your longest run', progress: 0.25, loop: 6800, seqHold: 5800,
    intent: 'Asks the thing itself, on a ruler you drag. It follows the finger 1:1, the kilometres run volt behind the needle, every whole kilometre lands with a thump, and what it means updates as you drag: laps of a track, then the easy runs of week one. On release it settles and the number slams.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const a = ctx.answers;
      let v = ctx.mode === 'flow' && a.sdLongest ? a.sdLongest : 3;
      const head = F.qHead(ctx, 'Your longest run *this month?*', 'A guess is fine. Week one starts from it.');
      const num = h('b.sd-num');
      const readout = h('div.sd-readout', num, h('span.sd-unit', 'km'));
      const laps = h('b');
      const lapsLine = h('p.sd-laps', F.icon('rotate-ccw', { size: 16, stroke: 2.2 }), h('span', 'About ', laps, ' laps of a track'));

      // Two strips that move together: the run so far in volt (left of the needle), the rest grey.
      const mkStrip = (lit) => {
        const s = h('div.sd-strip' + (lit ? '.is-lit' : ''), { style: { width: MAX * KM + 'px' } });
        for (let i = 0; i <= MAX * 5; i++) {
          const km = i / 5;
          const kind = i % 5 === 0 ? '.is-major' : '';
          s.append(h('i.sd-tick' + kind, { style: { left: km * KM + 'px' } }));
          if (!lit && i % 5 === 0) s.append(h('span.sd-label', { style: { left: km * KM + 'px' } }, String(km)));
        }
        return s;
      };
      const strip = mkStrip(false), litStrip = mkStrip(true);
      const needle = h('i.sd-needle');
      const ruler = h('div.sd-ruler', strip, h('div.sd-lit', litStrip), needle);
      const easy = h('b');
      const plan = h('div.sd-plan', h('span', 'Easy runs in week one'), h('span.sd-slot', easy));
      const cta = F.primary(ctx, 'Continue');

      const thump = () => !F.reduced() && ctx.track(needle.animate([{ scale: '1 1' }, { scale: '1.5 1.28', offset: 0.22 }, { scale: '1 1' }], { duration: 260 * F.k(), easing: 'ease-out' }));
      let lastWhole = Math.floor(v), lastEasy = null;
      const set = (val, quiet) => {
        v = F.clamp(val, 0.5, MAX);
        a.sdLongest = Math.round(v * 10) / 10;
        tab(num, v.toFixed(1));
        const x = `translateX(${(-v * KM).toFixed(2)}px)`;
        strip.style.transform = x;
        litStrip.style.transform = x;
        laps.textContent = String(Math.round(v / 0.4));
        const e = easyKm(v);
        if (e !== lastEasy) {
          if (lastEasy === null) easy.textContent = `${e} km`;
          else F.setValue(ctx, easy, `${e} km`);
          lastEasy = e;
        }
        const whole = Math.floor(v);
        if (whole !== lastWhole) {
          lastWhole = whole;
          if (!quiet) { thump(); ctx.haptic('selection'); }
        }
      };
      set(v, true);

      // The number slams when the ruler settles.
      const land = () => { F.move(readout, { s: 1.07 }, { s: 1 }, { spring: LAND, ctx, fill: 'none' }); ctx.haptic('rigid'); };
      let drag = null, settle = null;
      let wait = null; // the needle pulses on the beat until a finger takes the ruler
      ctx.at(700, () => { if (!ruler.classList.contains('is-held')) wait = F.idle(ctx, needle, 'pulse'); });
      const take = () => { wait && wait.cancel(); wait = null; };
      ctx.on(ruler, 'pointerdown', (e) => {
        take();
        settle && settle();
        drag = { x: e.clientX, v, k: ruler.getBoundingClientRect().width / ruler.offsetWidth };
        ruler.setPointerCapture(e.pointerId);
        ruler.classList.add('is-held');
      });
      ctx.on(ruler, 'pointermove', (e) => { if (drag) set(drag.v - (e.clientX - drag.x) / drag.k / KM); });
      const release = () => {
        if (!drag) return;
        drag = null;
        ruler.classList.remove('is-held');
        settle = F.tween(ctx, v, Math.round(v * 10) / 10, { spring: { response: 0.3, damping: 0.86 }, done: land }, (x) => set(x, true));
      };
      ctx.on(ruler, 'pointerup', release);
      ctx.on(ruler, 'pointercancel', release);

      body.append(F.qTop(ctx, { progress: 0.25 }), head, readout, lapsLine, ruler, plan, h('div.ph-fill'), h('div.ph-foot', cta));
      F.rise(ctx, [readout, lapsLine, ruler, plan, cta], { delay: 90 });

      if (ctx.mode !== 'flow') {
        // A thumb drags the ruler from 3 km to 8.4 km (the finger moves exactly as far as the ruler), lets go, then Continue.
        ctx.at(1400, () => {
          const y = F.pos(ruler, ctx.root).cy;
          const from = v;
          ctx.at(380, take);
          ruler.classList.add('is-held');
          X.drag(ctx, ctx.root, 318, 48, y, {
            duration: 1600, curve: 'inout',
            up: () => { ruler.classList.remove('is-held'); settle = F.tween(ctx, v, 8.4, { spring: { response: 0.3, damping: 0.86 }, done: land }, (x) => set(x, true)); },
          }, (t) => set(from + (8.4 - from) * t));
        });
        ctx.at(4700, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- onboarding · 2 · the days

  F.def({
    ...base, id: 'stride-days', section: 'stride-onboarding', name: 'The days you can run', progress: 0.5, loop: 6400, seqHold: 5400,
    intent: 'One calendar week, the seven days of week one with their dates, as seven lanes. A preset lights its days in a wave, each one slamming down on the beat; a lane can also be tapped on its own. The count underneath says what week one will get.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const a = ctx.answers;
      const on = new Set(ctx.mode === 'flow' && a.sdDays ? a.sdDays : []);
      const head = F.qHead(ctx, 'Which days can you *run?*', 'Week one runs on these days.');
      const face = (d, i) => [h('small', WD[d.getDay()]), h('b', String(d.getDate())), h('span.sd-day-dot', i === 0 ? 'Today' : '')];
      const lanes = WEEK().map((d, i) => {
        const lit = h('span.sd-day-lit', face(d, i));
        const el = h('button.sd-day', { type: 'button', 'aria-pressed': 'false' }, face(d, i), lit);
        el.wd = d.getDay();
        el.lit = lit;
        F.press(ctx, el, { scale: 0.95, onTap: () => { light(el, !el.classList.contains('is-on'), 0); preset(null); sync(); } });
        return el;
      });
      const week = h('div.sd-lanes', lanes);
      const chips = PRESETS.map((p) => {
        const c = h('button.sd-chip', { type: 'button', 'aria-pressed': 'false' }, p.label);
        c.p = p;
        F.press(ctx, c, { onTap: () => choose(p) });
        return c;
      });
      const count = h('b.sd-sum-n');
      const what = h('span.sd-sum-t');
      const sum = h('div.sd-sum', h('span.sd-slot.is-n', count), h('span.sd-slot', what));
      const cta = F.primary(ctx, 'Continue');

      const light = (el, yes, delay) => {
        if (el.classList.contains('is-on') === yes) return;
        el.anim && el.anim.cancel();
        el.classList.toggle('is-on', yes);
        el.setAttribute('aria-pressed', String(yes));
        if (yes) {
          el.anim = clipOpen(ctx, el.lit, (v) => `inset(0px 0px ${((1 - v) * 100).toFixed(2)}% 0px round 10px)`, LAND, { delay });
          ctx.at(delay, () => ctx.haptic('selection'));
        } else el.anim = clipShut(ctx, el.lit, 'inset(0px 0px 0% 0px round 10px)', 'inset(100% 0px 0px 0px round 10px)', 130);
      };
      const preset = (p) => chips.forEach((c) => {
        const yes = c.p === p;
        c.classList.toggle('is-on', yes);
        c.setAttribute('aria-pressed', String(yes));
      });
      let shown = null;
      const sync = () => {
        const days = lanes.filter((l) => l.classList.contains('is-on')).map((l) => l.wd);
        a.sdDays = days;
        const n = days.length;
        const text = String(Math.min(3, n));
        const words = n === 0 ? 'runs yet' : n === 1 ? 'run in week one' : n <= 3 ? 'runs in week one' : `runs in week one, then up to ${n}`;
        if (shown === null) { tab(count, text); what.textContent = words; }
        else if (shown !== text + words) { F.setValue(ctx, count, text); F.swapText(ctx, what, words, 30); }
        shown = text + words;
        cta.enable(n > 0);
      };
      /** A preset: what leaves drains at once, then the new days slam down left to right, on the beat. */
      const choose = (p) => {
        preset(p);
        const want = (l) => p.days.includes(l.wd);
        lanes.filter((l) => !want(l)).forEach((l) => light(l, false));
        lanes.filter(want).filter((l) => !l.classList.contains('is-on')).forEach((l, k) => light(l, true, 60 + k * 90));
        ctx.at(60, sync);
      };
      lanes.forEach((l) => on.has(l.wd) && light(l, true, 0));
      sync();
      ctx.at(900, () => F.idle(ctx, count.parentNode, 'pulse'));

      body.append(F.qTop(ctx, { progress: 0.5 }), head, week, h('div.sd-chips', chips), sum, h('div.ph-fill'), h('div.ph-foot', cta));
      F.rise(ctx, [week, chips[0].parentNode, sum, cta], { delay: 90 });

      if (ctx.mode !== 'flow') {
        ctx.at(1300, () => F.tapEl(ctx, chips[0]));
        ctx.at(2800, () => F.tapEl(ctx, chips[2]));
        ctx.at(4200, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- onboarding · 3 · the race

  F.def({
    ...base, id: 'stride-goal', section: 'stride-onboarding', name: 'What you’re training for', progress: 0.75, loop: 4200, seqHold: 3200,
    intent: 'Four big tiles, each with its distance drawn to scale, so the half marathon is visibly four 5Ks long. One tap: the pick slams in and the screen moves on by itself. The long run of week one builds toward it.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const a = ctx.answers;
      const head = F.qHead(ctx, 'What are you *training* for?', 'Your long run builds toward it.');
      const tiles = GOALS.map((g) => {
        const face = () => h('span.sd-goal-face', h('b.sd-goal-name', g.name), h('small.sd-goal-km', g.dist), h('span.sd-goal-bar', h('i', { style: { width: g.km ? (g.km / 21.1) * 100 + '%' : '100%' } })));
        const plate = h('span.sd-goal-plate', face());
        const tile = h('button.sd-goal' + (g.km ? '' : '.is-open'), { type: 'button', 'aria-pressed': 'false' }, face(), plate);
        tile.plate = plate;
        F.press(ctx, tile, { scale: 0.97, onTap: () => pick(g, tile) });
        return tile;
      });
      let picked = false;
      const pick = (g, tile) => {
        if (picked) return;
        picked = true;
        a.sdGoal = g.id;
        tile.classList.add('is-on');
        tile.setAttribute('aria-pressed', 'true');
        F.move(tile.plate, { s: 1.06, o: 0 }, { s: 1, o: 1 }, { spring: LAND, ctx, fill: 'backwards' });
        F.move(tile, { y: -3 }, { y: 0 }, { spring: LAND, ctx, fill: 'none' });
        ctx.haptic('rigid');
        ctx.at(380, () => ctx.next());
      };
      body.append(F.qTop(ctx, { progress: 0.75 }), head, h('div.sd-goals', tiles));
      F.rise(ctx, tiles, { delay: 90 });
      // Each distance draws to scale as its tile lands.
      tiles.forEach((t, i) => {
        const fill = t.querySelector('.sd-goal-bar > i');
        if (!F.reduced()) ctx.track(fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 420 * F.k(), delay: (220 + i * 70) * F.k(), easing: F.css('snap'), fill: 'backwards' }));
      });
      if (ctx.mode !== 'flow') ctx.at(1500, () => F.tapEl(ctx, tiles[1]));
    },
  });

  // ---------------------------------------------------------------- onboarding · 4 · week one (the value beat)

  F.def({
    ...base, id: 'stride-week', section: 'stride-onboarding', name: 'Week one', loop: 5000, seqHold: 4000,
    intent: 'The answers become week one: seven days with their dates, and three runs that slam onto the days they chose, on the beat. The easy run comes from their longest run, the long run from their race; each card says so in small print. The value beat before any price.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const runs = weekOne(ctx.answers);
      const week = WEEK();
      const eyebrow = h('p.sd-eyebrow', `${X.short(week[0])} to ${X.short(week[6])} · ${runs.length} runs`);
      const title = h('h1.sd-h', F.rich('Week one, *from your run.*'));
      const cards = [];
      const rows = week.map((d, i) => {
        const r = runs.find((x) => x.i === i);
        const day = h('div.sd-wk-day', h('small', WD[d.getDay()]), h('b', String(d.getDate())));
        if (!r) return h('div.sd-wk-row.is-rest', day, h('span.sd-wk-rest', h('span', 'Rest')));
        const big = h('b.sd-wk-big');
        if (r.text) big.textContent = r.text; else tab(big, `${r.n} ${r.unit}`);
        const card = h('div.sd-wk-card.is-' + r.type, h('div.sd-wk-top', big, h('span.sd-wk-kind', r.label)), h('small.sd-wk-note', r.note));
        card.r = r;
        card.big = big;
        card.day = day;
        cards.push(card);
        return h('div.sd-wk-row', day, card);
      });
      const list = h('div.sd-wk', rows);
      const foot = h('p.sd-wk-foot', 'Next week builds from how this one goes.');
      const cta = F.primary(ctx, 'Continue');
      body.append(eyebrow, title, list, h('div.ph-fill'), foot, h('div.ph-foot', cta));
      F.titleIn(ctx, title, { delay: 40 });
      F.rise(ctx, [eyebrow, list, foot, cta], { delay: 60 });
      // The runs slam onto their days on the beat; their numbers tick up as they land.
      cards.forEach((c, k) => {
        const at = 520 + k * 260;
        slam(ctx, c, { delay: at, s: 1.1, y: -20 });
        ctx.at(at, () => {
          c.day.classList.add('is-on');
          ctx.haptic('rigid');
          if (c.r.n) tick(ctx, c.big, 0, c.r.n, (x) => `${Math.round(x)} ${c.r.unit}`, { ms: 360 });
        });
      });
      if (ctx.mode !== 'flow') ctx.at(2700, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- the paywall

  const PLANS = [
    { id: 'year', name: 'Yearly', price: 59.99, per: 'a year', note: '$5.00 a month' },
    { id: 'month', name: 'Monthly', price: 7.99, per: 'a month', note: '$95.88 a year' },
  ];
  const money = (v) => '$' + v.toFixed(2);

  F.def({
    ...base, id: 'stride-pay', section: 'stride-paywall', name: 'Week one free', loop: 6600, seqHold: 5600,
    intent: 'Dark and loud, still honest. Week one is free; both prices are on the screen before any tap; the trial is a timeline with its real dates (today, the reminder, the first charge), and the charge rolls when the plan changes. One button names the outcome; Restore purchases and how to cancel sit under it. No countdown, no struck price.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const a = ctx.answers;
      let pick = a.sdPlan || 'year';
      const plan = () => PLANS.find((p) => p.id === pick);
      const close = h('button.sd-x', { type: 'button', 'aria-label': 'Close' }, F.icon('x', { size: 22, stroke: 2.2 }));
      F.press(ctx, close, { row: true, onTap: () => ctx.next() });
      const l1 = h('span.sd-pay-ln', 'Week one'), l2 = h('span.sd-pay-ln', F.rich('is *free.*'));
      const title = h('h1.sd-pay-h', l1, l2);
      const gets = [['calendar', 'A new week, built from the one you ran'], ['timer', 'Target paces from your own runs'], ['refresh-cw', 'Miss a day and the week moves']]
        .map(([ic, t]) => h('li', F.icon(ic, { size: 18, stroke: 2.2 }), h('span', t)));
      const list = h('ul.sd-gets', gets);
      const cards = PLANS.map((p) => {
        const price = h('b.sd-plan-price');
        const ring = h('i.sd-plan-ring');
        const card = h('button.sd-plan-card' + (p.id === pick ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(p.id === pick) },
          ring, h('span.sd-plan-top', h('small', p.name), h('i.sd-radio')), price, h('span.sd-plan-per', p.per), h('span.sd-plan-note', p.note));
        card.p = p;
        card.price = price;
        card.ring = ring;
        F.press(ctx, card, { scale: 0.96, onTap: () => choose(p.id) });
        return card;
      });
      const charge = h('span.sd-tl-money');
      const per = h('span.sd-tl-per', plan().per);
      const stop = (date, what, cls = '') => h('div.sd-tl-stop' + cls, h('b', date), h('small', what));
      const dots = [h('i.sd-tl-dot.is-now'), h('i.sd-tl-dot'), h('i.sd-tl-dot.is-pay')];
      const links = [h('i.sd-tl-link'), h('i.sd-tl-link')];
      const track = h('div.sd-tl-track', dots[0], links[0], dots[1], links[1], dots[2]);
      const stops = h('div.sd-tl-stops', stop('Today', 'Week one, free'), stop(X.short(X.day(5)), 'A reminder from us', '.is-mid'), stop(X.short(X.day(7)), h('span.sd-tl-end', charge, h('span.sd-slot', per)), '.is-end'));
      const timeline = h('div.sd-tl', track, stops);
      const cta = F.primary(ctx, 'Start week one free', { haptic: 'medium' });
      const restore = h('button.sd-link', { type: 'button' }, 'Restore purchases');
      F.press(ctx, restore, { row: true });
      const small = h('div.sd-pay-small', restore, h('span', 'Cancel anytime in Settings'));

      const choose = (id) => {
        if (id === pick) return;
        pick = id;
        a.sdPlan = id;
        cards.forEach((c) => {
          const yes = c.p.id === id;
          c.classList.toggle('is-on', yes);
          c.setAttribute('aria-pressed', String(yes));
          if (yes) slam(ctx, c.ring, { s: 1.08, y: 0 });
        });
        F.reel(ctx, charge, money(plan().price), { spins: 1, stagger: 40 });
        F.swapText(ctx, per, plan().per, 40);
        ctx.haptic('selection');
      };

      body.append(h('div.sd-pay-top', close), title, list, h('div.sd-plans', cards), timeline, h('div.ph-fill'), h('div.ph-foot.sd-pay-foot', cta, small));
      // Loud and on the beat: the two lines slam, the lines of value rise, the prices tick in,
      // the timeline's stops land left to right, then the button.
      F.titleIn(ctx, l1, { delay: 30 });
      F.titleIn(ctx, l2, { delay: 170 });
      [30, 170].forEach((t) => ctx.at(t, () => ctx.haptic('rigid')));
      // One wave, paced on the beat: the lines of value, the prices, the timeline, the button.
      const foot = cta.parentNode;
      F.rise(ctx, [list, cards[0].parentNode, timeline, foot], { delay: 240, stagger: 110 });
      cards.forEach((c, i) => {
        tab(c.price, money(0));
        ctx.at(330 + i * 60, () => tick(ctx, c.price, 0, c.p.price, money, { ms: 420 }));
      });
      dots.forEach((d, i) => F.pop(ctx, d, { delay: 480 + i * 140 }));
      links.forEach((l, i) => !F.reduced() && ctx.track(l.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 160 * F.k(), delay: (540 + i * 140) * F.k(), easing: F.css('snap'), fill: 'backwards' })));
      ctx.at(480, () => F.reel(ctx, charge, money(plan().price), { spins: 1, stagger: 40, haptic: false }));
      ctx.at(1700, () => F.idle(ctx, dots[0], 'pulse'));

      if (ctx.mode !== 'flow') {
        ctx.at(1900, () => F.tapEl(ctx, cards[1]));
        ctx.at(3000, () => F.tapEl(ctx, cards[0]));
        ctx.at(4300, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- Apple Health, in context

  /** Apple's Health authorization sheet, drawn the way iOS draws it (never restyled). */
  const healthSheet = (ctx, root, o) => {
    const allow = h('button.sd-hk-nav-b.is-strong', { type: 'button', 'aria-disabled': 'true' }, 'Allow');
    const deny = h('button.sd-hk-nav-b', { type: 'button' }, 'Don’t Allow');
    const rowsOf = (items) => items.map(([icon, color, name]) => {
      const tog = F.toggle(ctx, false, () => o.onChange && o.onChange());
      return { tog, el: h('div.ios-cell.sd-hk-cell', h('span.sd-hk-ic', { style: { color } }, F.icon(icon, { size: 19, stroke: 2.2 })), h('span.sd-hk-name', name), tog) };
    });
    const write = rowsOf([['flame', '#ff9500', 'Workouts']]);
    const readR = rowsOf([['heart', '#ff2d55', 'Heart Rate'], ['flame', '#ff9500', 'Walking + Running Distance'], ['flame', '#ff9500', 'Workouts']]);
    const all = h('button.ios-cell.sd-hk-all', { type: 'button' }, 'Turn On All');
    const body = h('div.sd-hk-body',
      h('div.sd-hk-hero', X.appIcon('stride', 64), h('p', '“Stride” would like to access and update your Health data in the categories below.')),
      h('div.ios-group', all),
      h('p.ios-head', 'Allow “Stride” to write data:'),
      h('div.ios-group', write.map((r) => r.el)),
      h('p.ios-head', 'Allow “Stride” to read data:'),
      h('div.ios-group', readR.map((r) => r.el)),
      h('p.ios-foot.sd-hk-why', h('b', 'App Explanation: '), o.why));
    const scrim = h('div.ios-sheet-scrim');
    const sheet = h('div.ios-sheet.sd-hk', h('div.sd-hk-nav', deny, h('b', 'Health Access'), allow), body);
    const el = h('div.ios-sheet-layer', scrim, sheet);
    root.append(el);
    F.move(scrim, { o: 0 }, { o: 1 }, { duration: 260, curve: 'strong', ctx, fill: 'backwards' });
    F.move(sheet, { y: 820 }, { y: 0 }, { spring: { response: 0.5, damping: 0.92 }, ctx, fill: 'backwards' });
    const toggles = [...write, ...readR].map((r) => r.tog);
    F.press(ctx, all, { row: true, onTap: () => {
      const turnOn = all.textContent === 'Turn On All';
      toggles.forEach((t, i) => ctx.at(i * 70, () => t.set(turnOn)));
      all.textContent = turnOn ? 'Turn Off All' : 'Turn On All';
    } });
    const syncAllow = () => allow.setAttribute('aria-disabled', String(!toggles.some((t) => t.getAttribute('aria-checked') === 'true')));
    o.onChange = syncAllow;
    const api = {
      el, all, allow, deny,
      close() {
        F.move(scrim, { o: 1 }, { o: 0 }, { duration: 220, curve: 'exit', ctx, fill: 'forwards' });
        F.move(sheet, { y: 0 }, { y: 820 }, { duration: 320, curve: 'exit', ctx, fill: 'forwards' });
        ctx.at(340, () => el.remove());
      },
    };
    F.press(ctx, allow, { row: true, onTap: () => { if (allow.getAttribute('aria-disabled') !== 'true') o.onAllow && o.onAllow(api); } });
    F.press(ctx, deny, { row: true, onTap: () => o.onDeny && o.onDeny(api) });
    return api;
  };

  F.def({
    ...base, id: 'stride-health', section: 'stride-paywall', name: 'Apple Health', loop: 7600, seqHold: 6600,
    intent: 'The permission is asked where its reason is visible: the runs of week one, waiting for the watch. The toggle opens Apple’s own Health sheet, in Apple’s words, with Stride’s purpose string as its App Explanation; Allow brings them back to a row that says Connected. Don’t Allow springs the toggle back.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-stride', tone: 'light' });
      const runs = weekOne(ctx.answers);
      const head = F.qHead(ctx, 'Connect *Apple Health.*', 'Runs from your watch go straight into week one.');
      const marks = [];
      const items = runs.map((r) => {
        const mark = h('span.sd-hl-mark');
        marks.push(mark);
        return h('div.sd-hl-run', h('span.sd-hl-day', `${WD[r.d.getDay()]} ${r.d.getDate()}`), h('b', r.text || `${r.n} ${r.unit}`), h('span.sd-hl-kind', r.label), mark);
      });
      const runsCard = h('div.sd-hl-runs', items);
      const week = WEEK();
      const label = h('p.sd-hl-head', `Week one · ${X.short(week[0])} to ${X.short(week[6])}`);
      const sub = h('small', 'Workouts, distance, heart rate');
      const tog = F.toggle(ctx, false, (yes) => { if (yes) ask(); });
      const row = h('div.sd-hl-row', h('span.sd-hl-ic', F.icon('heart-pulse', { size: 22, stroke: 2.2 })), h('span.sd-hl-label', h('b', 'Apple Health'), h('span.sd-slot', sub)), tog);
      const cta = F.primary(ctx, 'Continue');
      let wait = null;
      ctx.at(700, () => { if (tog.getAttribute('aria-checked') !== 'true') wait = F.idle(ctx, tog, 'pulse'); });
      ctx.on(tog, 'click', () => { wait && wait.cancel(); wait = null; });
      body.append(head, label, runsCard, row, h('div.ph-fill'), h('div.ph-foot', cta));
      F.rise(ctx, [label, runsCard, row, cta], { delay: 90 });

      const connected = () => {
        row.classList.add('is-on');
        F.swapText(ctx, sub, 'Connected · runs land here', 0);
        marks.forEach((m, i) => ctx.at(160 + i * 110, () => {
          m.replaceChildren(F.icon('watch', { size: 15, stroke: 2.2 }));
          m.classList.add('is-on');
          F.pop(ctx, m);
          ctx.haptic('selection');
        }));
        ctx.haptic('success');
      };
      let sheet = null;
      const ask = () => {
        if (sheet) return;
        sheet = healthSheet(ctx, ctx.root, {
          why: 'Runs from your watch go straight into week one.',
          onAllow: (s) => { s.close(); sheet = null; ctx.at(260, connected); },
          onDeny: (s) => { s.close(); sheet = null; ctx.at(200, () => { tog.set(false); F.swapText(ctx, sub, 'Not allowed · *Open Settings*'); }); },
        });
        if (ctx.mode !== 'flow') {
          ctx.at(1300, () => F.tapEl(ctx, sheet.all));
          ctx.at(2400, () => F.tapEl(ctx, sheet.allow));
        }
      };
      if (ctx.mode !== 'flow') {
        ctx.at(1400, () => F.tapEl(ctx, tog));
        ctx.at(5500, () => F.tapEl(ctx, cta));
      }
    },
  });
})();
