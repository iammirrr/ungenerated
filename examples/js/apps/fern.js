/* Fern, plant care. Motion style: organic (things grow).
 * Flows: leaving, for budget (seven screens, from the plan to coming back) and the first plant.
 * Generated draft: guilt, a 50% countdown and "No thanks, I don't care about my plants". */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

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

  // ---------------------------------------------------------------- what every Fern screen shares

  const ENDS = () => X.day(20); // the next charge: the day Fern Plus ends if they cancel
  const LATER = () => X.day(56); // coming back, a month after it ended
  const SHELF = [['fern-monstera', 'Monstera'], ['fern-pothos', 'Golden pothos'], ['fern-fig', 'Fiddle-leaf fig'], ['fern-snake', 'Snake plant']];
  const base = { section: 'fern-leaving', style: 'organic', flow: true };

  const top = (ctx, title) => {
    const back = h('button.q-back', { type: 'button', 'aria-label': 'Back' }, F.icon('chevron-left', { size: 22 }));
    F.press(ctx, back, { row: true });
    return h('div.fe-top', { 'data-keep': '' }, back, h('b', title), h('span'));
  };
  /** Continue to cancel: a full outline button, in the same place on every screen. */
  const leave = (ctx, label = 'Continue to cancel', onTap = () => ctx.next()) => {
    const b = h('button.fe-leave', { type: 'button' }, label);
    F.press(ctx, b, { scale: 0.98, onTap });
    return b;
  };
  const kept = () => h('div.fe-kept', h('span.fe-kept-ic', F.icon('sprout', { size: 18 })), h('p', h('b', '14 plants, 212 waterings since March.'), ' They stay yours either way.'));
  const leafPath = 'M0 0 C 5 -9, 17 -11, 24 -5 C 17 1, 7 2, 0 0 Z';
  /** When a path drawn on a curve reaches t (0–1), in ms: the inverse of the curve. */
  const reach = (curve, ms, t) => {
    const f = F.bezier(curve);
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (f(m) < t) lo = m; else hi = m; }
    return ms * hi;
  };

  // ---------------------------------------------------------------- 1 · the plan, where people expect it

  F.def({
    ...base, id: 'fern-plan', name: 'Your plan', loop: 7600, seqHold: 6400,
    intent: 'Settings → your plan. What Fern did for them comes first, drawn as a vine that grows past each number; then the plan, its price, the next charge and who bills it. A cheaper way to pay sits above Cancel, and Cancel is a plain row with its true consequence under it.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const title = h('h1.fe-h', F.rich('What Fern grew *with you.*'));
      const W = 342, H = 150;
      const vine = F.svg('path', { d: 'M6 142 C 46 136, 58 100, 100 102 S 168 120, 200 88 S 262 30, 336 18', class: 'fe-vine', pathLength: 1 });
      const svg = F.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'fe-vine-svg' }, vine);
      const stats = [['14', 'plants'], ['212', 'waterings'], ['3', 'repots']].map(([n, w]) => {
        const num = h('b', '0');
        const el = h('div.fe-stat', num, h('span', w));
        el.num = num;
        el.to = +n;
        return el;
      });
      const card = h('div.fe-grow', svg, h('div.fe-stats', stats), h('small.fe-since', 'Since March'));
      const row = (k, v) => h('div', h('dt', k), h('dd', v));
      const plan = h('div.fe-plan', h('div.fe-plan-top', X.appIcon('fern', 44), h('div', h('b', 'Fern Plus'), h('small', '$4.99 a month'))), h('dl', row('Next charge', X.long(ENDS())), row('Billed by', 'Apple')));
      const cell = (b, s, cls = '') => h('button.fe-cell' + cls, { type: 'button' }, h('span', h('b', b), h('small', s)), F.icon('chevron-right', { size: 18 }));
      const yearly = cell('Switch to yearly', '$29.99 a year, half the price');
      const cancel = cell('Cancel subscription', 'Your plants and their history stay.', '.is-cancel');
      F.press(ctx, yearly, { row: true });
      F.press(ctx, cancel, { row: true, onTap: () => ctx.next() });
      body.append(top(ctx, 'Your plan'), title, card, plan, h('div.fe-cells', yearly, cancel));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [card, plan, yearly, cancel], { delay: 200 });

      // The vine grows; a leaf sprouts where it passes; each number counts up as the vine reaches it.
      const GROW = 2000, START = 520;
      vine.style.strokeDashoffset = 1;
      ctx.at(START, () => {
        ctx.track(vine.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: GROW * F.k(), easing: F.css('calm'), fill: 'forwards' }));
        const L = vine.getTotalLength();
        [[0.16, -48], [0.3, 34], [0.47, -56], [0.62, 28], [0.79, -40], [0.93, 24]].forEach(([t, ang], i) => {
          const p = vine.getPointAtLength(L * t);
          const leaf = F.svg('path', { d: leafPath, class: 'fe-leaf' + (i % 2 ? ' is-light' : '') });
          svg.append(F.svg('g', { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang})` }, leaf));
          leaf.style.opacity = 0;
          ctx.at(reach('calm', GROW, t), () => {
            leaf.style.opacity = '';
            F.move(leaf, { s: 0.15, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.5, damping: 0.7 }, ctx, fill: 'backwards' });
            ctx.at(700, () => F.idle(ctx, leaf, 'sway', { delay: i * 300 }));
          });
        });
        stats.forEach((st, i) => ctx.at(reach('calm', GROW, 0.2 + i * 0.3), () => F.count(ctx, st.num, 0, st.to, { duration: 900, curve: 'grow' })));
      });
      if (ctx.mode !== 'flow') ctx.at(4900, () => F.tapEl(ctx, cancel));
    },
  });

  // ---------------------------------------------------------------- 2 · one question

  const REASONS = [
    { id: 'budget', icon: 'wallet', label: 'It doesn’t fit my budget right now' },
    { id: 'fine', icon: 'sprout', label: 'My plants are doing fine on their own' },
    { id: 'moving', icon: 'truck', label: 'I’m moving, so no plants for a while' },
    { id: 'broken', icon: 'wrench', label: 'Something didn’t work for me' },
  ];

  F.def({
    ...base, id: 'fern-why', name: 'One question', loop: 5200, seqHold: 4200,
    intent: 'One question, four answers in Fern’s words and no Other; a tap answers it and the screen moves on. What they keep stays at the top. “Skip, just cancel” goes straight to the end, in the same place Continue to cancel will be.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const title = h('h1.fe-h', F.rich('Before you go, *what changed?*'));
      const rows = REASONS.map((r) => F.answer(ctx, { label: r.label, icon: r.icon, onTap: (row) => {
        rows.forEach((x) => x !== row && x.classList.remove('is-on'));
        F.picked(ctx, row, true);
        ctx.answers.fernWhy = r.id;
        ctx.haptic('selection');
        ctx.at(F.T.pick.advance, () => ctx.next());
      } }));
      // Skip goes straight to the end: Apple's own sheet, which does the cancelling.
      const skip = leave(ctx, 'Skip, just cancel', () => ctx.next({ to: 'fern-sheet' }));
      const k = kept();
      body.append(top(ctx, 'Cancel Fern Plus'), title, k, h('div.fe-list', rows), h('div.ph-fill'), h('div.ph-foot', skip));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [k, ...rows, skip], { delay: 160 });
      if (ctx.mode !== 'flow') ctx.at(2300, () => F.tapEl(ctx, rows[0]));
    },
  });

  // ---------------------------------------------------------------- 3 · one offer, matched

  const MENU = [
    { id: 'free', name: 'A month free', note: 'Then $4.99 a month', keep: 'Take the free month' },
    { id: 'half', name: '3 months at $2.49', note: 'Half price, then $4.99', keep: 'Keep Fern for $2.49 a month' },
    { id: 'year', name: 'A year for $29.99', note: '$2.50 a month · best value', keep: 'Keep Fern for $29.99 a year' },
  ];

  F.def({
    ...base, id: 'fern-offer', name: 'One offer', loop: 7200, seqHold: 6000,
    intent: 'The answer was budget, so the whole menu, once: a free month, three months at half price, a discounted year. Every price visible, the best value picked, and never a second offer after a no. Keeping is the primary button; Continue to cancel is a full button under it.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const title = h('h1.fe-h', F.rich('Keep Fern *for less.*'));
      const sub = h('p.fe-sub', 'Every option, once. Pick one, or carry on.');
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
      const out = leave(ctx);
      const k = kept();
      body.append(top(ctx, 'Cancel Fern Plus'), title, k, sub, h('div.fe-menu', menu), h('div.ph-fill'), h('div.ph-foot', keep, out));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [k, sub, ...menu, keep, out], { delay: 160 });
      if (ctx.mode !== 'flow') {
        ctx.at(1900, () => F.tapEl(ctx, menu[1]));
        ctx.at(3300, () => F.tapEl(ctx, menu[2]));
        ctx.at(4900, () => F.tapEl(ctx, out));
      }
    },
  });

  // ---------------------------------------------------------------- 4 · what stays, what stops

  F.def({
    ...base, id: 'fern-keep', name: 'What stays', loop: 6400, seqHold: 5200,
    intent: 'Before the platform’s sheet: what they made, big, and exactly what stays and what stops, on which day. Nothing that is not true. The two buttons keep their places.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const title = h('h1.fe-h', F.rich('Look what *you grew.*'));
      const pots = SHELF.map(([id]) => X.pic(id, { cls: 'fe-pot is-small', icon: 'sprout' }));
      const more = h('span.fe-more', '+10');
      const shelf = h('div.fe-shelf', pots, more);
      const list = (icon, head, items, cls = '') => h('div.fe-list-block' + cls, h('p.fe-list-head', F.icon(icon, { size: 15 }), head), h('ul', items.map((t) => h('li', t))));
      const stays = list('leaf', 'Stays with you', ['14 plants and their photos', '212 waterings since March', 'Your notes and repotting dates']);
      const stops = list('bell-off', `Stops on ${X.long(ENDS())}`, ['Watering reminders', 'The light meter', 'Plant ID for new plants'], '.is-stops');
      const keep = F.primary(ctx, 'Keep Fern Plus', { onTap: () => {} });
      const out = leave(ctx);
      body.append(top(ctx, 'Cancel Fern Plus'), title, shelf, stays, stops, h('div.ph-fill'), h('div.ph-foot', keep, out));
      F.titleIn(ctx, title, { delay: 60 });
      [...pots, more].forEach((p, i) => F.pop(ctx, p, { delay: 260 + i * 90 }));
      F.rise(ctx, [stays, stops, keep, out], { delay: 520 });
      if (ctx.mode !== 'flow') ctx.at(3600, () => F.tapEl(ctx, out));
    },
  });

  // ---------------------------------------------------------------- 5 · Apple's own sheet

  F.def({
    ...base, id: 'fern-sheet', name: 'Apple’s sheet', enter: 'dissolve', loop: 7600, seqHold: 6400,
    intent: 'The platform does the cancelling: iOS’s Subscriptions sheet (showManageSubscriptions) and its confirmation, in Apple’s words, over the app. Shown on the board so nobody fakes it inside the app.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const title = h('h1.fe-h', F.rich('Look what *you grew.*'));
      body.append(top(ctx, 'Cancel Fern Plus'), title, h('div.fe-shelf', SHELF.map(([id]) => X.pic(id, { cls: 'fe-pot is-small', icon: 'sprout' })), h('span.fe-more', '+10')));
      const end = X.longYear(ENDS());
      const renews = h('small', `Renews ${end}`);
      const option = (name, price, on) => h('div.ios-cell', h('span', name), h('span.ios-val', price), on ? h('span.ios-check', F.icon('check', { size: 16, stroke: 2.6 })) : null);
      const cancelCell = h('button.ios-cell.is-red', { type: 'button' }, 'Cancel Subscription');
      const cancelGroup = h('div.ios-group.ios-gap', cancelCell);
      const foot = h('p.ios-foot', `If you cancel now, you can still access your subscription until ${end}.`);
      const sheetBody = h('div.ios-sub',
        h('div.ios-group.ios-gap', h('div.ios-cell.ios-app', X.appIcon('fern', 60), h('div', h('b', 'Fern Plus'), h('small', 'Fern'), renews))),
        h('p.ios-head', 'Options'),
        h('div.ios-group', option('Fern Plus Yearly', '$29.99/year'), option('Fern Plus Monthly', '$4.99/month', true)),
        cancelGroup, foot);
      const sheet = X.sheet(ctx, ctx.root, { title: 'Subscriptions', body: sheetBody, delay: 260 });
      F.press(ctx, cancelCell, { row: true, onTap: () => {
        const al = X.alert(ctx, ctx.root, {
          title: 'Confirm Cancellation',
          message: `If you confirm and end your subscription now, you can still access it until ${end}.`,
          buttons: [{ label: 'Not Now' }, { label: 'Confirm', bold: true, onTap: () => {
            al.close();
            ctx.haptic('success');
            F.swapText(ctx, renews, `Expires ${end}`);
            F.move(cancelGroup, { o: 1 }, { o: 0, y: -6 }, { duration: 220, curve: 'exit', ctx, fill: 'forwards' });
            F.swapText(ctx, foot, `You can use Fern Plus until ${end}.`, 120);
            ctx.at(1500, () => ctx.next());
          } }],
        });
        al.buttons[0].addEventListener('click', () => al.close());
        if (ctx.mode !== 'flow') ctx.at(1300, () => F.tapEl(ctx, al.buttons[1]));
      } });
      if (ctx.mode !== 'flow') ctx.at(2200, () => F.tapEl(ctx, cancelCell));
    },
  });

  // ---------------------------------------------------------------- 6 · goodbye

  /** A sprout in a terracotta pot: the stem draws up, two leaves unfold, then it sways. */
  const sprout = (ctx, delay = 0) => {
    const stem = F.svg('path', { d: 'M100 150 C 100 120, 96 96, 104 70', class: 'fe-stem', pathLength: 1 });
    const l1 = F.svg('path', { d: 'M0 0 C 8 -16, 30 -22, 44 -10 C 30 2, 12 4, 0 0 Z', class: 'fe-leaf' });
    const l2 = F.svg('path', { d: 'M0 0 C 8 -16, 30 -22, 44 -10 C 30 2, 12 4, 0 0 Z', class: 'fe-leaf is-light' });
    const plant = F.svg('g', { class: 'fe-plant' }, stem, F.svg('g', { transform: 'translate(101 96) rotate(-150)' }, l1), F.svg('g', { transform: 'translate(103 82) rotate(-28)' }, l2));
    const pot = F.svg('g', {}, F.svg('path', { d: 'M62 150 L138 150 L130 196 Q129 202 123 202 L77 202 Q71 202 70 196 Z', class: 'fe-pot-body' }), F.svg('rect', { x: 56, y: 140, width: 88, height: 16, rx: 5, class: 'fe-pot-rim' }));
    const svg = F.svg('svg', { viewBox: '0 0 200 210', width: 170, height: 178, class: 'fe-sprout' }, plant, pot);
    stem.style.strokeDashoffset = 1;
    [l1, l2].forEach((l) => (l.style.opacity = 0));
    F.move(svg, { y: 18, o: 0 }, { y: 0, o: 1 }, { duration: 680, delay, curve: 'grow', ctx, fill: 'backwards' });
    ctx.at(delay + 380, () => ctx.track(stem.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900 * F.k(), easing: F.css('grow'), fill: 'forwards' })));
    [l1, l2].forEach((l, i) => ctx.at(delay + 820 + i * 220, () => { l.style.opacity = ''; F.move(l, { s: 0.1, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.5, damping: 0.7 }, ctx, fill: 'backwards' }); }));
    plant.style.transformOrigin = '100px 150px';
    ctx.at(delay + 1500, () => F.idle(ctx, plant, 'sway'));
    return svg;
  };

  F.def({
    ...base, id: 'fern-bye', name: 'Goodbye', loop: 6200, seqHold: 5200,
    intent: 'A personal goodbye: their name, the exact last day, no more charges, what they keep, and one tap to undo. It finishes like the product, with a plant that grows, and their numbers.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const art = sprout(ctx, 120);
      const title = h('h1.fe-h.fe-center', F.rich('Thank you, *Maya.*'));
      const end = X.long(ENDS());
      const p1 = h('p.fe-body', `Fern Plus ends on ${end}. You won’t be charged again.`);
      const p2 = h('p.fe-body', 'Your 14 plants stay here, with every watering since March.');
      const done = F.primary(ctx, 'Done', { onTap: () => ctx.next() });
      const undo = leave(ctx, 'Keep Fern Plus', () => {});
      body.append(h('div.fe-art', art), title, p1, p2, h('div.ph-fill'), h('div.ph-foot', done, undo));
      F.titleIn(ctx, title, { delay: 700 });
      F.rise(ctx, [p1, p2, done, undo], { delay: 900 });
    },
  });

  // ---------------------------------------------------------------- 7 · coming back

  F.def({
    ...base, id: 'fern-back', name: 'Coming back', loop: 6400, seqHold: 5200,
    intent: 'Weeks later, the same plan screen: what happened, their plants still there, every price, and one tap to start again. No guilt, no countdown.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-fern' });
      const when = h('p.t-eyebrow.fe-when', X.long(LATER()));
      const title = h('h1.fe-h', F.rich('Your plants *are all here.*'));
      const last = [X.short(X.day(52)), X.short(X.day(49)), X.short(X.day(54))];
      const shelf = h('div.fe-back-shelf', SHELF.slice(0, 3).map(([id, name], i) => h('figure.fe-back-pot', X.pic(id, { cls: 'fe-back-pic is-small', icon: 'sprout' }), h('figcaption', h('b', name), h('small', `Watered ${last[i]}`)))));
      const status = h('p.fe-status', F.icon('bell-off', { size: 16 }), h('span', `Fern Plus ended on ${X.monthName(ENDS())} ${ENDS().getDate()}. Reminders and plant ID are off.`));
      let pick = 'year';
      const plans = [['month', 'Monthly', '$4.99', 'a month'], ['year', 'Yearly', '$29.99', 'a year, half the price']].map(([id, name, price, per]) => {
        const c = h('button.fe-price' + (id === pick ? '.is-on' : ''), { type: 'button' }, h('small', name), h('b', price), h('span', per));
        F.press(ctx, c, { scale: 0.97, onTap: () => { pick = id; plans.forEach((x) => x.classList.toggle('is-on', x === c)); ctx.haptic('selection'); } });
        return c;
      });
      const start = F.primary(ctx, 'Start Fern Plus again', { onTap: () => {} });
      const small = h('p.fe-small', 'Cancel anytime in Settings.');
      body.append(when, title, shelf, status, h('div.fe-prices', plans), h('div.ph-fill'), h('div.ph-foot', start, small));
      F.rise(ctx, when);
      F.titleIn(ctx, title, { delay: 80 });
      [...shelf.children].forEach((c, i) => F.pop(ctx, c, { delay: 300 + i * 110 }));
      F.rise(ctx, [status, ...plans, start, small], { delay: 620 });
      if (ctx.mode !== 'flow') {
        ctx.at(2400, () => F.tapEl(ctx, plans[0]));
        ctx.at(3500, () => F.tapEl(ctx, plans[1]));
      }
    },
  });
})();
