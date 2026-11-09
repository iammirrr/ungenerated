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
 * The motion styles (js/styles.js) add four more, each the default of a style:
 *   fade      calm: a slow cross-dissolve through a soft blur
 *             (.transition(.opacity.combined(with: .blur)), easeInOut 0.9 s)
 *   push      snappy and precise: the next screen pushes in from the trailing edge, the old one
 *             drifts back by a third (NavigationStack push; .transition(.push(from: .trailing)))
 *   iris      cinematic: the next screen opens in a circle from where the finger was
 *             (a Circle mask whose scale animates; .transition(.modifier(active:identity:)))
 *   grow      organic: the next screen grows up from the bottom edge, its parts unfurling
 *             (a rounded-rect mask from the bottom, then the parts on .spring)
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
        // The ghost keeps its measured box, so a picture keeps its size and text keeps its lines.
        Object.assign(ghost.style, { position: 'absolute', left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', margin: '0', zIndex: '80', pointerEvents: 'none', transformOrigin: '50% 50%' });
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
      // The old screen's ground stays under the see-through new one until it is opaque again (660 ms).
      done(680);
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

    // ---------------------------------------------------------------- the motion styles' moves
    const S = (o.style && F.STYLES && F.STYLES[o.style]) || {};

    if (kind === 'fade') {
      const n = mount({ via: kind });
      F.move(oldPh, { o: 1, blur: 0 }, { o: 0.5, blur: 6 }, { duration: 700, curve: 'calm', fill: 'forwards' });
      F.move(n.root, { o: 0, blur: 10 }, { o: 1, blur: 0 }, { duration: 980, delay: 120, curve: 'calm', fill: 'backwards' });
      onMounted(n);
      done(1120);
      return;
    }

    if (kind === 'push') {
      const P = { ...T.push, ...(S.push || {}) };
      const dur = P.ms, curve = P.curve || 'strong';
      const n = mount({ via: kind });
      n.root.style.zIndex = '6';
      n.root.style.boxShadow = '-10px 0 30px rgba(0, 0, 0, 0.16)';
      F.move(n.root, { x: 390 * dir }, { x: 0 }, { duration: dur, curve, fill: 'backwards' });
      F.move(oldPh, { x: 0, o: 1 }, { x: -390 * P.parallax * dir, o: 0.6 }, { duration: dur, curve, fill: 'forwards' });
      later(dur + 10, () => { if (!n.dead) n.root.style.boxShadow = ''; });
      onMounted(n);
      done(dur + 20);
      return;
    }

    if (kind === 'iris') {
      const tap = oldCtx.lastTap && oldCtx.lastTap.isConnected ? F.pos(oldCtx.lastTap, oldPh) : null;
      const cx = tap ? tap.cx : 195, cy = tap ? tap.cy : 640;
      const rad = Math.hypot(Math.max(cx, 390 - cx), Math.max(cy, 844 - cy)) + 8;
      const n = mount({ via: kind });
      n.root.style.zIndex = '6';
      n.root.animate([{ clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${rad}px at ${cx}px ${cy}px)` }], { duration: 820 * F.k(), easing: F.css('cine'), fill: 'backwards' });
      F.move(oldPh, { s: 1, o: 1 }, { s: 0.95, o: 0.7 }, { duration: 820, curve: 'cine', fill: 'forwards' });
      onMounted(n);
      done(840);
      return;
    }

    if (kind === 'grow') {
      const n = mount({ via: kind });
      n.root.style.zIndex = '6';
      n.root.animate([{ clipPath: 'inset(100% 0px 0px 0px round 160px 160px 0px 0px)' }, { clipPath: 'inset(0% 0px 0px 0px round 0px 0px 0px 0px)' }], { duration: 760 * F.k(), easing: F.css('grow'), fill: 'backwards' });
      partsIn(n.root).forEach((p, i) => p.animate([{ opacity: 0, translate: '0px 26px', rotate: '-1.5deg' }, { opacity: 1, translate: '0px 0px', rotate: '0deg' }], { duration: 700 * F.k(), delay: (180 + i * 70) * F.k(), easing: F.css('grow'), fill: 'backwards' }));
      F.move(oldPh, { y: 0, o: 1 }, { y: -30, o: 0.75 }, { duration: 760, curve: 'grow', fill: 'forwards' });
      onMounted(n);
      done(780);
      return;
    }

    onMounted(mount({ via: kind }));
    done(0);
  };
})();
