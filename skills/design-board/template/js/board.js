/* The design board: every screen of an app as a live phone, in rows, with the research behind it,
 * the kit it is built from, the moves between screens, and "Play the flow" to walk it full screen.
 *
 * Configure it in board.config.js (window.BOARD). Screens register themselves with F.def in
 * js/screens/*.js. Picks and notes save to review/store.json when served by tools/serve.mjs,
 * to the artifact's database when published as a Claude artifact, and to this browser otherwise.
 */
(() => {
  'use strict';
  const F = window.F;
  const h = F.h;
  const CFG = window.BOARD || {};
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // ------------------------------------------------------------------ configuration

  // The order of the work: research, then the kit, then the screens, then the moves between them.
  const VIEWS = CFG.views || [['research', 'Research'], ['kit', 'Kit'], ['screens', 'Screens'], ['transitions', 'Transitions']];
  const SECTIONS = CFG.sections || [];
  const RESEARCH = CFG.research || {};
  const viewOf = (sec) => sec.view || 'screens';
  F.DEFAULT_ANSWERS = { ...(F.DEFAULT_ANSWERS || {}), ...(CFG.answers || {}) };

  // ------------------------------------------------------------------ state and storage

  const state = { notes: {}, picks: {}, canWrite: true, store: 'local' };
  const LS = 'design-board:' + (CFG.id || CFG.name || 'board');
  const lsRead = () => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; } };
  const lsWrite = () => { try { localStorage.setItem(LS, JSON.stringify({ notes: state.notes, picks: state.picks })); } catch {} };
  let db = null, serverStore = false;
  const toServer = async (coll, id, data) => {
    try { return (await fetch('api/store', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ coll, id, data }) })).ok; } catch { return false; }
  };
  const save = async (coll, id, data) => {
    const body = { ...data, at: new Date().toISOString() };
    state[coll][id] = body;
    lsWrite();
    if (serverStore) { flash((await toServer(coll, id, body)) ? 'Saved to review/store.json' : 'Could not reach the server. Kept in this browser.'); return; }
    if (db && state.canWrite) {
      try { await db.collection(coll).doc(id).set(body); flash('Saved to the board'); return; } catch { flash('Could not save. Kept in this browser.'); }
    }
  };
  const remove = async (coll, id) => {
    delete state[coll][id];
    lsWrite();
    if (serverStore) await toServer(coll, id, null);
    if (db && state.canWrite) { try { await db.collection(coll).doc(id).delete(); } catch {} }
  };
  const connect = async () => {
    const local = lsRead();
    Object.assign(state.notes, local.notes || {});
    Object.assign(state.picks, local.picks || {});
    refreshAll();
    if (!window.claude || !window.claude.use) {
      try {
        const r = await fetch('api/store', { cache: 'no-store' });
        if (r.ok) {
          const remote = await r.json();
          serverStore = true;
          state.store = 'server';
          state.notes = remote.notes || {};
          state.picks = remote.picks || {};
          lsWrite();
          refreshAll();
        }
      } catch {}
      return;
    }
    try { db = await window.claude.use('db'); } catch { db = null; }
    if (!db) return;
    state.store = 'board';
    ['notes', 'picks'].forEach((coll) => db.collection(coll).onSnapshot((snap) => {
      const next = {};
      snap.docs.forEach((d) => { if (d.exists) next[d.id] = d.data(); });
      state[coll] = next;
      refreshAll();
    }, () => {}));
  };

  // ------------------------------------------------------------------ screens: context and mount

  const makeCtx = (screen, root, mode, hooks = {}) => {
    const timers = new Set(), anims = new Set(), loops = new Set(), offs = [];
    let paused = false;
    const ctx = {
      screen, root, mode, dead: false,
      answers: hooks.answers || clone(F.DEFAULT_ANSWERS),
      progressFrom: hooks.progressFrom,
      via: hooks.via || null,
      params: Object.fromEntries(Object.entries(screen.params || {}).map(([k, p]) => [k, p.value])),
      at(ms, fn) {
        const id = setTimeout(() => { timers.delete(id); if (!ctx.dead) fn(); }, ms * F.k());
        timers.add(id);
        return id;
      },
      track(a) {
        if (!a) return a;
        anims.add(a);
        a.finished.then(() => anims.delete(a), () => anims.delete(a));
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
      haptic(kind) { hooks.haptic && hooks.haptic(kind); },
      next(info) { hooks.next && hooks.next(info); },
      back() { hooks.back && hooks.back(); },
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
  const mount = (screen, host, mode, hooks = {}) => {
    const ph = h('div.ph', { 'data-screen': screen.id });
    host.append(ph);
    const ctx = makeCtx(screen, ph, mode, hooks);
    try { screen.build(ctx); } catch (e) { console.error(screen.id, e); ph.append(h('div.ph-error', `${screen.id}: ${e.message}`)); }
    return ctx;
  };

  // ------------------------------------------------------------------ the flow

  /** The flow: every screen marked flow, in registry order; a group plays its Pick or its default. */
  const flowOrder = () => {
    const ids = [], groups = new Set();
    F.SCREENS.forEach((s) => {
      if (!s.flow) return;
      if (s.group) {
        if (groups.has(s.group)) return;
        groups.add(s.group);
        const pick = state.picks[s.group] && state.picks[s.group].choice;
        ids.push(pick && F.SCREENS.some((x) => x.id === pick) ? pick : (F.SCREENS.find((x) => x.group === s.group && x.flowDefault) || s).id);
      } else ids.push(s.id);
    });
    return ids;
  };

  // ------------------------------------------------------------------ cards

  const cards = new Map();
  let order = [];
  const sectionScreens = (secId) => {
    const all = F.SCREENS.filter((s) => s.section === secId);
    return all.filter((s) => s.seq).concat(all.filter((s) => !s.seq));
  };
  const numberOf = (id) => {
    const scr = F.SCREENS.find((x) => x.id === id);
    const sec = scr && SECTIONS.find((x) => x.id === scr.section);
    const v = sec ? viewOf(sec) : 'screens';
    const list = order.filter((x) => { const s = F.SCREENS.find((y) => y.id === x); const c = s && SECTIONS.find((y) => y.id === s.section); return (c ? viewOf(c) : 'screens') === v; });
    return (v === 'kit' ? 'K' : v === 'transitions' ? 'T' : '') + String(list.indexOf(id) + 1).padStart(2, '0');
  };
  const hapticLabel = { light: 'Light', medium: 'Medium', soft: 'Soft', rigid: 'Rigid', selection: 'Tick', success: 'Success', warning: 'Warning' };
  const showHaptic = (el, kind) => {
    el.replaceChildren(F.icon('activity', { size: 11 }), hapticLabel[kind] || kind);
    el.classList.remove('is-on');
    void el.offsetWidth;
    el.classList.add('is-on');
  };

  const buildCard = (screen) => {
    const fit = h('div.stage-fit');
    const stage = h('div.stage', fit);
    const hap = h('span.card-haptic', { 'aria-live': 'polite' });
    const tool = (icon, label, cls = '') => h('button.tbtn' + cls, { type: 'button', title: label, 'aria-label': label }, F.icon(icon, { size: 15 }));
    const replayBtn = tool('rotate-ccw', 'Replay');
    const noteBtn = tool('message-square-text', 'Note', '.is-note');
    const pickBtn = screen.group ? tool('award', 'Pick this variation', '.is-pick') : null;
    const infoBtn = tool('info', 'What this screen is for', '.is-info');
    const noteText = h('p.card-note');
    const badge = h('span.card-badge');
    const info = h('div.card-info', h('strong', screen.name), h('p', screen.intent || ''), noteText);
    const el = h('article.card', { id: 's-' + screen.id },
      h('div.card-bar', h('span.card-n', numberOf(screen.id)), h('div.card-tools', replayBtn, noteBtn, pickBtn, infoBtn), hap),
      h('div.stage-wrap', stage, info),
      h('div.card-title', h('strong', { title: screen.name }, screen.name), badge));
    const c = { el, stage: fit, screen, ctx: null, visible: false, hap, noteText, noteBtn, pickBtn, badge };
    replayBtn.addEventListener('click', () => mountCard(c));
    noteBtn.addEventListener('click', () => openNote(screen.id));
    infoBtn.addEventListener('click', () => {
      const on = !el.classList.contains('is-info');
      document.querySelectorAll('.card.is-info').forEach((x) => x.classList.remove('is-info'));
      el.classList.toggle('is-info', on);
    });
    info.addEventListener('click', () => el.classList.remove('is-info'));
    pickBtn && pickBtn.addEventListener('click', () => {
      const picked = state.picks[screen.group] && state.picks[screen.group].choice === screen.id;
      (picked ? remove('picks', screen.group) : save('picks', screen.group, { choice: screen.id })).then(refreshAll);
      refreshAll();
    });
    cards.set(screen.id, c);
    return c;
  };

  /** A whole-part card plays its section's screens in order with their real transitions, then loops. */
  const mountSeq = (c) => {
    const ids = Array.isArray(c.screen.seq) ? c.screen.seq : flowOrder().filter((id) => F.SCREENS.find((x) => x.id === id)?.section === c.screen.section);
    const answers = clone(F.DEFAULT_ANSWERS);
    const run = c.run = (c.run || 0) + 1;
    let i = -1, fallback = 0, progress = 0;
    const step = () => {
      if (c.run !== run) return;
      clearTimeout(fallback);
      if (!c.visible) { c.stalled = true; return; }
      i += 1;
      if (i >= ids.length) { c.loopTimer = setTimeout(() => c.run === run && c.visible && mountCard(c), 1600 * F.k()); return; }
      const me = i;
      const scr = F.SCREENS.find((x) => x.id === ids[i]);
      if (!scr) return step();
      F.transit(i === 0 ? 'cut' : scr.enter || 'step', {
        oldCtx: c.ctx, dir: 1,
        mount: (extra) => mount(scr, c.stage, 'demo', { answers, progressFrom: progress, haptic: (k) => showHaptic(c.hap, k), next: () => me === i && step(), ...extra }),
        onMounted: (n) => {
          c.ctx = n;
          if (typeof scr.progress === 'number') progress = scr.progress;
          if (!c.visible) n.pause();
          fallback = setTimeout(() => me === i && step(), (scr.seqHold || 3600) * F.k());
        },
      });
    };
    step();
  };
  const mountCard = (c) => {
    if (c.ctx) c.ctx.dispose();
    clearTimeout(c.loopTimer);
    c.stage.replaceChildren();
    c.mounted = true;
    if (c.screen.seq) return mountSeq(c);
    c.ctx = mount(c.screen, c.stage, 'board', { haptic: (k) => showHaptic(c.hap, k), next: () => {}, back: () => {}, restart: () => mountCard(c) });
    if (!c.visible) c.ctx.pause();
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const c = cards.get(e.target.id.slice(2));
      if (!c) return;
      c.visible = e.isIntersecting && e.intersectionRatio >= 0.25;
      if (c.visible && (!c.mounted || c.stalled)) { c.stalled = false; mountCard(c); }
      else if (c.ctx) c.visible ? c.ctx.resume() : c.ctx.pause();
    });
  }, { threshold: [0, 0.25, 0.6] });

  // ------------------------------------------------------------------ layout

  let main, tabs;
  const VIEW_KEY = LS + ':view';
  let view = (() => { try { return localStorage.getItem(VIEW_KEY) || CFG.startView || 'screens'; } catch { return 'screens'; } })();

  const makeRow = (label, screens, hero = true) => {
    const rowEl = h('div.row-scroll', { tabindex: 0, 'aria-label': label + ' previews. Use left and right arrows to browse.' });
    screens.forEach((s, i) => {
      const c = buildCard(s);
      if (hero && i === 0 && s.seq) c.el.classList.add('is-hero');
      rowEl.append(c.el);
      io.observe(c.el);
    });
    const page = (dir) => {
      const list = [...rowEl.children].filter((el) => !el.hidden);
      const edge = rowEl.getBoundingClientRect().left + parseFloat(getComputedStyle(rowEl).paddingLeft);
      const cur = list.reduce((b, el, i) => (Math.abs(el.getBoundingClientRect().left - edge) < Math.abs(list[b].getBoundingClientRect().left - edge) ? i : b), 0);
      const t = list[F.clamp(cur + dir, 0, list.length - 1)];
      if (t) rowEl.scrollBy({ left: t.getBoundingClientRect().left - edge, behavior: F.reduced() ? 'auto' : 'smooth' });
    };
    const prev = h('button.row-arrow', { type: 'button', 'aria-label': 'Previous' }, F.icon('chevron-left', { size: 18 }));
    const next = h('button.row-arrow', { type: 'button', 'aria-label': 'Next' }, F.icon('chevron-right', { size: 18 }));
    prev.addEventListener('click', () => page(-1));
    next.addEventListener('click', () => page(1));
    const upd = () => { prev.disabled = rowEl.scrollLeft < 2; next.disabled = rowEl.scrollLeft >= rowEl.scrollWidth - rowEl.clientWidth - 2; };
    rowEl.addEventListener('scroll', upd, { passive: true });
    new ResizeObserver(upd).observe(rowEl);
    rowEl.addEventListener('keydown', (e) => { if (e.target === rowEl && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); page(e.key === 'ArrowLeft' ? -1 : 1); } });
    return { rowEl, arrows: [prev, next], screens };
  };
  const sectionHead = (sec, screens, controls) => {
    const range = screens.length ? (() => { const a = numberOf(screens[0].id), b = numberOf(screens.at(-1).id); return a === b ? a : `${a}–${b}`; })() : '';
    const about = h('p.sec-intent', sec.intent || '');
    about.hidden = true;
    const aboutBtn = h('button.sec-about', { type: 'button', 'aria-label': 'About ' + sec.title, 'aria-expanded': 'false' }, F.icon('info', { size: 15 }));
    aboutBtn.addEventListener('click', () => { about.hidden = !about.hidden; aboutBtn.setAttribute('aria-expanded', String(!about.hidden)); });
    return [h('div.sec-head', h('div.sec-name', h('h2', sec.title), h('span.sec-range', range), sec.intent ? aboutBtn : null), h('div.row-controls', controls)), about];
  };
  const replayButton = (screens) => {
    const b = h('button.row-arrow', { type: 'button', title: 'Replay', 'aria-label': 'Replay' }, F.icon('rotate-ccw', { size: 16 }));
    b.addEventListener('click', () => screens.forEach((s) => { const c = cards.get(s.id); if (c && c.visible) mountCard(c); }));
    return b;
  };

  const render = () => {
    order = VIEWS.flatMap(([v]) => SECTIONS.filter((s) => viewOf(s) === v)).flatMap((sec) => sectionScreens(sec.id).map((s) => s.id));
    F.SCREENS.forEach((s) => !order.includes(s.id) && order.push(s.id));
    const app = document.getElementById('board');
    app.replaceChildren();
    const viewBar = h('div.views', { role: 'tablist' }, VIEWS.map(([v, label]) => {
      const b = h('button.view', { type: 'button', role: 'tab', 'data-view': v }, label);
      b.addEventListener('click', () => setView(v));
      return b;
    }));
    tabs = h('nav.tabs', { 'aria-label': 'Sections' });
    const themeSeg = segmented('Theme', [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']], currentTheme(), setTheme);
    const play = h('button.play', { type: 'button' }, F.icon('play', { size: 15 }), 'Play the flow');
    play.addEventListener('click', () => openPlayer());
    app.append(h('header.top',
      h('div.top-row', h('div.brand', CFG.mark ? h('img.brand-mark', { src: CFG.mark, alt: '' }) : null, h('div', h('strong', CFG.name || 'Design board'), h('span.lead-store', ''))), viewBar, h('div.top-actions', themeSeg, play)),
      h('div.top-row.is-sub', tabs)));
    main = h('main.rows');
    app.append(main);

    SECTIONS.forEach((sec) => {
      const v = viewOf(sec);
      const screens = sectionScreens(sec.id);
      if (!screens.length) return;
      if (v === 'kit') {
        // The kit: live tiles in a grid.
        const grid = h('div.kit-grid');
        screens.forEach((s) => { const c = buildCard(s); c.el.classList.add('is-tile'); grid.append(c.el); io.observe(c.el); });
        const [head, about] = sectionHead(sec, screens, [replayButton(screens)]);
        main.append(h('section.sec', { id: 'sec-' + sec.id, 'data-view': v }, head, about, grid));
        return;
      }
      const row = makeRow(sec.title, screens, v === 'screens');
      const [head, about] = sectionHead(sec, screens, [replayButton(screens), ...row.arrows]);
      main.append(h('section.sec', { id: 'sec-' + sec.id, 'data-view': v }, head, about, row.rowEl));
    });

    // Research: every reference, grouped by the section it informed. What we took is the intent,
    // never the look.
    const groups = Object.keys(RESEARCH).filter((k) => RESEARCH[k].length);
    main.append(h('section.sec.research-view', { id: 'sec-research', 'data-view': 'research' },
      h('div.sec-head', h('div.sec-name', h('h2', 'Research'), h('span.sec-range', 'What we took is the intent, never the look.'))),
      groups.length ? groups.map((k) => h('div.research-group', { id: 'res-' + k },
        h('h3', (SECTIONS.find((s) => s.id === k) || { title: k }).title),
        h('div.research-grid', RESEARCH[k].map((r) => {
          const fig = h('figure.ref',
            r.src ? h('button.ref-img', { type: 'button', title: 'Open ' + r.title }, h('img', { src: r.src, alt: r.title, loading: 'lazy' })) : null,
            h('figcaption', h('strong', r.title), h('span', r.took)));
          fig.querySelector('button')?.addEventListener('click', () => openLightbox(r));
          return fig;
        })))) : h('p.empty', 'No research yet. The app-research skill fills this view.')));
    const secIo = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id.replace(/^(sec|res)-/, '');
      tabs.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-on', t.dataset.sec === id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    main.querySelectorAll('.sec, .research-group').forEach((s) => secIo.observe(s));
    applyView();
    fitStages();
    refreshAll();
  };

  const applyView = () => {
    document.querySelectorAll('.view').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    main.querySelectorAll('.sec').forEach((s) => (s.hidden = s.dataset.view !== view));
    tabs.replaceChildren();
    const links = view === 'research'
      ? [...main.querySelectorAll('.research-group')].map((g) => [g.id.slice(4), g.querySelector('h3').textContent, g])
      : SECTIONS.filter((s) => viewOf(s) === view).map((s) => [s.id, s.title, document.getElementById('sec-' + s.id)]).filter(([, , t]) => t);
    links.forEach(([id, title, target]) => {
      const b = h('button.tab', { type: 'button', 'data-sec': id }, title);
      b.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      tabs.append(b);
    });
    tabs.hidden = links.length < 2;
  };
  const setView = (v) => { view = v; try { localStorage.setItem(VIEW_KEY, v); } catch {} applyView(); window.scrollTo({ top: 0 }); };

  const refreshAll = () => {
    cards.forEach((c) => {
      const note = state.notes[c.screen.id];
      c.noteText.textContent = note && note.text ? note.text : '';
      c.noteText.hidden = !(note && note.text);
      c.noteBtn.classList.toggle('has-note', !!(note && note.text));
      const picked = c.screen.group && state.picks[c.screen.group] && state.picks[c.screen.group].choice === c.screen.id;
      c.el.classList.toggle('is-picked', !!picked);
      c.badge.textContent = picked ? 'Picked' : c.screen.flowDefault ? 'Default' : '';
      c.badge.hidden = !(picked || c.screen.flowDefault);
      if (c.pickBtn) c.pickBtn.setAttribute('aria-pressed', String(!!picked));
    });
    const ls = document.querySelector('.lead-store');
    if (ls) ls.textContent = state.store === 'server' ? 'Design board · saved in the repo' : state.store === 'board' ? 'Design board · saved for everyone' : 'Design board · saved in this browser';
  };

  const fitStages = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = vw < 640 ? Math.min((vw - 72) / 390, 0.82) : Math.min(0.62, Math.max(0.48, (vh - 260) / 844));
    document.documentElement.style.setProperty('--s', s.toFixed(4));
  };
  window.addEventListener('resize', () => { fitStages(); fitPlayer(); });

  // ------------------------------------------------------------------ theme, toast, notes, lightbox

  const THEME_KEY = LS + ':theme';
  const currentTheme = () => { try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch { return 'auto'; } };
  const setTheme = (t) => {
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  };
  const segmented = (name, options, value, onChange) => {
    const wrap = h('div.bseg', { role: 'group', 'aria-label': name });
    options.forEach(([v, label]) => {
      const b = h('button', { type: 'button', 'aria-pressed': String(v === value) }, label);
      b.addEventListener('click', () => { wrap.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); onChange(v); });
      wrap.append(b);
    });
    return wrap;
  };
  let flashTimer = 0;
  const flash = (text) => {
    let el = document.querySelector('.flash');
    if (!el) { el = h('div.flash', { role: 'status' }); document.body.append(el); }
    el.textContent = text;
    el.classList.add('is-on');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
  };
  const modal = (content) => {
    const back = h('div.modal', { role: 'dialog', 'aria-modal': 'true' }, h('div.modal-card', content));
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const close = () => { back.classList.add('is-leaving'); setTimeout(() => back.remove(), 160); document.removeEventListener('keydown', onKey); };
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    document.addEventListener('keydown', onKey);
    document.body.append(back);
    back.close = close;
    return back;
  };
  const openNote = (id) => {
    const s = F.SCREENS.find((x) => x.id === id);
    const note = state.notes[id];
    const area = h('textarea', { rows: 5, placeholder: 'What should change on this screen?' });
    area.value = (note && note.text) || '';
    const saveBtn = h('button.play', { type: 'button' }, 'Save note');
    const clearBtn = h('button.ghost', { type: 'button' }, 'Clear');
    const m = modal(h('div.note', h('h3', `${numberOf(id)} · ${s.name}`), area, h('div.note-actions', clearBtn, saveBtn)));
    saveBtn.addEventListener('click', async () => { const text = area.value.trim(); if (text) await save('notes', id, { text }); else await remove('notes', id); refreshAll(); m.close(); });
    clearBtn.addEventListener('click', async () => { await remove('notes', id); refreshAll(); m.close(); });
    setTimeout(() => area.focus(), 50);
  };
  const openLightbox = (r) => modal(h('figure.lightbox', h('img', { src: r.src, alt: r.title }), h('figcaption', h('strong', r.title), h('span', r.took))));

  // ------------------------------------------------------------------ Play the flow

  let player = null;
  const fitPlayer = () => {
    if (!player) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = vw < 640 ? Math.min(vw / 390, vh / 844) : Math.min((vh - 96) / 844, (vw - 48) / 390, 1);
    player.el.style.setProperty('--ps', s.toFixed(4));
  };
  const openPlayer = (startAt = 0) => {
    closePlayer();
    const ids = flowOrder();
    const stage = h('div.player-fit');
    const label = h('span.player-label');
    const prev = h('button.icon-btn', { type: 'button', 'aria-label': 'Previous screen' }, F.icon('chevron-left', { size: 18 }));
    const next = h('button.icon-btn', { type: 'button', 'aria-label': 'Next screen' }, F.icon('chevron-right', { size: 18 }));
    const close = h('button.icon-btn', { type: 'button', 'aria-label': 'Close' }, F.icon('x', { size: 18 }));
    const hap = h('span.player-haptic');
    const el = h('div.player', { role: 'dialog', 'aria-label': 'Play the flow' }, h('div.player-frame', h('div.player-stage', stage), hap), h('div.player-bar', prev, label, next, h('span.player-gap'), close));
    document.body.append(el);
    document.body.classList.add('has-player');
    player = { el, ids, i: -1, ctx: null, answers: clone(F.DEFAULT_ANSWERS), progress: 0, busy: false };
    fitPlayer();
    const go = (i, dir = 1) => {
      if (i < 0 || i >= ids.length || player.busy) return;
      const screen = F.SCREENS.find((x) => x.id === ids[i]);
      const old = player.ctx;
      player.busy = true;
      setTimeout(() => player && (player.busy = false), 260);
      F.transit(old ? (dir > 0 ? screen.enter || 'step' : 'dissolve') : 'cut', {
        oldCtx: old, dir,
        mount: (extra) => mount(screen, stage, 'flow', { answers: player.answers, progressFrom: player.progress, haptic: (k) => showHaptic(hap, k), next: () => go(player.i + 1), back: () => go(player.i - 1, -1), ...extra }),
        onMounted: (n) => { player.ctx = n; if (typeof screen.progress === 'number') player.progress = screen.progress; },
      });
      player.i = i;
      label.textContent = `${String(i + 1).padStart(2, '0')} / ${ids.length} · ${screen.name}`;
      prev.disabled = i === 0;
      next.disabled = i === ids.length - 1;
    };
    prev.addEventListener('click', () => go(player.i - 1, -1));
    next.addEventListener('click', () => go(player.i + 1));
    close.addEventListener('click', closePlayer);
    player.onKey = (e) => {
      if (e.key === 'Escape') closePlayer();
      if (e.key === 'ArrowRight') go(player.i + 1);
      if (e.key === 'ArrowLeft') go(player.i - 1, -1);
    };
    document.addEventListener('keydown', player.onKey);
    go(typeof startAt === 'string' ? Math.max(0, ids.indexOf(startAt)) : startAt);
  };
  const closePlayer = () => {
    if (!player) return;
    player.ctx && player.ctx.dispose();
    document.removeEventListener('keydown', player.onKey);
    player.el.remove();
    player = null;
    document.body.classList.remove('has-player');
  };

  // ------------------------------------------------------------------ boot

  /** #only-<id>: one phone at its real size (for screenshots); #play or #play-<id>: the flow. */
  const solo = (id) => {
    const screen = F.SCREENS.find((x) => x.id === id);
    if (!screen) return false;
    document.body.classList.add('is-solo');
    const host = h('div.solo');
    document.getElementById('board').replaceChildren(host);
    const c = { stage: host, screen, visible: true, hap: h('span'), el: host };
    if (screen.seq) { cards.set(id, c); mountSeq(c); }
    else mount(screen, host, 'board', { restart: () => { host.replaceChildren(); mount(screen, host, 'board', {}); } });
    return true;
  };
  const boot = () => {
    setTheme(currentTheme());
    if (location.hash.startsWith('#only-') && solo(location.hash.slice(6))) return;
    render();
    connect();
    if (location.hash === '#play') openPlayer();
    else if (location.hash.startsWith('#play-')) openPlayer(location.hash.slice(6));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  F.board = { openPlayer, state };
})();
