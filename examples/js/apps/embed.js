/* One phone, for the page: embed.html#<screen-id> plays that screen's demo and loops it.
 * The page talks to it with postMessage: {cmd: 'pause' | 'play' | 'restart'} or {cmd: 'show', id}.
 * The context matches the board's (js/board.js), so a screen behaves the same in both places. */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  const host = document.getElementById('one');
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const makeCtx = (screen, root) => {
    const timers = new Set(), anims = new Set(), loops = new Set(), offs = [];
    let paused = false;
    const ctx = {
      screen, root, mode: 'demo', dead: false,
      answers: clone(F.DEFAULT_ANSWERS || {}),
      params: {},
      at(ms, fn) {
        const id = setTimeout(() => { timers.delete(id); if (!ctx.dead) fn(); }, ms * F.k());
        timers.add(id);
        return id;
      },
      track(a) {
        if (!a) return a;
        anims.add(a);
        a.finished.then(() => anims.delete(a), () => anims.delete(a));
        if (paused) try { a.pause(); } catch {}
        return a;
      },
      loop(fn) {
        const L = { alive: true, raf: 0, last: 0 };
        const tick = (now) => {
          L.raf = 0;
          if (!L.alive || ctx.dead || paused) return;
          const dt = L.last ? Math.min(64, now - L.last) : 16;
          L.last = now;
          fn(dt, now);
          if (L.alive && !paused) L.raf = requestAnimationFrame(tick);
        };
        L.start = () => { if (!L.raf && L.alive) { L.last = 0; L.raf = requestAnimationFrame(tick); } };
        loops.add(L);
        L.start();
        return () => { L.alive = false; cancelAnimationFrame(L.raf); loops.delete(L); };
      },
      on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); },
      haptic() {},
      next() {},
      back() {},
      restart() { show(current, true); },
      pause() { paused = true; anims.forEach((a) => { try { a.pause(); } catch {} }); },
      resume() { if (!paused) return; paused = false; anims.forEach((a) => { try { a.play(); } catch {} }); loops.forEach((L) => L.start()); },
      dispose() {
        ctx.dead = true;
        timers.forEach(clearTimeout);
        anims.forEach((a) => { try { a.cancel(); } catch {} });
        loops.forEach((L) => { L.alive = false; cancelAnimationFrame(L.raf); });
        offs.forEach((f) => f());
      },
    };
    return ctx;
  };

  let ctx = null, current = null, loopTimer = 0, paused = false, startedAt = 0, elapsed = 0;
  const schedule = (ms) => {
    clearTimeout(loopTimer);
    if (paused) return;
    startedAt = performance.now();
    loopTimer = setTimeout(() => show(current, true), ms);
  };
  const show = (id, again) => {
    const screen = F.SCREENS.find((s) => s.id === id);
    if (!screen) return;
    clearTimeout(loopTimer);
    const old = host.firstElementChild;
    if (ctx) ctx.dispose();
    current = id;
    const ph = h('div.ph', { 'data-screen': id });
    host.replaceChildren(ph);
    ctx = makeCtx(screen, ph);
    try { screen.build(ctx); } catch (e) { console.error(id, e); }
    // A loop starts from a soft dissolve, never a cut.
    if (again && old) F.move(ph, { o: 0 }, { o: 1 }, { duration: 360, curve: 'strong', fill: 'backwards' });
    elapsed = 0;
    schedule(screen.loop || 11000);
    if (paused) ctx.pause();
  };

  window.addEventListener('message', (e) => {
    const m = e.data || {};
    if (m.cmd === 'pause' && !paused) {
      paused = true;
      elapsed += performance.now() - startedAt;
      clearTimeout(loopTimer);
      ctx && ctx.pause();
    } else if (m.cmd === 'play' && paused) {
      paused = false;
      ctx && ctx.resume();
      const screen = F.SCREENS.find((s) => s.id === current);
      schedule(Math.max(600, (screen && screen.loop || 11000) - elapsed));
    } else if (m.cmd === 'restart') show(current, true);
    else if (m.cmd === 'show' && m.id) show(m.id, true);
  });
  window.addEventListener('hashchange', () => show(location.hash.slice(1), true));
  const boot = () => {
    if (new URLSearchParams(location.search).has('paused')) paused = true;
    show(location.hash.slice(1) || 'lull-paywall');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
