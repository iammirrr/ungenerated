/* What the six apps share: a few more Lucide icons, real dates, the iOS alert (drawn as the
 * system draws it, never restyled), and the generated draft's parts (the default kit). */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  const X = (window.X = {});

  // Lucide (ISC licence), in the same form as js/icons.js.
  Object.assign(window.F_ICONS, {
    sprout: [['path', { d: 'M7 20h10' }], ['path', { d: 'M10 20c5.5-2.5.8-6.4 3-10' }], ['path', { d: 'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z' }], ['path', { d: 'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' }]],
    wallet: [['path', { d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1' }], ['path', { d: 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' }]],
    truck: [['path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' }], ['path', { d: 'M15 18H9' }], ['path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' }], ['circle', { cx: 17, cy: 18, r: 2 }], ['circle', { cx: 7, cy: 18, r: 2 }]],
    wrench: [['path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' }]],
    'cloud-moon': [['path', { d: 'M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197' }], ['path', { d: 'M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z' }]],
    'audio-lines': [['path', { d: 'M2 10v3' }], ['path', { d: 'M6 6v11' }], ['path', { d: 'M10 3v18' }], ['path', { d: 'M14 8v7' }], ['path', { d: 'M18 5v13' }], ['path', { d: 'M22 10v3' }]],
    'wifi-off': [['path', { d: 'M12 20h.01' }], ['path', { d: 'M8.5 16.429a5 5 0 0 1 7 0' }], ['path', { d: 'M5 12.859a10 10 0 0 1 5.17-2.69' }], ['path', { d: 'M19 12.859a10 10 0 0 0-2.007-1.523' }], ['path', { d: 'M2 8.82a15 15 0 0 1 4.177-2.643' }], ['path', { d: 'M22 8.82a15 15 0 0 0-11.288-3.764' }], ['path', { d: 'm2 2 20 20' }]],
    droplet: [['path', { d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' }]],
  });

  // ---------------------------------------------------------------- dates (always real)

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  X.day = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };
  X.short = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  X.monthName = (d) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];

  /** A demo finger that drags: lands at (x0, y), follows the path, lifts. fn(t 0..1) each frame. */
  X.drag = (ctx, root, x0, x1, y, o, fn) => {
    const dot = h('span.touch', { style: { left: x0 + 'px', top: y + 'px' } });
    root.append(dot);
    F.move(dot, { o: 0, s: 1.35 }, { o: 1, s: 1 }, { duration: 240, curve: 'strong', ctx, fill: 'backwards' });
    F.move(dot, { s: 1 }, { s: 0.8 }, { duration: 110, delay: 260, curve: 'strong', ctx, fill: 'forwards' });
    const ease = F.bezier(o.curve || 'inout');
    ctx.at(380, () => {
      o.down && o.down();
      const t0 = performance.now();
      const stop = ctx.loop(() => {
        const t = F.clamp((performance.now() - t0) / o.duration, 0, 1);
        const e = ease(t);
        dot.style.left = F.lerp(x0, x1, e) + 'px';
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

  // ---------------------------------------------------------------- the iOS alert, as iOS draws it

  /** The system alert. buttons: [{label, bold}]. Returns {el, buttons, close()}. */
  X.alert = (ctx, root, o) => {
    const scrim = h('div.ios-scrim');
    const btns = o.buttons.map((b) => h('button.ios-alert-btn' + (b.bold ? '.is-bold' : ''), { type: 'button' }, b.label));
    const box = h('div.ios-alert', h('div.ios-alert-text', h('strong', o.title), h('p', o.message)), h('div.ios-alert-btns' + (btns.length === 2 ? '.is-pair' : ''), btns));
    const el = h('div.ios-alert-layer', scrim, box);
    root.append(el);
    F.move(scrim, { o: 0 }, { o: 1 }, { duration: 220, curve: 'strong', ctx, fill: 'backwards', delay: o.delay || 0 });
    F.move(box, { s: 1.12, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.32, damping: 0.86 }, ctx, fill: 'backwards', delay: o.delay || 0 });
    btns.forEach((b, i) => F.press(ctx, b, { row: true, onTap: () => o.buttons[i].onTap && o.buttons[i].onTap() }));
    return {
      el, buttons: btns,
      close() {
        F.move(scrim, { o: 1 }, { o: 0 }, { duration: 200, curve: 'exit', ctx, fill: 'forwards' });
        F.move(box, { s: 1, o: 1 }, { s: 1, o: 0 }, { duration: 200, curve: 'exit', ctx, fill: 'forwards' });
        ctx.at(220, () => el.remove());
      },
    };
  };

  // ---------------------------------------------------------------- the generated draft's parts

  const S = (window.S = {});
  /** The frame every generated draft gets: Inter, a white ground, two blurred blobs. */
  S.frame = (ctx, o = {}) => {
    const fr = F.frame(ctx, { cls: 'slop' + (o.dark ? ' is-dark' : ''), tone: o.dark ? 'light' : undefined });
    if (o.blobs !== false) ctx.root.prepend(h('div.s-blobs', h('i.s-blob.is-a'), h('i.s-blob.is-b')));
    return fr;
  };
  S.btn = (ctx, label, o = {}) => {
    const b = h('button.s-btn' + (o.glow ? '.is-glow' : ''), { type: 'button' }, label);
    F.press(ctx, b, { scale: 1, onTap: o.onTap || (() => {}) });
    return b;
  };
  S.dots = (n, i) => h('div.s-dots', Array.from({ length: n }, (_, k) => h('i' + (k === i ? '.is-on' : ''))));
  /** Everything at once, with an overshoot: the generated entrance. */
  S.in = (els, delay = 0) => els.filter(Boolean).forEach((el, i) => {
    el.classList.add('s-in');
    el.style.animationDelay = delay + i * 40 + 'ms';
  });
  S.countdown = (ctx, el, seconds) => {
    let s = seconds;
    const tick = () => { el.textContent = F.clock(s); s = Math.max(0, s - 1); };
    tick();
    const run = () => ctx.at(1000, () => { tick(); run(); });
    run();
  };
})();
