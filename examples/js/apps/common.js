/* What the example apps share: more Lucide icons, real dates, the iOS alert and sheet (drawn as
 * the system draws them, never restyled), pictures with their placeholders (X.pic), app icons,
 * the mascot's stand-in, and the generated draft's parts (the default kit). */
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
    leaf: [['path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' }], ['path', { d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' }]],
    utensils: [['path', { d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' }], ['path', { d: 'M7 2v20' }], ['path', { d: 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' }]],
    trophy: [['path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6' }], ['path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18' }], ['path', { d: 'M4 22h16' }], ['path', { d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' }], ['path', { d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' }], ['path', { d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z' }]],
    watch: [['circle', { cx: 12, cy: 12, r: 6 }], ['polyline', { points: '12 10 12 12 13 13' }], ['path', { d: 'm16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05' }], ['path', { d: 'm7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05' }]],
    repeat: [['path', { d: 'm17 2 4 4-4 4' }], ['path', { d: 'M3 11v-1a4 4 0 0 1 4-4h14' }], ['path', { d: 'm7 22-4-4 4-4' }], ['path', { d: 'M21 13v1a4 4 0 0 1-4 4H3' }]],
    smile: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }], ['line', { x1: 9, x2: 9.01, y1: 9, y2: 9 }], ['line', { x1: 15, x2: 15.01, y1: 9, y2: 9 }]],
    'heart-pulse': [['path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' }], ['path', { d: 'M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27' }]],
    apple: [['path', { d: 'M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z' }], ['path', { d: 'M10 2c1 .5 2 2 2 5' }]],
    thermometer: [['path', { d: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z' }]],
    'glass-water': [['path', { d: 'M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z' }], ['path', { d: 'M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0' }]],
    'file-spreadsheet': [['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }], ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }], ['path', { d: 'M8 13h2' }], ['path', { d: 'M14 13h2' }], ['path', { d: 'M8 17h2' }], ['path', { d: 'M14 17h2' }]],
    navigation: [['polygon', { points: '3 11 22 2 13 21 11 13 3 11' }]],
  });

  // ---------------------------------------------------------------- pictures, icons, the mascot

  /**
   * A picture by its id in examples/images.json. Until the file exists (examples/images/<id>.*),
   * a placeholder that says what goes there. o: {cls ('is-contain is-dark is-small is-cutout'), style,
 * icon (the placeholder's icon)}. is-small hides the placeholder's words (a caption names it).
   */
  X.pic = (id, o = {}) => {
    const src = (F.PICS || {})[id];
    const info = (F.PIC_INFO || {})[id] || { label: id, kind: 'photo' };
    const cls = ['pic', src ? '' : 'is-empty', ...(o.cls ? o.cls.split(' ') : [])].filter(Boolean).join('.');
    const el = h('div.' + cls, { style: o.style, 'data-pic': id });
    if (src) el.append(h('img', { src, alt: info.label, draggable: 'false' }));
    else el.append(h('div.pic-ph', F.icon(o.icon || (info.kind === 'avatar' ? 'user-round' : info.kind === 'mascot' ? 'smile' : 'image'), { size: 20 }), h('b', info.label), h('small', id)));
    return el;
  };
  X.has = (id) => !!(F.PICS || {})[id];

  /** An app's icon: its picture, or its initial on its own colours until the picture exists. */
  X.appIcon = (appId, size = 60) => {
    const a = ((window.APPS && window.APPS.apps) || []).find((x) => x.id === appId) || { name: appId, kit: {} };
    const el = h('span.app-ic', { style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.48) + 'px', background: a.kit.accent, color: a.kit.btnInk || '#fff' } });
    const src = (F.PICS || {})[appId + '-icon'];
    if (src) el.append(h('img', { src, alt: '' }));
    else el.textContent = a.name.slice(0, 1);
    return el;
  };

  /**
   * Tazza, Parla's mascot: the picture for a pose (parla-tazza-<pose>), or a drawn stand-in until
   * it exists. pose: hello, listen, cheer, sleep, wave.
   */
  X.tazza = (pose = 'hello', size = 160) => {
    const id = 'parla-tazza-' + pose;
    if (X.has(id)) return X.pic(id, { cls: 'is-cutout is-contain', style: { width: size + 'px', height: size + 'px' } });
    const s = (tag, a) => F.svg(tag, a);
    const arm = (x1, y1, x2, y2) => [s('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: '#E9E1D8', 'stroke-width': 14, 'stroke-linecap': 'round' }), s('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: '#fff', 'stroke-width': 10, 'stroke-linecap': 'round' })];
    const ARMS = {
      hello: [...arm(56, 120, 44, 140), ...arm(146, 116, 168, 82)],
      listen: [...arm(56, 118, 36, 106), ...arm(146, 124, 156, 142)],
      cheer: [...arm(56, 114, 34, 80), ...arm(146, 114, 168, 80)],
      sleep: [...arm(58, 128, 48, 144), ...arm(144, 128, 154, 144)],
      wave: [...arm(56, 122, 42, 146), ...arm(146, 116, 168, 84), s('rect', { x: 24, y: 140, width: 26, height: 19, rx: 4, fill: '#FFE7B8', stroke: '#C8351F', 'stroke-width': 2 }), s('path', { d: 'M31 140 v-4 h12 v4', stroke: '#C8351F', 'stroke-width': 3, fill: 'none' })],
    };
    const closed = pose === 'cheer' ? 'M74 110 Q82 100 90 110 M110 110 Q118 100 126 110' : 'M74 108 Q82 114 90 108 M110 108 Q118 114 126 108';
    const eyes = pose === 'cheer' || pose === 'sleep'
      ? [s('path', { d: closed, stroke: '#1c1716', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' })]
      : [s('circle', { cx: 82, cy: 107, r: 9, fill: '#1c1716' }), s('circle', { cx: 118, cy: 107, r: 9, fill: '#1c1716' }), s('circle', { cx: 85, cy: 104, r: 3, fill: '#fff' }), s('circle', { cx: 121, cy: 104, r: 3, fill: '#fff' })];
    const mouth = pose === 'cheer'
      ? s('path', { d: 'M92 123 Q100 136 108 123 Z', fill: '#8E2516' })
      : s('path', { d: pose === 'sleep' ? 'M96 125 Q100 127 104 125' : 'M93 123 Q100 130 107 123', stroke: '#1c1716', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' });
    const wisp = (x) => s('path', { d: `M${x} 56 C${x - 6} 48 ${x + 8} 42 ${x + 1} 32`, stroke: 'rgba(255,255,255,.72)', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' });
    const steam = pose === 'cheer' ? [wisp(88), wisp(112)] : pose === 'sleep' || pose === 'hello' ? [wisp(100)] : [];
    const svg = s('svg', { viewBox: '0 0 200 200', width: size, height: size, class: 'tazza is-' + pose, 'aria-label': 'Tazza' });
    [
      ...steam,
      s('ellipse', { cx: 100, cy: 172, rx: 66, ry: 11, fill: 'rgba(0,0,0,.14)' }),
      s('ellipse', { cx: 100, cy: 167, rx: 68, ry: 13, fill: '#FFE7B8' }),
      s('ellipse', { cx: 100, cy: 165, rx: 68, ry: 13, fill: 'none', stroke: '#E4472E', 'stroke-width': 2.5 }),
      s('path', { d: 'M150 92 C180 90 180 130 146 130', stroke: '#E9E1D8', 'stroke-width': 13, fill: 'none', 'stroke-linecap': 'round' }),
      s('path', { d: 'M150 92 C176 91 176 128 146 128', stroke: '#fff', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }),
      s('path', { d: 'M46 70 Q46 64 52 64 L148 64 Q154 64 154 70 L147 140 Q144 162 120 163 L80 163 Q56 162 53 140 Z', fill: '#fff', stroke: '#EDE6DE', 'stroke-width': 2 }),
      s('path', { d: 'M47 73 L153 73 L152 82 L48 82 Z', fill: '#E4472E' }),
      ...(ARMS[pose] || ARMS.hello),
      ...eyes,
      s('ellipse', { cx: 70, cy: 121, rx: 7, ry: 4, fill: '#FFB3A6', opacity: 0.85 }),
      s('ellipse', { cx: 130, cy: 121, rx: 7, ry: 4, fill: '#FFB3A6', opacity: 0.85 }),
      mouth,
    ].forEach((n) => svg.append(n));
    return h('div.tazza-wrap', { style: { width: size + 'px', height: size + 'px' } }, svg);
  };

  // ---------------------------------------------------------------- the iOS sheet, as iOS draws it

  /** A system sheet (Subscriptions, Settings): o.title, o.body (a node), o.done ('Done'). */
  X.sheet = (ctx, root, o) => {
    const scrim = h('div.ios-sheet-scrim');
    const sheet = h('div.ios-sheet', h('i.ios-sheet-grab'), h('div.ios-sheet-nav', h('span'), h('b', o.title), h('span', o.done || 'Done')), o.body);
    const el = h('div.ios-sheet-layer', scrim, sheet);
    root.append(el);
    F.move(scrim, { o: 0 }, { o: 1 }, { duration: 260, delay: o.delay || 0, curve: 'strong', ctx, fill: 'backwards' });
    F.move(sheet, { y: 820 }, { y: 0 }, { spring: { response: 0.5, damping: 0.92 }, delay: o.delay || 0, ctx, fill: 'backwards' });
    return {
      el, sheet,
      close() {
        F.move(scrim, { o: 1 }, { o: 0 }, { duration: 220, curve: 'exit', ctx, fill: 'forwards' });
        F.move(sheet, { y: 0 }, { y: 820 }, { duration: 320, curve: 'exit', ctx, fill: 'forwards' });
        ctx.at(340, () => el.remove());
      },
    };
  };


  // ---------------------------------------------------------------- dates (always real)

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  X.day = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };
  X.short = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  X.monthName = (d) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
  X.weekday = (d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
  /** "Monday, November 3" */
  X.long = (d) => `${X.weekday(d)}, ${X.monthName(d)} ${d.getDate()}`;
  /** "November 3, 2026" */
  X.longYear = (d) => `${X.monthName(d)} ${d.getDate()}, ${d.getFullYear()}`;

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
