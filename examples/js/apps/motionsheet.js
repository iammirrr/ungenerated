/* The motion styles, part by part: motionsheet.html. One row per style, each in the kit of the app
 * that moves that way, and the same four parts in every row: a heading, a button, a toggle and a
 * value. The first row is Claude's default, for contrast. One column moves at a time, in every row
 * at once, so the eye reads a column and compares. Plays on {cmd: 'play'} (or ?autoplay), stops on
 * {cmd: 'pause'}; tells the page its height ({type: 'height', h}). ?speed=0.25 slows it all down,
 * for recording. */
(() => {
  'use strict';
  const F = window.F, X = window.X, h = F.h;
  const APPS = (window.APPS && window.APPS.apps) || [];
  const G = window.APPS && window.APPS.generated;
  const root = document.getElementById('ms');
  if (!F.STYLES || !G) return;
  const qs = new URLSearchParams(location.search);
  if (+qs.get('speed') > 0) F.T.speed = +qs.get('speed');

  const COLS = ['Heading', 'Button', 'Toggle', 'Value'];
  const VALUES = ['25 min', '18 min'];
  root.append(h('span'), ...COLS.map((c) => h('span.ms-col', c)));

  /** Claude's default: the parts the generated drafts use, moving the way they move. */
  const generatedRow = () => {
    const ctx = X.miniCtx(null, null);
    const cells = COLS.map(() => h('div.ph.ks-box.ms-cell.k-generated'));
    let head = h('p.ms-head', G.sample);
    const btn = h('button.g-btn', { type: 'button' }, 'Get Started 🚀');
    const tog = h('button.g-tog', { type: 'button', 'aria-label': 'Sound' });
    const value = h('b.ms-value', VALUES[0]);
    let vi = 0;
    tog.addEventListener('click', () => tog.classList.toggle('is-on'));
    cells[0].append(head);
    cells[1].append(btn);
    cells[2].append(h('div.ks-tog', h('span', 'Sound'), tog));
    cells[3].append(h('div.g-value', value));
    const tap = (cell, el) => {
      const p = F.pos(el, cell);
      F.touch({ ...ctx, root: cell }, cell, p.cx, p.cy);
      ctx.at(410, () => el.click());
    };
    return {
      label: h('div.ms-label.is-before', h('b', 'Default'), h('small', 'Claude alone')),
      cells,
      beats: [
        () => {
          // Everything at once, with an overshoot: the generated entrance.
          head.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 * F.k(), easing: 'linear', fill: 'forwards' });
          ctx.at(380, () => {
            const fresh = h('p.ms-head', G.sample);
            head.replaceWith(fresh);
            head = fresh;
            head.animate([{ opacity: 0, transform: 'translateY(26px) scale(0.94)' }, { opacity: 1, transform: 'none' }], { duration: 750 * F.k(), easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' });
          });
        },
        () => tap(cells[1], btn),
        () => tap(cells[2], tog),
        () => { vi = 1 - vi; value.textContent = VALUES[vi]; },
      ],
    };
  };

  /** A style's row, in the kit of the app that moves that way. */
  const styleRow = (key) => {
    const S = F.STYLES[key];
    const app = APPS.find((a) => a.style === key);
    const kit = app ? 'k-' + app.id : '';
    const cells = COLS.map(() => h('div.ph.ks-box.ms-cell' + (kit ? '.' + kit : '')));
    const ctxs = cells.map((c) => X.miniCtx(c, key));
    const text = (app && app.kit.sample) || S.feel;
    let head = h('p.ms-head', text);
    const btn = F.primary(ctxs[1], 'Continue', { onTap: () => {} });
    const tog = F.toggle(ctxs[2], false, () => {});
    const value = h('b.ms-value', VALUES[0]);
    let vi = 0;
    cells[0].append(head);
    cells[1].append(btn);
    cells[2].append(h('div.ks-tog', h('span', 'Sound'), tog));
    cells[3].append(value);
    const out = (S.out && S.out.ms) || 200;
    return {
      label: h('div.ms-label', h('b', S.name), h('small', S.feel), app ? h('small.ms-app', app.name) : null),
      cells,
      beats: [
        () => {
          F.exit(ctxs[0], head);
          ctxs[0].at(out + 80, () => {
            const fresh = h('p.ms-head', text);
            head.replaceWith(fresh);
            head = fresh;
            F.titleIn(ctxs[0], head);
          });
        },
        () => F.tapEl(ctxs[1], btn),
        () => F.tapEl(ctxs[2], tog),
        () => { vi = 1 - vi; F.setValue(ctxs[3], value, VALUES[vi]); },
      ],
    };
  };

  const rows = [generatedRow(), ...Object.keys(F.STYLES).map(styleRow)];
  rows.forEach((r) => root.append(r.label, ...r.cells));

  // One column at a time, every row at once; then round again while the sheet is on screen.
  const BEAT = 1700;
  let running = false, timer = 0, col = 0;
  const step = () => {
    if (!running) return;
    rows.forEach((r) => r.beats[col]());
    root.querySelectorAll('.ms-col').forEach((c, i) => c.classList.toggle('is-on', i === col));
    col = (col + 1) % COLS.length;
    timer = setTimeout(step, (BEAT + (col === 0 ? 900 : 0)) * F.k());
  };
  const play = () => { if (running) return; running = true; timer = setTimeout(step, 500 * F.k()); };
  const pause = () => { running = false; clearTimeout(timer); };
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.cmd === 'play') play();
    if (e.data.cmd === 'pause') pause();
  });
  if (qs.has('autoplay')) play();
  const tell = () => { try { window.parent.postMessage({ type: 'height', h: Math.ceil(root.getBoundingClientRect().height) + 4 }, '*'); } catch {} };
  new ResizeObserver(tell).observe(root);
  document.fonts && document.fonts.ready.then(tell);
  tell();
})();
