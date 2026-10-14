// The flow player, shared by the home page and the skill pages. Each [data-player] element gets a
// live phone that plays a flow step by step (board/embed.html#flow=<id>), the list of its steps
// with what each one does, and a progress bar, all in step with the phone.
//   <div data-player data-kinds>               every kind as tabs (the home page)
//   <div data-player data-flows="a,b,c">       just these flows (a skill page)
(() => {
  'use strict';
  const FLOWS = window.FLOWS || [], APPS = (window.APPS && window.APPS.apps) || [], KINDS = window.KINDS || [];
  const STYLES = window.STYLES || {};
  const base = document.documentElement.dataset.base || '';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const appOf = (id) => APPS.find((a) => a.id === id) || { name: id, kit: {} };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (a, size) => {
    const src = (window.PICS || {})[a.id + '-icon'];
    return src
      ? `<span class="fl-ic" style="width:${size}px;height:${size}px"><img src="${base}board/${src}" alt=""></span>`
      : `<span class="fl-ic" style="width:${size}px;height:${size}px;background:${a.kit.accent};color:${a.kit.btnInk || '#fff'};font-size:${Math.round(size * 0.46)}px">${esc(a.name[0])}</span>`;
  };

  const build = (root) => {
    const only = root.dataset.flows ? root.dataset.flows.split(',') : null;
    const pool = only ? FLOWS.filter((f) => only.includes(f.id)) : FLOWS;
    if (!pool.length) return;
    const kinds = root.hasAttribute('data-kinds') ? KINDS.filter((k) => pool.some((f) => f.kind === k.id)) : [];
    root.innerHTML = `
      ${kinds.length ? `<div class="fl-kinds" role="tablist" aria-label="Kinds of flow">${kinds.map((k) => `<button type="button" role="tab" data-kind="${k.id}"><b>${esc(k.title)}</b><small>${pool.filter((f) => f.kind === k.id).length}</small></button>`).join('')}</div>` : ''}
      <div class="fl-apps" role="tablist" aria-label="Flows"></div>
      <div class="fl-stage">
        <figure class="fl-phone">
          <div class="dev"><div class="dev-screen"><iframe title="The flow, playing" tabindex="-1"></iframe></div></div>
          <div class="fl-bar" aria-hidden="true"></div>
        </figure>
        <div class="fl-info">
          <div class="fl-head"></div>
          <ol class="fl-steps"></ol>
        </div>
      </div>`;
    const frame = $('iframe', root), bar = $('.fl-bar', root), list = $('.fl-steps', root), head = $('.fl-head', root), apps = $('.fl-apps', root);
    const screen = $('.dev-screen', root);
    const fit = () => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
    new ResizeObserver(fit).observe(screen);
    fit();
    let flow = null, visible = false, loaded = false;
    const post = (m) => { try { frame.contentWindow && frame.contentWindow.postMessage(m, '*'); } catch {} };

    const show = (f) => {
      flow = f;
      const a = appOf(f.app), S = STYLES[a.style] || {};
      root.style.setProperty('--fl-accent', a.kit.accent);
      root.style.setProperty('--fl-ground', a.kit.ground);
      [...apps.children].forEach((b) => b.setAttribute('aria-selected', String(b.dataset.flow === f.id)));
      head.innerHTML = `
        <div class="fl-app">${icon(a, 44)}<div><b>${esc(a.name)}</b><span>${esc(a.category || '')} · <a href="${base}skills/motion-styles.html">${esc(S.name || a.style)} motion</a></span></div></div>
        <h3 class="fl-title">${esc(f.title)}</h3>
        <p class="fl-summary">${esc(f.summary)}</p>
        <div class="fl-skills">${f.skills.map((s) => `<a href="${base}skills/${s}.html">${s}</a>`).join('')}</div>`;
      list.innerHTML = f.steps.map((s, i) => `
        <li data-i="${i}"><button type="button">
          <span class="fl-thumb"><img src="${base}shots/steps/${s.id}.webp" alt="" loading="lazy" width="390" height="844"></span>
          <span class="fl-txt"><span class="fl-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(s.name)}</b><span class="fl-note">${esc(s.note)}</span></span>
        </button></li>`).join('');
      bar.innerHTML = f.steps.map(() => '<i><b></b></i>').join('');
      bar.classList.toggle('is-one', f.steps.length === 1);
      [...list.children].forEach((li) => $('button', li).addEventListener('click', () => post({ cmd: 'go', i: +li.dataset.i })));
      mark(0, f.steps[0] ? 4000 : 0);
      if (loaded) post({ cmd: 'flow', id: f.id });
      else if (visible) load();
    };
    const mark = (i, hold) => {
      [...list.children].forEach((li, k) => { li.classList.toggle('is-on', k === i); li.classList.toggle('is-done', k < i); });
      [...bar.children].forEach((seg, k) => {
        const fill = seg.firstChild;
        fill.getAnimations().forEach((x) => x.cancel());
        fill.style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)';
        if (k === i && !reduce) fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: hold, easing: 'linear', fill: 'forwards' });
        else if (k === i) fill.style.transform = 'scaleX(1)';
      });
    };
    const load = () => {
      loaded = true;
      frame.src = `${base}board/embed.html${visible ? '' : '?paused'}#flow=${flow.id}`;
    };
    window.addEventListener('message', (e) => {
      if (e.source !== frame.contentWindow) return;
      const m = e.data || {};
      if (m.type === 'step' && flow && m.flow === flow.id) mark(m.i, m.hold);
    });
    new IntersectionObserver((es) => es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && !loaded && flow) load();
      else post({ cmd: visible ? 'play' : 'pause' });
    }), { rootMargin: '80px 0px' }).observe(screen);

    const pickKind = (k) => {
      [...root.querySelectorAll('.fl-kinds button')].forEach((b) => b.setAttribute('aria-selected', String(b.dataset.kind === k)));
      const fs = k ? pool.filter((f) => f.kind === k) : pool;
      apps.innerHTML = fs.map((f) => {
        const a = appOf(f.app), S = STYLES[a.style] || {};
        return `<button type="button" role="tab" data-flow="${f.id}">${icon(a, 26)}<span><b>${esc(a.name)}</b><small>${esc(kinds.length ? (S.name || a.style) : f.title)}</small></span></button>`;
      }).join('');
      [...apps.children].forEach((b) => b.addEventListener('click', () => show(pool.find((f) => f.id === b.dataset.flow))));
      apps.hidden = fs.length < 2;
      show(fs[0]);
    };
    if (kinds.length) [...root.querySelectorAll('.fl-kinds button')].forEach((b) => b.addEventListener('click', () => pickKind(b.dataset.kind)));
    root.flowPlayer = { pickKind, show: (id) => { const f = pool.find((x) => x.id === id); if (!f) return; if (kinds.length) pickKind(f.kind); show(f); } };
    pickKind(kinds.length ? kinds[0].id : null);
  };
  document.querySelectorAll('[data-player]').forEach(build);
})();
