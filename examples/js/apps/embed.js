/* One phone, for the page.
 *   embed.html#<screen-id>      that screen's demo, looping
 *   embed.html#flow=<flow-id>   a whole flow from examples/flows.json, step by step, with each
 *                               screen's real transition (its own, or its motion style's)
 * The page talks to it with postMessage: {cmd: 'pause' | 'play' | 'restart'}, {cmd: 'show', id},
 * {cmd: 'flow', id}, {cmd: 'go', i}. In a flow it reports {type: 'step', flow, i, n, hold}.
 * The context matches the board's (js/board.js), so a screen behaves the same in both places. */
(() => {
  'use strict';
  const F = window.F, h = F.h;
  const host = document.getElementById('one');
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const tell = (m) => { try { if (window.parent !== window) window.parent.postMessage(m, '*'); } catch {} };

  const makeCtx = (screen, root, hooks = {}) => {
    const timers = new Set(), anims = new Set(), loops = new Set(), offs = [];
    let paused = false;
    const ctx = {
      screen, root, mode: 'demo', dead: false,
      style: screen.style || null,
      answers: hooks.answers || clone(F.DEFAULT_ANSWERS || {}),
      via: hooks.via || null,
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
          fn(dt * (F.T.speed || 1), now);
          if (L.alive && !paused) L.raf = requestAnimationFrame(tick);
        };
        L.start = () => { if (!L.raf && L.alive) { L.last = 0; L.raf = requestAnimationFrame(tick); } };
        loops.add(L);
        L.start();
        return () => { L.alive = false; cancelAnimationFrame(L.raf); loops.delete(L); };
      },
      on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); },
      haptic() {},
      next(info) { hooks.next && hooks.next(info); },
      back() {},
      restart() { hooks.restart && hooks.restart(); },
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
  const mountOn = (screen, extra = {}) => {
    const ph = h('div.ph', { 'data-screen': screen.id });
    host.append(ph);
    const ctx = makeCtx(screen, ph, extra);
    try { screen.build(ctx); } catch (e) { console.error(screen.id, e); }
    return ctx;
  };
  const find = (id) => F.SCREENS.find((s) => s.id === id);

  // ---------------------------------------------------------------- state

  let ctx = null, paused = false, timer = 0, due = 0, left = 0, run = 0;
  let flow = null, step = -1, single = null;
  const answers = {};
  const schedule = (ms, fn) => {
    clearTimeout(timer);
    left = ms;
    if (paused) { timer = 0; schedule.fn = fn; return; }
    due = performance.now() + ms;
    schedule.fn = fn;
    timer = setTimeout(fn, ms * F.k());
  };
  const clearAll = () => { run++; clearTimeout(timer); timer = 0; };

  // ---------------------------------------------------------------- one screen, looping

  const showOne = (id) => {
    const screen = find(id);
    if (!screen) return;
    clearAll();
    flow = null;
    single = id;
    const old = ctx;
    if (old) old.dispose();
    host.replaceChildren();
    ctx = mountOn(screen, { restart: () => showOne(id) });
    if (old) F.move(ctx.root, { o: 0 }, { o: 1 }, { duration: 360, curve: 'strong', fill: 'backwards' });
    if (paused) ctx.pause();
    schedule(screen.loop || 11000, () => showOne(id));
  };

  // ---------------------------------------------------------------- a whole flow

  const go = (i, kind) => {
    if (!flow) return;
    const me = ++run;
    clearTimeout(timer);
    const s = flow.steps[i];
    const screen = s && find(s.id);
    if (!screen) return;
    const first = !ctx;
    step = i;
    const hold = screen.seqHold || screen.loop || 4200;
    tell({ type: 'step', flow: flow.id, i, n: flow.steps.length, hold });
    F.transit(first ? 'cut' : kind || F.enterOf(screen), {
      oldCtx: ctx, dir: 1, style: screen.style,
      mount: (extra) => mountOn(screen, { ...extra, answers, next: (info) => { if (me === run && step === i) advance(info); } }),
      onMounted: (n) => { ctx = n; if (paused) n.pause(); },
    });
    schedule(hold, () => { if (me === run) advance(); });
  };
  const advance = (info) => {
    if (!flow) return;
    // A screen can skip ahead: ctx.next({ to: '<screen id>' }) (e.g. "Skip, just cancel").
    const to = info && info.to ? flow.steps.findIndex((x) => x.id === info.to) : -1;
    if (to > step) go(to);
    else if (step + 1 < flow.steps.length) go(step + 1);
    else schedule(1400, () => go(0, flow.steps.length > 1 ? 'dissolve' : 'cut'));
  };
  const showFlow = (id) => {
    const f = (window.FLOWS || []).find((x) => x.id === id);
    if (!f) return showOne(id);
    clearAll();
    single = null;
    flow = f;
    if (ctx) { ctx.dispose(); ctx = null; }
    host.replaceChildren();
    go(0, 'cut');
  };

  // ---------------------------------------------------------------- the page's remote

  window.addEventListener('message', (e) => {
    const m = e.data || {};
    if (m.cmd === 'pause' && !paused) {
      paused = true;
      left = Math.max(0, due - performance.now());
      clearTimeout(timer);
      ctx && ctx.pause();
    } else if (m.cmd === 'play' && paused) {
      paused = false;
      ctx && ctx.resume();
      if (schedule.fn) { due = performance.now() + left; timer = setTimeout(schedule.fn, left * F.k()); }
    } else if (m.cmd === 'restart') {
      if (flow) showFlow(flow.id); else if (single) showOne(single);
    } else if (m.cmd === 'show' && m.id) showOne(m.id);
    else if (m.cmd === 'flow' && m.id) showFlow(m.id);
    else if (m.cmd === 'go' && flow && typeof m.i === 'number') go(m.i, 'dissolve');
  });
  const route = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith('flow=')) showFlow(hash.slice(5));
    else showOne(hash || (window.FLOWS && window.FLOWS[0] && window.FLOWS[0].steps[0].id));
  };
  window.addEventListener('hashchange', route);
  const boot = () => {
    const qs = new URLSearchParams(location.search);
    if (qs.has('paused')) paused = true;
    // ?speed=0.25 plays everything at a quarter speed (for recording; F.k() scales every timer).
    if (+qs.get('speed') > 0) F.T.speed = +qs.get('speed');
    route();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
