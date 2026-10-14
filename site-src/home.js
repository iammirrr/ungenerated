// The home page: the bar's line, the copy buttons, and the two live phones at the top (before and
// after), which load when seen, pause when not, and switch together with the project tabs.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (new URLSearchParams(location.search).has('still')) document.documentElement.classList.add('is-still');

  const top = $('#top');
  const onScroll = () => top && top.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#' + b.dataset.copy + ' code').innerText.trim());
      b.textContent = 'Copied';
      setTimeout(() => (b.textContent = 'Copy'), 1600);
    } catch {}
  }));

  // Live phones: drawn at 390 × 844 and scaled to their glass; loaded when near, paused when gone.
  const post = (f, m) => { try { f.contentWindow && f.src && f.contentWindow.postMessage(m, '*'); } catch {} };
  const fit = (screen) => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
  const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target)));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const f = e.target;
    f._seen = e.isIntersecting;
    if (e.isIntersecting && !f.src) f.src = f.dataset.src.replace('?paused', '');
    else post(f, { cmd: e.isIntersecting ? 'play' : 'pause' });
  }), { rootMargin: '120px 0px' });
  $$('.phone > iframe[data-src]').forEach((f) => { fit(f.parentElement); ro.observe(f.parentElement); io.observe(f); });

  // The tabs under the hero switch both phones to another project.
  const before = $('#hero-before'), after = $('#hero-after');
  const tabs = $$('.hero-tabs button');
  const show = (b) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === b)));
    [[before, b.dataset.before], [after, b.dataset.after]].forEach(([f, id]) => {
      f.dataset.src = 'board/embed.html#' + id;
      if (f.src) post(f, { cmd: 'show', id }); else if (f._seen) f.src = f.dataset.src;
    });
  };
  tabs.forEach((b) => b.addEventListener('click', () => show(b)));
})();
