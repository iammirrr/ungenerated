// A skill page: the bar's line when scrolled, the section you are reading lit in the margin, and
// the live phones (motion styles) loading when they come into view.
(() => {
  'use strict';
  const bar = document.getElementById('bar');
  const onScroll = () => bar && bar.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Bring this skill into view in the list, without moving the page.
  const side = document.querySelector('.sk-side'), cur = side && side.querySelector('[aria-current]');
  if (cur) side.scrollTop = cur.offsetTop - side.clientHeight / 2;

  // Live phones: each iframe is drawn at 390 × 844 and scaled to its glass; it loads when it is
  // near the screen and pauses when it leaves.
  const fit = (screen) => screen.style.setProperty('--k', (screen.clientWidth / 390).toFixed(4));
  const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target)));
  const post = (f, m) => { try { f.contentWindow && f.src && f.contentWindow.postMessage(m, '*'); } catch {} };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const f = e.target;
    if (e.isIntersecting && !f.src) f.src = f.dataset.src.replace('?paused', '');
    else post(f, { cmd: e.isIntersecting ? 'play' : 'pause' });
  }), { rootMargin: '120px 0px' });
  document.querySelectorAll('iframe[data-src]').forEach((f) => {
    const screen = f.closest('.dev-screen');
    if (screen) { fit(screen); ro.observe(screen); }
    io.observe(f);
  });

  const links = [...document.querySelectorAll('.sk-toc a')];
  if (!links.length) return;
  const tocIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-20% 0px -70% 0px' });
  links.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) tocIo.observe(t); });
})();
