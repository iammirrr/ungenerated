// A skill page: the bar's line when scrolled, this skill brought into view in the list, and the
// sheets (the motion styles, a kit) loading near view, fitting their height, playing in view.
(() => {
  'use strict';
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Bring this skill into view in the list, without moving the page.
  const side = document.querySelector('.sk-side'), cur = side && side.querySelector('[aria-current]');
  if (cur) side.scrollTop = cur.offsetTop - side.clientHeight / 2;

  const post = (f, m) => { try { f.contentWindow && f.src && f.contentWindow.postMessage(m, '*'); } catch {} };
  const sheet = document.querySelector('.sk-sheet');
  if (sheet) {
    let seen = false;
    window.addEventListener('message', (e) => {
      if (e.source !== sheet.contentWindow || !e.data) return;
      if (e.data.type === 'height') sheet.style.height = e.data.h + 'px';
    });
    sheet.addEventListener('load', () => seen && setTimeout(() => post(sheet, { cmd: 'play' }), 300));
    new IntersectionObserver((es) => es.forEach((e) => {
      seen = e.isIntersecting && e.intersectionRatio > 0.2;
      if (e.isIntersecting && !sheet.src) sheet.src = sheet.dataset.src;
      post(sheet, { cmd: seen ? 'play' : 'pause' });
    }), { threshold: [0, 0.2] }).observe(sheet);
    // A kit per project: the tabs swap the sheet.
    const tabs = [...document.querySelectorAll('.sk-tabs button')];
    tabs.forEach((b) => b.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === b)));
      // A new query, not just a new hash, so the sheet loads afresh.
      sheet.dataset.src = sheet.dataset.src.replace(/[?#].*$/, '') + '?app=' + b.dataset.kit + '#' + b.dataset.kit;
      sheet.src = sheet.dataset.src;
    }));
  }

})();
