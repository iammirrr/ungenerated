/* Parla, Italian you say out loud, a phrase at a time. Motion style: bubbly (soft, round, alive):
 * springs 0.38 / 0.62 on small things, squash that keeps its volume under the finger, pops from
 * their source, Tazza bobbing while it waits, content that rises calmly and never bounces, and a
 * step between screens. One lively moment per screen.
 * Flows: the opening (one stage; Tazza carries every beat), the microphone (the phrase first, the
 * ask in context, the first phrase heard, day one) and leaving for a break (one question, the
 * honest break, ci vediamo).
 * Generated draft: the system asks at launch, over a spinner, with a reason that says nothing. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'parla-generated', section: 'generated', name: 'Parla · generated', loop: 7800,
    intent: 'The first draft of "a speaking app": the microphone prompt fires at launch over a gradient splash and a spinner, with "This app requires microphone access." People say no, and the app scolds them.',
    build(ctx) {
      const { body } = S.frame(ctx, { blobs: false });
      ctx.root.classList.add('is-splash');
      const logo = h('div.s-logo.s-emoji', '🗣️');
      const name = h('h1.s-h1', { style: { marginTop: '26px', color: '#fff' } }, 'Parla AI');
      const tag = h('p.s-p', { style: { color: '#e0e7ff' } }, 'Your AI-Powered Language Tutor ✨');
      body.append(h('div.ph-fill'), logo, name, tag, h('div.s-spin'), h('div.ph-fill'));
      S.in([logo, name, tag]);
      ctx.at(1000, () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Parla AI” Would Like to Access the Microphone',
          message: 'This app requires microphone access.',
          buttons: [{ label: 'Don’t Allow', onTap: () => al.close() }, { label: 'OK', bold: true, onTap: () => al.close() }],
        });
        ctx.at(2300, () => F.tapEl(ctx, al.buttons[0]));
      });
      ctx.at(4000, () => {
        const toast = h('div.s-toast', '⚠️ Microphone access is required to use Parla AI!');
        ctx.root.append(toast);
        toast.classList.add('s-in');
      });
    },
  });

  // ---------------------------------------------------------------- what every Parla screen shares

  // Lucide (ISC licence), in the same form as js/icons.js.
  window.F_ICONS.luggage = window.F_ICONS.luggage || [['path', { d: 'M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2' }], ['path', { d: 'M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14' }], ['path', { d: 'M10 20h4' }], ['circle', { cx: 16, cy: 20, r: 2 }], ['circle', { cx: 8, cy: 20, r: 2 }]];

  /** The first phrase, in two lines, broken where a person takes a breath. */
  const LINES = [['Vorrei', 'un', 'caffè,'], ['per', 'favore.']];
  /** How long each word takes to say, in ms: the rhythm of the sentence, not a metronome. */
  const SAID = [420, 230, 440, 250, 500];
  const EN = 'I’d like a coffee, please.';
  const SOUNDS = 'vor·RAY oon kaf·FEH, pehr fa·VOH·reh';
  const NAME = 'Maya', PHRASES = 41, BEST = 12;
  const ENDS = () => X.day(18); // the day Parla Plus ends once renewal is off
  /** The same date n months from today, real like X.day. */
  const months = (n) => { const d = X.day(0); d.setMonth(d.getMonth() + n); return d; };
  const k = () => (F.reduced() ? 0 : F.k());
  /** A keyframe move that follows the speed dial and Reduce Motion, tracked by the screen. */
  const play = (ctx, el, frames, o = {}) => ctx.track(el.animate(frames, {
    duration: F.reduced() ? 1 : (o.duration || 300) * F.k(), delay: (o.delay || 0) * k(),
    easing: o.easing || 'linear', fill: o.fill || 'both', iterations: o.iterations || 1, direction: o.direction || 'normal',
  }));
  /** A spring's progress at t ms (F.springCurve sampled at 60 fps). */
  const springAt = (sc, t) => {
    if (t >= sc.duration) return 1;
    const i = (Math.max(0, t) / sc.duration) * (sc.values.length - 1), j = Math.floor(i), f = i - j;
    return sc.values[j] + (sc.values[Math.min(j + 1, sc.values.length - 1)] - sc.values[j]) * f;
  };

  /**
   * Tazza in a slot. The slot carries the place and the idle bob; the inside carries the pose,
   * the squash and the hop, so no two moves fight over one element. A pose changes at the deepest
   * point of a squash, so the swap is never seen.
   */
  const tazza = (ctx, pose, size) => {
    const inner = h('div.pa-tz-in', X.tazza(pose, size));
    const el = h('div.pa-tz', { style: { width: size + 'px', height: size + 'px', transformOrigin: '50% 90%' } }, inner);
    el.inner = inner;
    el.now = pose;
    el.swap = (p) => {
      if (p === el.now) return;
      el.now = p;
      inner.replaceChildren(X.tazza(p, size));
    };
    el.set = (p) => {
      if (p === el.now) return;
      F.move(inner, { sx: 1, sy: 1 }, { sx: 1.07, sy: 0.92 }, { duration: 100, curve: 'strong', ctx, fill: 'forwards' });
      ctx.at(100, () => {
        el.swap(p);
        F.move(inner, { sx: 1.07, sy: 0.92 }, { sx: 1, sy: 1 }, { spring: { response: 0.34, damping: 0.6 }, ctx, fill: 'forwards' });
      });
    };
    let idle = null;
    el.bob = (delay = 0) => { el.still(); idle = F.idle(ctx, el, 'bob', { delay }); };
    el.still = () => { if (idle) { idle.cancel(); idle = null; } };
    return el;
  };

  /** Tazza popping up from its saucer. It is big, so a slower spring than a chip (0.5 / 0.62). */
  const popUp = (ctx, t, delay = 0) => {
    F.move(t, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.5, damping: 0.62 }, delay, ctx, fill: 'backwards' });
    ctx.at(delay + 220, () => ctx.haptic('light'));
  };
  /** Tazza arriving calmly, like content, when the screen's lively moment is something else. */
  const settle = (ctx, t, delay = 0) => F.move(t, { y: 12, o: 0 }, { y: 0, o: 1 }, { duration: 460, delay, curve: 'decel', ctx, fill: 'backwards' });

  /**
   * Tazza's cheer, once: it gathers (a squash), jumps (a stretch), lands (a squash) and goes
   * still. Width × height stays about the same all the way. The haptic fires on the landing.
   */
  const hop = (ctx, t, o = {}) => {
    t.still();
    const D = 860, d = o.delay || 0;
    play(ctx, t.inner, [
      { transform: 'translateY(0px) scale(1, 1)', easing: 'cubic-bezier(.33, 0, .67, 1)' },
      { transform: 'translateY(0px) scale(1.1, 0.88)', offset: 0.16, easing: 'cubic-bezier(.16, .8, .3, 1)' },
      { transform: 'translateY(-38px) scale(0.92, 1.09)', offset: 0.44, easing: 'cubic-bezier(.62, 0, .88, .45)' },
      { transform: 'translateY(0px) scale(1.12, 0.87)', offset: 0.64, easing: 'cubic-bezier(.2, .7, .3, 1)' },
      { transform: 'translateY(0px) scale(0.97, 1.03)', offset: 0.8, easing: 'cubic-bezier(.4, 0, .6, 1)' },
      { transform: 'translateY(0px) scale(1, 1)' },
    ], { duration: D, delay: d, fill: 'none' });
    ctx.at(d + D * 0.16, () => o.pose && t.swap(o.pose));
    ctx.at(d + D * 0.64, () => { ctx.haptic('success'); o.land && o.land(); });
    if (o.bob !== false) ctx.at(d + D + 260, () => t.bob());
  };

  /** What Tazza says: a crema bubble that pops from its tail, beside Tazza's rim. */
  const bubble = (ctx) => {
    const txt = h('span');
    const el = h('div.pa-bub', txt);
    el.style.visibility = 'hidden';
    el.show = (text, delay = 0) => ctx.at(delay, () => {
      el.getAnimations().forEach((a) => a.cancel());
      txt.textContent = text;
      el.style.visibility = '';
      F.pop(ctx, el);
      ctx.haptic('light');
    });
    el.hide = (delay = 0) => ctx.at(delay, () => F.exit(ctx, el));
    return el;
  };

  /**
   * The phrase: every word its own box. light(i) sends the voice pill to word i. Its leading
   * edge runs ahead on a quicker spring and the trailing edge catches up, so it stretches as it
   * travels and lands round; a new line is a breath (it closes, then opens on the next line).
   * The pill is a clip on one layer, so only a clip moves.
   */
  const phrase = (ctx, o = {}) => {
    const words = [];
    const pill = h('i.pa-pill');
    const lines = LINES.map((ln) => h('span.pa-line', ln.flatMap((w, i) => {
      const s = h('span.pa-word', w);
      words.push(s);
      return i ? [' ', s] : [s];
    })));
    const el = h('p.pa-phrase' + (o.read ? '.is-read' : ''), pill, ...lines);
    el.words = words;
    const E = 16, PX = 7, PY = 1;
    let L = 0, R = 0, T = 0, B = 0, stop = null, open = false;
    const boxOf = (i) => {
      const w = words[i];
      return { l: w.offsetLeft - PX, r: w.offsetLeft + w.offsetWidth + PX, t: w.offsetTop + PY, b: w.offsetTop + w.offsetHeight - PY };
    };
    const paint = () => {
      const W = el.offsetWidth, H = el.offsetHeight;
      pill.style.clipPath = `inset(${(T + E).toFixed(1)}px ${(W + E - R).toFixed(1)}px ${(H + E - B).toFixed(1)}px ${(L + E).toFixed(1)}px round 999px)`;
    };
    /** Both edges to the box: the one moving with the travel leads, the other lags. */
    const go = (b, mode) => {
      stop && stop();
      const a = { L, R, T, B };
      const right = b.l + b.r >= a.L + a.R;
      const lead = F.springCurve(0.24, 0.72), lag = F.springCurve(0.4, 0.78), vert = F.springCurve(0.3, 0.86);
      // Opening is even on both edges; closing is quick and never overshoots, so nothing lingers.
      const even = mode === 'close' ? F.springCurve(0.16, 0.92) : F.springCurve(0.34, 0.66);
      const sL = mode ? even : right ? lag : lead;
      const sR = mode ? even : right ? lead : lag;
      if (F.reduced()) { L = b.l; R = b.r; T = b.t; B = b.b; paint(); return; }
      const t0 = performance.now(), kk = F.k();
      const end = Math.max(sL.duration, sR.duration, vert.duration);
      stop = ctx.loop(() => {
        const t = (performance.now() - t0) / kk;
        L = a.L + (b.l - a.L) * springAt(sL, t);
        R = a.R + (b.r - a.R) * springAt(sR, t);
        if (mode !== 'close') R = Math.max(R, L + 12);
        T = a.T + (b.t - a.T) * springAt(vert, t);
        B = a.B + (b.b - a.B) * springAt(vert, t);
        paint();
        if (t >= end) { stop(); stop = null; }
      });
    };
    const mark = (i) => words.forEach((w, j) => {
      w.classList.toggle('is-heard', j < i);
      w.classList.toggle('is-now', j === i);
    });
    el.light = (i) => {
      const b = boxOf(i);
      mark(i);
      if (!open) {
        const c = (b.l + b.r) / 2;
        L = R = c; T = b.t; B = b.b;
        open = true;
        go(b, 'open');
      } else if (Math.abs(b.t - T) > 6) {
        // A new line: the pill closes into the last word's end, then opens from the next word's start.
        go({ l: R, r: R, t: T, b: B }, 'close');
        ctx.at(160, () => { L = R = b.l; T = b.t; B = b.b; go(b); });
      } else go(b);
    };
    /** Every word heard: all of them full colour, the pill closes into its last word. */
    el.finish = () => {
      words.forEach((w) => { w.classList.add('is-heard'); w.classList.remove('is-now'); });
      const c = (L + R) / 2;
      go({ l: c, r: c, t: T, b: B }, 'close');
      open = false;
    };
    /** Let go early: the pill closes where it is; the words already said stay lit. */
    el.rest = () => {
      if (!open) return;
      const c = (L + R) / 2;
      go({ l: c, r: c, t: T, b: B }, 'close');
      words.forEach((w) => w.classList.remove('is-now'));
      open = false;
    };
    return el;
  };

  /**
   * The mic: a milk button with a lip. Under the finger it squashes from its base and keeps its
   * volume (1.06 wide, 0.92 tall), the haptic on the deepest point; while a voice is heard two flat
   * rings follow the level; let go and it springs back (0.34 / 0.6).
   */
  const micPart = (ctx, size = 128) => {
    const r1 = h('i.pa-ring'), r2 = h('i.pa-ring.is-out');
    const btn = h('button.pa-mic', { type: 'button', 'aria-label': 'Hold to speak' }, F.icon('mic', { size: Math.round(size * 0.34), stroke: 2.3 }));
    const el = h('div.pa-mic-wrap', { style: { width: size + 'px', height: size + 'px' } }, r2, r1, btn);
    el.btn = btn;
    let level = 0, target = 0, live = false, stop = null, t = 0, wait = null;
    const run = () => {
      if (stop || F.reduced()) return;
      stop = ctx.loop((dt) => {
        t += dt;
        level += (target - level) * (1 - Math.exp(-dt / 70));
        const a = Math.max(0, level * (0.8 + 0.2 * Math.sin(t / 57) * Math.sin(t / 23 + 1)));
        r1.style.transform = `scale(${(1.08 + a * 0.22).toFixed(3)})`;
        r2.style.transform = `scale(${(1.17 + a * 0.36).toFixed(3)})`;
        if (!live && level < 0.01) { stop(); stop = null; }
      });
    };
    el.level = (v) => { target = v; run(); };
    /** Waiting for a finger: the mic breathes (1 → 1.035), and stops the moment it is touched. */
    el.invite = () => {
      if (wait || F.reduced()) return;
      wait = play(ctx, btn, [{ scale: '1' }, { scale: '1.035' }], { duration: 1400, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', fill: 'none' });
    };
    el.down = () => {
      live = true;
      if (wait) { wait.cancel(); wait = null; }
      el.classList.add('is-live');
      btn.classList.add('is-live');
      F.move(btn, { sx: 1, sy: 1 }, { sx: 1.06, sy: 0.92 }, { duration: 90, curve: 'strong', ctx, fill: 'forwards' });
      ctx.at(90, () => ctx.haptic('light'));
      el.level(0.25);
    };
    el.up = () => {
      live = false;
      el.classList.remove('is-live');
      btn.classList.remove('is-live');
      F.move(btn, { sx: 1.06, sy: 0.92 }, { sx: 1, sy: 1 }, { spring: { response: 0.34, damping: 0.6 }, ctx, fill: 'forwards' });
      el.level(0);
    };
    return el;
  };

  /**
   * Hold to speak. While the finger stays on the mic, the voice lights the phrase a word at a
   * time, at the pace each word is said. Let go after the last word and it has been heard.
   * o: {ready(), onDown(), onDone()}
   */
  const holdToSpeak = (ctx, mic, ph, o = {}) => {
    let held = false, heard = 0, timer = null, done = false;
    const N = ph.words.length;
    const say = () => {
      timer = null;
      if (!held || heard >= N) return;
      ph.light(heard);
      mic.level(0.7 + 0.3 * (SAID[heard] / 500));
      ctx.haptic('selection');
      const dur = SAID[heard];
      heard += 1;
      timer = ctx.at(dur, () => {
        mic.level(0.18);
        timer = heard < N ? ctx.at(80, say) : null;
      });
    };
    const down = () => {
      if (done || held || (o.ready && !o.ready())) return;
      held = true;
      mic.down();
      o.onDown && o.onDown();
      timer = ctx.at(280, say);
    };
    const up = () => {
      if (!held) return;
      held = false;
      if (timer) { clearTimeout(timer); timer = null; }
      mic.up();
      if (heard >= N) {
        done = true;
        ph.finish();
        o.onDone && o.onDone();
      } else ph.rest();
    };
    ctx.on(mic.btn, 'pointerdown', down);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => ctx.on(mic.btn, ev, up));
  };
  /** The demo finger that holds: lands on the element, presses for `hold` ms, lifts. */
  const holdOn = (ctx, el, hold) => {
    const p = F.pos(el, ctx.root);
    F.touch(ctx, ctx.root, p.cx, p.cy + 6, { hold });
    ctx.at(300, () => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    ctx.at(420 + hold, () => el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })));
  };
  /** How long a hold takes to say the whole phrase, and a breath after it. */
  const HOLD = 280 + SAID.reduce((a, b) => a + b, 0) + 80 * (SAID.length - 1) + 260;

  /** Continue to cancel and its twins: a full outline button, in the same place on every screen. */
  const leave = (ctx, label = 'Continue to cancel', onTap = () => ctx.next()) => {
    const b = h('button.pa-out', { type: 'button' }, label);
    F.press(ctx, b, { onTap });
    return b;
  };
  /** The leaving screens' top: back, and what this is. */
  const top = (ctx, title = 'Cancel Parla Plus') => {
    const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22, stroke: 2.4 }));
    F.press(ctx, back, { row: true });
    return h('div.pa-top', { 'data-keep': '' }, back, h('b', title), h('span'));
  };
  const lesson = () => h('span.pa-chip', { 'data-keep': '' }, F.icon('coffee', { size: 15, stroke: 2.4 }), 'Lesson 1 · At the bar');

  /** The lesson card: the phrase, how it sounds, what it means, a button to hear it. */
  const card = (ctx, o = {}) => {
    const ph = phrase(ctx, { read: o.read });
    const eq = h('span.pa-eq', h('i'), h('i'), h('i'));
    const hear = h('button.pa-hear', { type: 'button', 'aria-label': 'Hear it' }, F.icon('volume-2', { size: 21, stroke: 2.3 }), eq);
    const perf = h('span.pa-perf', F.icon('check', { size: 16, stroke: 3.2 }), 'Perfetto.');
    const el = h('div.pa-card', { 'data-keep': '' }, ph, h('p.pa-sounds', SOUNDS), h('div.pa-card-foot', h('p.pa-en', EN), hear), perf);
    el.ph = ph;
    el.hear = hear;
    el.perf = perf;
    let playing = false;
    F.press(ctx, hear, { onTap: () => {
      if (playing) return;
      playing = true;
      ctx.haptic('light');
      hear.classList.add('is-playing');
      [...eq.children].forEach((b, i) => play(ctx, b, [{ transform: 'scaleY(0.3)' }, { transform: 'scaleY(1)' }], { duration: 260 + i * 70, iterations: 7, direction: 'alternate', easing: 'ease-in-out', fill: 'none' }));
      ctx.at(1900, () => { hear.classList.remove('is-playing'); playing = false; });
    } });
    return el;
  };

  // ---------------------------------------------------------------- the opening: say it out loud

  F.def({
    id: 'parla-open', section: 'parla-open', style: 'bubbly', flow: true, name: 'Say it out loud', loop: 12400, seqHold: 11600,
    intent: 'One stage, Tazza on it from the first frame to the last. Tazza pops in and says ciao; the tiles other apps make you tap fall away and a mic pops up in their place; a finger holds the mic and the phrase lights word by word as it is said; Tazza cheers once; only then the button.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla pa-open', tone: 'light' });
      // The heading keeps its lines: each beat's line breaks where it is read (white-space: pre-line).
      const title = h('h1.pa-h.pa-open-h', F.rich('Italian you *say,*\nnot tap.'));
      const tz = tazza(ctx, 'hello', 176);
      const bub = bubble(ctx);
      tz.append(bub);
      const cam = h('div.pa-open-tz', tz);
      const tiles = ['caffè,', 'per', 'Vorrei', 'favore.', 'un'].map((w) => h('span.pa-tile', w));
      const bank = h('div.pa-tiles', tiles);
      const ph = phrase(ctx);
      const speech = h('div.pa-speech', ph, h('p.pa-speech-en', EN));
      const mic = micPart(ctx, 120);
      mic.style.transformOrigin = '50% 100%';
      const hint = h('p.pa-open-hint', 'Hold the mic and say it');
      const cta = F.primary(ctx, 'Start speaking');
      const foot = h('div.pa-open-foot', cta);
      body.append(title, cam, bank, speech, h('div.pa-open-mic', mic), hint, foot);
      [title, bank, speech, mic, hint, foot].forEach((el) => (el.style.visibility = 'hidden'));
      const show = (el) => (el.style.visibility = '');

      // Beat 1: Tazza alone, big and low; it pops up from its saucer and says ciao.
      const B1 = { y: 126, s: 1.42 };
      cam.style.transform = F.tf(B1);
      F.move(tz, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.5, damping: 0.6 }, delay: 60, ctx, fill: 'backwards' });
      ctx.at(300, () => ctx.haptic('light'));
      bub.show('Ciao.', 700);

      // Beat 2: the camera settles Tazza into its place; the idea; the tiles other apps make you tap.
      ctx.at(1950, () => {
        bub.hide();
        F.move(cam, B1, { y: 0, s: 1 }, { duration: 760, curve: 'inout', ctx, fill: 'forwards' });
      });
      ctx.at(2200, () => { show(title); F.titleIn(ctx, title); });
      ctx.at(2420, () => { show(bank); F.rise(ctx, tiles, { stagger: 55 }); });
      // They fall away; the same words come back as one sentence, to say; the mic pops up under it.
      ctx.at(3420, () => tiles.forEach((t, i) => play(ctx, t, [
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(74px) rotate(${[-11, 8, -6, 12, -8][i]}deg)`, opacity: 0 },
      ], { duration: 320, delay: i * 40, easing: F.css('exit'), fill: 'forwards' })));
      ctx.at(3920, () => { bank.style.visibility = 'hidden'; show(speech); F.rise(ctx, speech); });
      ctx.at(4220, () => { show(mic); F.pop(ctx, mic); ctx.at(180, () => ctx.haptic('light')); });

      // Beat 3: Tazza listens; the mic waits for a finger.
      let ready = false;
      ctx.at(4640, () => {
        tz.set('listen');
        ready = true;
        if (ctx.mode === 'flow') { show(hint); F.rise(ctx, hint); mic.invite(); }
      });
      holdToSpeak(ctx, mic, ph, {
        ready: () => ready,
        onDown: () => { if (ctx.mode === 'flow') F.exit(ctx, hint); },
        // Beat 4: Tazza cheers, once; then beat 5: the last line, and only now the button.
        onDone: () => {
          hop(ctx, tz, { delay: 60, pose: 'cheer', land: () => bub.show('Perfetto.', 40), bob: false });
          ctx.at(1500, () => {
            F.swapText(ctx, title, 'A phrase a day,\n*out loud.*');
            bub.hide(60);
          });
          ctx.at(1700, () => { tz.set('hello'); show(foot); F.rise(ctx, cta, { delay: 120 }); });
          ctx.at(2500, () => tz.bob());
        },
      });
      if (ctx.mode !== 'flow') ctx.at(5080, () => holdOn(ctx, mic.btn, HOLD));
    },
  });

  // ---------------------------------------------------------------- the microphone · 1 · the phrase first

  F.def({
    id: 'parla-first', section: 'parla-permission', style: 'bubbly', flow: true, name: 'Your first phrase', loop: 5800, seqHold: 5000,
    intent: 'The phrase comes before any ask: the words, how they sound, what they mean, and Tazza listening. By the time the microphone is mentioned, its reason is already on the screen. The button names what the mic is for.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const chip = lesson();
      const title = h('h1.pa-h', F.rich('Order a *coffee.*'));
      const c = card(ctx, { read: true });
      // Tazza sits on the card like a cup on the counter, listening.
      const tz = tazza(ctx, 'listen', 244);
      const cta = F.primary(ctx, 'Say it out loud', { icon: F.icon('mic', { size: 20, stroke: 2.5 }) });
      body.append(chip, title, h('div.ph-fill'), h('div.pa-first-tz', tz), c, h('div.ph-fill.is-more'), h('div.ph-foot', cta));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [chip, c, cta], { delay: 140 });
      // Tazza pops up from its saucer (the screen's one lively moment), then waits.
      popUp(ctx, tz, 380);
      ctx.at(1150, () => tz.bob());
      if (ctx.mode !== 'flow') {
        ctx.at(1700, () => F.tapEl(ctx, c.hear));
        ctx.at(4200, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- 2 · asked in context

  F.def({
    id: 'parla-mic', section: 'parla-permission', style: 'bubbly', flow: true, name: 'Asked in context', loop: 10200, seqHold: 9400,
    intent: 'The card glides up from under Tazza; the mic takes Tazza’s place, with one line on what it hears and never keeps. Continue opens the real system alert, Parla’s sentence as its purpose string (a No leads to Settings, never a second ask). Then the mic squashes under the finger, a pill travels word to word as each is said, one Perfetto. lands on the card, and it moves on.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const kept = ctx.via === 'step'; // arriving from the phrase: the chip and the card never moved
      const chip = lesson();
      const title = h('h1.pa-h', F.rich('Say it *out loud.*'));
      const c = card(ctx, { read: kept });
      const mic = micPart(ctx, 132);
      const PROMISE = 'Parla listens only while you hold the mic. Nothing is recorded.';
      const promise = h('p.pa-promise', PROMISE);
      // iOS asks once. After a no, only Settings can turn the mic on, so the screen says so.
      let denied = false;
      // The button leads to Apple's alert, where the decision is made; App Review rejects a custom
      // button that says Allow before it, so it says Continue and the line above says why.
      const cta = F.primary(ctx, 'Continue', { icon: F.icon('mic', { size: 20, stroke: 2.5 }), onTap: () => (denied ? grant() : ask()) });
      const hint = h('p.pa-hint', 'Hold the mic and say it');
      hint.hidden = true;
      body.append(chip, title, c, h('div.pa-mic-stage', mic), promise, h('div.ph-fill'), h('div.ph-foot', cta, hint));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, kept ? [mic, promise, cta] : [chip, c, mic, promise, cta], { delay: 140 });
      if (kept) {
        // The same card glides up from where it sat under Tazza (one element, one move: the baton),
        // and its words step back to wait for a voice.
        const old = [...ctx.root.parentNode.children].find((p) => p !== ctx.root && p.dataset.screen === 'parla-first');
        const was = old && old.querySelector('.pa-card');
        if (was) {
          const dy = F.pos(was, old).y - F.pos(c, ctx.root).y;
          if (Math.abs(dy) > 1) F.move(c, { y: dy }, { y: 0 }, { duration: 720, curve: 'emph', ctx, fill: 'backwards' });
        }
        ctx.at(560, () => c.ph.classList.remove('is-read'));
      }

      let allowed = false;
      const grant = () => {
        allowed = true;
        ctx.haptic('success');
        if (denied) F.swapText(ctx, promise, PROMISE);
        F.exit(ctx, cta);
        ctx.at(170, () => {
          cta.hidden = true;
          hint.hidden = false;
          F.rise(ctx, hint);
          mic.invite();
        });
      };
      const ask = () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Parla” Would Like to Access the Microphone',
          message: 'Parla listens while you hold the mic, so you can practise speaking. Nothing is recorded or saved.',
          buttons: [{ label: 'Don’t Allow', onTap: () => {
            al.close();
            denied = true;
            F.swapText(ctx, promise, 'Turn the mic on in Settings, then come back to say it.', 120);
            F.swapText(ctx, cta.querySelector('span'), 'Open Settings', 160);
          } }, { label: 'Allow', bold: true, onTap: () => { al.close(); grant(); } }],
        });
        if (ctx.mode !== 'flow') ctx.at(1500, () => F.tapEl(ctx, al.buttons[1]));
      };
      holdToSpeak(ctx, mic, c.ph, {
        ready: () => allowed,
        onDone: () => {
          // The one reward of the screen: the sticker lands on the card, lively (0.45 / 0.55).
          ctx.at(140, () => {
            c.perf.style.visibility = 'visible';
            F.move(c.perf, { s: 0.5, o: 0, r: -14 }, { s: 1, o: 1, r: -4 }, { spring: { response: 0.45, damping: 0.55 }, ctx, fill: 'both' });
            ctx.haptic('success');
          });
          F.swapText(ctx, hint, 'Heard, word for word.', 200);
          ctx.at(1500, () => ctx.next());
        },
      });
      if (ctx.mode !== 'flow') {
        ctx.at(1500, () => F.tapEl(ctx, cta));
        ctx.at(4500, () => holdOn(ctx, mic.btn, HOLD));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · day one

  F.def({
    id: 'parla-streak', section: 'parla-permission', style: 'bubbly', flow: true, name: 'Day one', loop: 7600, seqHold: 6800,
    intent: 'Tazza cheers, once, and today fills on the week ahead. The reminder is asked for here, with the streak on screen and the notification it will send, at the time they practise; then Apple’s own alert, in its fixed words.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const time = ctx.answers.parlaTime || '8:30';
      const tz = tazza(ctx, 'hello', 212);
      const title = h('h1.pa-h.pa-center.pa-day-h', F.rich('Day *one.*'));
      const sub = h('p.pa-body.pa-day-sub', 'Your first phrase, said out loud.');
      const dots = [];
      const week = h('div.pa-week', Array.from({ length: 7 }, (_, i) => {
        const dot = h('i', i ? null : F.icon('check', { size: 19, stroke: 3.2 }));
        dots.push(dot);
        return h('div.pa-day' + (i ? '' : '.is-today'), dot, h('small', i ? X.weekday(X.day(i)).slice(0, 3) : 'Today'));
      }));
      const note = h('div.pa-note', X.appIcon('parla', 38),
        h('div.pa-note-text', h('div.pa-note-top', h('b', 'Day two'), h('small', `${time} AM`)), h('p', 'Tazza has your next phrase ready.')));
      let denied = false;
      const cta = F.primary(ctx, `Remind me at ${time}`, { icon: F.icon('bell', { size: 19, stroke: 2.5 }), onTap: () => (denied ? ctx.next() : ask()) });
      const later = h('button.pa-later', { type: 'button' }, 'Not now');
      F.press(ctx, later, { onTap: () => ctx.next() });
      // The day on top; at the bottom, the ask with what it will send.
      body.append(h('div.ph-fill.is-less'), h('div.pa-streak-tz', tz), title, sub, week, h('div.ph-fill'), note, h('div.ph-foot', cta, later));

      // Tazza arrives and cheers, once; today's bubble fills as it lands.
      settle(ctx, tz, 60);
      hop(ctx, tz, { delay: 420, pose: 'cheer', land: () => { dots[0].parentNode.classList.add('is-on'); F.pop(ctx, dots[0]); } });
      F.titleIn(ctx, title, { delay: 260 });
      F.rise(ctx, [sub, week, note, cta, later], { delay: 380 });
      ctx.at(2300, () => tz.set('hello'));

      const ask = () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Parla” Would Like to Send You Notifications',
          message: 'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
          buttons: [{ label: 'Don’t Allow', onTap: () => {
            // No reminder, no second ask: the button simply carries on.
            al.close();
            denied = true;
            const bell = cta.querySelector('.ic');
            F.exit(ctx, [bell, later]);
            F.swapText(ctx, cta.querySelector('span'), 'Continue', 160);
            ctx.at(330, () => (bell.style.display = 'none'));
          } }, { label: 'Allow', bold: true, onTap: () => {
            al.close();
            ctx.haptic('success');
            F.swapText(ctx, cta.querySelector('span'), `Every day at ${time}`, 160);
            ctx.at(1300, () => ctx.next());
          } }],
        });
        if (ctx.mode !== 'flow') ctx.at(1400, () => F.tapEl(ctx, al.buttons[1]));
      };
      if (ctx.mode !== 'flow') ctx.at(2900, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- leaving · 1 · one question

  const REASONS = [
    { id: 'break', icon: 'luggage', label: 'I’m taking a break' },
    { id: 'budget', icon: 'wallet', label: 'It doesn’t fit my budget right now' },
    { id: 'another', icon: 'graduation-cap', label: 'I’m learning another way' },
    { id: 'broken', icon: 'wrench', label: 'Something didn’t work for me' },
  ];
  const base = { section: 'parla-leaving', style: 'bubbly', flow: true };

  F.def({
    ...base, id: 'parla-why', name: 'One question', loop: 5200, seqHold: 4200,
    intent: 'One question in Parla’s own words: four answers, no Other. A tap answers it and the screen moves on. Skip, just cancel sits where Continue to cancel will be on the next screen.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const title = h('h1.pa-h', F.rich('Before you go, *what’s changing?*'));
      const sub = h('p.pa-sub', `Your ${PHRASES} phrases stay, whatever you pick.`);
      const rows = REASONS.map((r) => F.answer(ctx, { label: r.label, icon: r.icon, onTap: (row) => {
        rows.forEach((x) => x !== row && x.classList.remove('is-on'));
        F.picked(ctx, row, true);
        ctx.answers.parlaWhy = r.id;
        ctx.at(F.T.pick.advance, () => ctx.next());
      } }));
      // Skip goes straight to the end: the goodbye (the App Store sheet comes from it).
      const skip = leave(ctx, 'Skip, just cancel', () => ctx.next({ to: 'parla-bye' }));
      body.append(top(ctx), title, sub, h('div.pa-list', rows), h('div.ph-fill'), h('div.ph-foot', skip));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, sub, { delay: 150 });
      F.rise(ctx, [...rows, skip], { delay: 220 });
      if (ctx.mode !== 'flow') ctx.at(2200, () => F.tapEl(ctx, rows[0]));
    },
  });

  // ---------------------------------------------------------------- 2 · a break, the honest version

  F.def({
    ...base, id: 'parla-break', name: 'A break', loop: 7000, seqHold: 6200,
    intent: 'The App Store can’t pause a plan, so the honest version: renewal off today, a reminder on the day they pick, every phrase kept. One, two or three months, each with the date they’re back; the timeline follows the pick. Continue to cancel is a full button under the offer.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const tz = tazza(ctx, 'sleep', 150);
      const title = h('h1.pa-h.pa-center', F.rich('Take a break, *keep your Italian.*'));
      let pick = 2;
      const when = h('b', X.short(months(pick)));
      const keep = F.primary(ctx, `Take a ${pick}-month break`, { onTap: () => { ctx.answers.parlaBreak = pick; ctx.answers.parlaLeave = 'break'; ctx.next(); } });
      const choose = (n) => {
        if (n === pick) return;
        pick = n;
        ctx.answers.parlaBreak = n;
        cards.forEach((c, i) => c.classList.toggle('is-on', i + 1 === n));
        F.setValue(ctx, when, X.short(months(n)));
        F.swapText(ctx, keep.querySelector('span'), `Take a ${n}-month break`, 40);
        ctx.haptic('selection');
      };
      const cards = [1, 2, 3].map((n) => {
        const c = h('button.pa-month' + (n === pick ? '.is-on' : ''), { type: 'button' }, h('b', String(n)), h('span', n === 1 ? 'month' : 'months'), h('small', `Back ${X.short(months(n))}`));
        F.press(ctx, c, { onTap: () => choose(n) });
        return c;
      });
      const step = (icon, head, text) => h('div.pa-step', h('span.pa-step-ic', icon), head, h('small', text));
      const steps = h('div.pa-steps',
        step(F.icon('bell-off', { size: 20, stroke: 2.3 }), h('b', 'Today'), 'Renewal off'), h('i.pa-link'),
        step(F.icon('bell', { size: 20, stroke: 2.3 }), when, 'We remind you'), h('i.pa-link'),
        step(F.icon('mic', { size: 20, stroke: 2.3 }), h('b', 'Back'), `with your ${PHRASES} phrases`));
      const out = leave(ctx, 'Continue to cancel', () => { ctx.answers.parlaLeave = 'cancel'; ctx.next(); });
      body.append(top(ctx), h('div.pa-break-tz', tz), title, h('div.pa-months', cards), steps, h('div.ph-fill'), h('div.ph-foot', keep, out));
      settle(ctx, tz, 100);
      ctx.at(900, () => play(ctx, tz, [{ scale: '1 1' }, { scale: '1.025 0.985' }], { duration: 1700, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', fill: 'none' }));
      F.titleIn(ctx, title, { delay: 160 });
      F.rise(ctx, [cards[0].parentNode, steps, keep, out], { delay: 260 });
      if (ctx.mode !== 'flow') {
        ctx.at(1900, () => F.tapEl(ctx, cards[2]));
        ctx.at(3200, () => F.tapEl(ctx, cards[1]));
        ctx.at(4700, () => F.tapEl(ctx, keep));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · ci vediamo

  F.def({
    ...base, id: 'parla-bye', name: 'Ci vediamo', loop: 6200, seqHold: 5200,
    intent: 'A goodbye that sounds like Parla: their name, the exact day Plus ends, no more charges, the phrases and the best streak that stay, and one tap to keep Plus. Tazza waves once, suitcase in hand.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const tz = tazza(ctx, 'wave', 196);
      const title = h('h1.pa-h.pa-center', F.rich(`Ci vediamo, *${NAME}.*`));
      const p1 = h('p.pa-body', h('span.pa-ln', `Parla Plus ends on ${X.long(ENDS())}.`), h('span.pa-ln', 'You won’t be charged again.'));
      const p2 = h('p.pa-body', `Your ${PHRASES} phrases and your ${BEST}-day best streak stay.`);
      // A break promised a reminder on the day they picked; a plain cancel promised nothing.
      const onBreak = ctx.answers.parlaLeave !== 'cancel';
      const remind = onBreak ? h('span.pa-remind', F.icon('bell', { size: 16, stroke: 2.4 }), `We’ll remind you on ${X.short(months(ctx.answers.parlaBreak || 2))}`) : null;
      const done = F.primary(ctx, 'Done');
      const undo = leave(ctx, 'Keep Parla Plus');
      body.append(h('div.pa-bye-tz', tz), title, p1, p2, remind && h('div.pa-remind-row', remind), h('div.ph-fill'), h('div.ph-foot', done, undo));
      settle(ctx, tz, 80);
      // The wave, once: Tazza rocks on its saucer like a hand waving, then settles and bobs.
      ctx.at(620, () => play(ctx, tz.inner, [
        { rotate: '0deg' }, { rotate: '-7deg', offset: 0.18 }, { rotate: '6deg', offset: 0.42 },
        { rotate: '-4deg', offset: 0.64 }, { rotate: '2deg', offset: 0.84 }, { rotate: '0deg' },
      ], { duration: 1150, easing: 'ease-in-out', fill: 'none' }));
      ctx.at(1900, () => tz.bob());
      F.titleIn(ctx, title, { delay: 380 });
      F.rise(ctx, [p1, p2, remind, done, undo].filter(Boolean), { delay: 520 });
    },
  });
})();
