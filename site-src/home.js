// The home page's motion and controls. No libraries: springs are sampled the SwiftUI way (as the
// board's kit.js does), and every phone is a live screen from the example board in an iframe.
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const APPS = (window.APPS && window.APPS.apps) || [];
  // ?still=<selector>: the README posters (scripts/shots.mjs). Everything lands at once; the strip
  // shows both rows, the draft over the skills.
  const STILL = new URLSearchParams(location.search).get('still');
  if (STILL) document.documentElement.classList.add('is-still');

  // ---------------------------------------------------------------- springs and curves

  const springCache = new Map();
  const spring = (response, damping) => {
    const key = response + ':' + damping;
    if (springCache.has(key)) return springCache.get(key);
    const k = Math.pow((2 * Math.PI) / response, 2), c = (4 * Math.PI * damping) / response, dt = 1 / 600;
    let x = 0, v = 0, t = 0, n = 0;
    const values = [0];
    while (t < 3) {
      v += (k * (1 - x) - c * v) * dt; x += v * dt; t += dt;
      if (++n % 10 === 0) values.push(x);
      if (t > 0.05 && Math.abs(1 - x) < 0.0008 && Math.abs(v) < 0.01) break;
    }
    values.push(1);
    const out = { values, duration: t * 1000 };
    springCache.set(key, out);
    return out;
  };
  const bezier = ([x1, y1, x2, y2]) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return sy(t);
    };
  };
  const CURVE = { inout: bezier([0.76, 0, 0.24, 1]), strong: bezier([0.23, 1, 0.32, 1]), emph: bezier([0.16, 1, 0.3, 1]) };
  const CSS = { strong: 'cubic-bezier(.23,1,.32,1)', emph: 'cubic-bezier(.16,1,.3,1)', decel: 'cubic-bezier(0,0,.2,1)' };
  /** Tween a number with rAF; returns stop(). */
  const tween = (a, b, ms, curve, fn, done) => {
    if (reduce) { fn(b); done && done(); return () => {}; }
    const t0 = performance.now();
    let raf = 0, alive = true;
    const tick = (now) => {
      if (!alive) return;
      const t = clamp((now - t0) / ms, 0, 1);
      fn(a + (b - a) * curve(t));
      if (t < 1) raf = requestAnimationFrame(tick); else done && done();
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  };
  /** A spring on any frames builder: frames(v) → keyframe. */
  const springAnim = (el, sp, frames, o = {}) => {
    const sc = spring(sp[0], sp[1]);
    return el.animate(sc.values.map(frames), { duration: reduce ? 1 : sc.duration, delay: o.delay || 0, easing: 'linear', fill: o.fill || 'both' });
  };

  // ---------------------------------------------------------------- small things

  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#' + b.dataset.copy + ' code').innerText.trim());
      b.textContent = 'Copied';
      setTimeout(() => (b.textContent = 'Copy'), 1600);
    } catch {}
  }));
  const bar = $('#bar');
  const onScroll = () => bar.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Things rise once as they arrive.
  $$('.sec-head, .tabs, .fixer, .feel, .browser, .board-points, .install-in, .group').forEach((el) => el.setAttribute('data-reveal', ''));
  const revealIo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealIo.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal], .kits').forEach((el) => (STILL ? el.classList.add('is-in') : revealIo.observe(el)));
  const wordsIo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); wordsIo.unobserve(e.target); } }), { rootMargin: '0px 0px -18% 0px' });
  $$('.words li').forEach((li) => (STILL ? li.classList.add('is-in') : wordsIo.observe(li)));

  // ---------------------------------------------------------------- the headline corrects itself

  const fix = $('#fix'), note = $('#fix-note');
  if (reduce) { fix.classList.add('is-fixed'); note.classList.add('is-on'); }
  else {
    setTimeout(() => fix.classList.add('is-striking'), 1100);
    setTimeout(() => fix.classList.add('is-fixed'), 1650);
    setTimeout(() => note.classList.add('is-on'), 1900);
  }

  // ---------------------------------------------------------------- live phones (iframes of the board)

  const post = (f, m) => { try { f.contentWindow && f.src && f.contentWindow.postMessage(m, '*'); } catch {} };
  const fit = (screen) => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
  const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target)));
  $$('.dev-screen').forEach((s) => { if (s.querySelector('iframe')) { fit(s); ro.observe(s); } });
  const frameIo = new IntersectionObserver((es) => es.forEach((e) => {
    const f = e.target;
    f._vis = e.isIntersecting;
    if (f._vis && !f.src) f.src = f.dataset.src;
    else post(f, { cmd: f._vis ? 'play' : 'pause' });
  }), { rootMargin: '120px 0px' });
  $$('iframe[data-src]').forEach((f) => {
    f.addEventListener('load', () => f._vis && post(f, { cmd: 'play' }));
    frameIo.observe(f);
  });
  const showIn = (f, id) => {
    f.dataset.src = 'board/embed.html?paused#' + id;
    if (f.src) post(f, { cmd: 'show', id });
  };

  // ---------------------------------------------------------------- the hero: drag to compare

  const cmp = $('#cmp');
  if (cmp) {
    const screen = $('#cmp-screen');
    const fAfter = $('.cmp-layer.is-after iframe', cmp), fBefore = $('.cmp-layer.is-before iframe', cmp);
    const pills = $$('.app-pill', cmp);
    let p = 1, auto = true, idx = 0, timers = [], stop = null;
    const setP = (v) => { p = clamp(v, 0, 1); cmp.style.setProperty('--p', p.toFixed(4)); };
    const clear = () => { timers.forEach(clearTimeout); timers = []; stop && stop(); };
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const play = (i, user) => {
      clear();
      idx = i;
      const a = APPS[i];
      pills.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
      showIn(fAfter, a.after.id);
      showIn(fBefore, a.before.id);
      setP(1);
      // Hold on the draft, then the skills sweep across it and the rule settles in the middle.
      later(user ? 900 : 2200, () => {
        stop = tween(1, 0.02, 1300, CURVE.inout, setP, () => {
          later(500, () => { stop = tween(0.02, 0.5, 800, CURVE.strong, setP); });
        });
      });
      if (auto) later(Math.max(9000, (a.after.loop || 10000) + 1200), () => play((idx + 1) % APPS.length));
    };
    pills.forEach((b, i) => b.addEventListener('click', () => { auto = false; play(i, true); }));
    // The rule follows the finger anywhere on the screen.
    let drag = false;
    const at = (e) => { const r = screen.getBoundingClientRect(); setP((e.clientX - r.left) / r.width); };
    screen.addEventListener('pointerdown', (e) => { drag = true; auto = false; clear(); cmp.classList.add('is-dragging'); screen.setPointerCapture(e.pointerId); at(e); });
    screen.addEventListener('pointermove', (e) => drag && at(e));
    const up = () => { drag = false; cmp.classList.remove('is-dragging'); };
    screen.addEventListener('pointerup', up);
    screen.addEventListener('pointercancel', up);
    $('.cmp-knob', cmp).addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); auto = false; clear();
      setP(p + (e.key === 'ArrowRight' ? 0.05 : -0.05));
    });
    setP(1);
    play(0);
  }

  // ---------------------------------------------------------------- the strip: a red line applies the skills

  const strip = $('#strip');
  if (strip) {
    const row = $('.strip-row', strip), scan = $('#scan'), label = $('span', scan);
    const shots = $$('.shot', strip);
    const seg = $$('#strip-seg button');
    let mode = 'scan', inView = false, L = -1, stop = null, timers = [];
    const geo = () => shots.map((s) => { const sc = $('.dev-screen', s); return { el: s, x: s.offsetLeft + sc.offsetLeft, w: sc.offsetWidth }; });
    let G = geo();
    addEventListener('resize', () => { G = geo(); paint(); });
    const paint = () => {
      G.forEach((g) => g.el.style.setProperty('--f', clamp((L - g.x) / g.w, 0, 1).toFixed(4)));
      scan.style.transform = `translateX(${(row.offsetLeft + L).toFixed(1)}px)`;
    };
    const clear = () => { timers.forEach(clearTimeout); timers = []; stop && stop(); };
    const W = () => row.offsetWidth;
    const cycle = () => {
      if (mode !== 'scan' || !inView) return;
      scan.classList.add('is-on');
      label.textContent = 'skills applied';
      stop = tween(-20, W() + 20, reduce ? 1 : 3600, CURVE.inout, (v) => { L = v; paint(); }, () => {
        scan.classList.remove('is-on');
        timers.push(setTimeout(() => {
          if (mode !== 'scan') return;
          scan.classList.add('is-on');
          label.textContent = 'generated';
          stop = tween(W() + 20, -20, reduce ? 1 : 2600, CURVE.inout, (v) => { L = v; paint(); }, () => {
            scan.classList.remove('is-on');
            timers.push(setTimeout(cycle, 1400));
          });
        }, 4200));
      });
    };
    const setMode = (m) => {
      mode = m;
      clear();
      seg.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
      if (m === 'scan') { L = -20; paint(); cycle(); return; }
      scan.classList.remove('is-on');
      const from = L, to = m === 'ung' ? W() + 20 : -20;
      stop = tween(from, to, 700, CURVE.strong, (v) => { L = v; paint(); });
    };
    seg.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
    new IntersectionObserver((es) => es.forEach((e) => {
      inView = e.isIntersecting;
      if (inView && mode === 'scan' && !timers.length && !(stop && L > -20)) { G = geo(); L = -20; paint(); clear(); cycle(); }
    }), { threshold: 0.35 }).observe(strip);
    L = -20;
    paint();
    if (STILL === '#before-after') {
      mode = 'still';
      const twin = row.cloneNode(true);
      $$('.shot', twin).forEach((s) => s.style.setProperty('--f', 1));
      row.before(Object.assign(document.createElement('p'), { className: 'strip-label', innerHTML: '<span class="tag is-gen">Generated</span>' }));
      row.after(Object.assign(document.createElement('p'), { className: 'strip-label', innerHTML: '<span class="tag is-ung">With the skills</span>' }), twin);
      $('#strip-seg').hidden = true;
    }
  }

  // ---------------------------------------------------------------- corrections, app by app

  const fixer = $('#fixer');
  if (fixer) {
    const tabs = $$('#tabs .tab');
    const fb = $('.fx-phone.is-before iframe', fixer), fa = $('.fx-phone.is-after iframe', fixer);
    const pins = { before: $('.pins[data-side="before"]', fixer), after: $('.pins[data-side="after"]', fixer) };
    const lists = { before: $('#fx-before'), after: $('#fx-after') };
    const head = $('#fx-app');
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const render = (i, first) => {
      const a = APPS[i];
      tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
      head.innerHTML = `<h3>${esc(a.name)}</h3><p>${esc(a.what)}</p><div class="fx-skills">${a.skills.map((s) => `<a href="skills/${s}.html">${s}</a>`).join('')}</div>`;
      ['before', 'after'].forEach((side) => {
        const notes = a[side].notes;
        lists[side].innerHTML = notes.map((n, k) => `<li data-k="${k}"><span class="pin">${k + 1}</span><div><span>${esc(n.text)}</span><a href="skills/${n.skill}.html">${n.skill}</a></div></li>`).join('');
        pins[side].innerHTML = notes.map((n, k) => `<i class="pin-mark" data-k="${k}" style="left:${n.x}%;top:${n.y}%">${k + 1}</i>`).join('');
        $$('.pin-mark', pins[side]).forEach((m, k) => springAnim(m, [0.38, 0.62], (v) => ({ transform: `scale(${(0.4 + 0.6 * v).toFixed(3)})`, opacity: Math.min(1, v * 2.2) }), { delay: (first ? 900 : 500) + k * 140 }));
        $$('li', lists[side]).forEach((li, k) => {
          li.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: reduce ? 1 : 420, delay: k * 60 + (side === 'after' ? 120 : 0), easing: CSS.decel, fill: 'backwards' });
          const hot = (on) => { li.classList.toggle('is-hot', on); $(`.pin-mark[data-k="${k}"]`, pins[side])?.classList.toggle('is-hot', on); };
          li.addEventListener('mouseenter', () => hot(true));
          li.addEventListener('mouseleave', () => hot(false));
        });
      });
      showIn(fb, a.before.id);
      showIn(fa, a.after.id);
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => render(i)));
    render(0, true);
  }

  // ---------------------------------------------------------------- motion, before and after

  // A press: in to 0.97 and a point down in 90 ms, out on a 0.34 / 0.6 spring.
  $$('.d-btn.is-ung').forEach((b) => {
    let a = null, down = false;
    const pin = () => { down = true; b.classList.add('is-down'); a && a.cancel(); a = b.animate([{ transform: 'none' }, { transform: 'translateY(1px) scale(0.97)' }], { duration: 90, easing: CSS.strong, fill: 'forwards' }); };
    const out = () => { if (!down) return; down = false; b.classList.remove('is-down'); a && a.cancel(); a = springAnim(b, [0.34, 0.6], (v) => ({ transform: `translateY(${(1 - v).toFixed(3)}px) scale(${(0.97 + 0.03 * v).toFixed(4)})` }), { fill: 'none' }); };
    b.addEventListener('pointerdown', pin);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, out));
  });

  // A pick: generated swaps in a frame; ours blooms from the finger and the check pops once.
  $$('.d-rows.is-gen').forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => $$('button', g).forEach((x) => x.classList.toggle('is-on', x === b)))));
  $$('.d-rows.is-ung').forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', (e) => {
    const r = b.getBoundingClientRect();
    const x = e.clientX ? e.clientX - r.left : r.width / 2, y = e.clientY ? e.clientY - r.top : r.height / 2;
    $$('button', g).forEach((o) => {
      if (o === b || !o.classList.contains('is-on')) return;
      o.classList.remove('is-on');
      const bl = $('.bloom', o);
      if (bl) bl.animate([{ transform: bl.style.transform, opacity: 1 }, { transform: 'scale(0)', opacity: 1 }], { duration: 320, easing: CSS.strong, fill: 'forwards' }).onfinish = () => bl.remove();
      $('i', o).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
    });
    if (b.classList.contains('is-on')) return;
    b.classList.add('is-on');
    const bl = document.createElement('span');
    bl.className = 'bloom';
    const reach = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) / 10 + 1;
    bl.style.left = x + 'px';
    bl.style.top = y + 'px';
    bl.style.transform = `scale(${reach})`;
    b.prepend(bl);
    bl.animate([{ transform: 'scale(0)' }, { transform: `scale(${reach})` }], { duration: reduce ? 1 : 460, easing: CSS.emph });
    springAnim($('i', b), [0.38, 0.62], (v) => ({ opacity: Math.min(1, v * 2), transform: `scale(${(0.5 + 0.5 * v).toFixed(3)})` }), { delay: 160, fill: 'both' });
  })));

  // A price: generated replaces the text; ours rolls each digit on its own reel, left to right.
  const PRICES = ['$39.99', '$71.88'];
  let priceI = 0;
  const reel = (el, text, prev) => {
    el.replaceChildren(...[...text].map((ch, i) => {
      if (!/\d/.test(ch)) { const s = document.createElement('span'); s.textContent = ch; return s; }
      const col = document.createElement('span'); col.className = 'col';
      const strip = document.createElement('span');
      for (let k = 0; k < 30; k++) { const d = document.createElement('span'); d.textContent = String(k % 10); strip.append(d); }
      col.append(strip);
      const from = /\d/.test(prev[i] || '') ? +prev[i] : 0, to = 20 + +ch;
      strip.style.transform = `translateY(${-to * 1.12}em)`;
      if (prev && prev[i] !== ch) springAnim(strip, [0.62 + i * 0.06, 0.74], (v) => ({ transform: `translateY(${(-(from + (to - from) * v) * 1.12).toFixed(3)}em)` }), { delay: i * 60, fill: 'backwards' });
      return col;
    }));
  };
  const moneyU = $('.d-money.is-ung'), moneyG = $('.d-money.is-gen');
  if (moneyU) reel(moneyU, PRICES[0], '');
  const switchPrice = () => {
    const prev = PRICES[priceI];
    priceI = 1 - priceI;
    moneyG.textContent = PRICES[priceI];
    reel(moneyU, PRICES[priceI], prev);
  };
  // A screen arriving: generated bounces everything at once; ours focuses the title and rises once.
  const arrive = () => {
    const g = $('.d-screen.is-gen');
    g.classList.remove('is-run'); void g.offsetWidth; g.classList.add('is-run');
    const u = $('.d-screen.is-ung');
    const [t, ...rest] = [...u.children];
    t.animate([{ opacity: 0, transform: 'translateY(10px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: reduce ? 1 : 520, easing: CSS.strong, fill: 'backwards' });
    rest.forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: reduce ? 1 : 420, delay: 90 + i * 60, easing: CSS.decel, fill: 'backwards' }));
  };
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => (b.dataset.go === 'money' ? switchPrice() : arrive())));
  const feelIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    feelIo.unobserve(e.target);
    const d = e.target.dataset.demo;
    if (d === 'money') setTimeout(switchPrice, 700);
    if (d === 'arrive') setTimeout(arrive, 500);
  }), { threshold: 0.6 });
  if (!STILL) $$('.feel').forEach((f) => feelIo.observe(f));

  // ---------------------------------------------------------------- find a skill

  const input = $('.search input');
  if (input) input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    $$('.sk').forEach((s) => { const on = !q || s.dataset.search.includes(q); s.hidden = !on; shown += on; });
    $$('.group').forEach((g) => (g.hidden = !$$('.sk', g).some((s) => !s.hidden)));
    $('.none').hidden = shown > 0;
  });
})();
