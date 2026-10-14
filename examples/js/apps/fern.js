/* Fern, plant care. The step: leaving (cancel-flow, human-copy).
 * Generated: guilt, a 50% countdown and "No thanks, I don't care about my plants".
 * Ungenerated: one question with four specific answers; the answer gets its offer (budget gets
 * the whole menu, every price visible); Continue to cancel is a full button, always in one place. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S;

  F.def({
    id: 'fern-generated', section: 'generated', name: 'Fern · generated', loop: 8200,
    intent: 'The first draft of "a retention screen when someone cancels": a sad headline, a wilting emoji with a glow, a 50% offer with a countdown, and the way out as a small grey link that shames them.',
    build(ctx) {
      const { body } = S.frame(ctx);
      const title = h('h1.s-h1', { style: { marginTop: '18px' } }, 'Wait! Don’t Leave Us! 😢');
      const sad = h('div.s-sad.s-emoji', '🥀');
      const p = h('p.s-p', 'Your plants will miss you 💔 You’ll lose ALL your plant data, care schedules and progress forever!');
      const clock = h('em', '04:59');
      const offer = h('div.s-offer', h('strong', '🔥 SPECIAL OFFER 🔥'), h('b', '50% OFF for 3 months'), h('span', 'Offer expires in ', clock));
      const btn = S.btn(ctx, 'Stay & Save 50% 🎉', { glow: true });
      const shame = h('button.s-shame', { type: 'button' }, 'No thanks, I don’t care about my plants');
      body.append(title, sad, p, offer, h('div.ph-fill'), btn, h('div', { style: { height: '14px' } }), shame);
      S.in([title, sad, p, offer, btn, shame]);
      S.countdown(ctx, clock, 299);
    },
  });

  // ---------------------------------------------------------------- one question, one matched offer

  const REASONS = [
    { id: 'budget', icon: 'wallet', label: 'It doesn’t fit my budget right now' },
    { id: 'fine', icon: 'sprout', label: 'My plants are doing fine on their own' },
    { id: 'moving', icon: 'truck', label: 'I’m moving, so no plants for a while' },
    { id: 'broken', icon: 'wrench', label: 'Something didn’t work for me' },
  ];
  const MENU = [
    { id: 'free', name: 'A month free', note: 'Then $4.99 a month', keep: 'Take the free month' },
    { id: 'half', name: '3 months at $2.49', note: 'Half price, then $4.99', keep: 'Keep Fern for $2.49 a month' },
    { id: 'year', name: 'A year for $29.99', note: '$2.50 a month · best value', keep: 'Keep Fern for $29.99 a year' },
  ];

  F.def({
    id: 'fern-leaving', section: 'ungenerated', name: 'Fern · leaving', flow: true, loop: 11000, seqHold: 10400,
    intent: 'What they keep stays on top with their own numbers. One question, four answers in Fern’s words, no Other; a tap answers it. Budget gets the whole menu at once with every price visible and the best value picked. Continue to cancel never moves and is never a link.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22 }));
      const top = h('div.fe-top', back, h('b', 'Your plan'), h('span'));
      const kept = h('div.fe-kept', h('span.fe-kept-ic', F.icon('sprout', { size: 18 })), h('p', h('b', '14 plants, 212 waterings since March.'), ' They stay yours either way.'));
      const title = h('h1.t-q.fe-title', F.rich('Before you go, *what changed?*'));
      const stage = h('div.fe-stage');
      const rows = REASONS.map((r) => F.answer(ctx, { label: r.label, icon: r.icon, onTap: (row) => pick(r, row) }));
      const list = h('div.fe-list', rows);

      let choice = 'year';
      const keep = F.primary(ctx, 'Keep Fern for $29.99 a year', { onTap: () => {} });
      const menu = MENU.map((m) => {
        const el = h('button.fe-opt' + (m.id === choice ? '.is-on' : ''), { type: 'button' }, h('span', h('b', m.name), h('small', m.note)), h('i.fe-radio'));
        F.press(ctx, el, { row: true, onTap: () => {
          choice = m.id;
          menu.forEach((x) => x.classList.toggle('is-on', x === el));
          keep.label(m.keep);
          ctx.haptic('selection');
        } });
        return el;
      });
      const offer = h('div.fe-offer', h('p.fe-sub', 'Every option, once. Pick one, or carry on.'), h('div.fe-menu', menu));
      offer.hidden = true;
      stage.append(list, offer);
      const keepWrap = h('div.fe-keep', keep);
      keepWrap.hidden = true;
      const leave = h('button.fe-leave', { type: 'button' }, 'Continue to cancel');
      F.press(ctx, leave, { scale: 0.98 });
      body.append(top, kept, title, stage, h('div.ph-fill'), h('div.ph-foot', keepWrap, leave));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [kept, ...rows, leave], { delay: 140 });

      // The answer moves the screen on; its offer arrives on the same ground, Cancel stays put.
      const pick = (r, row) => {
        F.picked(ctx, row, true);
        ctx.haptic('selection');
        if (r.id !== 'budget') return;
        ctx.at(F.T.pick.advance, () => {
          rows.forEach((x, i) => F.move(x, { y: 0, o: 1 }, { y: -10, o: 0 }, { duration: 180, delay: i * 25, curve: 'exit', ctx, fill: 'forwards' }));
          F.swapText(ctx, title, 'Keep Fern *for less.*');
          ctx.at(260, () => {
            list.hidden = true;
            offer.hidden = false;
            keepWrap.hidden = false;
            F.rise(ctx, [offer.firstChild, ...menu, keep], { delay: 40 });
          });
        });
      };

      if (ctx.mode !== 'flow') {
        ctx.at(2000, () => F.tapEl(ctx, rows[0]));
        ctx.at(5400, () => F.tapEl(ctx, menu[1]));
        ctx.at(7600, () => F.tapEl(ctx, menu[2]));
      }
    },
  });
})();
