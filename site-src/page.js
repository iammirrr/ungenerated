// A skill page: the bar's line when scrolled, and the section you are reading lit in the margin.
(() => {
  'use strict';
  const bar = document.getElementById('bar');
  const onScroll = () => bar && bar.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Bring this skill into view in the list, without moving the page.
  const side = document.querySelector('.sk-side'), cur = side && side.querySelector('[aria-current]');
  if (cur) side.scrollTop = cur.offsetTop - side.clientHeight / 2;
  const links = [...document.querySelectorAll('.sk-toc a')];
  if (!links.length) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-20% 0px -70% 0px' });
  links.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) io.observe(t); });
})();
