/* Motion styles: seven personalities for one engine (the motion-styles skill).
 *
 * A screen picks one with F.def({ style: 'calm', ... }). Then F.rise, F.titleIn, F.pop, F.press,
 * F.swapText, F.setValue and F.idle move in that style, and the screen is entered with the
 * style's transition unless it names its own `enter`. A screen with no style keeps the engine's
 * defaults, so nothing changes for screens written before styles existed.
 *
 *   calm       nothing hurries               sleep, meditation, health, journaling
 *   snappy     every move lands on the beat  fitness, sport, games, music
 *   bubbly     soft, round, alive            language, kids, habits, social
 *   precise    measured, like a ledger       money, productivity, tools
 *   fluid      one shape becomes the next    diet, health tracking, utilities
 *   cinematic  a camera, not a cursor        food, travel, reading, fashion
 *   organic    things grow                   plants, gardening, wellbeing, nature
 *
 * Only transform, opacity, blur and clip move, so each style has a native twin
 * (skills/motion-styles/references/styles.md). Loops use the separate scale, translate and rotate
 * properties, so an idle loop never fights an entrance or a press on the same element.
 */
(() => {
  'use strict';
  const F = window.F;

  Object.assign(F.CURVES, {
    calm: [0.37, 0, 0.63, 1], // sine in-out: nothing hurries
    standard: [0.4, 0, 0.2, 1], // measured, no overshoot
    cine: [0.65, 0, 0.35, 1], // cubic in-out: a camera move
    grow: [0.33, 1, 0.68, 1], // cubic out: growth that settles
    snap: [0.15, 0.95, 0.25, 1], // very fast out: lands hard
  });

  F.STYLES = {
    calm: {
      name: 'Calm', feel: 'Nothing hurries.', use: 'Sleep, meditation, health, journaling',
      tokens: '900 ms · sine in-out · no springs · a slow fade between screens',
      reel: { response: 0.9, damping: 1 },
      enter: 'fade', idle: 'breathe',
      content: { from: { y: 6, o: 0, blur: 6 }, ms: 900, stagger: 120, curve: 'calm' },
      title: { from: { y: 4, o: 0, blur: 10 }, ms: 1100, curve: 'calm' },
      out: { to: { o: 0, blur: 8 }, ms: 520, curve: 'calm' },
      pop: { from: { s: 0.96, o: 0 }, ms: 700, curve: 'calm' },
      press: { to: { s: 0.985, o: 0.8 }, inMs: 160, outMs: 480, curve: 'calm' },
      swap: { out: { o: 0, blur: 8 }, outMs: 480, in: { o: 0, blur: 8 }, inMs: 900, curve: 'calm' },
    },
    snappy: {
      name: 'Snappy', feel: 'Every move lands on the beat.', use: 'Fitness, sport, games, music',
      tokens: '120–340 ms · stiff springs · type that slams · a hard push',
      reel: { response: 0.34, damping: 0.8 },
      enter: 'push', push: { ms: 340, curve: 'snap', parallax: 0.25 }, idle: 'pulse',
      content: { from: { y: 28, o: 0 }, spring: { response: 0.3, damping: 0.82 }, stagger: 35 },
      title: { from: { s: 1.16, y: -4, o: 0 }, spring: { response: 0.26, damping: 0.7 } },
      out: { to: { y: 16, o: 0 }, ms: 120, curve: 'exit' },
      pop: { from: { s: 1.4, o: 0 }, spring: { response: 0.24, damping: 0.72 } },
      press: { to: { s: 0.93, y: 1 }, inMs: 60, spring: { response: 0.22, damping: 0.6 } },
      swap: { out: { y: 16, o: 0 }, outMs: 110, in: { y: -20, o: 0 }, spring: { response: 0.26, damping: 0.75 } },
    },
    bubbly: {
      name: 'Bubbly', feel: 'Soft, round, alive.', use: 'Language, kids, habits, social',
      tokens: 'springs 0.38 / 0.62 · squash and stretch · pops from the source',
      enter: 'step', idle: 'bob',
      content: { from: { y: 10, o: 0 }, ms: 460, stagger: 55, curve: 'decel' },
      title: null,
      out: { to: { s: 0.9, o: 0 }, ms: 160, curve: 'exit' },
      pop: { from: { s: 0.5, o: 0 }, spring: { response: 0.38, damping: 0.62 } },
      press: { to: { sx: 1.06, sy: 0.92 }, origin: '50% 100%', inMs: 90, spring: { response: 0.34, damping: 0.6 } },
      swap: { out: { s: 0.8, o: 0 }, outMs: 150, in: { s: 0.6, o: 0 }, spring: { response: 0.38, damping: 0.62 } },
    },
    precise: {
      name: 'Precise', feel: 'Measured, like a ledger.', use: 'Money, productivity, tools',
      tokens: '180–460 ms · standard curve · wipes · numbers roll · no overshoot',
      reel: { response: 0.5, damping: 1, blur: false },
      enter: 'push', push: { ms: 460, curve: 'standard', parallax: 0.3 }, idle: null, value: 'roll',
      content: { wipe: true, from: { x: 10 }, ms: 360, stagger: 45, curve: 'standard' },
      title: { wipe: true, from: { x: 6 }, ms: 420, curve: 'standard' },
      out: { to: { x: -8, o: 0 }, ms: 180, curve: 'exit' },
      pop: { from: { s: 0.9, o: 0 }, ms: 220, curve: 'standard' },
      press: { to: { s: 0.98 }, inMs: 80, outMs: 180, curve: 'standard' },
      swap: { wipe: true, outMs: 200, inMs: 340, curve: 'standard' },
    },
    fluid: {
      name: 'Fluid', feel: 'One shape becomes the next.', use: 'Diet, health tracking, utilities',
      tokens: '640–760 ms · emphasised curve · shared elements · soft springs',
      reel: { response: 0.6, damping: 0.85 },
      enter: 'carry', idle: 'wave',
      content: { from: { y: 22, s: 0.98, o: 0, blur: 4 }, ms: 680, stagger: 60, curve: 'emph' },
      title: { from: { y: 16, o: 0, blur: 10 }, ms: 760, curve: 'emph' },
      out: { to: { y: -10, o: 0, blur: 6 }, ms: 280, curve: 'exit' },
      pop: { from: { s: 0.7, o: 0, blur: 8 }, spring: { response: 0.5, damping: 0.78 } },
      press: { to: { s: 0.96 }, inMs: 120, spring: { response: 0.42, damping: 0.75 } },
      swap: { out: { y: -10, o: 0, blur: 8 }, outMs: 260, in: { y: 14, o: 0, blur: 10 }, inMs: 640, curve: 'emph' },
    },
    cinematic: {
      name: 'Cinematic', feel: 'A camera, not a cursor.', use: 'Food, travel, reading, fashion',
      tokens: '760–1100 ms · cubic in-out · lines rise from masks · an iris between screens',
      reel: { response: 0.8, damping: 1 },
      enter: 'iris', idle: 'drift',
      content: { curtain: true, from: { y: 24, s: 1.04 }, ms: 900, stagger: 130, curve: 'cine' },
      title: { lines: true, ms: 900, stagger: 90, curve: 'cine' },
      out: { to: { o: 0 }, ms: 360, curve: 'exit' },
      pop: { from: { s: 1.08, o: 0 }, ms: 900, curve: 'cine' },
      press: { to: { s: 0.97 }, inMs: 120, outMs: 420, curve: 'cine' },
      swap: { mask: true, outMs: 420, inMs: 760, curve: 'cine' },
    },
    organic: {
      name: 'Organic', feel: 'Things grow.', use: 'Plants, gardening, wellbeing, nature',
      tokens: '640–760 ms · cubic out · sprouts from the base · a gentle sway',
      reel: { response: 0.6, damping: 0.85 },
      enter: 'grow', idle: 'sway',
      content: { from: { y: 12, s: 0.96, r: -1.5, o: 0 }, ms: 680, stagger: 80, curve: 'grow' },
      title: { from: { y: 10, o: 0, blur: 4 }, ms: 720, curve: 'grow' },
      out: { to: { y: -6, o: 0 }, ms: 260, curve: 'exit' },
      pop: { from: { s: 0.4, o: 0 }, origin: '50% 100%', spring: { response: 0.5, damping: 0.7 } },
      press: { to: { s: 0.95, r: -1 }, inMs: 110, spring: { response: 0.4, damping: 0.68 } },
      swap: { out: { y: -6, o: 0 }, outMs: 240, in: { y: 10, s: 0.96, r: -1, o: 0 }, inMs: 640, curve: 'grow' },
    },
  };

  /** The style a screen moves in, or null for the engine's defaults. */
  F.styleOf = (ctx) => (ctx && ctx.style && F.STYLES[ctx.style]) || null;
  /** How a screen is entered: its own `enter`, else its style's, else a step. */
  F.enterOf = (screen) => (screen && (screen.enter || (screen.style && F.STYLES[screen.style] && F.STYLES[screen.style].enter))) || 'step';

  const base = { rise: F.rise, titleIn: F.titleIn, pop: F.pop, press: F.press, swapText: F.swapText };
  const REST = { x: 0, y: 0, r: 0, blur: 0, s: 1, sx: 1, sy: 1, o: 1 };
  const rest = (pose) => Object.fromEntries(Object.keys(pose).map((k) => [k, REST[k] ?? 0]));
  const timing = (spec, extra) => (spec.spring ? { spring: spec.spring, ...extra } : { duration: spec.ms, curve: spec.curve, ...extra });
  const ms = (v) => (F.reduced() ? 1 : v * F.k());

  /** A pose arriving at rest. */
  const moveIn = (ctx, el, spec, delay) => F.move(el, spec.from, rest(spec.from), timing(spec, { delay, fill: 'backwards', ctx }));
  /** Precise: revealed left to right by a clip, sliding the last few points. */
  const wipeIn = (ctx, el, spec, delay) => ctx.track(el.animate([
    { clipPath: 'inset(-24px 100% -24px -24px)', transform: `translateX(${(spec.from && spec.from.x) || 0}px)` },
    { clipPath: 'inset(-24px -24px -24px -24px)', transform: 'none' },
  ], { duration: ms(spec.ms), delay: ms(delay), easing: F.css(spec.curve), fill: 'backwards' }));
  /** Cinematic: a block revealed from the bottom up while the camera settles on it. */
  const curtainIn = (ctx, el, spec, delay) => ctx.track(el.animate([
    { clipPath: 'inset(100% -24px -24px -24px)', transform: `translateY(${spec.from.y}px) scale(${spec.from.s})` },
    { clipPath: 'inset(-24px -24px -24px -24px)', transform: 'none' },
  ], { duration: ms(spec.ms), delay: ms(delay), easing: F.css(spec.curve), fill: 'backwards' }));
  /** Cinematic: a line rises out of a mask whose edge stays fixed at the line's foot. */
  const maskUp = (ctx, el, spec, delay) => {
    const hgt = el.offsetHeight || 40;
    return ctx.track(el.animate([
      { transform: `translateY(${hgt}px)`, clipPath: `inset(-12px -24px ${hgt}px -24px)` },
      { transform: 'translateY(0px)', clipPath: 'inset(-12px -24px -12px -24px)' },
    ], { duration: ms(spec.ms), delay: ms(delay), easing: F.css(spec.curve), fill: 'backwards' }));
  };

  /**
   * Split a heading into lines (after fonts load), keeping its accents, so each line can move on
   * its own. Returns the line elements.
   */
  F.splitLines = (el) => {
    if (el._lines) return el._lines;
    const words = [];
    const frag = document.createDocumentFragment();
    const add = (text, wrap) => text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(' '); return; }
      const inner = wrap ? Object.assign(wrap.cloneNode(false), { textContent: part }) : part;
      const w = F.h('span.w', inner);
      words.push(w);
      frag.append(w);
    });
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === 3) add(node.textContent);
      else if (node.nodeType === 1 && node.tagName !== 'BR') add(node.textContent, node);
    });
    el.replaceChildren(frag);
    const lines = [];
    let top = null;
    words.forEach((w) => {
      if (top === null || Math.abs(w.offsetTop - top) > 2) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w);
    });
    el._lines = lines.map((ws) => {
      const ln = F.h('span.ln');
      ws.forEach((w, i) => { if (i) ln.append(' '); ln.append(w); });
      return ln;
    });
    el.replaceChildren(...el._lines);
    return el._lines;
  };
  const linesIn = (ctx, el, spec, delay) => {
    el.style.visibility = 'hidden';
    document.fonts.ready.then(() => {
      if (ctx.dead) return;
      el.style.visibility = '';
      F.splitLines(el).forEach((ln, i) => maskUp(ctx, ln, spec, delay + i * spec.stagger));
    });
  };

  // ---------------------------------------------------------------- the helpers, in the screen's style

  F.rise = (ctx, els, o = {}) => {
    const S = F.styleOf(ctx);
    if (!S || !S.content || o.plain) return base.rise(ctx, els, o);
    const C = S.content;
    (Array.isArray(els) ? els : [els]).filter(Boolean).forEach((el, i) => {
      const delay = (o.delay || 0) + i * (o.stagger ?? C.stagger);
      if (C.wipe) wipeIn(ctx, el, C, delay);
      else if (C.curtain) curtainIn(ctx, el, C, delay);
      else moveIn(ctx, el, C, delay);
    });
  };

  F.titleIn = (ctx, el, o = {}) => {
    const S = F.styleOf(ctx);
    if (!S || !S.title || o.plain) return base.titleIn(ctx, el, o);
    const T = S.title, delay = o.delay || 0;
    if (T.wipe) return wipeIn(ctx, el, T, delay);
    if (T.lines) return linesIn(ctx, el, T, delay);
    return moveIn(ctx, el, T, delay);
  };

  F.pop = (ctx, el, o = {}) => {
    const S = F.styleOf(ctx);
    if (!S || !S.pop || o.plain) return base.pop(ctx, el, o);
    const P = S.pop;
    if (P.origin) el.style.transformOrigin = P.origin;
    return F.move(el, P.from, rest(P.from), timing(P, { delay: o.delay || 0, fill: 'backwards', ctx }));
  };

  /** Leaving, in the style: faster than arriving, always. */
  F.exit = (ctx, els, o = {}) => {
    const S = F.styleOf(ctx);
    const X = (S && S.out) || { to: { y: -8, o: 0 }, ms: 200, curve: 'exit' };
    (Array.isArray(els) ? els : [els]).filter(Boolean).forEach((el, i) => F.move(el, rest(X.to), X.to, { duration: X.ms, curve: X.curve, delay: (o.delay || 0) + i * (o.stagger ?? 30), fill: 'forwards', ctx }));
  };

  F.press = (ctx, el, o = {}) => {
    const S = F.styleOf(ctx);
    if (!S || !S.press || o.row || o.plain) return base.press(ctx, el, o);
    const P = S.press;
    const to = { ...P.to };
    if (o.scale !== undefined && to.s !== undefined) to.s = o.scale;
    if (P.origin) el.style.transformOrigin = P.origin;
    let down = false, anim = null;
    const pressIn = (e) => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      const r = el.getBoundingClientRect();
      const k = r.width / (el.offsetWidth || r.width || 1) || 1;
      const hit = e && (e.clientX || e.clientY);
      el._tapX = hit ? (e.clientX - r.left) / k : null;
      el._tapY = hit ? (e.clientY - r.top) / k : null;
      down = true;
      el.classList.add('is-down');
      anim && anim.cancel();
      anim = F.move(el, rest(to), to, { duration: P.inMs, curve: P.curve || 'strong', fill: 'forwards', ctx });
    };
    const pressOut = () => {
      if (!down) return;
      down = false;
      el.classList.remove('is-down');
      anim && anim.cancel();
      anim = F.move(el, to, rest(to), P.spring ? { spring: P.spring, fill: 'none', ctx } : { duration: P.outMs, curve: P.curve, fill: 'none', ctx });
    };
    ctx.on(el, 'pointerdown', pressIn);
    ctx.on(el, 'pointerup', pressOut);
    ctx.on(el, 'pointerleave', pressOut);
    ctx.on(el, 'pointercancel', pressOut);
    if (o.onTap) ctx.on(el, 'click', (e) => {
      if (el.disabled) return;
      ctx.lastTap = el;
      o.onTap(e);
    });
    return el;
  };

  F.swapText = (ctx, el, text, delay = 0) => {
    const S = F.styleOf(ctx);
    if (!S || !S.swap) return base.swapText(ctx, el, text, delay);
    const W = S.swap;
    return ctx.at(delay, () => {
      if (W.wipe) {
        const a = ctx.track(el.animate([{ clipPath: 'inset(-12px -12px -12px -12px)' }, { clipPath: 'inset(-12px -12px -12px 100%)' }], { duration: ms(W.outMs), easing: F.css('exit'), fill: 'forwards' }));
        ctx.at(W.outMs + 10, () => {
          el.replaceChildren(F.rich(text));
          a.cancel();
          ctx.track(el.animate([{ clipPath: 'inset(-12px 100% -12px -12px)' }, { clipPath: 'inset(-12px -12px -12px -12px)' }], { duration: ms(W.inMs), easing: F.css(W.curve), fill: 'backwards' }));
        });
        return;
      }
      if (W.mask) {
        const h0 = el.offsetHeight || 40;
        const a = ctx.track(el.animate([
          { transform: 'translateY(0px)', clipPath: 'inset(-12px -24px -12px -24px)' },
          { transform: `translateY(${-h0}px)`, clipPath: `inset(${h0}px -24px -12px -24px)` },
        ], { duration: ms(W.outMs), easing: F.css(W.curve), fill: 'forwards' }));
        ctx.at(W.outMs + 10, () => {
          el.replaceChildren(F.rich(text));
          a.cancel();
          maskUp(ctx, el, { ms: W.inMs, curve: W.curve }, 0);
        });
        return;
      }
      F.move(el, rest(W.out), W.out, { duration: W.outMs, curve: 'exit', fill: 'forwards', ctx });
      ctx.at(W.outMs + 10, () => {
        el.replaceChildren(F.rich(text));
        F.move(el, W.in, rest(W.in), W.spring ? { spring: W.spring, fill: 'forwards', ctx } : { duration: W.inMs, curve: W.curve, fill: 'forwards', ctx });
      });
    });
  };

  /** A value changes in the style: precise numbers roll on reels; the rest swap as words do. */
  F.setValue = (ctx, el, text, o = {}) => {
    const S = F.styleOf(ctx);
    if (S && S.value === 'roll' && /\d/.test(text)) return F.reel(ctx, el, text, o);
    return F.swapText(ctx, el, text, o.delay || 0);
  };

  // ---------------------------------------------------------------- idle loops (one per screen)

  const IDLE = {
    breathe: [[{ scale: '1', opacity: 0.92 }, { scale: '1.035', opacity: 1 }], { duration: 4800, direction: 'alternate', easing: 'calm' }],
    pulse: [[{ scale: '1' }, { scale: '1.07', offset: 0.08 }, { scale: '1', offset: 0.2 }, { scale: '1' }], { duration: 1200, easing: 'linear' }],
    bob: [[{ translate: '0px 0px', scale: '1 1' }, { translate: '0px -6px', scale: '0.98 1.02', offset: 0.5 }, { translate: '0px 0px', scale: '1.03 0.97', offset: 0.9 }, { translate: '0px 0px', scale: '1 1' }], { duration: 2200, easing: 'ease-in-out' }],
    wave: [[{ translate: '0px 0px', scale: '1' }, { translate: '3px -4px', scale: '1.012', offset: 0.33 }, { translate: '-3px -1px', scale: '1.006', offset: 0.66 }, { translate: '0px 0px', scale: '1' }], { duration: 6400, easing: 'ease-in-out' }],
    drift: [[{ scale: '1' }, { scale: '1.07' }], { duration: 9000, direction: 'alternate', easing: 'ease-in-out' }],
    sway: [[{ rotate: '-1.6deg' }, { rotate: '1.6deg' }], { duration: 3600, direction: 'alternate', easing: 'calm' }],
  };
  /** The style's idle loop on one element (the hero, waiting). Stops when the screen goes. */
  F.idle = (ctx, el, kind, o = {}) => {
    const S = F.styleOf(ctx);
    kind = kind || (S && S.idle);
    if (!kind || !IDLE[kind] || F.reduced()) return null;
    if (kind === 'sway' || kind === 'bob') el.style.transformOrigin = el.style.transformOrigin || '50% 100%';
    const [frames, opt] = IDLE[kind];
    return ctx.track(el.animate(frames, { duration: opt.duration * F.k(), delay: (o.delay || 0) * F.k(), direction: opt.direction || 'normal', easing: F.CURVES[opt.easing] ? F.css(opt.easing) : opt.easing, iterations: Infinity }));
  };
})();
