// A project page: the bar's line, live phones that load when seen and pause when not, the kit
// sheet that fits its height and plays once in view, and the copy buttons on the prompts.
(() => {
  'use strict';
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const post = (f, m) => { try { f.contentWindow && f.src && f.contentWindow.postMessage(m, '*'); } catch {} };
  const fit = (screen) => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
  const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target)));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const f = e.target;
    if (e.isIntersecting && !f.src) f.src = f.dataset.src.replace('?paused', '');
    else post(f, { cmd: e.isIntersecting ? 'play' : 'pause' });
  }), { rootMargin: '120px 0px' });
  $$('.phone > iframe[data-src]').forEach((f) => { fit(f.parentElement); ro.observe(f.parentElement); io.observe(f); });

  // The kit sheet: load near view, fit its height, and play its demo once it is mostly visible.
  const kit = document.querySelector('.pj-kit');
  if (kit) {
    let played = false;
    window.addEventListener('message', (e) => {
      if (e.source !== kit.contentWindow || !e.data) return;
      if (e.data.type === 'height') kit.style.height = e.data.h + 'px';
    });
    new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !kit.src) kit.src = kit.dataset.src;
      if (e.isIntersecting && e.intersectionRatio > 0.3 && !played) { played = true; setTimeout(() => post(kit, { cmd: 'play' }), 300); }
    }), { threshold: [0, 0.3] }).observe(kit);
  }

  // Copy buttons: a prompt carries its words in data-text.
  $$('.copy[data-text]').forEach((b) => b.addEventListener('click', async () => {
    const label = b.textContent;
    try {
      await navigator.clipboard.writeText(b.dataset.text);
      b.textContent = 'Copied';
      setTimeout(() => (b.textContent = label), 1600);
    } catch {}
  }));
})();
