/* Parla, Italian out loud. The step: a permission (consent-and-permissions, bubbly-motion).
 * Generated: the system asks at launch, over a spinner, with a reason that says nothing.
 * Ungenerated: the reason is on screen first (the phrase you're about to say), then the real
 * system alert, untouched; then the mic gives under the finger and the words light as heard. */
(() => {
  'use strict';
  const F = window.F, h = F.h, S = window.S, X = window.X;

  F.def({
    id: 'parla-generated', section: 'generated', name: 'Parla · generated', loop: 7800,
    intent: 'The first draft of "a speaking app": the microphone prompt fires at launch over a gradient splash and a spinner, with "This app requires microphone access." People say no, and the app scolds them.',
    build(ctx) {
      const { body } = S.frame(ctx, { blobs: false });
      ctx.root.classList.add('is-splash');
      const logo = h('div.s-logo.s-emoji', '🗣️');
      const name = h('h1.s-h1', { style: { marginTop: '26px', color: '#fff' } }, 'Parla AI');
      const tag = h('p.s-p', { style: { color: '#e0e7ff' } }, 'Your AI-Powered Language Tutor ✨');
      body.append(h('div.ph-fill'), logo, name, tag, h('div.s-spin'), h('div.ph-fill'));
      S.in([logo, name, tag]);
      ctx.at(1000, () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Parla AI” Would Like to Access the Microphone',
          message: 'This app requires microphone access.',
          buttons: [{ label: 'Don’t Allow', onTap: () => al.close() }, { label: 'OK', bold: true, onTap: () => al.close() }],
        });
        ctx.at(2300, () => F.tapEl(ctx, al.buttons[0]));
      });
      ctx.at(4000, () => {
        const toast = h('div.s-toast', '⚠️ Microphone access is required to use Parla AI!');
        ctx.root.append(toast);
        toast.classList.add('s-in');
      });
    },
  });

  // ---------------------------------------------------------------- the mic, asked where the reason is

  const WORDS = ['Vorrei', 'un', 'caffè,', 'per', 'favore.'];

  F.def({
    id: 'parla-mic', section: 'ungenerated', name: 'Parla · a permission', flow: true, loop: 10800, seqHold: 10200,
    intent: 'The phrase is on screen before anything is asked, so the reason is visible. One line says what Parla does and never does. The button opens the real system alert (its text, not a lookalike). Then the mic squishes under the finger, a waveform follows the voice, and each word lights as it is heard; one "Perfetto." is the screen’s one lively moment.',
    build(ctx) {
      const { body } = F.frame(ctx, { cls: 'k-parla', tone: 'light' });
      const lesson = h('span.pa-lesson', F.icon('coffee', { size: 14 }), 'Lesson 1 · At the bar');
      const title = h('h1.pa-title', F.rich('Say it *out loud.*'));
      const words = WORDS.map((w) => h('span.pa-word', w));
      const perf = h('span.pa-perf', F.icon('check', { size: 15, stroke: 3 }), 'Perfetto.');
      const card = h('div.pa-card', h('p.pa-phrase', words.flatMap((w, i) => (i ? [' ', w] : [w]))), h('p.pa-en', 'I’d like a coffee, please.'), perf);
      const bars = Array.from({ length: 17 }, () => h('i'));
      const wave = h('div.pa-wave', bars);
      const mic = h('button.pa-mic', { type: 'button', 'aria-label': 'Hold to speak' }, F.icon('mic', { size: 40, stroke: 2 }));
      const promise = h('p.pa-promise', 'Parla listens only while you hold the mic. Nothing is recorded.');
      const cta = F.primary(ctx, 'Allow the microphone', { onTap: () => ask() });
      const hint = h('p.pa-hint', 'Hold the mic and say it');
      hint.style.display = 'none';
      body.append(lesson, title, card, h('div.pa-stage', wave, mic), promise, h('div.ph-fill'), h('div.ph-foot', cta, hint));
      F.titleIn(ctx, title, { delay: 60 });
      F.rise(ctx, [lesson, card, mic, promise, cta], { delay: 160 });

      // Holding the mic: squash and stretch that keeps its volume, a waveform, words lit in turn.
      let allowed = false, held = false, heard = 0, stopWave = null, stopWords = null;
      const breathe = () => F.move(mic, { s: 1 }, { s: 1.03 }, { duration: 1500, curve: 'inout', ctx, fill: 'none' });
      const down = () => {
        if (!allowed || held) return;
        held = true;
        ctx.haptic('light');
        mic.getAnimations().forEach((a) => a.cancel());
        F.move(mic, { sx: 1, sy: 1 }, { sx: 1.06, sy: 0.92 }, { duration: 90, curve: 'strong', ctx, fill: 'forwards' });
        mic.classList.add('is-live');
        const r = F.rand(3);
        let t = 0;
        stopWave = ctx.loop((dt) => {
          t += dt;
          bars.forEach((b, i) => {
            const amp = 0.25 + 0.75 * Math.abs(Math.sin(t / 140 + i * 0.7) * Math.sin(t / 380 + i * 0.31));
            b.style.transform = `scaleY(${(0.18 + amp * (0.6 + r() * 0.4)).toFixed(3)})`;
          });
        });
        const next = () => {
          if (!held || heard >= words.length) return;
          words[heard].classList.add('is-heard');
          F.move(words[heard], { y: 4, s: 0.96 }, { y: 0, s: 1 }, { spring: { response: 0.34, damping: 0.7 }, ctx, fill: 'none' });
          ctx.haptic('selection');
          heard += 1;
          if (heard < words.length) stopWords = ctx.at(420, next);
        };
        stopWords = ctx.at(380, next);
      };
      const up = () => {
        if (!held) return;
        held = false;
        clearTimeout(stopWords);
        stopWave && stopWave();
        bars.forEach((b) => F.move(b, { sy: 0.6 }, { sy: 0.18 }, { duration: 260, curve: 'strong', ctx, fill: 'forwards' }));
        mic.classList.remove('is-live');
        F.move(mic, { sx: 1.06, sy: 0.92 }, { sx: 1, sy: 1 }, { spring: { response: 0.34, damping: 0.6 }, ctx, fill: 'forwards' });
        if (heard >= words.length) {
          ctx.at(160, () => {
            perf.classList.add('is-on');
            F.move(perf, { s: 0.5, o: 0, y: 10 }, { s: 1, o: 1, y: 0 }, { spring: { response: 0.4, damping: 0.55 }, ctx, fill: 'backwards' });
            ctx.haptic('success');
          });
        }
      };
      ctx.on(mic, 'pointerdown', down);
      ctx.on(mic, 'pointerup', up);
      ctx.on(mic, 'pointerleave', up);
      ctx.on(mic, 'pointercancel', up);

      // The ask: the real alert, its real text. Allow, and the button steps aside for the mic.
      const grant = () => {
        allowed = true;
        ctx.haptic('success');
        F.move(cta, { o: 1, y: 0 }, { o: 0, y: 8 }, { duration: 180, curve: 'exit', ctx, fill: 'forwards' });
        ctx.at(190, () => { cta.style.display = 'none'; hint.style.display = ''; F.rise(ctx, hint); });
        breathe();
      };
      const ask = () => {
        const al = X.alert(ctx, ctx.root, {
          title: '“Parla” Would Like to Access the Microphone',
          message: 'Parla listens while you hold the mic, so you can practise speaking. Nothing is recorded or saved.',
          buttons: [{ label: 'Don’t Allow', onTap: () => al.close() }, { label: 'Allow', bold: true, onTap: () => { al.close(); grant(); } }],
        });
        if (ctx.mode !== 'flow') ctx.at(1700, () => F.tapEl(ctx, al.buttons[1]));
      };

      if (ctx.mode !== 'flow') {
        ctx.at(1700, () => F.tapEl(ctx, cta));
        ctx.at(5000, () => {
          const p = F.pos(mic, ctx.root);
          F.touch(ctx, ctx.root, p.cx, p.cy, { hold: 2400 });
          ctx.at(300, () => mic.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
          ctx.at(2700, () => mic.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })));
        });
      }
    },
  });
})();
