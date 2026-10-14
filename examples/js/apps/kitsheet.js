/* A kit, before and after: kitsheet.html#<app>. Every part on its own, Claude's default kit on the
 * left, the app's kit on the right, each pressable. The right side moves in the app's motion style
 * (F.press, F.toggle, F.setValue... read it from the context). When the page says {cmd: 'play'},
 * a finger goes through both columns at once, so the difference is felt, then it's yours to try.
 * The sheet tells the page its height ({type: 'height', h}) so the frame fits it. */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  const app = ((window.APPS && window.APPS.apps) || []).find((a) => a.id === location.hash.slice(1)) || (window.APPS && window.APPS.apps[0]);
  const G = window.APPS && window.APPS.generated;
  const root = document.getElementById('ks');
  if (!app || !G) return;
  const qs = new URLSearchParams(location.search);
  if (+qs.get('speed') > 0) F.T.speed = +qs.get('speed');

  const makeCtx = window.X.miniCtx;
  const boxOf = (kit) => h('div.ph.ks-box.' + kit);
  const rows = [];
  const row = (label, before, after) => rows.push({ label, before, after });

  // ------------------------------------------------------------------ the two kits, part by part
  // Each builder returns { el, demo(ctx) }: the part, and what a finger does to it.

  const swatches = (list) => h('div.ks-sw', { style: { '--n': list.length } }, list.map(([n, c]) => h('div', h('i', { style: { background: c } }), h('b', n), h('small', c))));
  row('Colour',
    () => ({ el: swatches(G.swatches) }),
    () => ({ el: swatches(app.kit.swatches) }));

  const type = (font, note, sample, body) => [h('div.ks-type', h('span.aa', 'Aa'), h('span', font, h('small', note))), h('p.ks-sample', sample), h('p.ks-body', body)];
  row('Type',
    () => ({ el: type(G.font, 'for every word, in every app', G.sample, 'Our AI-powered companion helps you unlock your full potential.') }),
    () => ({ el: type(app.kit.font, app.kit.body === 'same' ? 'for every word' : 'for headings, the system face for the rest', app.kit.sample, app.what) }));

  row('Buttons',
    (ctx) => {
      const a = h('button.g-btn', { type: 'button' }, 'Get Started 🚀'), b = h('button.g-btn.is-outline', { type: 'button' }, 'Learn More'), c = h('button.g-btn.is-off', { type: 'button' }, 'Continue');
      return { el: [a, b, c], demo: () => ctx.at(0, () => tapPlain(ctx, a)) };
    },
    (ctx) => {
      const a = F.primary(ctx, 'Continue', { onTap: () => {} }), b = F.primary(ctx, 'Not now', { kind: 'quiet', onTap: () => {} }), c = F.primary(ctx, 'Continue', { disabled: true });
      return { el: [a, b, c], demo: () => F.tapEl(ctx, a) };
    });

  row('Toggles',
    (ctx) => {
      const mk = (label, on) => { const t = h('button.g-tog' + (on ? '.is-on' : ''), { type: 'button', 'aria-label': label }); ctx.on(t, 'click', () => t.classList.toggle('is-on')); return [h('div.ks-tog', h('span', label), t), t]; };
      const [r1, t1] = mk('Reminders', false), [r2] = mk('Sounds', true);
      return { el: [r1, r2], demo: () => tapPlain(ctx, t1) };
    },
    (ctx) => {
      const t1 = F.toggle(ctx, false, () => {}), t2 = F.toggle(ctx, true, () => {});
      return { el: [h('div.ks-tog', h('span', 'Reminders'), t1), h('div.ks-tog', h('span', 'Sounds'), t2)], demo: () => F.tapEl(ctx, t1) };
    });

  row('Slider',
    (ctx) => {
      const out = h('b', '40%');
      const r = h('input.g-range', { type: 'range', min: 0, max: 100, value: 40, 'aria-label': 'Level' });
      ctx.on(r, 'input', () => (out.textContent = r.value + '%'));
      return { el: [h('div.ks-value.g-value', out), r], demo: () => { let v = 40; const stop = ctx.loop(() => { v = Math.min(78, v + 1.2); r.value = v; out.textContent = Math.round(v) + '%'; if (v >= 78) stop(); }); } };
    },
    (ctx) => {
      const out = h('b', '40%');
      let s;
      s = F.slider(ctx, { min: 0, max: 100, step: 1, value: 40, label: 'Level', onInput: (v) => (out.textContent = v + '%') });
      return { el: [h('div.ks-value', out), s], demo: () => {
        const r = s.getBoundingClientRect();
        const y = r.top + r.height / 2, x0 = r.left + r.width * 0.4, x1 = r.left + r.width * 0.78;
        const fire = (type, x) => s.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
        fire('pointerdown', x0);
        let t = 0;
        const stop = ctx.loop((dt) => { t = Math.min(1, t + dt / 700); fire('pointermove', x0 + (x1 - x0) * t); if (t >= 1) { stop(); fire('pointerup', x1); } });
      } };
    });

  const OPTS = [['day', 'Day'], ['week', 'Week'], ['month', 'Month']];
  row('Choice',
    (ctx) => {
      const btns = OPTS.map(([v, l], i) => { const b = h('button' + (i === 0 ? '.is-on' : ''), { type: 'button' }, l); ctx.on(b, 'click', () => btns.forEach((x) => x.classList.toggle('is-on', x === b))); return b; });
      return { el: h('div.g-seg', btns), demo: () => tapPlain(ctx, btns[2]) };
    },
    (ctx) => {
      const s = F.seg(ctx, OPTS, 'day', () => {});
      return { el: s, demo: () => F.tapEl(ctx, s.querySelectorAll('button')[2]) };
    });

  const CHIPS = ['Morning', 'Evening', 'Weekends'];
  row('Chips',
    (ctx) => {
      const cs = CHIPS.map((l, i) => { const c = h('button.g-chip' + (i === 0 ? '.is-on' : ''), { type: 'button' }, (i === 0 ? '☀️ ' : i === 1 ? '🌙 ' : '🎉 ') + l); ctx.on(c, 'click', () => c.classList.toggle('is-on')); return c; });
      return { el: h('div.ks-chips', cs), demo: () => tapPlain(ctx, cs[1]) };
    },
    (ctx) => {
      const cs = CHIPS.map((l, i) => F.chipPick(ctx, { label: l, on: i === 0, onTap: (c) => F.picked(ctx, c, !c.classList.contains('is-on')) }));
      return { el: h('div.ks-chips', cs), demo: () => F.tapEl(ctx, cs[1]) };
    });

  row('A value',
    (ctx) => {
      const v = h('b', '25 min'), b = h('button', { type: 'button' }, 'Shorter');
      let short = false;
      ctx.on(b, 'click', () => { short = !short; v.textContent = short ? '18 min' : '25 min'; });
      return { el: h('div.ks-value.g-value', v, b), demo: () => tapPlain(ctx, b) };
    },
    (ctx) => {
      const v = h('b', '25 min'), b = h('button', { type: 'button' }, 'Shorter');
      let short = false;
      F.press(ctx, b, { scale: 0.95, onTap: () => { short = !short; F.setValue(ctx, v, short ? '18 min' : '25 min'); } });
      return { el: h('div.ks-value', v, b), demo: () => F.tapEl(ctx, b) };
    });

  /** The default kit's demo finger: a plain click, no press, no physics (that is the point). */
  function tapPlain(ctx, el) {
    const p = F.pos(el, ctx.root);
    F.touch(ctx, ctx.root, p.cx, p.cy);
    ctx.at(410, () => el.click());
  }

  // ------------------------------------------------------------------ the sheet

  root.append(h('span.ks-col'), h('span.ks-col.is-before', 'Before'), h('span.ks-col', 'After'));
  const demos = [];
  rows.forEach((r) => {
    const before = boxOf('k-generated'), after = boxOf('k-' + app.id);
    const cb = makeCtx(before, null), ca = makeCtx(after, app.style);
    const b = r.before(cb), a = r.after(ca);
    [].concat(b.el).forEach((x) => before.append(x));
    [].concat(a.el).forEach((x) => after.append(x));
    root.append(h('span.ks-label', r.label), before, after);
    if (b.demo || a.demo) demos.push(() => { b.demo && b.demo(); a.demo && a.demo(); });
  });

  // The page plays the demos once the sheet is in view; afterwards it is yours.
  let played = false;
  const play = () => {
    if (played) return;
    played = true;
    demos.forEach((d, i) => setTimeout(d, (400 + i * 700) * F.k()));
  };
  window.addEventListener('message', (e) => { if (e.data && e.data.cmd === 'play') play(); });
  if (qs.has('autoplay')) play();
  const tell = () => { try { window.parent.postMessage({ type: 'height', h: Math.ceil(root.getBoundingClientRect().height) + 4 }, '*'); } catch {} };
  new ResizeObserver(tell).observe(root);
  document.fonts && document.fonts.ready.then(tell);
  tell();
})();
