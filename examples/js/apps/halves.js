/* Halves, a budget two people keep together. Motion style: precise (measured, like a ledger).
 * Flows: onboarding (who's in, what comes in, how you split, the month) and leaving for another
 * app (one question, take it with you, goodbye). Mia is ink and Sam is marigold on every screen.
 * Generated: confetti, an unlabelled donut and "Save up to $1,000". Ungenerated: their answers
 * glide into the plan one by one, and every number adds up. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'halves-generated', section: 'generated', name: 'Halves · generated', loop: 8000,
    intent: 'The first draft of "show the couple their budget plan": a celebration before anything is read, a donut without labels, a round number from nowhere and "Unlock your financial freedom".',
    build(ctx) {
      const { body } = S.frame(ctx);
      const party = h('div', { style: { fontSize: '44px', textAlign: 'center', marginTop: '10px' } }, '🎉');
      const title = h('h1.s-h1', { style: { marginTop: '8px' } }, 'Your ', h('span.s-grad', 'Personalized Plan'), ' is Ready!');
      const p = h('p.s-p', 'Our AI analyzed your finances to create the perfect plan for you ✨');
      const donut = h('div.s-donut', h('b', '92%', h('small', 'Financial Score')));
      const list = h('div.s-list.s-glass', ['💰 Save up to $1,000/month*', '📈 Grow your wealth 10x faster', '🛡️ Achieve financial freedom'].map((t) => h('div', t)));
      const btn = S.btn(ctx, 'Unlock Your Financial Freedom 🚀', { glow: true });
      body.append(party, title, p, donut, list, h('div.ph-fill'), btn, h('p.s-fine', { style: { margin: '10px 0 0' } }, '*Results may vary. Not financial advice.'));
      S.in([party, title, p, donut, list, btn]);
      const conf = h('div.s-confetti');
      const r = F.rand(4);
      const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#14b8a6', '#22c55e'];
      for (let i = 0; i < 46; i++) conf.append(h('i', { style: { left: r() * 390 + 'px', background: colors[i % colors.length], animationDelay: r() * 900 + 'ms', animationDuration: 1800 + r() * 1400 + 'ms' } }));
      ctx.root.append(conf);
    },
  });

  // ---------------------------------------------------------------- icons the set lacks (Lucide, ISC)

  Object.assign(window.F_ICONS, {
    'hv-split': [['path', { d: 'M16 3h5v5' }], ['path', { d: 'M8 3H3v5' }], ['path', { d: 'M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3' }], ['path', { d: 'm15 9 6-6' }]],
    'hv-equal-not': [['line', { x1: 5, x2: 19, y1: 9, y2: 9 }], ['line', { x1: 5, x2: 19, y1: 15, y2: 15 }], ['line', { x1: 19, x2: 5, y1: 5, y2: 19 }]],
    'hv-house': [['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }], ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }]],
    'hv-car': [['path', { d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' }], ['circle', { cx: 7, cy: 17, r: 2 }], ['path', { d: 'M9 17h6' }], ['circle', { cx: 17, cy: 17, r: 2 }]],
    'hv-piggy': [['path', { d: 'M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z' }], ['path', { d: 'M16 10h.01' }], ['path', { d: 'M2 8v1a2 2 0 0 0 2 2h1' }]],
    'hv-shift': [['path', { d: 'M9 18v-6H5l7-7 7 7h-4v6H9z' }]],
    'hv-delete': [['path', { d: 'M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' }], ['path', { d: 'm12 9 6 6' }], ['path', { d: 'm18 9-6 6' }]],
  });

  // ---------------------------------------------------------------- their month: every figure follows from these

  // What goes out each month (from the setup the flow does not show); the rest follows from
  // their answers on these screens. 1,450 + 310 + 860 + 374 + 260 + 64 + 450 × 2 = 4,218.
  const OUT = { rent: 1450, bills: 310, food: 860, car: 374, trains: 260, subs: 64, spend: 450 };
  const HOME = OUT.rent + OUT.bills; // 1,760
  const MOVE = OUT.car + OUT.trains; // 634
  const OUT_TOTAL = HOME + OUT.food + MOVE + OUT.subs + OUT.spend * 2; // 4,218
  const gbp = (n) => (n < 0 ? '−' : '') + '£' + Math.abs(Math.round(n)).toLocaleString('en-GB');
  /** Names, incomes and the split, from the answers (Mia £2,450 and Sam £2,180 by default). */
  const month = (ctx) => {
    const a = ctx.answers;
    const mia = a.hvMia || 'Mia', sam = a.hvSam || 'Sam';
    const inMia = a.hvInMia ?? 2450, inSam = a.hvInSam ?? 2180;
    const total = inMia + inSam; // 4,630
    const pMia = total ? Math.round((inMia / total) * 100) : 50; // 53
    const byMia = Math.floor((OUT_TOTAL * pMia) / 100); // 2,235
    return { mia, sam, inMia, inSam, total, pMia, pSam: 100 - pMia, byMia, bySam: OUT_TOTAL - byMia, half: OUT_TOTAL / 2, left: total - OUT_TOTAL, split: a.hvSplit || 'income' };
  };
  const SPLIT_NAME = { half: 'half each', income: 'split by income', pot: 'one pot' };
  /** March to October: the eight months they have kept in Halves, ending this month. */
  const months = () => {
    const now = X.day(0);
    return Array.from({ length: 8 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 7 + i, 1));
  };
  const ENDS = () => X.day(28); // the day Halves Plus ends if they cancel today

  // ---------------------------------------------------------------- the precise vocabulary

  const ms = (v) => v * F.k();
  const STD = () => F.css('standard');

  /**
   * Money in Schibsted Grotesk: tabular digits, but the pound sign and the comma keep their own
   * widths (its tabular comma is as wide as a digit, which opens a gap in £2,450).
   */
  const money = (text) => {
    const frag = document.createDocumentFragment();
    String(text).split(/(\d+)/).forEach((part) => part && frag.append(h(/\d/.test(part) ? 'span.hv-d' : 'span.hv-s', part)));
    return frag;
  };
  /**
   * A value set at once (while a finger drags it: it ticks, it does not roll). The next F.setValue
   * rolls from it: in this style F.setValue rolls money on reels whose spring never overshoots.
   */
  const setMoney = (el, text) => {
    el.classList.remove('reel');
    el.replaceChildren(money(text));
    el._reel = text;
  };
  /** Money rolling to a new value, digit by digit (F.setValue, which is F.reel in this style). */
  const roll = (ctx, el, text, o = {}) => F.setValue(ctx, el, text, { spins: 1, stagger: 60, ...o });

  /** A line or a bar drawing to its exact length (scaleX from one edge). */
  const draw = (ctx, el, o = {}) => {
    el.style.transformOrigin = o.origin || '0 50%';
    if (F.reduced()) {
      el.style.transform = `scaleX(${o.to ?? 1})`;
      return null;
    }
    return ctx.track(el.animate([{ transform: `scaleX(${o.from ?? 0})` }, { transform: `scaleX(${o.to ?? 1})` }], {
      duration: ms(o.ms ?? 360), delay: ms(o.delay || 0), easing: F.css(o.curve || 'standard'), fill: 'both',
    }));
  };
  /** Revealed left to right by a clip (for single things the wave does not carry). */
  const wipe = (ctx, el, o = {}) => (F.reduced() ? null : ctx.track(el.animate(
    [{ clipPath: 'inset(-12px 100% -12px -12px)' }, { clipPath: 'inset(-12px -12px -12px -12px)' }],
    { duration: ms(o.ms ?? 340), delay: ms(o.delay || 0), easing: STD(), fill: 'backwards' })));
  /** Wiped away to the right, faster than it came. */
  const wipeOut = (ctx, el, o = {}) => (F.reduced() ? (el.style.visibility = 'hidden') : ctx.track(el.animate(
    [{ clipPath: 'inset(-12px -12px -12px -12px)' }, { clipPath: 'inset(-12px -12px -12px 100%)' }],
    { duration: ms(o.ms ?? 200), delay: ms(o.delay || 0), easing: F.css('exit'), fill: 'forwards' })));

  /** The heading: wiped in, then a marigold marker stroke draws under the accent words. A \n
   * breaks the line where it reads best. */
  const head = (ctx, text, o = {}) => {
    const el = h('h1.hv-h' + (o.cls || ''), text.split('\n').map((part, i) => [i ? h('br') : null, F.rich(part)]));
    el.querySelectorAll('em').forEach((em) => em.append(h('i.hv-hl', { 'aria-hidden': 'true' })));
    const d = o.delay ?? 60;
    F.titleIn(ctx, el, { delay: d });
    el.querySelectorAll('.hv-hl').forEach((hl) => draw(ctx, hl, { delay: d + 380, ms: 340 }));
    return el;
  };
  const sub = (ctx, kids, delay = 150) => {
    const el = h('p.hv-sub', kids);
    F.rise(ctx, el, { delay });
    return el;
  };

  /** A person's picture in their ring: Mia's ink, Sam's marigold. */
  const avatar = (who, size) => h('span.hv-av.is-' + who, { style: { width: size + 'px', height: size + 'px' } }, X.pic('halves-' + who, { cls: 'is-small', icon: 'user-round' }));

  /** The pick, measured: the ring closes on the card and the check wipes in and draws. */
  const check = () => h('span.hv-ck', h('i.hv-ck-on', F.icon('check', { size: 14, stroke: 2.8 })));
  const pickOn = (ctx, el) => {
    el.classList.add('is-on');
    el.setAttribute('aria-pressed', 'true');
    const on = el.querySelector('.hv-ck-on');
    if (on && !F.reduced()) ctx.track(on.animate([{ clipPath: 'inset(0 100% 0 0 round 13px)' }, { clipPath: 'inset(0 0 0 0 round 13px)' }], { duration: ms(220), easing: STD(), fill: 'backwards' }));
    const tile = el.querySelector('.hv-tile-on');
    if (tile && !F.reduced()) ctx.track(tile.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: ms(260), easing: STD(), fill: 'backwards' }));
    ctx.haptic('selection');
  };

  const onb = { section: 'halves-onboarding', style: 'precise', flow: true };
  const lv = { section: 'halves-leaving', style: 'precise', flow: true };

  // ---------------------------------------------------------------- the keyboard (iOS draws it; drawn here as iOS does)

  const KB_H = 291;
  /**
   * The system keyboard, light, without the predictive bar (names have autocorrect off). Letters
   * show their balloon when pressed; the shift lights for a capital; return says next, then done.
   * onKey(id) types; press(id) is the demo's way of pressing a key.
   */
  const keyboard = (ctx, onKey) => {
    const el = h('div.hv-kb', { 'aria-hidden': 'true' });
    const keys = {};
    const add = (id, label, x, y, w, cls = '') => {
      const k = h('button.hv-key' + cls, { type: 'button', tabindex: -1, style: { left: x + 'px', top: y + 'px', width: w + 'px' } }, label);
      ctx.on(k, 'pointerdown', () => k.classList.add('is-down'));
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => ctx.on(k, ev, () => k.classList.remove('is-down')));
      ctx.on(k, 'click', () => api.press(id, true));
      keys[id] = k;
      el.append(k);
      return k;
    };
    [...'qwertyuiop'].forEach((c, i) => add(c, c, 3 + i * 39, 8, 33, '.is-letter'));
    [...'asdfghjkl'].forEach((c, i) => add(c, c, 22.5 + i * 39, 62, 33, '.is-letter'));
    add('shift', F.icon('hv-shift', { size: 21, stroke: 1.6 }), 3, 116, 42, '.is-mod.is-shift');
    [...'zxcvbnm'].forEach((c, i) => add(c, c, 61.5 + i * 39, 116, 33, '.is-letter'));
    add('delete', F.icon('hv-delete', { size: 22, stroke: 1.6 }), 345, 116, 42, '.is-mod');
    add('123', '123', 3, 170, 89, '.is-mod.is-word');
    add('space', 'space', 98, 170, 194, '.is-word');
    const ret = add('return', h('span', 'next'), 298, 170, 89, '.is-mod.is-word');
    const pops = h('div.hv-kb-pops');
    el.append(h('span.hv-kb-sys.is-emoji', F.icon('smile', { size: 26, stroke: 1.5 })), h('span.hv-kb-sys.is-mic', F.icon('mic', { size: 24, stroke: 1.5 })), pops);
    const api = {
      el,
      isCaps: () => el.classList.contains('is-caps'),
      caps(on) { el.classList.toggle('is-caps', on); keys.shift.classList.toggle('is-on', on); },
      ret(label, blue) { ret.firstChild.textContent = label; ret.classList.toggle('is-blue', !!blue); },
      press(id, real) {
        const k = keys[id];
        if (!k) return;
        if (k.classList.contains('is-letter')) {
          const pop = h('span.hv-kb-pop', { style: { left: parseFloat(k.style.left) + 16.5 + 'px', top: k.style.top } }, h('b', api.isCaps() ? id.toUpperCase() : id));
          pops.append(pop);
          ctx.at(160, () => pop.remove());
        } else if (!real) {
          k.classList.add('is-down');
          ctx.at(150, () => k.classList.remove('is-down'));
        }
        onKey(id);
      },
    };
    return api;
  };

  // ---------------------------------------------------------------- 1 · who's in

  F.def({
    ...onb, id: 'halves-who', name: 'Who’s in', progress: 0.25, loop: 5000, seqHold: 4300,
    intent: 'Names are the one thing worth typing, so they are typed on the real keyboard: Mia, next, Sam. The focus line draws under the field being typed and moves to the next one; Continue rides on the keyboard and waits for both names. Mia is ink and Sam is marigold from here on.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const title = head(ctx, 'Who’s *in?*');
      const line = sub(ctx, 'First names are enough.');
      let cur = null;
      const field = (who, role) => {
        const text = h('span.hv-text'), caret = h('i.hv-caret'), ph = h('span.hv-ph', 'First name');
        const on = h('i.hv-line-on');
        const el = h('div.hv-person.is-' + who, avatar(who, 64), h('div.hv-field', h('small', role), h('div.hv-input', text, caret, ph), h('i.hv-line', on)));
        const f = { el, on, caret, value: '' };
        f.set = (v) => {
          f.value = v;
          text.textContent = v;
          ph.hidden = !!v;
        };
        caret.hidden = true;
        ctx.on(el, 'click', () => focus(f));
        return f;
      };
      const f1 = field('mia', 'You'), f2 = field('sam', 'Your partner');
      const cta = F.primary(ctx, 'Continue', { onTap: () => {
        ctx.answers.hvMia = f1.value.trim() || 'Mia';
        ctx.answers.hvSam = f2.value.trim() || 'Sam';
        ctx.next();
      } });
      const ready = () => !!(f1.value.trim() && f2.value.trim());
      const update = () => {
        if (ready()) cta.removeAttribute('aria-disabled');
        else cta.setAttribute('aria-disabled', 'true');
        if (cur === f2) kb.ret('done', ready());
      };
      const onKey = (id) => {
        const f = cur;
        if (!f) return;
        if (id.length === 1) {
          if (f.value.length < 14) f.set(f.value + (kb.isCaps() ? id.toUpperCase() : id));
          kb.caps(false);
        } else if (id === 'delete') {
          f.set(f.value.slice(0, -1));
          if (!f.value) kb.caps(true);
        } else if (id === 'shift') kb.caps(!kb.isCaps());
        else if (id === 'space' && f.value) f.set(f.value + ' ');
        else if (id === 'return') {
          if (f === f1) focus(f2);
          else if (ready()) cta.click();
        }
        update();
      };
      const kb = keyboard(ctx, onKey);
      /** Focus moves: the old line wipes away to the right, the new one draws from the left. */
      const focus = (f) => {
        if (cur === f) return;
        const old = cur;
        cur = f;
        [f1, f2].forEach((x) => (x.caret.hidden = x !== f));
        if (old) draw(ctx, old.on, { from: 1, to: 0, origin: '100% 50%', ms: 200, curve: 'exit' });
        draw(ctx, f.on, { delay: old ? 90 : 0, ms: 340 });
        kb.caps(!f.value);
        kb.ret(f === f1 ? 'next' : 'done', f === f2 && ready());
      };
      const dock = h('div.hv-dock', h('div.hv-acc', cta), kb.el);
      ctx.root.append(dock);
      body.append(F.qTop(ctx, { progress: 0.25 }), title, line, h('div.hv-who', f1.el, f2.el));
      F.rise(ctx, [f1.el, f2.el], { delay: 220 });
      // The keyboard rises once the screen has landed, with Continue riding on it: one axis.
      F.move(dock, { y: KB_H + 80 }, { y: 0 }, { duration: 420, delay: 470, curve: 'standard', ctx, fill: 'backwards' });
      const flow = ctx.mode === 'flow';
      if (flow) {
        f1.set(P.mia);
        f2.set(P.sam);
        ctx.at(620, () => focus(f2));
        ctx.on(document, 'keydown', (e) => {
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          if (/^[a-z]$/i.test(e.key)) kb.press(e.key.toLowerCase());
          else if (e.key === 'Backspace') kb.press('delete');
          else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            kb.press('return');
          }
        });
      } else {
        ctx.at(620, () => focus(f1));
        const type = (word, t0) => [...word].forEach((ch, i) => ctx.at(t0 + i * 175, () => kb.press(ch.toLowerCase())));
        type(P.mia, 1120);
        ctx.at(1820, () => kb.press('return'));
        type(P.sam, 2240);
        ctx.at(3240, () => F.tapEl(ctx, cta));
      }
      update();
    },
  });

  // ---------------------------------------------------------------- 2 · what comes in

  F.def({
    ...onb, id: 'halves-income', name: 'What comes in', progress: 0.5, loop: 7400, seqHold: 6700,
    intent: 'Two take-home pays, each dragged along one scale with the figure following the finger. When a figure lands, the bar under them draws to its exact share and the total rolls into place: £4,630 together, split 53 to 47. Nothing overshoots.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const title = head(ctx, 'What comes in\n*each month?*');
      const line = sub(ctx, 'Take-home pay, after tax.');
      const MAX = 4000, TW = 302; // the scale: £0 to £4,000 across the card's 302 pt
      const xOf = (v) => (v / MAX) * TW;
      const snap = (v) => F.clamp(Math.round(v / 10) * 10, 0, MAX);
      const val = { mia: 0, sam: 0 };

      const person = (who, name) => {
        const amt = h('b.hv-amt');
        const fill = h('i.hv-fill'), knob = h('i.hv-knob');
        const track = h('div.hv-track', h('i.hv-rail'), fill, knob);
        const el = h('div.hv-inc.is-' + who, h('div.hv-inc-top', avatar(who, 38), h('b.hv-inc-name', name), amt), track);
        const p = { el, amt, track, who };
        p.set = (v) => {
          val[who] = v;
          const x = xOf(v);
          fill.style.clipPath = `inset(0 ${(TW - x).toFixed(2)}px 0 0 round 3px)`;
          knob.style.transform = `translateX(${x.toFixed(2)}px)`;
          setMoney(amt, gbp(v));
        };
        p.set(0);
        // A finger on the scale: the knob comes to it and follows it, in £10 steps.
        let down = false;
        const at = (e) => {
          const r = track.getBoundingClientRect();
          const k = r.width / (track.offsetWidth || r.width || 1) || 1;
          return snap(((e.clientX - r.left) / k / TW) * MAX);
        };
        ctx.on(track, 'pointerdown', (e) => {
          down = true;
          track.setPointerCapture && e.pointerId !== undefined && track.setPointerCapture(e.pointerId);
          p.set(at(e));
        });
        ctx.on(track, 'pointermove', (e) => down && p.set(at(e)));
        const up = () => {
          if (!down) return;
          down = false;
          ctx.haptic('selection');
          land();
        };
        ctx.on(track, 'pointerup', up);
        ctx.on(track, 'pointercancel', up);
        return p;
      };
      const pm = person('mia', P.mia), ps = person('sam', P.sam);
      // One scale for both: they are measured against the same pounds.
      const axis = h('div.hv-axis', [0, 1, 2, 3, 4].map((n) => h('span', n ? `£${n}k` : '£0')));
      const card = h('div.hv-card', pm.el, ps.el, axis);

      // The one bar: Mia's share in ink, Sam's in marigold, each drawn to its exact length.
      const BW = 342, GAP = 4;
      const pctM = h('b.hv-pct'), pctS = h('b.hv-pct');
      const segM = h('div.hv-seg.is-mia', h('span', P.mia), pctM);
      const segS = h('div.hv-seg.is-sam', h('span', P.sam), pctS);
      const bar = h('div.hv-split', segM, segS);
      const total = h('b.hv-total');
      setMoney(total, '£0');
      const together = h('div.hv-together', h('div.hv-together-top', h('span', 'Together, each month'), total), bar);
      const clip = (l, r) => `inset(0 ${(BW - r).toFixed(2)}px 0 ${l.toFixed(2)}px round 14px)`;
      const segs = { m: [0, 0], s: [BW, BW] };
      const segTo = (seg, key, to, delay) => {
        const from = segs[key];
        segs[key] = to;
        seg.style.clipPath = clip(...to);
        if (!F.reduced() && (from[0] !== to[0] || from[1] !== to[1])) ctx.track(seg.animate([{ clipPath: clip(...from) }, { clipPath: clip(...to) }], { duration: ms(460), delay: ms(delay), easing: STD(), fill: 'backwards' }));
      };
      segM.style.clipPath = clip(...segs.m);
      segS.style.clipPath = clip(...segs.s);
      let both = false;
      /** A figure has landed: the bar draws to the new shares, then the numbers roll. */
      const land = (o = {}) => {
        const m = val.mia, s = val.sam, t = m + s, d = o.delay || 0;
        ctx.answers.hvInMia = m;
        ctx.answers.hvInSam = s;
        roll(ctx, total, gbp(t), { delay: d + 80 });
        if (m && s) {
          const x = (m / t) * BW;
          segTo(segM, 'm', [0, x - GAP / 2], d);
          segTo(segS, 's', [x + GAP / 2, BW], d);
          const p = Math.round((m / t) * 100);
          roll(ctx, pctM, p + '%', { delay: d + 260, haptic: false });
          roll(ctx, pctS, 100 - p + '%', { delay: d + 300, haptic: false });
          if (!both) [pctM, pctS].forEach((el, i) => wipe(ctx, el, { delay: d + 240 + i * 40, ms: 300 }));
          both = true;
          bar.classList.add('is-both');
        } else {
          segTo(segM, 'm', m ? [0, BW] : [0, 0], d);
          segTo(segS, 's', s ? [0, BW] : [BW, BW], d);
          both = false;
          bar.classList.remove('is-both');
        }
        if (m && s) cta.removeAttribute('aria-disabled');
        else cta.setAttribute('aria-disabled', 'true');
      };
      const cta = F.primary(ctx, 'Continue', { disabled: true });
      body.append(F.qTop(ctx, { progress: 0.5 }), title, line, card, together, h('div.ph-fill'), h('div.ph-foot', cta));
      F.rise(ctx, [card, together, cta], { delay: 220 });

      if (ctx.mode === 'flow') {
        pm.set(P.inMia);
        ps.set(P.inSam);
        land({ delay: 620 });
      } else {
        /** The demo finger drags a knob from where it is to a value, along the scale only. */
        const drag = (p, v, t0) => ctx.at(t0, () => {
          const r = F.pos(p.track, ctx.root);
          const v0 = val[p.who];
          X.drag(ctx, ctx.root, r.x + xOf(v0), r.x + xOf(v), r.cy, { duration: 980, curve: 'inout', up: () => {
            ctx.haptic('selection');
            land();
          } }, (e) => p.set(snap(F.lerp(v0, v, e))));
        });
        drag(pm, P.inMia, 1000);
        drag(ps, P.inSam, 2900);
        ctx.at(5500, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · how you split

  F.def({
    ...onb, id: 'halves-split', name: 'How you split', progress: 0.75, loop: 4600, seqHold: 3900,
    intent: 'Three ways to split the £4,218 going out, each drawn as the bar it makes from their own incomes: half each, by income (53 to 47), one pot. The bars draw left to right and the shares roll in; one tap is the answer and the screen moves on.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const title = head(ctx, 'How do you *split* the bills?');
      const line = sub(ctx, ['Everything going out: ', h('b', money(gbp(OUT_TOTAL))), ' a month.']);
      const OPTS = [
        { id: 'half', name: 'Half each', what: 'The same from each of you', cut: 50, dims: [[P.mia, P.half], [P.sam, P.half]] },
        { id: 'income', name: 'By income', what: `${P.pMia} to ${P.pSam}, like what comes in`, cut: P.pMia, dims: [[P.mia, P.byMia], [P.sam, P.bySam]] },
        { id: 'pot', name: 'One pot', what: 'Both pay in, every bill comes out of it', pot: true },
      ];
      let picked = false;
      const cards = OPTS.map((o) => {
        const bar = o.pot
          ? h('div.hv-obar.is-pot', h('i.is-mia'), h('i.is-sam'))
          : h('div.hv-obar', h('i.is-mia', { style: { width: `calc(${o.cut}% - 2px)` } }), h('i.is-sam', { style: { width: `calc(${100 - o.cut}% - 2px)` } }));
        const nums = [];
        const amount = (v) => {
          const n = h('b');
          nums.push([n, gbp(v)]);
          return n;
        };
        const dims = o.pot
          ? h('div.hv-dims', h('span', `${P.mia} and ${P.sam}`), h('span', amount(OUT_TOTAL), ' together'))
          : h('div.hv-dims', o.dims.map(([who, v]) => h('span', who + ' ', amount(v))));
        const card = h('button.hv-opt', { type: 'button', 'aria-pressed': 'false' },
          h('span.hv-opt-top', h('span', h('b', o.name), h('small', o.what)), check()), bar, dims);
        card.bar = bar;
        card.dims = dims;
        card.nums = nums;
        F.press(ctx, card, { scale: 0.98, onTap: () => {
          if (picked) return;
          picked = true;
          pickOn(ctx, card);
          ctx.answers.hvSplit = o.id;
          ctx.at(F.T.pick.advance, () => ctx.next());
        } });
        return card;
      });
      body.append(F.qTop(ctx, { progress: 0.75 }), title, line, h('div.hv-opts', cards));
      F.rise(ctx, cards, { delay: 220 });
      // Each bar draws to its exact cut, left to right; as it finishes its shares come in and roll.
      cards.forEach((c, i) => {
        const at = 520 + i * 130;
        wipe(ctx, c.bar, { delay: at, ms: 520 });
        wipe(ctx, c.dims, { delay: at + 300, ms: 420 });
        c.nums.forEach(([n, to], j) => roll(ctx, n, to, { delay: at + 300 + j * 60, haptic: false }));
      });
      if (ctx.mode !== 'flow') ctx.at(2260, () => F.tapEl(ctx, cards[1]));
    },
  });

  // ---------------------------------------------------------------- 4 · the month

  F.def({
    ...onb, id: 'halves-plan', name: 'The month', loop: 6600, seqHold: 5900,
    intent: 'The ledger arrives with its labels and empty values. Each answer glides straight up its column into its row, 170 ms apart, and is wiped into place; then the sums roll: £4,218 going out, split the way they chose, and £412 put away, its line marked in marigold. One check on the mark when it adds up, and the year it makes: £4,944.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const now = X.monthName(X.day(0));
      const title = head(ctx, 'This is how *your month* will work.', { cls: '.is-plan' });
      const tick = h('span.hv-check', F.icon('check', { size: 13, stroke: 3 }));
      const mark = h('span.hv-mark', h('i'), h('i'), tick);
      const splitLine = P.split === 'half' ? `${gbp(P.half)} each` : P.split === 'pot' ? 'All from one pot' : `${P.mia} ${gbp(P.byMia)} · ${P.sam} ${gbp(P.bySam)}`;
      const ROWS = [
        { icon: 'banknote', label: 'Coming in', sub: `${P.mia} ${gbp(P.inMia)} · ${P.sam} ${gbp(P.inSam)}`, value: gbp(P.total), glide: true },
        { rule: true },
        { icon: 'hv-house', label: 'Home', sub: `Rent ${gbp(OUT.rent)} · bills ${gbp(OUT.bills)}`, value: gbp(HOME), glide: true },
        { icon: 'utensils', label: 'Food and nights out', value: gbp(OUT.food), glide: true },
        { icon: 'hv-car', label: 'Getting around', sub: `Car loan ${gbp(OUT.car)} · trains ${gbp(OUT.trains)}`, value: gbp(MOVE), glide: true },
        { icon: 'repeat', label: 'Subscriptions', value: gbp(OUT.subs), glide: true },
        { icon: 'wallet', label: 'Yours to spend', value: `${gbp(OUT.spend)} each`, glide: true },
        { sum: true, label: 'Going out', sub: splitLine, value: gbp(OUT_TOTAL) },
        { rule: true, strong: true },
        { big: true, icon: 'hv-piggy', label: 'Put away together', value: gbp(Math.max(0, P.left)) },
      ];
      const rows = ROWS.map((r) => {
        if (r.rule) return h('i.hv-rule' + (r.strong ? '.is-strong' : ''));
        const v = h('span.hv-v');
        if (r.glide) v.append(money(r.value));
        const val = h('span.hv-val', h('i.hv-dash'), v);
        const band = r.big ? h('i.hv-band') : null;
        const el = h('div.hv-row' + (r.big ? '.is-big' : '') + (r.sum ? '.is-sum' : '') + (r.sub ? '.has-sub' : ''), band,
          r.icon ? h('span.hv-ic', F.icon(r.icon, { size: 17 })) : h('span.hv-ic.is-blank'),
          h('span.hv-label', r.label, r.sub ? h('small', money(r.sub)) : null), val);
        Object.assign(el, { v, val, r, band, small: el.querySelector('small') });
        return el;
      });
      const card = h('div.hv-plan', h('div.hv-plan-head', mark, h('div', h('b', `${P.mia} & ${P.sam}`), h('small', `${now} · ${SPLIT_NAME[P.split]}`))), h('div.hv-rows', rows));
      const year = h('p.hv-year', money(gbp(Math.max(0, P.left))), ' a month is ', h('b'), ` by next ${now}.`);
      const yearNum = year.querySelector('b');
      const cta = F.primary(ctx, 'Continue');
      const foot = h('div.ph-foot', cta);
      body.append(title, card, year, h('div.ph-fill'), foot);
      F.rise(ctx, card, { delay: 140 });
      year.style.visibility = 'hidden';
      foot.style.visibility = 'hidden';
      const sumRow = rows.find((r) => r.r && r.r.sum), bigRow = rows.find((r) => r.r && r.r.big);
      if (sumRow.small) sumRow.small.style.visibility = 'hidden';

      // The glide: each answer rises from under the card straight up its value column (one axis),
      // lands on its row and is wiped into it, left to right. 170 ms apart.
      const GAP = 170, FLY = 720;
      const glides = rows.filter((r) => r.r && r.r.glide);
      const land = (row) => {
        row.val.classList.add('is-in');
      };
      const run = () => {
        if (ctx.dead) return;
        const cardBox = F.pos(card, ctx.root);
        const from = cardBox.y + cardBox.h + 30;
        glides.forEach((row, i) => {
          const p = F.pos(row.v, ctx.root);
          const chip = h('span.hv-chip', { style: { left: p.x - 9 + 'px', top: p.y - 3 + 'px' } }, money(row.r.value));
          ctx.root.append(chip);
          const d = 640 + i * GAP;
          if (F.reduced()) {
            land(row);
            chip.remove();
            return;
          }
          ctx.track(chip.animate([
            { transform: `translateY(${from - p.y}px)`, opacity: 0 },
            { opacity: 1, offset: 0.22 },
            { transform: 'translateY(0px)', opacity: 1 },
          ], { duration: ms(FLY), delay: ms(d), easing: STD(), fill: 'backwards' }));
          ctx.at(d + FLY, () => {
            land(row);
            wipeOut(ctx, chip, { ms: 240 });
            ctx.at(260, () => chip.remove());
          });
        });
        const end = 640 + (glides.length - 1) * GAP + FLY;
        // The sums are not answers: they roll. Going out, then what is left to put away.
        ctx.at(end + 80, () => {
          sumRow.val.classList.add('is-in');
          roll(ctx, sumRow.v, sumRow.r.value, { haptic: false });
          if (sumRow.small) {
            sumRow.small.style.visibility = '';
            wipe(ctx, sumRow.small, { delay: 160 });
          }
        });
        // What is left is the point of the month: it rolls in, and its line is marked, left to right.
        ctx.at(end + 380, () => {
          bigRow.val.classList.add('is-in');
          roll(ctx, bigRow.v, bigRow.r.value, { haptic: false });
          bigRow.band.style.visibility = 'visible';
          wipe(ctx, bigRow.band, { delay: 160, ms: 520 });
        });
        // It adds up: one check on the mark, one haptic.
        ctx.at(end + 920, () => {
          tick.style.visibility = 'visible';
          F.pop(ctx, tick);
          ctx.haptic('success');
        });
        ctx.at(end + 1020, () => {
          year.style.visibility = '';
          wipe(ctx, year, { ms: 420 });
          roll(ctx, yearNum, gbp(Math.max(0, P.left) * 12), { delay: 120, haptic: false });
        });
        ctx.at(end + 1220, () => {
          foot.style.visibility = '';
          F.rise(ctx, cta);
        });
        if (ctx.mode !== 'flow') ctx.at(end + 2600, () => F.tapEl(ctx, cta));
      };
      document.fonts.ready.then(run);
    },
  });

  // ---------------------------------------------------------------- leaving: what every screen shares

  const top = (ctx, title = 'Cancel Halves Plus') => {
    const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22, stroke: 2 }));
    F.press(ctx, back, { row: true, onTap: () => ctx.back() });
    return h('div.hv-top', { 'data-keep': '' }, back, h('b', title), h('span'));
  };
  /** Continue to cancel: a full outline button, in the same place on every screen. */
  const leave = (ctx, label = 'Continue to cancel', onTap = () => ctx.next()) => {
    const b = h('button.hv-leave', { type: 'button' }, h('span', label));
    F.press(ctx, b, { onTap: () => {
      ctx.lastTap = b;
      ctx.haptic('light');
      onTap();
    } });
    return b;
  };

  // ---------------------------------------------------------------- 1 · one question

  const REASONS = [
    { id: 'split', icon: 'hv-split', label: 'We’re splitting money differently now' },
    { id: 'budget', icon: 'wallet', label: 'It doesn’t fit our budget right now' },
    { id: 'app', icon: 'smartphone', label: 'We moved to another app' },
    { id: 'wrong', icon: 'hv-equal-not', label: 'Something didn’t add up' },
  ];

  F.def({
    ...lv, id: 'halves-why', name: 'One question', loop: 4000, seqHold: 3400,
    intent: 'One question, four answers in Halves’ own words and no Other. What they keep is said first. A tap closes the ring, wipes the tile to marigold, draws the check and moves on; Skip, just cancel sits where Continue to cancel will be.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const title = head(ctx, 'Before you go,\n*what changed?*');
      const line = sub(ctx, 'Your 8 months stay yours either way.');
      let picked = false;
      const rows = REASONS.map((r) => {
        const row = h('button.hv-ans', { type: 'button', 'aria-pressed': 'false' },
          h('span.hv-tile', F.icon(r.icon, { size: 24 }), h('i.hv-tile-on', F.icon(r.icon, { size: 24 }))),
          h('span.hv-ans-label', r.label), check());
        F.press(ctx, row, { row: true, onTap: () => {
          if (picked) return;
          picked = true;
          pickOn(ctx, row);
          ctx.answers.hvWhy = r.id;
          ctx.at(F.T.pick.advance, () => ctx.next());
        } });
        return row;
      });
      const skip = leave(ctx, 'Skip, just cancel', () => ctx.next({ to: 'halves-bye' }));
      body.append(top(ctx), title, line, h('div.hv-answers', rows), h('div.ph-fill'), h('div.ph-foot', skip));
      F.rise(ctx, [...rows, skip], { delay: 220 });
      if (ctx.mode !== 'flow') ctx.at(2000, () => F.tapEl(ctx, rows[2]));
    },
  });

  // ---------------------------------------------------------------- 2 · take it with you

  F.def({
    ...lv, id: 'halves-export', name: 'Take it with you', loop: 6300, seqHold: 5700,
    intent: 'They moved to another app, so there is no offer: pretending one would help is slop. Their months, ready to take: March to October, every bill and transfer, as a spreadsheet or a statement. Export runs month by month along a measured line, then Saved to Files. Continue to cancel is a full button.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const M = months();
      const first = X.monthName(M[0]), last = X.monthName(M[7]), yr = M[7].getFullYear();
      const title = head(ctx, 'Take your *months* with you.');
      const cells = M.map((d) => {
        const lab = X.monthName(d).slice(0, 3);
        const on = h('i.hv-cell-on', h('span', lab));
        const c = h('span.hv-cell', h('span', lab), on);
        c.on = on;
        return c;
      });
      const prog = h('i');
      const count = h('span', '8 months');
      const kept = h('div.hv-months',
        h('div.hv-months-top', h('b', `${first} to ${last}`), count),
        h('div.hv-cells', cells),
        h('div.hv-prog', prog),
        h('p', `Every bill and transfer, from both of you.`));
      prog.style.transform = 'scaleX(0)';
      let fmt = 'csv', busy = false, done = false;
      const FMTS = [
        { id: 'csv', icon: 'file-spreadsheet', name: 'Spreadsheet', ext: '.csv', verb: 'Export spreadsheet' },
        { id: 'pdf', icon: 'file-text', name: 'Statement', ext: '.pdf', verb: 'Export statement' },
      ];
      const go = F.primary(ctx, FMTS[0].verb, { onTap: () => run() });
      const goLabel = go.querySelector('span');
      const cards = FMTS.map((f) => {
        const c = h('button.hv-fmt' + (f.id === fmt ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(f.id === fmt) },
          h('span.hv-fmt-ic', F.icon(f.icon, { size: 24 })), h('b', f.name), h('small', f.ext), check());
        F.press(ctx, c, { scale: 0.98, onTap: () => {
          if (busy || done || fmt === f.id) return;
          fmt = f.id;
          cards.forEach((x) => {
            x.classList.remove('is-on');
            x.setAttribute('aria-pressed', 'false');
          });
          pickOn(ctx, c);
          F.swapText(ctx, goLabel, f.verb);
        } });
        return c;
      });
      const fileName = h('b');
      const file = h('div.hv-file', h('span.hv-file-ic', F.icon('file-down', { size: 20 })), h('div', fileName, h('small', 'Saved to Files › Halves')));
      file.style.visibility = 'hidden';
      const out = leave(ctx);
      body.append(top(ctx), title, kept, h('div.hv-formats', cards), file, h('div.ph-fill'), h('div.ph-foot', go, out));
      F.rise(ctx, [kept, ...cards, go, out], { delay: 220 });

      /** Export: the line runs month by month, each month filling as the line reaches it. */
      const run = () => {
        if (busy || done) return;
        busy = true;
        F.swapText(ctx, goLabel, 'Exporting');
        go.classList.add('is-busy');
        const STEP = 150;
        M.forEach((_, i) => ctx.at(260 + i * STEP, () => {
          draw(ctx, prog, { from: i / 8, to: (i + 1) / 8, ms: STEP - 10, curve: 'standard' });
          const c = cells[i].on;
          c.style.clipPath = 'inset(0 0 0 0)';
          if (!F.reduced()) ctx.track(c.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: ms(STEP), easing: STD(), fill: 'backwards' }));
          ctx.haptic('selection');
        }));
        ctx.at(260 + 8 * STEP + 140, () => {
          busy = false;
          done = true;
          go.classList.remove('is-busy');
          go.classList.add('is-saved');
          F.swapText(ctx, goLabel, 'Saved to Files');
          go.prepend(h('span.hv-saved-ic', F.icon('check', { size: 16, stroke: 2.6 })));
          F.pop(ctx, go.firstChild, { delay: 220 });
          F.swapText(ctx, count, 'Exported');
          fileName.textContent = `${P.mia} and ${P.sam}, ${first.slice(0, 3)}–${last.slice(0, 3)} ${yr}${fmt === 'csv' ? '.csv' : '.pdf'}`;
          file.style.visibility = '';
          wipe(ctx, file, { delay: 120, ms: 380 });
          ctx.haptic('success');
        });
      };
      if (ctx.mode !== 'flow') {
        ctx.at(1700, () => F.tapEl(ctx, go));
        ctx.at(4660, () => F.tapEl(ctx, out));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · goodbye

  F.def({
    ...lv, id: 'halves-bye', name: 'Goodbye', loop: 5200, seqHold: 4600,
    intent: 'Both names, the exact last day, no more charges, and what stays: their budget, readable and ready to export. Laid out like the app, as a ledger. Keep Halves Plus undoes it in one tap.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const P = month(ctx);
      const M = months();
      const pair = h('div.hv-pair', avatar('mia', 92), avatar('sam', 92));
      const title = head(ctx, `Thanks,\n*${P.mia} and ${P.sam}.*`, { cls: '.is-center', delay: 200 });
      const row = (icon, label, value) => h('div.hv-rc', F.icon(icon, { size: 19 }), h('div', h('small', label), h('b', value)));
      const receipt = h('div.hv-receipt',
        row('calendar', 'Halves Plus ends', X.long(ENDS())),
        row('circle-check', 'After that', 'You won’t be charged again.'),
        row('file-text', 'Your shared budget', `${X.monthName(M[0])} to ${X.monthName(M[7])} stays readable and exportable.`));
      const done = F.primary(ctx, 'Done');
      const undo = leave(ctx, 'Keep Halves Plus', () => {});
      body.append(pair, title, receipt, h('div.ph-fill'), h('div.ph-foot', done, undo));
      F.rise(ctx, [...pair.children, receipt, done, undo], { delay: 40, stagger: 100 });
      if (ctx.mode !== 'flow') ctx.at(3600, () => F.tapEl(ctx, done));
    },
  });
})();
