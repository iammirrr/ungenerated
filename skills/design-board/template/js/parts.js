/* The board's parts: the phone frame, buttons, picks, chips, the segmented control, the toggle,
 * sliders, flowing time, money reels, coach marks. Every part has its states and its motion. */
(() => {
  'use strict';
  const F = window.F;
  const h = F.h;

  /** The Dynamic Island: a black pill; expand({lead, trail}) grows it into a Live Activity. */
  F.island = () => {
    const el = h('div.ph-island');
    const lead = h('span.isl-lead'), trail = h('span.isl-trail');
    el.append(lead, trail);
    el.expand = (ctx, o = {}) => {
      el.classList.add('is-live');
      lead.replaceChildren(o.lead || h('i.isl-dot'));
      trail.textContent = o.trail || '';
      F.move(lead, { o: 0, x: 10, s: 0.6 }, { o: 1, x: 0, s: 1 }, { spring: { response: 0.45, damping: 0.75 }, delay: 120, ctx, fill: 'backwards' });
      F.move(trail, { o: 0, x: -10 }, { o: 1, x: 0 }, { duration: 360, delay: 160, curve: 'strong', ctx, fill: 'backwards' });
    };
    el.collapse = () => { el.classList.remove('is-live'); lead.replaceChildren(); trail.textContent = ''; };
    el.lead = lead;
    el.trail = trail;
    return el;
  };

  /**
   * A real app icon, by key: assets/appicons/<key>.png when you have fetched it
   * (tools/fetch-appicons.mjs), otherwise a neutral tile with the first letter. Never draw a
   * stand-in that imitates a real app's mark.
   */
  F.APP_ICONS = F.APP_ICONS || {};
  F.appTile = (id, size = 60) => {
    const name = (F.APP_ICONS[id] && F.APP_ICONS[id].name) || id;
    const tile = h('span.app-tile', { style: { width: size + 'px', height: size + 'px', '--r': Math.round(size * 0.225) + 'px' } });
    const img = h('img', { src: `assets/appicons/${id}.png`, alt: '', draggable: 'false' });
    img.onerror = () => { tile.classList.add('is-letter'); tile.replaceChildren(h('b', name.slice(0, 1).toUpperCase())); };
    tile.append(img);
    return tile;
  };

  /** The icon at the start of a row or card: a real app, or an icon on a tinted tile. */
  const markIcon = (o) => {
    if (o.app) return F.appTile(o.app, 36);
    if (o.icon) return h('span.tile' + (o.tone ? '.tone-' + o.tone : ''), F.icon(o.icon, { size: 19 }));
    return null;
  };

  /** The question top: back chevron and a thin progress bar that eases forward. */
  F.qTop = (ctx, o = {}) => {
    const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22, stroke: 2 }));
    if (o.back === false) back.style.visibility = 'hidden';
    F.press(ctx, back, { onTap: () => ctx.back() });
    const fill = h('div.q-fill');
    const track = h('div.q-track', { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round((o.progress || 0) * 100) }, fill);
    if (o.track === false) track.style.visibility = 'hidden';
    const to = F.clamp(o.progress || 0, 0, 1);
    const from = F.clamp(ctx.progressFrom ?? Math.max(0, to - 0.1), 0, 1);
    fill.style.transform = `scaleX(${from})`;
    ctx.at(120, () => F.move(fill, { sx: from }, { sx: to }, { duration: 700, curve: 'emph', ctx, fill: 'forwards' }));
    return h('div.q-top', { 'data-keep': '' }, back, track, h('span'));
  };

  /** The heading: the title with its accent, a quiet line under it. */
  F.qHead = (ctx, title, sub, o = {}) => {
    const t = h(o.hero ? 'h1.t-hero' : 'h1.t-q', F.rich(title));
    const wrap = h('div.q-head-block' + (o.center ? '.t-center' : ''), t, sub ? h('p.t-sub', F.rich(sub)) : null);
    F.titleIn(ctx, t, { delay: o.delay || 0 });
    if (sub) F.rise(ctx, wrap.lastChild, { delay: (o.delay || 0) + 90 });
    return wrap;
  };


  /** The system chrome and the safe-area body. o: {tone: 'light' for white text, island, home, bg} */
  F.frame = (ctx, o = {}) => {
    const root = ctx.root;
    if (o.bg) root.style.background = o.bg;
    if (o.cls) root.classList.add(...o.cls.split(' '));
    const body = h('div.ph-body' + (o.bodyCls ? '.' + o.bodyCls : ''));
    root.append(body);
    const status = F.statusBar({ tone: o.tone });
    const island = F.island();
    root.append(status, island);
    if (o.home !== false) root.append(h('div.ph-home' + (o.tone === 'light' ? '.is-light' : '')));
    return { body, status, island };
  };

  /** The primary pill. kind: '' | 'dark' | 'quiet'. */
  F.primary = (ctx, label, o = {}) => {
    const b = h('button.btn' + (o.kind ? '.is-' + o.kind : ''), { type: 'button' }, o.icon ? o.icon : null, h('span', label));
    if (o.disabled) b.setAttribute('aria-disabled', 'true');
    F.press(ctx, b, {
      onTap: () => {
        if (b.getAttribute('aria-disabled') === 'true') return;
        ctx.haptic(o.haptic || 'light');
        o.onTap ? o.onTap() : ctx.next();
      },
    });
    b.enable = (on) => {
      const was = b.getAttribute('aria-disabled') !== 'true';
      if (on) b.removeAttribute('aria-disabled');
      else b.setAttribute('aria-disabled', 'true');
      if (on && !was) F.move(b, { s: 0.98 }, { s: 1 }, { spring: { response: 0.4, damping: 0.6 }, ctx, fill: 'none' });
    };
    let swap = null;
    b.label = (text) => {
      const span = b.querySelector('span');
      if (b._text === text || (!b._text && span.textContent === text)) return;
      b._text = text;
      swap && swap.cancel();
      // Out and up, then the new words rise in: one animation, so nothing is left hidden.
      swap = span.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-6px)', offset: 0.33 },
        { opacity: 0, transform: 'translateY(6px)', offset: 0.34 },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 330 * F.k(), easing: 'linear' });
      ctx.track(swap);
      ctx.at(110, () => (span.textContent = b._text));
    };
    return b;
  };

  /**
   * The selected colour spreads from where the finger touched and then stays as the fill (no swap
   * at the end, so nothing flickers); unpicking drains it back to that point. It sits under the
   * content and over the background; each element can carry its own colour (--sel-bg).
   */
  F.bloom = (ctx, el, out) => {
    if (!el.offsetWidth) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const x = el._tapX ?? W / 2, y = el._tapY ?? H / 2;
    const D = 2 * Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
    let wrap = el.querySelector(':scope > .sel-bloom');
    if (!wrap) {
      wrap = h('span.sel-bloom', h('i'));
      el.append(wrap);
    }
    const dot = wrap.firstChild;
    Object.assign(dot.style, { width: D + 'px', height: D + 'px', left: x - D / 2 + 'px', top: y - D / 2 + 'px' });
    dot.getAnimations().forEach((an) => an.cancel());
    if (F.reduced()) {
      dot.style.transform = out ? 'scale(0)' : 'none';
      return;
    }
    dot.style.transform = out ? 'scale(0)' : 'none';
    if (out) F.move(dot, { s: 1 }, { s: 0 }, { duration: 300, curve: 'desktop', ctx, fill: 'none' });
    else F.move(dot, { s: 0 }, { s: 1 }, { duration: 380, curve: 'emph', ctx, fill: 'none' });
  };

  /** Pick feedback: the colour blooms from the finger, the ring eases in, the check pops and draws, one haptic. */
  F.picked = (ctx, el, on) => {
    const was = el.classList.contains('is-on');
    el.classList.toggle('is-on', on);
    el.setAttribute('aria-pressed', String(on));
    if (on !== was) F.bloom(ctx, el, !on);
    const check = el.querySelector('.check, .radio');
    if (on && !was && check) F.move(check, { s: 0.5 }, { s: 1 }, { spring: { response: 0.34, damping: 0.62 }, ctx, fill: 'none' });
    ctx.haptic('selection');
  };

  /**
   * Money rolls like a slot machine (money only; time uses F.timeText). Every digit is a reel that spins through its
   * strip with a little motion blur, slows, overshoots a touch and stops; the reels stop left to
   * right, one haptic when the last lands. $ . , and letters sit still. o: {spins, stagger, haptic}
   */
  F.reel = (ctx, el, text, o = {}) => {
    text = String(text);
    const prev = el._reel ?? '';
    if (prev === text && el.children.length) return;
    el._reel = text;
    el.classList.add('reel');
    const LH = 1.12;
    const spins = o.spins ?? 2;
    let col = 0;
    const digits = [...text].filter((c) => /\d/.test(c)).length;
    el.replaceChildren(...[...text].map((ch, i) => {
      if (!/\d/.test(ch)) return h('span.reel-ch', ch);
      const d = +ch;
      const from = /\d/.test(prev[i] || '') ? +prev[i] : 0;
      const turns = prev === '' || prev[i] !== ch ? spins : 0;
      const target = turns * 10 + d;
      const strip = h('span.reel-strip', Array.from({ length: (spins + 1) * 10 + 1 }, (_, k) => h('span', String(k % 10))));
      const box = h('span.reel-col', strip);
      const k = col++;
      strip.style.transform = `translateY(${-target * LH}em)`;
      if (!F.reduced() && turns) {
        const sc = F.springCurve(0.62 + k * 0.08, 0.72);
        const frames = sc.values.map((v, j) => {
          const pos = from + (target - from) * v;
          const vel = j ? Math.abs(v - sc.values[j - 1]) * sc.values.length : 0;
          return { transform: `translateY(${(-pos * LH).toFixed(3)}em)`, filter: `blur(${Math.min(1.6, vel * 0.09).toFixed(2)}px)` };
        });
        ctx.track(strip.animate(frames, { duration: sc.duration * F.k(), delay: (o.delay || 0) * F.k() + k * (o.stagger ?? 70) * F.k(), easing: 'linear', fill: 'backwards' }));
        if (k === digits - 1 && o.haptic !== false) ctx.at((o.delay || 0) + sc.duration * 0.62 + k * (o.stagger ?? 70), () => ctx.haptic('light'));
      }
      return box;
    }));
  };

  /**
   * Time flows (different from money): the shown value glides through the minutes in between
   * on a soft follow, and a digit that settles morphs a few points (SwiftUI .numericText). No reels,
   * no spin, no blur. o: {fmt(minutes) → text, tau (ms, the follow's softness)}
   */
  F.timeText = (ctx, el, value, o = {}) => {
    const fmt = o.fmt || ((m) => F.fmtDur(m));
    let st = el._flow;
    if (!st || st.ctx !== ctx) {
      st = el._flow = { ctx, v: value, to: value, run: null, shown: null, last: 0 };
      el.textContent = fmt(value);
      st.shown = el.textContent;
      return;
    }
    st.to = value;
    if (st.run || F.reduced()) {
      if (F.reduced()) el.textContent = fmt(value);
      return;
    }
    const tau = o.tau ?? 110;
    st.run = ctx.loop((dt) => {
      st.v += (st.to - st.v) * (1 - Math.exp(-dt / tau));
      if (Math.abs(st.to - st.v) < 0.5) st.v = st.to;
      const txt = fmt(Math.round(st.v));
      if (txt !== st.shown) {
        const now = performance.now();
        const slow = now - st.last > 140;
        st.last = now;
        el.textContent = txt;
        // Only a settling change morphs; a fast run just ticks, like a clock.
        if (slow || st.v === st.to) el.animate([{ transform: 'translateY(3px)', opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duration: 160, easing: 'ease-out' });
        st.shown = txt;
      }
      if (st.v === st.to) {
        st.run();
        st.run = null;
      }
    });
  };

  /**
   * One answer row. o: {label, sub, icon, tone, brand, app, multi, on, onTap}.
   * Rows highlight under the finger (never scale), then light up with the accent ring.
   */
  F.answer = (ctx, o) => {
    const check = h('span.check', F.chromeIcon('check', { size: 14, stroke: 2.6 }));
    const row = h('button.row', { type: 'button', 'aria-pressed': String(!!o.on) }, markIcon(o), h('span.row-label', o.label, o.sub ? h('small', o.sub) : null), check);
    if (o.on) row.classList.add('is-on');
    F.press(ctx, row, { row: true, onTap: () => o.onTap && o.onTap(row) });
    return row;
  };

  /** A multi-pick card for grids. o: {label, icon, tone, brand, soon, on, onTap} */
  F.pickCard = (ctx, o) => {
    const card = h('button.card-pick', { type: 'button', 'aria-pressed': String(!!o.on) },
      markIcon(o),
      h('span.card-label', o.label),
      o.soon ? h('span.soon', 'Soon') : h('span.check', F.chromeIcon('check', { size: 14, stroke: 2.6 })));
    if (o.on) card.classList.add('is-on');
    F.press(ctx, card, { onTap: () => o.onTap && o.onTap(card) });
    return card;
  };

  /** A chip (pill) that toggles. */
  F.chipPick = (ctx, o) => {
    const chip = h('button.chip.is-pick' + (o.big ? '.is-big' : ''), { type: 'button', 'aria-pressed': String(!!o.on) },
      o.app ? F.appTile(o.app, 20) : o.icon ? h('span.chip-ic' + (o.tone ? '.tone-' + o.tone : ''), F.icon(o.icon, { size: 16 })) : null,
      h('span', o.label));
    if (o.on) chip.classList.add('is-on');
    F.press(ctx, chip, { scale: 0.95, onTap: () => o.onTap && o.onTap(chip) });
    return chip;
  };

  /**
   * Single choice: tap lights the row, the check pops, then the screen moves on.
   * Returns the list element. items: [{id, label, ...}], key: the answer to write.
   */
  F.singleList = (ctx, items, key, o = {}) => {
    const list = h('div.answers' + (o.cls ? '.' + o.cls : ''));
    const els = items.map((it) => {
      const make = o.card ? F.pickCard : F.answer;
      const el = make(ctx, {
        ...it,
        on: ctx.mode === 'board' && o.showSelected !== false ? ctx.answers[key] === it.id && o.preselect : false,
        onTap: (node) => {
          els.forEach((e) => e !== node && e.classList.remove('is-on'));
          F.picked(ctx, node, true);
          ctx.answers[key] = it.id;
          o.onPick && o.onPick(it, node);
          if (it.stay) return;
          ctx.at(F.T.pick.advance, () => ctx.next());
        },
      });
      return el;
    });
    els.forEach((e) => list.append(e));
    F.rise(ctx, els, { delay: o.delay ?? 160, stagger: o.stagger });
    list.items = els;
    return list;
  };

  /**
   * A slider that follows the finger exactly (no clicking between steps): the thumb grows with a
   * halo, a value bubble rides above it, passed ticks light up, and on release it springs onto
   * the nearest step. o: {min, max, step, value, onInput, onRelease, onGrab, ticks, tickEvery, bubble(fmt)}
   */
  F.slider = (ctx, o) => {
    const fill = h('div.slider-fill');
    const halo = h('span.slider-halo');
    const thumb = h('div.slider-thumb', { role: 'slider', tabindex: 0, 'aria-valuemin': o.min, 'aria-valuemax': o.max, 'aria-valuenow': o.value, 'aria-label': o.label || 'Value' });
    const knob = h('div.slider-knob', halo, thumb);
    const bubble = o.bubble ? h('span.slider-bubble.num') : null;
    const el = h('div.slider', h('div.slider-track'), fill, knob, bubble);
    const nT = o.ticks || 0;
    const ticks = nT ? Array.from({ length: nT }, () => h('i')) : [];
    if (nT) el.append(h('div.slider-ticks', ticks));
    let value = o.value;
    const pct = (v) => (v - o.min) / (o.max - o.min);
    let pos = F.clamp(pct(value), 0, 1);
    const snap = (raw) => F.clamp(Math.round(raw / o.step) * o.step, o.min, o.max);
    const place = (p) => {
      pos = p;
      fill.style.width = p * 100 + '%';
      knob.style.left = p * 100 + '%';
      if (bubble) bubble.style.left = p * 100 + '%';
      ticks.forEach((t, i) => {
        const on = i / (nT - 1) <= p + 0.001;
        if (on === t._on) return;
        t._on = on;
        t.classList.toggle('is-on', on);
        if (on && t._ready) F.move(t, { sy: 2.2 }, { sy: 1 }, { spring: { response: 0.3, damping: 0.5 }, ctx, fill: 'none' });
      });
      ticks.forEach((t) => (t._ready = true));
    };
    place(pos);
    const setValue = (v, user) => {
      if (v === value) return;
      const every = o.tickEvery || o.step;
      if (user && Math.floor(value / every) !== Math.floor(v / every)) ctx.haptic('selection');
      value = v;
      thumb.setAttribute('aria-valuenow', v);
      if (bubble) F.roll(bubble, o.bubble(v));
      o.onInput && o.onInput(v, user);
    };
    if (bubble) F.roll(bubble, o.bubble(value));
    const rawFromX = (clientX) => {
      const r = el.getBoundingClientRect();
      return F.clamp((clientX - r.left) / r.width, 0, 1);
    };
    let dragging = false, stopSnap = null, demoRevision = 0;
    const grab = () => {
      F.move(thumb, { s: 1 }, { s: 1.16 }, { spring: { response: 0.3, damping: 0.6 }, ctx, fill: 'forwards' });
      F.move(halo, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.34, damping: 0.7 }, ctx, fill: 'forwards' });
      if (bubble) F.move(bubble, { s: 0.6, o: 0, y: 8 }, { s: 1, o: 1, y: 0 }, { spring: { response: 0.34, damping: 0.62 }, ctx, fill: 'forwards' });
    };
    const letGo = () => {
      F.move(thumb, { s: 1.16 }, { s: 1 }, { spring: { response: 0.32, damping: 0.5 }, ctx, fill: 'forwards' });
      F.move(halo, { s: 1, o: 1 }, { s: 0.6, o: 0 }, { duration: 220, curve: 'exit', ctx, fill: 'forwards' });
      if (bubble) F.move(bubble, { s: 1, o: 1, y: 0 }, { s: 0.8, o: 0, y: 6 }, { duration: 200, delay: 260, curve: 'exit', ctx, fill: 'forwards' });
    };
    ctx.on(el, 'pointerdown', (e) => {
      demoRevision++;
      dragging = true;
      stopSnap && stopSnap();
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      grab();
      const p = rawFromX(e.clientX);
      // The thumb travels to the finger on a quick spring, then follows it exactly.
      const from = pos;
      stopSnap = F.tween(ctx, from, p, { spring: { response: 0.22, damping: 0.85 } }, (v) => place(v));
      setValue(snap(o.min + p * (o.max - o.min)), true);
      o.onGrab && o.onGrab();
    });
    ctx.on(el, 'pointermove', (e) => {
      if (!dragging) return;
      stopSnap && stopSnap();
      const p = rawFromX(e.clientX);
      place(p);
      setValue(snap(o.min + p * (o.max - o.min)), true);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      letGo();
      // Settle onto the step with a soft spring.
      stopSnap = F.tween(ctx, pos, pct(value), { spring: { response: 0.3, damping: 0.72 } }, (v) => place(v));
      o.onRelease && o.onRelease(value);
    };
    ctx.on(el, 'pointerup', end);
    ctx.on(el, 'pointercancel', end);
    ctx.on(thumb, 'keydown', (e) => {
      if (!['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      demoRevision++;
      stopSnap && stopSnap();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setValue(F.clamp(value + o.step, o.min, o.max), true);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setValue(F.clamp(value - o.step, o.min, o.max), true);
      if (e.key === 'Home') setValue(o.min, true);
      if (e.key === 'End') setValue(o.max, true);
      place(pct(value));
    });
    /** Glide the thumb to v (a demo of the gesture, with the grab and the bubble). */
    el.glide = (v, dur = 900, delay = 0) => {
      const revision = demoRevision;
      ctx.at(delay, () => {
        if (revision !== demoRevision) return;
        grab();
        stopSnap && stopSnap();
        const a = pos, b = pct(v);
        stopSnap = F.tween(ctx, a, b, { duration: dur, curve: 'inout', done: () => ctx.at(120, letGo) }, (p) => {
          place(p);
          setValue(snap(o.min + p * (o.max - o.min)), false);
        });
      });
    };
    el.value = () => value;
    el.set = (v, options = {}) => {
      demoRevision++;
      stopSnap && stopSnap();
      v = snap(v);
      setValue(v, !!options.user);
      if (options.animate) stopSnap = F.tween(ctx, pos, pct(v), { spring: { response: 0.3, damping: 0.86 } }, place);
      else place(pct(v));
    };
    return el;
  };

  /**
   * A range with two thumbs, smooth, never clicky: the nearer thumb glides to the finger on a
   * quick spring and then follows it exactly, a bubble above it shows its value, ticks a haptic on
   * every hour, and on release both settle onto their steps. o: {min, max, step, start, end, minGap,
   * onInput(lo, hi, dragging), onRelease(lo, hi), bubble(v)}
   */
  F.range = (ctx, o) => {
    const fill = h('div.slider-fill');
    const mk = (cls) => {
      const halo = h('span.slider-halo');
      const thumb = h('div.slider-thumb', { role: 'slider' });
      return { el: h('div.slider-knob' + cls, halo, thumb), halo, thumb };
    };
    const A = mk('.is-a'), Bk = mk('.is-b');
    const bubble = o.bubble ? h('span.slider-bubble.num.is-range') : null;
    const el = h('div.slider.is-range', h('div.slider-track'), fill, A.el, Bk.el, bubble);
    let lo = o.start, hi = o.end;
    const pct = (v) => (v - o.min) / (o.max - o.min);
    let pa = pct(lo), pb = pct(hi);
    let which = null, glide = null, settle = null;
    const place = () => {
      A.el.style.left = pa * 100 + '%';
      Bk.el.style.left = pb * 100 + '%';
      fill.style.left = pa * 100 + '%';
      fill.style.width = (pb - pa) * 100 + '%';
      if (bubble && which) {
        bubble.style.left = (which === A ? pa : pb) * 100 + '%';
        bubble.textContent = o.bubble(which === A ? lo : hi);
      }
    };
    place();
    const snap = (raw) => F.clamp(Math.round(raw / o.step) * o.step, o.min, o.max);
    const rawFromX = (x) => {
      const r = el.getBoundingClientRect();
      return F.clamp((x - r.left) / r.width, 0, 1);
    };
    const minGap = (o.minGap || 60) / (o.max - o.min);
    const set = (p) => {
      if (which === A) {
        pa = Math.min(p, pb - minGap);
        const v = snap(o.min + pa * (o.max - o.min));
        if (v !== lo) {
          if (Math.floor(v / 60) !== Math.floor(lo / 60)) ctx.haptic('selection');
          lo = v;
          o.onInput && o.onInput(lo, hi, true);
        }
      } else {
        pb = Math.max(p, pa + minGap);
        const v = snap(o.min + pb * (o.max - o.min));
        if (v !== hi) {
          if (Math.floor(v / 60) !== Math.floor(hi / 60)) ctx.haptic('selection');
          hi = v;
          o.onInput && o.onInput(lo, hi, true);
        }
      }
      place();
    };
    let target = 0;
    ctx.on(el, 'pointerdown', (e) => {
      const p = rawFromX(e.clientX);
      which = Math.abs(p - pa) <= Math.abs(p - pb) ? A : Bk;
      el.setPointerCapture && e.pointerId !== undefined && el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      settle && settle();
      F.move(which.thumb, { s: 1 }, { s: 1.16 }, { spring: { response: 0.3, damping: 0.6 }, ctx, fill: 'forwards' });
      F.move(which.halo, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.34, damping: 0.7 }, ctx, fill: 'forwards' });
      if (bubble) F.move(bubble, { s: 0.6, o: 0, y: 8 }, { s: 1, o: 1, y: 0 }, { spring: { response: 0.34, damping: 0.62 }, ctx, fill: 'forwards' });
      // Glide to the finger on a quick spring, then follow it exactly.
      target = p;
      const from = which === A ? pa : pb;
      glide && glide();
      glide = F.tween(ctx, 0, 1, { spring: { response: 0.22, damping: 0.86 }, done: () => (glide = null) }, (t) => set(from + (target - from) * t));
    });
    ctx.on(el, 'pointermove', (e) => {
      if (!which) return;
      target = rawFromX(e.clientX);
      if (!glide) set(target);
    });
    const end = () => {
      if (!which) return;
      const k = which;
      glide && glide();
      glide = null;
      el.classList.remove('is-dragging');
      F.move(k.thumb, { s: 1.16 }, { s: 1 }, { spring: { response: 0.32, damping: 0.5 }, ctx, fill: 'forwards' });
      F.move(k.halo, { s: 1, o: 1 }, { s: 0.6, o: 0 }, { duration: 220, curve: 'exit', ctx, fill: 'forwards' });
      if (bubble) F.move(bubble, { s: 1, o: 1, y: 0 }, { s: 0.8, o: 0, y: 6 }, { duration: 200, delay: 200, curve: 'exit', ctx, fill: 'forwards' });
      // Each thumb settles onto its step.
      const fa = pa, fb = pb, ta = pct(lo), tb = pct(hi);
      settle = F.tween(ctx, 0, 1, { spring: { response: 0.3, damping: 0.78 } }, (t) => {
        pa = fa + (ta - fa) * t;
        pb = fb + (tb - fb) * t;
        place();
      });
      which = null;
      o.onRelease && o.onRelease(lo, hi);
    };
    ctx.on(el, 'pointerup', end);
    ctx.on(el, 'pointercancel', end);
    /** Demo: a thumb glides to a value with the grab, the bubble and the settle. */
    el.glide = (side, v, dur = 900, delay = 0) => ctx.at(delay, () => {
      which = side === 'start' ? A : Bk;
      el.classList.add('is-dragging');
      F.move(which.thumb, { s: 1 }, { s: 1.16 }, { spring: { response: 0.3, damping: 0.6 }, ctx, fill: 'forwards' });
      F.move(which.halo, { s: 0.5, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.34, damping: 0.7 }, ctx, fill: 'forwards' });
      if (bubble) F.move(bubble, { s: 0.6, o: 0, y: 8 }, { s: 1, o: 1, y: 0 }, { spring: { response: 0.34, damping: 0.62 }, ctx, fill: 'forwards' });
      const from = which === A ? pa : pb, to = pct(v);
      F.tween(ctx, from, to, { duration: dur, curve: 'inout', done: () => ctx.at(120, end) }, (p) => set(p));
    });
    return el;
  };

  /**
   * The segmented control: the thumb slides on a spring and stretches with its own speed
   * (wide and a touch flat mid-flight, round again when it lands); labels follow its weight.
   */
  F.seg = (ctx, options, value, onChange) => {
    const thumb = h('span.seg-thumb');
    const el = h('div.seg', { role: 'group' }, thumb);
    let squeeze = null;
    const btns = options.map(([v, label]) => {
      const b = h('button', { type: 'button', 'aria-pressed': String(v === value) }, label);
      ctx.on(b, 'click', () => select(v, true));
      // The press squeezes the thumb with the separate `scale` property, so it never replaces the
      // thumb's translate (a held scale-only transform would park the thumb on the first option).
      ctx.on(b, 'pointerdown', () => {
        if (b.getAttribute('aria-pressed') !== 'true' || F.reduced()) return;
        squeeze && squeeze.cancel();
        squeeze = thumb.animate([{ scale: '1' }, { scale: '0.95' }], { duration: 90 * F.k(), easing: F.css('strong'), fill: 'forwards' });
        ctx.track(squeeze);
      });
      ctx.on(b, 'pointerup', () => {
        if (!squeeze) return;
        squeeze.cancel();
        squeeze = null;
        const sc = F.springCurve(0.3, 0.6);
        ctx.track(thumb.animate(sc.values.map((v) => ({ scale: String(0.95 + 0.05 * v) })), { duration: sc.duration * F.k(), easing: 'linear' }));
      });
      el.append(b);
      return b;
    });
    let current = value;
    const n = options.length;
    let idx = Math.max(0, options.findIndex((x) => x[0] === value));
    const w = () => (el.clientWidth - 6) / n;
    thumb.style.width = `calc((100% - 6px) / ${n})`;
    thumb.style.transform = `translateX(${idx * 100}%)`;
    const slideTo = (i) => {
      const from = idx * w(), to = i * w();
      idx = i;
      if (!el.clientWidth || F.reduced()) {
        thumb.style.transform = `translateX(${i * 100}%)`;
        return;
      }
      const sc = F.springCurve(0.42, 0.72);
      let prev = from;
      const frames = sc.values.map((p) => {
        const x = from + (to - from) * p;
        const v = Math.abs(x - prev);
        prev = x;
        const st = Math.min(0.22, v * 0.035);
        return { transform: `translateX(${x.toFixed(2)}px) scale(${(1 + st).toFixed(3)}, ${(1 - st * 0.4).toFixed(3)})` };
      });
      const anim = thumb.animate(frames, { duration: sc.duration * F.k(), easing: 'linear' });
      ctx.track(anim);
      thumb.style.transform = `translateX(${i * 100}%)`;
    };
    const select = (v, user) => {
      const i = options.findIndex((x) => x[0] === v);
      if (i < 0) return;
      btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      if (i !== idx) slideTo(i);
      if (user && v !== current) ctx.haptic('selection');
      current = v;
      if (user) onChange && onChange(v);
    };
    el.select = select;
    return el;
  };

  /** A spring's progress at time t (ms), sampled the SwiftUI way (F.springCurve). */
  const springAt = (sc, t) => {
    if (t >= sc.duration) return 1;
    const i = (Math.max(0, t) / sc.duration) * (sc.values.length - 1);
    const k = Math.floor(i), f = i - k;
    const v0 = sc.values[k], v1 = sc.values[Math.min(k + 1, sc.values.length - 1)];
    return v0 + (v1 - v0) * f;
  };

  /**
   * The toggle, liquid: the knob is two edges on two springs. Under the finger it reaches toward
   * where it will go; on release the leading edge runs ahead and the trailing edge catches up, so
   * it stretches in flight and lands round. The track's colour cross-fades underneath.
   */
  F.toggle = (ctx, on, onChange) => {
    const knob = h('i');
    const el = h('button.tog' + (on ? '.is-on' : ''), { type: 'button', role: 'switch', 'aria-checked': String(!!on) }, knob);
    const W = 51, K = 27, P = 2, REACH = 7;
    let state = !!on;
    const restL = (s) => (s ? W - P - K : P);
    let L = restL(state), R = L + K, stop = null;
    knob.style.transformOrigin = '0 50%';
    const paint = () => {
      knob.style.transform = `translateX(${(L - P).toFixed(2)}px) scaleX(${((R - L) / K).toFixed(4)})`;
    };
    paint();
    /** Both edges to (l2, r2): the one moving with the travel leads, the other lags. */
    const go = (l2, r2, fast) => {
      stop && stop();
      const l1 = L, r1 = R;
      const right = l2 + r2 > l1 + r1;
      const lead = F.springCurve(fast ? 0.18 : 0.26, 0.74), lag = F.springCurve(fast ? 0.24 : 0.4, 0.82);
      const sl = right ? lag : lead, sr = right ? lead : lag;
      if (F.reduced()) {
        L = l2;
        R = r2;
        paint();
        return;
      }
      const t0 = performance.now(), k = F.k();
      stop = ctx.loop(() => {
        const t = (performance.now() - t0) / k;
        const pl = springAt(sl, t), pr = springAt(sr, t);
        L = l1 + (l2 - l1) * pl;
        R = Math.max(L + K * 0.6, r1 + (r2 - r1) * pr);
        paint();
        if (t >= Math.max(sl.duration, sr.duration)) {
          stop();
          stop = null;
        }
      });
    };
    let pressed = false;
    ctx.on(el, 'pointerdown', () => {
      pressed = true;
      const l = restL(state);
      // Reach toward the other side, a little.
      if (state) go(l - REACH, l + K, true);
      else go(l, l + K + REACH, true);
    });
    const relax = () => {
      if (!pressed) return;
      pressed = false;
      const l = restL(state);
      go(l, l + K, true);
    };
    ctx.on(el, 'pointerleave', relax);
    ctx.on(el, 'pointercancel', relax);
    ctx.on(el, 'click', () => {
      pressed = false;
      state = !state;
      el.classList.toggle('is-on', state);
      el.setAttribute('aria-checked', String(state));
      const l = restL(state);
      go(l, l + K, false);
      ctx.haptic('light');
      onChange && onChange(state);
    });
    el.set = (v) => {
      if (!!v === state) return;
      el.click();
    };
    return el;
  };

  /** "Tap to continue" with a tap layer under the content's own controls. */
  F.tapOn = (ctx, body, o = {}) => {
    const hint = h('div.hint', o.label || 'Tap to continue');
    hint.style.opacity = '0';
    ctx.at(o.delay ?? 1400, () => {
      hint.style.opacity = '';
      F.rise(ctx, hint);
    });
    const layer = h('div.tap-layer', { 'aria-hidden': 'true' });
    ctx.on(layer, 'click', () => {
      ctx.haptic('soft');
      ctx.next();
    });
    ctx.root.append(layer);
    return hint;
  };

  /** Words change in place: the old ones leave upward, the new ones rise in from below. */
  F.swapText = (ctx, el, text, delay = 0) => ctx.at(delay, () => {
    F.move(el, { o: 1, y: 0, blur: 0 }, { o: 0, y: -14, blur: 6 }, { duration: 240, curve: 'exit', ctx, fill: 'forwards' });
    ctx.at(250, () => {
      el.replaceChildren(F.rich(text));
      F.move(el, { o: 0, y: 18, blur: 8 }, { o: 1, y: 0, blur: 0 }, { duration: 620, curve: 'strong', ctx, fill: 'forwards' });
    });
  });

  /**
   * A coach mark for the tour: the screen dims, a rounded window opens on the target with a
   * spring, and a card says what it is. Taps reach the target through the
   * window. o: {title, text, step, next, onNext, place: 'above' | 'below', pad, radius, delay, skip}
   */
  F.coach = (ctx, target, o = {}) => {
    const r = F.pos(target, ctx.root);
    const pad = o.pad ?? 8;
    const box = { x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 };
    const below = o.dock !== 'top';
    const W = 342;
    const left = 24;
    const hole = h('div.coach-hole', { style: { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px', borderRadius: (o.radius ?? 22) + 'px' } });
    const title = h('b.coach-title', o.title);
    const text = h('p.coach-text', o.text);
    const next = h('button.coach-next', { type: 'button' }, h('span', o.next || 'Next'), F.icon('arrow-right', { size: 15, stroke: 2.2 }));
    const skip = o.skip === false ? h('span') : h('button.coach-skip', { type: 'button' }, 'Skip the tour');
    const tip = h('div.coach-tip.is-docked', { style: { left: left + 'px', width: W + 'px', [below ? 'bottom' : 'top']: (below ? 88 : 112) + 'px' } },
      h('div.coach-head', h('i.coach-dot'), h('small', o.step || 'Tour')),
      title, text, h('div.coach-actions', skip, next));
    const layer = h('div.coach', hole, tip);
    ctx.root.append(layer);
    F.press(ctx, next, { scale: 0.94, onTap: () => {
      ctx.haptic('light');
      (o.onNext || (() => ctx.next()))();
    } });
    if (skip.tagName === 'BUTTON') F.press(ctx, skip, { row: true, onTap: () => ctx.next({ to: o.skipTo || 'app-focus-live' }) });
    const d = o.delay || 0;
    F.move(hole, { o: 0 }, { o: 1 }, { duration: 240, delay: d, curve: 'strong', ctx, fill: 'backwards' });
    F.move(tip, { y: below ? 8 : -8, o: 0 }, { y: 0, o: 1 }, { duration: 300, delay: d + 100, curve: 'strong', ctx, fill: 'backwards' });
    layer.say = (t, x, label) => {
      F.swapText(ctx, title, t);
      F.swapText(ctx, text, x, 60);
      if (label) F.swapText(ctx, next.firstChild, label, 120);
    };
    layer.next = next;
    layer.tip = tip;
    return layer;
  };
})();
