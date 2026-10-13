/* Screen-to-screen transitions. Each kind names what the move means; each has a native twin.
 *   cut       same ground, only the words change (no container motion)
 *   dissolve  in place: the new screen fades in over the old (.opacity)
 *   step      question to question: the old parts slide out, the new slide and rise in
 *             (.transition(.asymmetric(insertion: .move.combined(with: .opacity), ...)))
 *   layer     story beat to beat: the old zooms back and blurs, the new settles from 1.05
 *   carry     values travel: every [data-shared] element flies from its place on the old screen
 *             to its twin on the new one in one eased move, turning into it on the way
 *             (matchedGeometryEffect)
 *   cover     a full-screen cover slides up; the old screen sinks back a little (.fullScreenCover)
 * Only transform, opacity, blur and a clip move. Parts marked data-keep stay put across a step.
 */
(() => {
  'use strict';
  const F = window.F;

  const later = (ms, fn) => setTimeout(fn, ms * F.k());
  const partsOf = (ph) => [...ph.querySelectorAll(':scope > .ph-body > *:not([data-keep]), :scope > .ph-layer:not([data-keep])')];
  const partsIn = (ph) => partsOf(ph).filter((p) => !p.hasAttribute('data-own'));

  /**
   * Move from the current screen to a new one.
   * o: {oldCtx, mount(extra) → ctx (appends to the stage), dir (1 forward, −1 back), onMounted(ctx)}
   */
  F.transit = (kind, o) => {
    const { oldCtx, mount, dir = 1, onMounted = () => {} } = o;
    const oldPh = oldCtx && oldCtx.root;
    const done = (ms) => later(ms, () => {
      if (oldCtx) oldCtx.dispose();
      if (oldPh && oldPh.parentNode) oldPh.remove();
    });
    const T = F.T;
    if (!oldPh || F.reduced() || kind === 'cut') {
      onMounted(mount({ via: kind }));
      done(0);
      return;
    }

    if (kind === 'dissolve') {
      const n = mount({ via: kind });
      F.move(n.root, { o: 0 }, { o: 1 }, { duration: 280, curve: 'emph', fill: 'backwards' });
      onMounted(n);
      done(300);
      return;
    }

    if (kind === 'step') {
      const S = T.step;
      partsOf(oldPh).forEach((p) => p.animate([{ opacity: 1, translate: '0px 0px' }, { opacity: 0, translate: `${-S.distance * dir}px 0px` }], { duration: S.outMs * F.k(), easing: F.css('exit'), fill: 'forwards' }));
      later(S.overlap, () => {
        const n = mount({ via: 'step' });
        partsIn(n.root).forEach((p) => p.animate([{ opacity: 0, translate: `${S.distance * dir}px 0px` }, { opacity: 1, translate: '0px 0px' }], { duration: S.inMs * F.k(), easing: F.css('emph'), fill: 'backwards' }));
        onMounted(n);
      });
      done(S.overlap + S.outMs + 20);
      return;
    }

    if (kind === 'layer') {
      const L = T.layer;
      F.move(oldPh, { s: 1, o: 1, blur: 0 }, { s: L.out, o: 0, blur: L.blur * 0.6 }, { duration: L.outMs, curve: 'exit', fill: 'forwards' });
      later(L.outMs * 0.4, () => {
        const n = mount({ via: 'layer' });
        F.move(n.root, { s: L.in, o: 0, blur: L.blur }, { s: 1, o: 1, blur: 0 }, { duration: L.inMs, curve: 'emph', fill: 'backwards' });
        onMounted(n);
      });
      done(L.outMs + 20);
      return;
    }

    if (kind === 'carry') {
      // One eased flight per shared value; the old copy and the new one share the path and cross
      // over in the middle, so nothing is swapped when it lands. The old screen eases out under a
      // see-through new one.
      const MS = 680, ease = F.css('inout');
      const shared = [...oldPh.querySelectorAll('[data-shared]')].map((el) => {
        const r = F.pos(el, oldPh);
        const ghost = el.cloneNode(true);
        ghost.removeAttribute('data-shared');
        Object.assign(ghost.style, { position: 'absolute', left: r.x + 'px', top: r.y + 'px', width: 'max-content', margin: '0', zIndex: '80', pointerEvents: 'none', transformOrigin: '50% 50%', whiteSpace: 'nowrap' });
        el.style.visibility = 'hidden';
        oldPh.append(ghost);
        return { key: el.dataset.shared, r, ghost };
      });
      partsOf(oldPh).forEach((p) => p.animate([{ opacity: 1, transform: 'translateY(0px) scale(1)' }, { opacity: 0, transform: 'translateY(10px) scale(0.98)' }], { duration: 420 * F.k(), easing: ease, fill: 'forwards' }));
      later(200, () => {
        if (oldCtx.dead) return;
        const n = mount({ via: 'carry' });
        n.root.style.background = 'transparent';
        later(460, () => { if (!n.dead) n.root.style.background = ''; });
        shared.forEach(({ key, r, ghost }) => {
          const to = n.root.querySelector(`[data-shared="${key}"]`);
          if (!to) { ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240 * F.k(), fill: 'forwards' }); later(260, () => ghost.remove()); return; }
          const b = F.pos(to, n.root);
          to.style.visibility = 'hidden';
          const twin = to.cloneNode(true);
          twin.removeAttribute('data-shared');
          Object.assign(twin.style, { position: 'absolute', left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', margin: '0', zIndex: '81', pointerEvents: 'none', transformOrigin: '50% 50%', visibility: 'visible' });
          n.root.append(ghost, twin);
          const gw = ghost.offsetWidth || r.w, gh = ghost.offsetHeight || r.h;
          const dx = b.x + b.w / 2 - (r.x + gw / 2), dy = b.y + b.h / 2 - (r.y + gh / 2), k = b.h / Math.max(1, gh);
          ghost.animate([{ transform: 'translate(0px, 0px) scale(1)', opacity: 1 }, { opacity: 1, offset: 0.35 }, { opacity: 0, offset: 0.65 }, { transform: `translate(${dx}px, ${dy}px) scale(${k})`, opacity: 0 }], { duration: MS * F.k(), easing: ease, fill: 'forwards' });
          twin.animate([{ transform: `translate(${-dx}px, ${-dy}px) scale(${1 / k})`, opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1, offset: 0.65 }, { transform: 'translate(0px, 0px) scale(1)', opacity: 1 }], { duration: MS * F.k(), easing: ease, fill: 'forwards' });
          later(MS + 10, () => { if (!n.dead) to.style.visibility = ''; ghost.remove(); twin.remove(); });
        });
        partsIn(n.root).forEach((p, i) => {
          if (p.querySelector('[data-shared]')) return;
          p.animate([{ opacity: 0, translate: '0px 16px' }, { opacity: 1, translate: '0px 0px' }], { duration: 520 * F.k(), delay: (220 + i * 50) * F.k(), easing: F.css('emph'), fill: 'backwards' });
        });
        onMounted(n);
      });
      done(440);
      return;
    }

    if (kind === 'cover') {
      const n = mount({ via: 'cover' });
      n.root.style.zIndex = '6';
      oldPh.style.transformOrigin = '50% 40%';
      F.move(n.root, { y: 844 }, { y: 0 }, { spring: { response: 0.62, damping: 0.9 }, fill: 'backwards' });
      F.move(oldPh, { s: 1, o: 1 }, { s: 0.93, o: 0.55 }, { duration: 560, curve: 'emph', fill: 'forwards' });
      onMounted(n);
      done(640);
      return;
    }

    onMounted(mount({ via: kind }));
    done(0);
  };
})();
