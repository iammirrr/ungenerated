// The flow player: a live phone plays a flow step by step (board/embed.html#flow=<id>), beside the
// list of its steps. The current step shows its one-line reason. Used on project and skill pages.
//   <div data-player data-flows="a,b">              these flows, tabs when there are several
//   <div data-player data-flows="a,b" data-apps>     tabs named by app (a skill page)
(() => {
  'use strict';
  const FLOWS = window.FLOWS || [], APPS = (window.APPS && window.APPS.apps) || [];
  const base = document.documentElement.dataset.base || '';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const appOf = (id) => APPS.find((a) => a.id === id) || { name: id };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const build = (root) => {
    const ids = (root.dataset.flows || '').split(',').filter(Boolean);
    const pool = ids.map((id) => FLOWS.find((f) => f.id === id)).filter(Boolean);
    if (!pool.length) return;
    const byApp = root.hasAttribute('data-apps');
    root.innerHTML = `
      <div class="fl-tabs" role="tablist" aria-label="Flows"${pool.length < 2 ? ' hidden' : ''}>${pool.map((f) => `<button type="button" role="tab" data-flow="${f.id}">${esc(byApp ? appOf(f.app).name : f.title)}</button>`).join('')}</div>
      <div class="fl-stage">
        <figure class="fl-phone">
          <div class="phone"><iframe title="The flow, playing" tabindex="-1"></iframe></div>
          <div class="fl-bar" aria-hidden="true"></div>
        </figure>
        <div class="fl-info">
          <p class="fl-meta"></p>
          <ol class="fl-steps"></ol>
        </div>
      </div>`;
    const frame = $('iframe', root), bar = $('.fl-bar', root), list = $('.fl-steps', root), meta = $('.fl-meta', root);
    const screen = $('.phone', root);
    const fit = () => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
    new ResizeObserver(fit).observe(screen);
    fit();
    let flow = null, visible = false, loaded = false;
    const post = (m) => { try { frame.contentWindow && frame.contentWindow.postMessage(m, '*'); } catch {} };

    const show = (f, step = 0) => {
      flow = f;
      [...root.querySelectorAll('.fl-tabs button')].forEach((b) => b.setAttribute('aria-selected', String(b.dataset.flow === f.id)));
      meta.innerHTML = `${byApp ? `<b>${esc(appOf(f.app).name)}</b> · ` : ''}${esc(f.title)} · ${f.steps.length} screen${f.steps.length > 1 ? 's' : ''}<span class="fl-skills">${f.skills.map((s) => `<a href="${base}skills/${s}.html">${s}</a>`).join('')}</span>`;
      list.innerHTML = f.steps.map((s, i) => `<li data-i="${i}"><button type="button"><span class="fl-n">${i + 1}</span><b>${esc(s.name)}</b><span class="fl-note">${esc(s.note)}</span></button></li>`).join('');
      bar.innerHTML = f.steps.map(() => '<i><b></b></i>').join('');
      [...list.children].forEach((li) => $('button', li).addEventListener('click', () => post({ cmd: 'go', i: +li.dataset.i })));
      mark(step, 4000);
      if (loaded) { post({ cmd: 'flow', id: f.id }); if (step) setTimeout(() => post({ cmd: 'go', i: step }), 300); }
      else if (visible) load(step);
    };
    const mark = (i, hold) => {
      [...list.children].forEach((li, k) => li.classList.toggle('is-on', k === i));
      [...bar.children].forEach((seg, k) => {
        const fill = seg.firstChild;
        fill.getAnimations().forEach((x) => x.cancel());
        fill.style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)';
        if (k === i && !reduce) fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: hold, easing: 'linear', fill: 'forwards' });
        else if (k === i) fill.style.transform = 'scaleX(1)';
      });
    };
    const load = (step = 0) => {
      loaded = true;
      frame.src = `${base}board/embed.html${visible ? '' : '?paused'}#flow=${flow.id}`;
      if (step) frame.addEventListener('load', () => setTimeout(() => post({ cmd: 'go', i: step }), 400), { once: true });
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
    [...root.querySelectorAll('.fl-tabs button')].forEach((b) => b.addEventListener('click', () => show(pool.find((f) => f.id === b.dataset.flow))));
    root.flowPlayer = { show: (id, step) => { const f = pool.find((x) => x.id === id); if (f) show(f, step); } };
    show(pool[0]);
  };
  window.FlowPlayer = { build };
  document.querySelectorAll('[data-player]').forEach(build);
})();
