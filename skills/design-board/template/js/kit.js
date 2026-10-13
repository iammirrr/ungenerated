/* The board's kit: tokens of motion, the motion engine and the DOM helpers every screen uses.
 * Only transform, opacity and blur move, so every motion here has a native twin
 * (see the native-port skill). Motion numbers live in F.T; change them here, not per screen.
 */
(() => {
  'use strict';
  const F = (window.F = window.F || {});

  // ---------------------------------------------------------------- tokens (the lab edits these)

  /** Named curves. Each one is also written out in the Swift spec. */
  F.CURVES = {
    decel: [0, 0, 0.2, 1], // a rise: things arriving
    strong: [0.23, 1, 0.32, 1], // UI ease-out, under 300 ms
    emph: [0.16, 1, 0.3, 1], // emphasised: zooms, camera moves, a value landing
    desktop: [0.22, 0.75, 0.2, 1], // state changes (kept under this name for compatibility)
    inout: [0.76, 0, 0.24, 1], // a camera between two rests; one object travelling
    exit: [0.4, 0, 1, 1], // exits: they leave faster than they came
    linear: [0, 0, 1, 1],
  };

  /** The motion tokens every screen reads. Durations in ms, distances in pt. */
  F.DEFAULT_TOKENS = {
    speed: 1,
    rise: { distance: 8, duration: 420, stagger: 60, curve: 'decel' },
    title: { distance: 10, duration: 520, blur: 6, curve: 'strong' },
    exit: { distance: 14, duration: 180, curve: 'exit' },
    press: { scale: 0.97, depth: 1, inMs: 90, response: 0.34, damping: 0.6 },
    pick: { response: 0.36, damping: 0.55, advance: 340 },
    zoom: { from: 0.92, duration: 900, curve: 'emph' },
    count: { duration: 1100, curve: 'strong' },
    spring: { response: 0.42, damping: 0.86 },
    // Screen to screen (js/transitions.js). Every value has a SwiftUI twin in the Swift tab.
    step: { distance: 28, outMs: 180, inMs: 480, overlap: 140 },
    layer: { out: 0.94, in: 1.05, blur: 6, outMs: 300, inMs: 560 },
    wash: { ms: 620 },
    carry: { ms: 640 },
    dismiss: { ms: 460 },
    push: { ms: 520, parallax: 0.3 },
    beat: { ms: 240 },
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  F.T = clone(F.DEFAULT_TOKENS);
  F.resetTokens = () => {
    F.T = clone(F.DEFAULT_TOKENS);
  };

  let forceReduce = null;
  F.reduced = () => (forceReduce !== null ? forceReduce : window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  F.setReduced = (v) => {
    forceReduce = v;
  };
  /** Wall-clock factor: 0.25× speed makes every duration four times longer. */
  F.k = () => 1 / Math.max(0.05, F.T.speed || 1);

  // ---------------------------------------------------------------- small helpers

  F.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  F.lerp = (a, b, t) => a + (b - a) * t;
  F.rand = (seed) => {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  };

  /** A cubic-bezier as a function of time, for count-ups and canvas motion. */
  F.bezier = (p) => {
    const [x1, y1, x2, y2] = Array.isArray(p) ? p : F.CURVES[p] || F.CURVES.strong;
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x;
        if (Math.abs(e) < 1e-5) break;
        const d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      let lo = 0, hi = 1;
      for (let i = 0; i < 20 && Math.abs(sx(t) - x) > 1e-5; i++) {
        if (sx(t) < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  };
  F.css = (curve) => {
    const c = Array.isArray(curve) ? curve : F.CURVES[curve] || F.CURVES.strong;
    return `cubic-bezier(${c.join(',')})`;
  };

  /**
   * A SwiftUI spring, sampled: `.spring(response:dampingFraction:)` with mass 1.
   * Returns the progress values (may pass 1 when damping < 1) and the settle time.
   */
  const springCache = new Map();
  F.springCurve = (response, damping) => {
    const key = response.toFixed(3) + ':' + damping.toFixed(3);
    if (springCache.has(key)) return springCache.get(key);
    const k = Math.pow((2 * Math.PI) / response, 2);
    const c = (4 * Math.PI * damping) / response;
    const dt = 1 / 600;
    let x = 0, v = 0, t = 0;
    const values = [0];
    let n = 0;
    while (t < 3) {
      const a = k * (1 - x) - c * v;
      v += a * dt;
      x += v * dt;
      t += dt;
      if (++n % 10 === 0) values.push(x);
      if (t > 0.05 && Math.abs(1 - x) < 0.0008 && Math.abs(v) < 0.01) break;
    }
    values.push(1);
    const out = { values, duration: t * 1000 };
    springCache.set(key, out);
    return out;
  };

  /** transform from a pose: {x, y, s, sx, sy, r} (pt, scale, degrees). */
  F.tf = (p = {}) => {
    const parts = [];
    if (p.x || p.y) parts.push(`translate(${(p.x || 0).toFixed(2)}px, ${(p.y || 0).toFixed(2)}px)`);
    if (p.s !== undefined && p.s !== 1) parts.push(`scale(${p.s.toFixed(4)})`);
    if (p.sx !== undefined || p.sy !== undefined) parts.push(`scale(${(p.sx ?? 1).toFixed(4)}, ${(p.sy ?? 1).toFixed(4)})`);
    if (p.r) parts.push(`rotate(${p.r.toFixed(2)}deg)`);
    return parts.length ? parts.join(' ') : 'none';
  };
  const poseFrame = (p) => {
    const f = { transform: F.tf(p) };
    if (p.o !== undefined) f.opacity = p.o;
    if (p.blur !== undefined) f.filter = p.blur > 0.01 ? `blur(${p.blur.toFixed(2)}px)` : 'blur(0px)';
    return f;
  };
  const mix = (a, b, t) => {
    const out = {};
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const base = key === 's' || key === 'sx' || key === 'sy' || key === 'o' ? 1 : 0;
      const va = a[key] ?? base, vb = b[key] ?? base;
      out[key] = va + (vb - va) * t;
    }
    if (out.o !== undefined) out.o = F.clamp(out.o, 0, 1);
    if (out.blur !== undefined) out.blur = Math.max(0, out.blur);
    return out;
  };

  /**
   * Animate a pose: F.move(el, from, to, {duration, delay, curve | spring, fill, ctx}).
   * A spring ({response, damping}) samples SwiftUI's spring; a curve is a cubic-bezier.
   * Reduce Motion lands on the final frame at once.
   */
  F.move = (el, from, to, o = {}) => {
    if (!el) return null;
    const k = F.k();
    const reduce = F.reduced();
    let frames, timing;
    if (o.spring && !reduce) {
      const sc = F.springCurve(o.spring.response, o.spring.damping);
      frames = sc.values.map((v) => poseFrame(mix(from, to, v)));
      timing = { duration: sc.duration * k, easing: 'linear' };
    } else {
      frames = [poseFrame(from), poseFrame(to)];
      timing = { duration: reduce ? 1 : (o.duration ?? 300) * k, easing: F.css(o.curve || 'strong') };
    }
    timing.delay = reduce ? 0 : (o.delay || 0) * k;
    timing.fill = o.fill || 'both';
    const anim = el.animate(frames, timing);
    if (o.ctx) o.ctx.track(anim);
    if (o.keep) {
      anim.onfinish = () => {
        const last = frames[frames.length - 1];
        el.style.transform = last.transform;
        if (last.opacity !== undefined) el.style.opacity = last.opacity;
        if (last.filter !== undefined) el.style.filter = last.filter;
        anim.cancel();
      };
    }
    return anim;
  };

  /** Tween a number from a to b on a spring or a curve; fn(value) each frame. Returns stop(). */
  F.tween = (ctx, a, b, o, fn) => {
    if (F.reduced()) {
      fn(b);
      o.done && o.done();
      return () => {};
    }
    const sc = o.spring ? F.springCurve(o.spring.response, o.spring.damping) : null;
    const dur = (sc ? sc.duration : o.duration || 300) * F.k();
    const ease = sc ? null : F.bezier(o.curve || 'strong');
    const t0 = performance.now();
    const stop = ctx.loop(() => {
      const t = F.clamp((performance.now() - t0) / dur, 0, 1);
      let p;
      if (sc) {
        const idx = t * (sc.values.length - 1), i = Math.floor(idx), f = idx - i;
        const v0 = sc.values[i], v1 = sc.values[Math.min(i + 1, sc.values.length - 1)];
        p = v0 + (v1 - v0) * f;
      } else p = ease(t);
      fn(a + (b - a) * p);
      if (t >= 1) {
        stop();
        o.done && o.done();
      }
    });
    return stop;
  };

  /** Numbers roll: each changed character slides in from below (up) or above (down). */
  F.roll = (el, text, o = {}) => {
    text = String(text);
    const prev = el._text ?? el.textContent;
    if (prev === text) return;
    el._text = text;
    const n = (t) => parseFloat(String(t).replace(/[^0-9.]/g, '')) || 0;
    const dir = o.dir ?? (n(text) >= n(prev) ? 1 : -1);
    el.replaceChildren(...[...text].map((ch, i) => {
      const s = document.createElement('span');
      s.className = 'rl';
      s.textContent = ch === ' ' ? '\u00a0' : ch;
      if (prev[i] !== ch && !F.reduced()) {
        s.animate([{ transform: `translateY(${dir * 55}%)`, opacity: 0, filter: 'blur(2px)' }, { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }], { duration: 260 * F.k(), easing: F.css('strong') });
      }
      return s;
    }));
  };

  /** The rise: 8 pt up over 420 ms, 60 ms apart. Content arrives; it never bounces. */
  F.rise = (ctx, els, o = {}) => {
    const T = F.T.rise;
    const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
    list.forEach((el, i) => {
      F.move(el, { y: o.distance ?? T.distance, o: 0, blur: o.blur || 0 }, { y: 0, o: 1, blur: 0 }, {
        duration: o.duration ?? T.duration,
        delay: (o.delay || 0) + i * (o.stagger ?? T.stagger),
        curve: o.curve || T.curve,
        fill: 'backwards',
        ctx,
      });
    });
  };

  /** A heading coming in: rise plus a soft focus pull (blur 6 → 0). */
  F.titleIn = (ctx, el, o = {}) => {
    const T = F.T.title;
    return F.move(el, { y: o.distance ?? T.distance, o: 0, blur: o.blur ?? T.blur }, { y: 0, o: 1, blur: 0 }, {
      duration: o.duration ?? T.duration, delay: o.delay || 0, curve: T.curve, fill: 'backwards', ctx,
    });
  };
  F.titleOut = (ctx, el, o = {}) =>
    F.move(el, { y: 0, o: 1, blur: 0 }, { y: -(o.distance ?? 8), o: 0, blur: 4 }, {
      duration: o.duration ?? 220, delay: o.delay || 0, curve: 'exit', fill: 'forwards', ctx,
    });

  /** A pop for something that appears in place (a check, a badge), as a spring. Never for content. */
  F.pop = (ctx, el, o = {}) =>
    F.move(el, { s: o.from ?? 0.6, o: 0 }, { s: 1, o: 1 }, {
      spring: o.spring || F.T.pick, delay: o.delay || 0, fill: 'backwards', ctx,
    });

  // ---------------------------------------------------------------- DOM

  /** h('div.a.b', {attrs, style, on}, ...children) */
  F.h = (sel, props, ...kids) => {
    const [tag, ...cls] = sel.split('.');
    const el = document.createElement(tag || 'div');
    if (cls.length) el.className = cls.join(' ');
    if (props && (typeof props !== 'object' || props instanceof Node || Array.isArray(props))) {
      kids.unshift(props);
      props = null;
    }
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === 'style' && typeof v === 'object') {
          for (const [sk, sv] of Object.entries(v)) {
            if (sv === undefined || sv === null) continue;
            if (sk.startsWith('--')) el.style.setProperty(sk, sv);
            else el.style[sk] = sv;
          }
        }
        else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
        else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('--')) el.style.setProperty(k, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    const add = (k) => {
      if (k === null || k === undefined || k === false) return;
      if (Array.isArray(k)) return k.forEach(add);
      el.append(k instanceof Node ? k : document.createTextNode(String(k)));
    };
    kids.forEach(add);
    return el;
  };
  const h = F.h;

  /** "Plan your *day.*" → text with the accent on the starred words. */
  F.rich = (text) => {
    const frag = document.createDocumentFragment();
    String(text).split(/(\*[^*]+\*)/g).forEach((part) => {
      if (!part) return;
      if (part.startsWith('*') && part.endsWith('*')) frag.append(h('em', part.slice(1, -1)));
      else frag.append(document.createTextNode(part));
    });
    return frag;
  };

  const SVGNS = 'http://www.w3.org/2000/svg';
  F.svg = (tag, attrs = {}, ...kids) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) el.setAttribute(k, v);
    kids.flat().forEach((k) => k && el.append(k));
    return el;
  };

  /** An icon from js/icons.js (Lucide, ISC licence), drawn at a 1.75 stroke. */
  F.icon = (name, o = {}) => {
    const size = o.size || 20;
    const node = (window.F_ICONS || {})[name];
    const svg = F.svg('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': o.stroke || 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      class: 'ic' + (o.cls ? ' ' + o.cls : ''), 'aria-hidden': 'true',
    });
    (node || []).forEach(([tag, attrs]) => svg.append(F.svg(tag, attrs)));
    return svg;
  };

  F.chromeIcon = (name, o = {}) => F.icon(name, { ...o, set: 'lucide' });



  F.statusBar = (o = {}) => {
    const bar = h('div.ph-status' + (o.tone === 'light' ? '.is-light' : ''),
      h('span.ph-time', o.time || '9:41'),
      h('span.ph-sys',
        F.svg('svg', { width: 18, height: 12, viewBox: '0 0 18 12' },
          F.svg('rect', { x: 0, y: 8, width: 3, height: 4, rx: 0.8, fill: 'currentColor' }),
          F.svg('rect', { x: 5, y: 5.5, width: 3, height: 6.5, rx: 0.8, fill: 'currentColor' }),
          F.svg('rect', { x: 10, y: 3, width: 3, height: 9, rx: 0.8, fill: 'currentColor' }),
          F.svg('rect', { x: 15, y: 0, width: 3, height: 12, rx: 0.8, fill: 'currentColor' })),
        F.svg('svg', { width: 16, height: 12, viewBox: '0 0 16 12' },
          F.svg('path', { d: 'M8 11.6 10.4 9a3.4 3.4 0 0 0-4.8 0Z', fill: 'currentColor' }),
          F.svg('path', { d: 'M3.8 7.2a6 6 0 0 1 8.4 0l1.4-1.5a8.1 8.1 0 0 0-11.2 0Z', fill: 'currentColor' }),
          F.svg('path', { d: 'M1.4 4.6a9.5 9.5 0 0 1 13.2 0L16 3.1a11.6 11.6 0 0 0-16 0Z', fill: 'currentColor' })),
        F.svg('svg', { width: 27, height: 13, viewBox: '0 0 27 13' },
          F.svg('rect', { x: 0.5, y: 0.5, width: 23, height: 12, rx: 3.8, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.4 }),
          F.svg('rect', { x: 2, y: 2, width: 18, height: 9, rx: 2.4, fill: 'currentColor' }),
          F.svg('path', { d: 'M25 4.5v4a2.2 2.2 0 0 0 0-4Z', fill: 'currentColor', 'fill-opacity': 0.45 }))));
    return bar;
  };

  /** A realistic iPhone (titanium band, glass, Dynamic Island). Content goes in .screen (393 × 852 pt, scaled). */
  F.iphone = (o = {}) => {
    const w = o.width || 236;
    const s = w / 432; // 393 pt screen + 2 × 19.5 band
    const screen = h('div.dev-screen');
    const el = h('div.dev-phone', { style: { width: w + 'px', height: Math.round(w * (891 / 432)) + 'px', '--k': s } },
      h('span.dev-btn.is-action'), h('span.dev-btn.is-up'), h('span.dev-btn.is-down'), h('span.dev-btn.is-power'),
      h('div.dev-glass', screen, h('span.dev-shine')));
    screen.style.setProperty('--k', s);
    el.screen = screen;
    el.scale = s;
    return el;
  };

  /** A MacBook (aluminium base, black bezel with the notch). Content goes in .screen (1512 × 945 pt, scaled). */
  F.macbook = (o = {}) => {
    const w = o.width || 340;
    const screen = h('div.dev-mac-screen');
    // What you put inside is drawn at 760 × 475 pt and scaled to the glass (84% lid, 2.2% bezel).
    const glassW = w * 0.84 * (1 - 0.044);
    const el = h('div.dev-mac', { style: { width: w + 'px', '--w': w + 'px', '--mac-s': (glassW / 760).toFixed(4) } },
      h('div.dev-mac-lid', h('div.dev-mac-glass', screen, h('span.dev-mac-notch'))),
      h('div.dev-mac-base', h('span.dev-mac-lip')));
    el.screen = screen;
    el.height = glassW / 1.6 + w * 0.84 * 0.056 + w * 0.034;
    return el;
  };

  /** An element's box inside `root`, in the phone's own points (offsets, so scaling never matters). */
  F.pos = (el, root) => {
    let x = 0, y = 0, node = el;
    while (node && node !== root) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
  };

  /** A finger: the soft touch dot iOS shows in demos, pressing with a real click rhythm. */
  F.touch = (ctx, parent, x, y, o = {}) => {
    const dot = h('span.touch', { style: { left: x + 'px', top: y + 'px' } });
    parent.append(dot);
    const delay = o.delay || 0;
    const hold = o.hold || 0;
    F.move(dot, { o: 0, s: 1.35 }, { o: 1, s: 1 }, { duration: 260, delay, curve: 'strong', ctx, fill: 'backwards' });
    F.move(dot, { s: 1 }, { s: 0.78 }, { duration: 110, delay: delay + 300, curve: 'strong', ctx, fill: hold ? 'forwards' : 'none' });
    F.move(dot, { s: 0.78, o: 1 }, { s: 1.5, o: 0 }, { duration: 420, delay: delay + 420 + hold, curve: 'strong', ctx, fill: 'forwards' });
    ctx.at(delay + 420 + hold + 440, () => dot.remove());
    return dot;
  };

  /**
   * Press physics for anything tappable: in on press-down (scale, a point of depth, a darker
   * fill via .is-down), out with a spring on release. `o.rows` uses a highlight, never scale.
   */
  F.press = (ctx, el, o = {}) => {
    const T = F.T.press;
    let down = false, anim = null;
    const isRow = !!o.row;
    const pressIn = (e) => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      // Where the finger landed, in the element's own points: a pick blooms from there.
      const r = el.getBoundingClientRect();
      const k = r.width / (el.offsetWidth || r.width || 1) || 1;
      const hit = e && (e.clientX || e.clientY);
      el._tapX = hit ? (e.clientX - r.left) / k : null;
      el._tapY = hit ? (e.clientY - r.top) / k : null;
      down = true;
      el.classList.add('is-down');
      if (isRow) return;
      anim && anim.cancel();
      anim = F.move(el, { s: 1, y: 0 }, { s: o.scale ?? T.scale, y: T.depth }, { duration: T.inMs, curve: 'strong', fill: 'forwards', ctx });
    };
    const pressOut = () => {
      if (!down) return;
      down = false;
      el.classList.remove('is-down');
      if (isRow) return;
      anim && anim.cancel();
      anim = F.move(el, { s: o.scale ?? T.scale, y: T.depth }, { s: 1, y: 0 }, { spring: { response: T.response, damping: T.damping }, fill: 'none', ctx });
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

  /** A demo finger: the touch dot lands on `el`, presses it (press physics included) and clicks. */
  F.tapEl = (ctx, el, o = {}) => {
    if (!el) return;
    const p = F.pos(el, ctx.root);
    F.touch(ctx, ctx.root, p.cx + (o.dx || 0), p.cy + (o.dy || 0));
    // The events carry the finger's point, so what reacts to it (a bloom, a thumb) starts there.
    const at = () => {
      const r = el.getBoundingClientRect();
      const k = r.width / (el.offsetWidth || r.width || 1) || 1;
      return { bubbles: true, clientX: r.left + r.width / 2 + (o.dx || 0) * k, clientY: r.top + r.height / 2 + (o.dy || 0) * k };
    };
    ctx.at(300, () => el.dispatchEvent(new PointerEvent('pointerdown', at())));
    ctx.at(410, () => {
      el.dispatchEvent(new PointerEvent('pointerup', at()));
      el.click();
    });
  };

  /** Count from a to b with the count curve; `fmt` formats each frame. */
  F.count = (ctx, el, a, b, o = {}) => {
    const T = F.T.count;
    const dur = (o.duration ?? T.duration) * F.k();
    const ease = F.bezier(o.curve || T.curve);
    const fmt = o.fmt || ((v) => Math.round(v).toLocaleString('en-US'));
    if (F.reduced()) {
      el.textContent = fmt(b);
      return;
    }
    el.textContent = fmt(a);
    const start = () => {
      const t0 = performance.now();
      const stop = ctx.loop(() => {
        const t = F.clamp((performance.now() - t0) / dur, 0, 1);
        el.textContent = fmt(a + (b - a) * ease(t));
        if (t >= 1) {
          stop();
          o.onDone && o.onDone();
        }
      });
    };
    if (o.delay) ctx.at(o.delay, start); else start();
  };

  F.fmtDur = (minutes, o = {}) => {
    const m = Math.max(0, Math.round(minutes));
    const hh = Math.floor(m / 60), mm = m % 60;
    if (o.short) return hh ? (mm ? `${hh}h ${mm}m` : `${hh}h`) : `${mm}m`;
    return hh ? `${hh}h ${String(mm).padStart(2, '0')}m` : `${mm}m`;
  };

  F.clock = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    return hh ? `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${mm}:${String(ss).padStart(2, '0')}`;
  };

  F.hm = (minutes) => {
    const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  };

  // ---------------------------------------------------------------- the screen registry

  F.SCREENS = [];
  /** Register a screen: {id, section, name, intent, group?, flowDefault?, seq?, flow?, enter?, build(ctx)}. */
  F.def = (s) => {
    s.params = s.params || {};
    F.SCREENS.push(s);
    return s;
  };
  /** The answers a screen reads in the flow; your screens set their own keys. */
  F.DEFAULT_ANSWERS = F.DEFAULT_ANSWERS || {};
})();
