/* Halves, a budget for two. The step: the plan (plan-reveal, no-slop's data rules).
 * Generated: confetti, an unlabelled donut and "Save up to $1,000". Ungenerated: their answers
 * glide into the plan one by one, and every number adds up. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'halves-generated', section: 'generated', name: 'Halves · generated', loop: 8000,
    intent: 'The first draft of "show the couple their budget plan": a celebration before anything is read, a donut without labels, a round number from nowhere and "Unlock your financial freedom".',
    build(ctx) {
      const { body } = S.frame(ctx);
      const party = h('div', { style: { fontSize: '44px', textAlign: 'center', marginTop: '10px' } }, '🎉');
      const title = h('h1.s-h1', { style: { marginTop: '8px' } }, 'Your ', h('span.s-grad', 'Personalized Plan'), ' is Ready!');
      const p = h('p.s-p', 'Our AI analyzed your finances to create the perfect plan for you ✨');
      const donut = h('div.s-donut', h('b', '92%', h('small', 'Financial Score')));
      const list = h('div.s-list.s-glass', ['💰 Save up to $1,000/month*', '📈 Grow your wealth 10x faster', '🛡️ Achieve financial freedom'].map((t) => h('div', t)));
      const btn = S.btn(ctx, 'Unlock Your Financial Freedom 🚀', { glow: true });
      body.append(party, title, p, donut, list, h('div.ph-fill'), btn, h('p.s-fine', { style: { margin: '10px 0 0' } }, '*Results may vary. Not financial advice.'));
      S.in([party, title, p, donut, list, btn]);
      const conf = h('div.s-confetti');
      const r = F.rand(4);
      const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#14b8a6', '#22c55e'];
      for (let i = 0; i < 46; i++) conf.append(h('i', { style: { left: r() * 390 + 'px', background: colors[i % colors.length], animationDelay: r() * 900 + 'ms', animationDuration: 1800 + r() * 1400 + 'ms' } }));
      ctx.root.append(conf);
    },
  });

  // ---------------------------------------------------------------- the plan, from their answers

  // Every figure is one of their answers, or follows from them; the last row is the difference.
  const ROWS = [
    { icon: 'banknote', label: 'Coming in', sub: 'Mia £2,450 · Sam £2,180', value: '£4,630' },
    { icon: 'building', label: 'Home', sub: 'Rent £1,450 · bills £310', value: '£1,760' },
    { icon: 'shopping-bag', label: 'Food and nights out', value: '£860' },
    { icon: 'truck', label: 'Getting around', sub: 'Car loan £374 · trains £260', value: '£634' },
    { icon: 'music', label: 'Subscriptions', value: '£64' },
    { icon: 'users-round', label: 'Yours to spend', value: '£450 each' },
    { icon: 'gem', label: 'Put away together', value: '£412', big: true },
  ];

  F.def({
    id: 'halves-plan', section: 'ungenerated', name: 'Halves · the plan', flow: true, loop: 9800, seqHold: 9200,
    intent: 'The card arrives with empty values; each answer glides up straight into its row and melts into it, 170 ms apart; one check on the mark when the last lands. £4,630 in, £4,218 out, £412 put away, and the year that adds up to.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-halves' });
      const month = X.monthName(X.day(0));
      const title = h('h1.t-q.hv-title', F.rich('This is how *your month* will work.'));
      const check = h('span.hv-check', F.icon('check', { size: 14, stroke: 3 }));
      const mark = h('span.hv-mark', h('i'), h('i'), check);
      const rows = ROWS.map((r) => {
        const slot = h('span.hv-slot');
        const el = h('div.hv-row' + (r.big ? '.is-big' : ''), h('span.hv-ic', F.icon(r.icon, { size: 17 })), h('span.hv-label', r.label, r.sub ? h('small', r.sub) : null), slot);
        el.valueEl = slot;
        return el;
      });
      const card = h('div.hv-card', h('div.hv-head', mark, h('div', h('b', 'Mia & Sam'), h('small', `${month}, together`))), h('div.hv-rows', rows));
      card.querySelector('.hv-rows').insertBefore(h('i.hv-rule'), rows[rows.length - 1]);
      const year = h('p.hv-year', F.rich(`£412 a month is *£4,944* by next ${month}.`));
      const cta = F.primary(ctx, 'Continue');
      const foot = h('div.ph-foot', cta);
      body.append(title, card, year, h('div.ph-fill'), foot);
      F.titleIn(ctx, title);
      F.move(card, { y: 16, o: 0 }, { y: 0, o: 1 }, { duration: 620, delay: 120, curve: 'decel', ctx, fill: 'backwards' });
      year.style.opacity = 0;
      foot.style.visibility = 'hidden';

      // The glide: a dark chip rises from below the card into its row's value, then melts into it.
      ctx.at(860, () => {
        const start = { x: 195, y: 790 };
        ROWS.forEach((r, i) => {
          const slot = rows[i].valueEl;
          const chip = h('span.hv-chip' + (r.big ? '.is-big' : ''), r.value);
          ctx.root.append(chip);
          const p = F.pos(slot, ctx.root);
          const w = chip.offsetWidth, ch = chip.offsetHeight;
          const x = p.x + p.w - w + 10, y = p.cy - ch / 2;
          chip.style.left = x + 'px';
          chip.style.top = y + 'px';
          const d = i * 170;
          F.move(chip, { x: start.x - w / 2 - x, y: start.y - y, o: 0 }, { x: 0, y: 0, o: 1 }, { duration: 900, delay: d, curve: 'emph', ctx, fill: 'backwards' });
          ctx.at(d + 640, () => {
            chip.classList.add('is-melted');
            F.move(slot, { o: 1 }, { o: 0 }, { duration: 200, curve: 'strong', ctx, fill: 'forwards' });
          });
        });
        const end = (ROWS.length - 1) * 170 + 900;
        ctx.at(end + 60, () => {
          check.style.visibility = 'visible';
          F.pop(ctx, check, { from: 0.5 });
          ctx.haptic('success');
        });
        ctx.at(end + 300, () => { year.style.opacity = ''; F.rise(ctx, year); });
        ctx.at(end + 520, () => { foot.style.visibility = ''; F.rise(ctx, cta); });
      });
    },
  });
})();
