/* Lull, sleep sounds and a wind-down that learns how long you take to drift off.
 * Motion style: calm (nothing hurries). The flow: the paywall, in four steps: tonight (the one
 * value beat, made from their answers), every price, the reminder the trial promised (the real
 * system alert), and the first screen of the product.
 * Generated: a countdown, a struck price and a faint ×. */
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

  // ---------------------------------------------------------------- what every Lull screen shares

  const base = { section: 'lull-paywall', style: 'calm', flow: true };

  /** Their answers, with the example's: in bed around 11:10 pm, about 40 minutes to drift off.
   *  Lull's wind-down is 20 minutes, so tonight starts at 10:50. Minutes after midnight. */
  const tonight = (ctx) => {
    const a = ctx.answers || {};
    const bed = a.lullBed ?? 23 * 60 + 10;
    const drift = a.lullDrift ?? 40;
    const wind = 20;
    return { bed, drift, wind, start: bed - wind };
  };
  /** 1370 → "10:50"; the pm sits beside it, small. */
  const hm = (m) => {
    const v = ((Math.round(m) % 1440) + 1440) % 1440;
    return `${Math.floor(v / 60) % 12 || 12}:${String(v % 60).padStart(2, '0')}`;
  };
  const inMonth = (d) => { const r = new Date(d); r.setMonth(r.getMonth() + 1); return r; };
  const daysBefore = (d, n) => { const r = new Date(d); r.setDate(r.getDate() - n); return r; };
  const PLANS = {
    year: { name: 'Yearly', price: '$39.99', per: '7 nights free', due: '$0.00', cta: 'Try 7 nights free' },
    month: { name: 'Monthly', price: '$5.99', per: 'Billed every month', due: '$5.99', cta: 'Start for $5.99 a month' },
  };
  /** When the first charge falls and when Lull reminds them, for the plan they chose. */
  const billing = (plan) => {
    const charge = plan === 'month' ? inMonth(X.day(0)) : X.day(7);
    return { charge, remind: daysBefore(charge, 2) };
  };

  /**
   * Money rolls, calmly (money only; time flows with F.timeText). Every changed digit turns on its
   * own reel on the calm curve, through a soft blur, with no overshoot, the reels a beat apart. The
   * column keeps a hidden copy of its digit, so the reel sits on the text's own baseline.
   */
  const LH = 1.2;
  const roll = (ctx, el, text, o = {}) => {
    text = String(text);
    const prev = el._money ?? '';
    if (prev === text && el.children.length) return;
    el._money = text;
    el.classList.add('lu-reel');
    const num = (t) => parseFloat(String(t).replace(/[^0-9.]/g, '')) || 0;
    const up = num(text) >= num(prev);
    let col = 0;
    el.replaceChildren(...[...text].map((ch, i) => {
      if (!/\d/.test(ch)) return h('span.lu-reel-ch', ch);
      const d = +ch;
      const was = /\d/.test(prev[i] || '') ? +prev[i] : d;
      const strip = h('span.lu-reel-strip', Array.from({ length: 20 }, (_, k) => h('span', String(k % 10))));
      const k = col++;
      // Up: from the digit it was to the next copy of the new one; down: from above to below.
      const from = up ? was : (was < d ? was + 10 : was);
      const to = up ? (d >= was ? d : d + 10) : d;
      strip.style.transform = `translateY(${-to * LH}em)`;
      if (prev && was !== d && !F.reduced()) {
        ctx.track(strip.animate([
          { transform: `translateY(${-from * LH}em)`, filter: 'blur(0px)' },
          { filter: 'blur(1.4px)', offset: 0.5 },
          { transform: `translateY(${-to * LH}em)`, filter: 'blur(0px)' },
        ], { duration: (o.ms || 1100) * F.k(), delay: ((o.delay || 0) + k * (o.stagger ?? 110)) * F.k(), easing: F.css('calm'), fill: 'backwards' }));
      }
      return h('span.lu-reel-col', h('span.lu-reel-ghost', ch), strip);
    }));
  };

  // ---------------------------------------------------------------- 1 · tonight, from their answers

  F.def({
    ...base, id: 'lull-value', name: 'Tonight', loop: 8600, seqHold: 8000,
    intent: 'The one value beat before the price, made only from their answers (in bed around 11:10, about 40 minutes to drift off): tonight as Lull plans it. The wind-down starts at 10:50 with rain on, lights low and the phone face down; the lights go out at 11:10. The evening plays once, slowly: the clock flows, the room dims, the lamp breathes. Nothing promised, nothing counted.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-lull lu-s-value' });
      const P = tonight(ctx);
      const eyebrow = h('p.t-eyebrow.lu-eyebrow', X.long(X.day(0)));
      const title = h('h1.lu-h', F.rich('Here’s *tonight.*'));
      const sub = h('p.lu-lede', `You’re in bed around ${hm(P.bed)} and drift off about ${P.drift} minutes later.`);

      // The window: the painting, a veil that deepens as the lights go low, a bedside clock.
      const veil = h('i.lu-veil');
      const time = h('b.lu-clock-t');
      F.timeText(ctx, time, P.start, { fmt: hm });
      const label = h('span.lu-clock-l', 'Wind-down');
      const lampOn = h('i.lu-lamp-on');
      const moon = h('span.lu-lamp-moon', F.icon('moon', { size: 15, stroke: 2 }));
      const lamp = h('span.lu-lamp', lampOn, moon);
      const plate = h('div.lu-clock', lamp, h('div.lu-clock-txt', h('div.lu-clock-row', time, h('small', 'pm')), label));
      const win = h('div.lu-window', X.pic('lull-window', { cls: 'is-dark', icon: 'cloud-moon' }), veil, plate);

      // The plan: two times, linked by a rail that fills while the clock flows.
      const fill = h('i.lu-tl-fill');
      const row = (t, head, detail, rail) => h('div.lu-tl-row', h('b.lu-tl-t', hm(t)), h('span.lu-tl-rail', h('i.lu-tl-dot'), rail), h('div.lu-tl-txt', h('b', head), h('small', detail)));
      const r1 = row(P.start, `Wind-down, ${P.wind} minutes`, 'Rain on, lights low, phone face down', h('i.lu-tl-line', fill));
      const r2 = row(P.bed, 'Lights out', 'When you said you go to bed');
      const list = h('div.lu-tl', r1, r2);
      const cta = F.primary(ctx, 'Continue');
      body.append(eyebrow, title, sub, win, list, h('div.ph-fill'), h('div.ph-foot', cta));
      F.titleIn(ctx, title);
      F.rise(ctx, [eyebrow, sub, win, list, cta], { delay: 60 });

      // The evening, once and slowly: the wind-down starts, the clock flows to lights out.
      const ON = 1500, FLOW = 3400, OUT = ON + 500 + FLOW;
      ctx.at(ON, () => {
        r1.classList.add('is-now');
        F.move(veil, { o: 0 }, { o: 0.3 }, { duration: 1800, curve: 'calm', ctx, fill: 'forwards' });
        F.idle(ctx, lamp, 'breathe');
      });
      ctx.at(ON + 500, () => {
        F.tween(ctx, P.start, P.bed, { duration: FLOW, curve: 'calm' }, (v) => F.timeText(ctx, time, v, { fmt: hm, tau: 70 }));
        ctx.track(fill.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: F.reduced() ? 1 : FLOW * F.k(), easing: F.css('calm'), fill: 'forwards' }));
      });
      ctx.at(OUT, () => {
        r1.classList.remove('is-now');
        r1.classList.add('is-done');
        r2.classList.add('is-now');
        lamp.classList.add('is-out');
        F.swapText(ctx, label, 'Lights out');
        F.move(veil, { o: 0.3 }, { o: 0.56 }, { duration: 1600, curve: 'calm', ctx, fill: 'forwards' });
      });
      if (ctx.mode !== 'flow') ctx.at(OUT + 1600, () => F.tapEl(ctx, cta));
    },
  });

  // ---------------------------------------------------------------- 2 · every price

  F.def({
    ...base, id: 'lull-paywall', name: 'Every price', loop: 9800, seqHold: 9200,
    intent: 'Both prices on screen before any tap, and what is due today. The trial is a timeline with real dates: today, the reminder two days before, the first charge. Changing the plan rolls the money on calm reels and rewrites the timeline through a soft blur; time never rolls. One button names the outcome; Restore purchases and the way to cancel sit under it.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-lull' });
      const P = tonight(ctx);
      let plan = ctx.answers.lullPlan === 'month' ? 'month' : 'year';
      ctx.answers.lullPlan = plan;

      const close = h('button.lu-close', { type: 'button', 'aria-label': 'Close' }, F.icon('x', { size: 18, stroke: 2 }));
      F.press(ctx, close);
      const title = h('h1.lu-h.lu-pw-h', 'More nights', h('br'), h('em', 'like this.'));
      const feats = h('div.lu-feats', [
        ['audio-lines', 'Sounds recorded outdoors', 'Rain on tin, night trains, low tide'],
        ['cloud-moon', 'A wind-down that learns', `It starts from your ${P.drift} minutes to drift off`],
        ['wifi-off', 'Offline, with a sleep timer', 'Nothing to stream at 2 am'],
      ].map(([i, t, s]) => h('div.lu-feat', h('span.lu-feat-ic', F.icon(i, { size: 18 })), h('div', h('b', t), h('small', s)))));

      const cards = {};
      const plans = h('div.lu-plans', Object.entries(PLANS).map(([id, p]) => {
        const c = h('button.lu-plan' + (id === plan ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(id === plan) },
          h('span.lu-plan-top', h('small', p.name)),
          h('b.lu-plan-price', p.price), h('span.lu-plan-per' + (id === 'year' ? '.is-free' : ''), p.per), h('i.lu-tick', F.icon('check', { size: 12, stroke: 3 })));
        F.press(ctx, c, { onTap: () => choose(id) });
        cards[id] = c;
        return c;
      }));

      // The trial, with real dates. It rewrites itself with the plan.
      const b = billing('year'), bm = billing('month');
      const STEPS = {
        year: [['Today', 'Everything opens'], [X.short(b.remind), 'We remind you'], [X.short(b.charge), '$39.99, unless you cancel']],
        month: [['Today', '$5.99, then monthly'], [X.short(bm.charge), 'Renews at $5.99'], ['Any time', 'Cancel in Settings']],
      };
      const rows = STEPS[plan].map(([when, what], i) => {
        const w = h('b.lu-trial-w', when), t = h('span.lu-trial-t', what);
        const r = h('div.lu-trial-row', h('span.lu-trial-rail', h('i.lu-trial-dot' + (i === 0 ? '.is-today' : '')), i < 2 ? h('i.lu-trial-line') : null), w, t);
        r.w = w;
        r.t = t;
        return r;
      });
      const trial = h('div.lu-trial', rows);

      const due = h('b.lu-due-v');
      roll(ctx, due, PLANS[plan].due);
      const dueRow = h('div.lu-due', h('span', 'Due today'), due);
      const cta = F.primary(ctx, PLANS[plan].cta, { haptic: 'medium' });
      const restore = h('button.btn-link.lu-restore', { type: 'button' }, 'Restore purchases');
      F.press(ctx, restore, { row: true });
      const fine = h('p.lu-fine', 'Cancel anytime in Settings · Terms · Privacy');

      const choose = (id) => {
        if (id === plan) return;
        plan = id;
        ctx.answers.lullPlan = id;
        ctx.haptic('selection');
        Object.entries(cards).forEach(([k, c]) => { c.classList.toggle('is-on', k === id); c.setAttribute('aria-pressed', String(k === id)); });
        roll(ctx, due, PLANS[id].due, { delay: 200 });
        F.swapText(ctx, cta.querySelector('span'), PLANS[id].cta, 80);
        STEPS[id].forEach(([when, what], i) => {
          if (rows[i].w.textContent !== when) F.swapText(ctx, rows[i].w, when, 160 + i * 120);
          F.swapText(ctx, rows[i].t, what, 200 + i * 120);
        });
      };

      body.append(close, title, feats, plans, trial, h('div.ph-fill'), h('div.ph-foot', dueRow, cta, restore, fine));
      F.titleIn(ctx, title);
      F.rise(ctx, [close, feats, plans, trial, body.lastChild], { delay: 80 });

      if (ctx.mode !== 'flow') {
        ctx.at(2700, () => F.tapEl(ctx, cards.month));
        ctx.at(5500, () => F.tapEl(ctx, cards.year));
        ctx.at(8200, () => F.tapEl(ctx, cta));
      }
    },
  });

  // ---------------------------------------------------------------- 3 · the reminder the trial promised

  F.def({
    ...base, id: 'lull-remind', name: 'The reminder', loop: 8900, seqHold: 8300,
    intent: 'The trial timeline promised a reminder, so notifications are asked for here, where the reason is plain: the day it comes, and the reminder itself, word for word. Then the real iOS alert in Apple’s fixed words (apps cannot change them), and a quiet confirmation with the date. Not now skips without spending the one system prompt.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-lull' });
      const plan = ctx.answers.lullPlan === 'month' ? 'month' : 'year';
      const { charge, remind } = billing(plan);

      // The day it comes: a calendar leaf that breathes, a bell that turns into a check.
      const bell = h('span.lu-badge-ic', F.icon('bell', { size: 17 }));
      const tick = h('span.lu-badge-ic.is-tick', F.icon('check', { size: 17, stroke: 2.4 }));
      const off = h('span.lu-badge-ic.is-off', F.icon('bell-off', { size: 17 }));
      const badge = h('span.lu-badge', bell, tick, off);
      const leaf = h('div.lu-leaf', h('span.lu-leaf-m', X.monthName(remind)), h('b.lu-leaf-d', String(remind.getDate())), h('span.lu-leaf-w', X.weekday(remind)));
      const hero = h('div.lu-leaf-wrap', leaf, badge);
      const title = h('h1.lu-h.lu-center', F.rich(`We’ll remind you on *${X.short(remind)}.*`));
      const sub = h('p.lu-lede.lu-center', plan === 'year' ? `Two days before the first charge, on ${X.short(charge)}.` : `Two days before it renews, on ${X.short(charge)}.`);
      // The reminder itself, as it will arrive.
      const note = h('div.lu-note', X.appIcon('lull', 38),
        h('div.lu-note-body',
          h('div.lu-note-head', h('b', plan === 'year' ? 'Your free nights end in 2 days' : 'Lull renews in 2 days'), h('span', X.short(remind))),
          h('p', plan === 'year' ? `Lull is $39.99 a year from ${X.short(charge)}. Cancel in Settings before then if it isn’t for you.` : `$5.99 on ${X.short(charge)}. Cancel in Settings before then if it isn’t for you.`)));

      let asked = false;
      const allow = F.primary(ctx, 'Allow reminders', { onTap: () => (asked ? ctx.next() : ask()) });
      const later = h('button.btn-link', { type: 'button' }, 'Not now');
      F.press(ctx, later, { row: true, onTap: () => ctx.next() });

      const settle = (head, line) => {
        asked = true;
        F.swapText(ctx, title, head);
        if (line) F.swapText(ctx, sub, line, 120);
        F.swapText(ctx, allow.querySelector('span'), 'Continue', 240);
        F.move(later, { o: 1 }, { o: 0, blur: 6 }, { duration: 480, curve: 'calm', ctx, fill: 'forwards' });
        later.setAttribute('aria-hidden', 'true');
        later.disabled = true;
      };
      const ask = () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Lull” Would Like to Send You Notifications',
          message: 'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
          buttons: [
            { label: 'Don’t Allow', onTap: () => {
              al.close();
              ctx.at(260, () => {
                badge.classList.add('is-denied');
                note.classList.add('is-denied');
                settle(plan === 'year' ? `Your first charge is *${X.short(charge)}.*` : `It renews on *${X.short(charge)}.*`, 'Turn on notifications in Settings to get the reminder.');
              });
            } },
            { label: 'Allow', bold: true, onTap: () => {
              al.close();
              ctx.haptic('success');
              ctx.at(260, () => {
                badge.classList.add('is-set');
                settle(`Reminder set for *${X.short(remind)}.*`);
              });
              if (ctx.mode !== 'flow') ctx.at(2700, () => F.tapEl(ctx, allow));
            } },
          ],
        });
        if (ctx.mode !== 'flow') ctx.at(1300, () => F.tapEl(ctx, al.buttons[1]));
      };

      body.append(h('div.lu-fill-top'), hero, title, sub, note, h('div.ph-fill'), h('div.ph-foot', allow, later));
      F.rise(ctx, hero);
      F.titleIn(ctx, title, { delay: 100 });
      F.rise(ctx, [sub, note, allow, later], { delay: 200 });
      ctx.at(1300, () => F.idle(ctx, leaf, 'breathe'));
      if (ctx.mode !== 'flow') ctx.at(2500, () => F.tapEl(ctx, allow));
    },
  });

  // ---------------------------------------------------------------- 4 · all set: the product, tonight

  const SOUNDS = [
    { id: 'rain', pic: 'lull-rain', name: 'Rain', line: 'rain' },
    { id: 'train', pic: 'lull-train', name: 'Night train', line: 'a night train' },
    { id: 'sea', pic: 'lull-sea', name: 'Sea', line: 'the sea' },
  ];

  F.def({
    ...base, id: 'lull-tonight', name: 'All set', loop: 6800, seqHold: 6000,
    intent: 'The first screen of the product, breathing slowly: the window the wind-down plays in, with the bedside clock from the plan on its sill (10:50), the sound they chose (rain) with two others as quiet cards, and one button to start. Nothing to set up; the plan is already theirs.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-lull lu-s-tonight' });
      const P = tonight(ctx);
      let sound = ctx.answers.lullSound || 'rain';
      const title = h('h1.lu-h', F.rich('All set for *tonight.*'));
      const line = (s) => `${P.wind} minutes of ${SOUNDS.find((x) => x.id === s).line}, then lights out at ${hm(P.bed)}.`;
      const sub = h('p.lu-lede', line(sound));

      // The window it plays in, breathing; the bedside clock from the plan sits on its sill.
      const orb = h('div.lu-orb', X.pic('lull-window', { cls: 'is-dark', icon: 'cloud-moon' }));
      const plate = h('div.lu-clock.is-sill', h('span.lu-lamp', h('i.lu-lamp-on')), h('div.lu-clock-txt', h('div.lu-clock-row', h('b.lu-clock-t', hm(P.start)), h('small', 'pm')), h('span.lu-clock-l', 'Wind-down')));
      const stage = h('div.lu-orb-stage', orb, plate);

      const cards = SOUNDS.map((s) => {
        const c = h('button.lu-sound' + (s.id === sound ? '.is-on' : ''), { type: 'button', 'aria-pressed': String(s.id === sound) },
          h('span.lu-sound-pic', X.pic(s.pic, { cls: 'is-small is-dark', icon: 'audio-lines' }), h('i.lu-sound-tick', F.icon('check', { size: 11, stroke: 3 }))),
          h('span.lu-sound-name', s.name));
        F.press(ctx, c, { onTap: () => {
          if (s.id === sound) return;
          sound = s.id;
          ctx.haptic('selection');
          cards.forEach((x) => { const on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
          F.swapText(ctx, sub, line(s.id));
        } });
        return c;
      });
      const sounds = h('div.lu-sounds', h('p.t-eyebrow.lu-sounds-h', 'Sound'), h('div.lu-sound-row', cards));
      const start = F.primary(ctx, 'Start wind-down', { haptic: 'soft' });

      body.append(title, sub, stage, sounds, h('div.ph-fill'), h('div.ph-foot', start));
      F.titleIn(ctx, title);
      F.rise(ctx, [sub, stage, sounds, start], { delay: 80 });
      ctx.at(1500, () => F.idle(ctx, orb, 'breathe'));
      if (ctx.mode !== 'flow') {
        ctx.at(2800, () => F.tapEl(ctx, cards[2]));
        ctx.at(5000, () => F.tapEl(ctx, start));
      }
    },
  });
})();
