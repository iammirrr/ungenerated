/* Lull, sleep sounds. The step: the paywall (paywall, motion-system).
 * Generated: a countdown, a struck price and a faint ×. Ungenerated: every price visible, the
 * trial on a timeline with real dates, money that rolls, one button that names the outcome. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'lull-generated', section: 'generated', name: 'Lull · generated', loop: 9000,
    intent: 'The first draft of "a premium paywall for a sleep app": a night gradient with a glowing crown, 70% off with a ticking countdown, a struck-out price nobody paid, five sparkle ticks and a close button you can barely see.',
    build(ctx) {
      const { body } = S.frame(ctx, { dark: true });
      const stars = h('div.s-stars');
      const r = F.rand(11);
      for (let i = 0; i < 38; i++) stars.append(h('i', { style: { left: r() * 390 + 'px', top: r() * 520 + 'px', opacity: 0.25 + r() * 0.6 } }));
      ctx.root.prepend(stars);
      ctx.root.append(h('span.s-x', '✕'));
      const crown = h('div.s-emoji.s-crown', '👑');
      const title = h('h1.s-h1', { style: { marginTop: '22px' } }, 'Unlock ', h('span.s-grad', 'Premium'));
      const p = h('p.s-p', { style: { marginTop: '6px' } }, 'Join 2M+ happy sleepers 😴');
      const clock = h('span', '09:59');
      const timer = h('div.s-timer', '⏰ LIMITED TIME: 70% OFF · ', clock);
      const price = h('div.s-price', h('s', '$99.99/year'), h('b', '$29.99/year'), h('span', 'Just $0.57/week! 🔥'));
      const ticks = h('div.s-ticks.s-glass', ['Unlimited sleep sounds', 'AI Sleep Coach', 'Ad-free experience', 'Exclusive content', 'Priority support'].map((t) => h('div', '✨ ' + t)));
      const btn = S.btn(ctx, 'Continue 🚀', { glow: true });
      body.append(crown, title, p, timer, price, ticks, h('div.ph-fill'), btn, h('p.s-fine', { style: { margin: '10px 0 0', fontSize: '9px', color: 'rgba(199,210,254,.45)' } }, 'Subscription automatically renews at $99.99/year after the first year unless cancelled at least 24 hours before the end of the current period. Offer valid for new users only.'));
      S.in([crown, title, p, timer, price, ticks, btn]);
      S.countdown(ctx, clock, 599);
    },
  });

  // ---------------------------------------------------------------- the paywall

  const PLANS = {
    year: { name: 'Yearly', price: '$39.99', per: '$3.33 a month', badge: '7 days free' },
    month: { name: 'Monthly', price: '$5.99', per: 'Billed every month' },
  };

  F.def({
    id: 'lull-paywall', section: 'ungenerated', name: 'Lull · the paywall', flow: true, loop: 10500, seqHold: 9900,
    intent: 'Both prices on screen before any tap. The trial is a timeline with real dates (today, the reminder, the first charge). Changing the plan rolls the money and rewrites the timeline; time never rolls. One button names the outcome; Restore and the way to cancel sit under it.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-lull' });
      const close = h('button.lu-close', { type: 'button', 'aria-label': 'Close' }, F.icon('x', { size: 18, stroke: 2.2 }));
      F.press(ctx, close, { scale: 0.9 });
      const title = h('h1.lu-title', F.rich('Sleep sooner, *starting tonight.*'));
      const sub = h('p.lu-sub', 'You said it takes you about 40 minutes to drift off.');
      const feats = h('div.lu-feats', [
        ['audio-lines', '64 soundscapes', 'Rain, sea and night trains, recorded outdoors'],
        ['cloud-moon', 'A wind-down that learns', 'It gets shorter as your 40 minutes do'],
        ['wifi-off', 'Offline, with a sleep timer', 'Nothing to stream at 2 am'],
      ].map(([i, t, s]) => h('div.lu-feat', h('span.lu-ic', F.icon(i, { size: 18 })), h('div', h('b', t), h('small', s)))));

      let plan = 'year';
      const cards = {};
      const planRow = h('div.lu-plans', Object.entries(PLANS).map(([id, p]) => {
        const c = h('button.lu-plan' + (id === plan ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(id === plan) },
          h('span.lu-plan-top', h('small', p.name), p.badge ? h('em', p.badge) : null),
          h('b', p.price), h('span.lu-per', p.per), h('i.lu-tick', F.icon('check', { size: 12, stroke: 3 })));
        F.press(ctx, c, { scale: 0.97, onTap: () => choose(id) });
        cards[id] = c;
        return c;
      }));

      // The timeline: three steps with real dates. It changes with the plan.
      const today = X.day(0), remind = X.day(5), charge = X.day(7), renew = new Date(today); renew.setMonth(renew.getMonth() + 1);
      const STEPS = {
        year: [['lock-open', 'Today', 'Everything opens'], ['bell', X.short(remind), 'We remind you'], ['banknote', X.short(charge), '$39.99, unless you cancel']],
        month: [['banknote', 'Today', '$5.99, then monthly'], ['refresh-cw', X.short(renew), 'Renews at $5.99'], ['x', 'Any time', 'Cancel in Settings']],
      };
      const steps = STEPS.year.map(([ic, when, what]) => {
        const icon = h('span.lu-step-ic', F.icon(ic, { size: 15 }));
        const w = h('b', when), t = h('small', what);
        const el = h('div.lu-step', icon, w, t);
        el.parts = { icon, w, t };
        return el;
      });
      const timeline = h('div.lu-steps', steps);

      const money = h('span.lu-money');
      const summary = h('p.lu-summary', h('span.lu-sum-a', '7 days free, then'), money, h('span.lu-sum-b', 'a year'));
      F.reel(ctx, money, '$39.99', { spins: 0 });
      const cta = F.primary(ctx, 'Start my free week', { haptic: 'medium' });
      const restore = h('button.btn-link', { type: 'button' }, 'Restore purchases');
      F.press(ctx, restore, { row: true });
      const fine = h('p.lu-fine', 'Cancel anytime in Settings · Terms · Privacy');

      const choose = (id) => {
        if (id === plan) return;
        plan = id;
        ctx.haptic('selection');
        Object.entries(cards).forEach(([k, c]) => { c.classList.toggle('is-on', k === id); c.setAttribute('aria-pressed', String(k === id)); });
        F.reel(ctx, money, PLANS[id].price, { spins: 1 });
        F.swapText(ctx, summary.querySelector('.lu-sum-a'), id === 'year' ? '7 days free, then' : 'Starting today,');
        F.swapText(ctx, summary.querySelector('.lu-sum-b'), id === 'year' ? 'a year' : 'a month', 40);
        cta.label(id === 'year' ? 'Start my free week' : 'Subscribe for $5.99 a month');
        STEPS[id].forEach(([ic, when, what], i) => {
          const p = steps[i].parts;
          ctx.at(i * 60, () => {
            F.move(p.icon, { s: 1, o: 1 }, { s: 0.6, o: 0 }, { duration: 140, curve: 'exit', ctx, fill: 'forwards' });
            ctx.at(150, () => { p.icon.replaceChildren(F.icon(ic, { size: 15 })); F.move(p.icon, { s: 0.6, o: 0 }, { s: 1, o: 1 }, { spring: { response: 0.36, damping: 0.62 }, ctx, fill: 'forwards' }); });
          });
          F.swapText(ctx, p.w, when, i * 60);
          F.swapText(ctx, p.t, what, i * 60 + 30);
        });
      };

      body.append(close, title, sub, feats, planRow, timeline, h('div.ph-fill'), summary, h('div.ph-foot', cta, restore), fine);
      F.titleIn(ctx, title, { delay: 80 });
      F.rise(ctx, [sub, ...feats.children, planRow, timeline, summary, cta, restore, fine], { delay: 220, stagger: 45 });

      if (ctx.mode !== 'flow') {
        ctx.at(3200, () => F.tapEl(ctx, cards.month));
        ctx.at(6400, () => F.tapEl(ctx, cards.year));
      }
    },
  });
})();
