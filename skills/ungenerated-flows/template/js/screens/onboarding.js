/* Example screens: an opening beat and a question. Replace them with your own. A whole-part card
 * (seq: true) leads each row and plays its screens with their transitions. */
(() => {
  'use strict';
  const F = window.F, h = F.h;

  F.def({ id: 'seq-opening', section: 'opening', name: 'The opening · the whole part', seq: true,
    intent: 'Plays the opening and the questions in order, with their real transitions.' });

  F.def({
    id: 'opening-hello', section: 'opening', name: 'One hero', flow: true, enter: 'cut', seqHold: 3200,
    intent: 'One object, one line, one button at the end. The object will stay on screen from beat to beat.',
    build(ctx) {
      const { body } = F.frame(ctx);
      const hero = h('div.ex-hero');
      const title = h('h1.t-hero', F.rich('Say it *once.*'));
      const sub = h('p.t-sub', 'One line under it. No more.');
      const cta = F.primary(ctx, 'Continue');
      body.append(hero, h('div.ex-words', title, sub), h('div.ex-foot', cta));
      F.move(hero, { s: 0.8, o: 0 }, { s: 1, o: 1 }, { duration: 620, curve: 'emph', ctx, fill: 'backwards' });
      F.titleIn(ctx, title, { delay: 240 });
      F.rise(ctx, sub, { delay: 340 });
      F.rise(ctx, cta.parentElement, { delay: 900 });
    },
  });

  F.def({ id: 'seq-questions', section: 'questions', name: 'Questions · the whole part', seq: true,
    intent: 'The questions in order with the step transition.' });

  F.def({
    id: 'q-goal', section: 'questions', name: 'What are you here for?', flow: true, enter: 'step', progress: 0.3,
    intent: 'A single pick: the answer is the button. The pick blooms from the finger, then the screen moves on.',
    build(ctx) {
      const { body } = F.frame(ctx);
      body.append(F.qTop(ctx, { progress: 0.3 }), F.qHead(ctx, 'What are you *here for?*', 'Pick one. You can change it later.'));
      body.append(F.singleList(ctx, [
        { id: 'focus', label: 'Focus for longer', icon: 'target', tone: 'good' },
        { id: 'plan', label: 'Plan my week', icon: 'calendar', tone: 'info' },
        { id: 'habit', label: 'Build a habit', icon: 'sparkles', tone: 'warn' },
      ], 'goal'));
      if (ctx.mode !== 'flow') ctx.at(1400, () => F.tapEl(ctx, body.querySelectorAll('.row')[0]));
    },
  });
})();
