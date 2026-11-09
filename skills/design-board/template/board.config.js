/* The board's configuration. The design-board skill fills this in for your app.
 * sections: one row each, in the order of the flow. view: 'screens' (default), 'kit' or
 * 'transitions'. research: what you studied, keyed by section id; src is optional. */
window.BOARD = {
  name: 'Your app',
  // mark: 'assets/app-icon.png',
  // style: 'calm',   // the app's motion style (js/styles.js); a screen can name its own
  startView: 'screens',
  sections: [
    { id: 'kit-foundations', view: 'kit', title: 'Foundations', intent: 'Type, colour, buttons: what every screen is drawn with.' },
    { id: 'kit-styles', view: 'kit', title: 'Motion styles', intent: 'One screen in seven personalities: calm, snappy, bubbly, precise, fluid, cinematic, organic. Pick the one the app should move in, then set F.def({ style }) on every screen (the motion-styles skill).' },
    { id: 'kit-bubbly', view: 'kit', title: 'Bubbly', intent: 'Squish, pop, goo and stretch: soft, alive motion for what the finger touches (the bubbly-motion skill).' },
    { id: 'kit-continuity', view: 'kit', title: 'Continuity', intent: 'One thing becomes the next: a choice flying into its place, a camera instead of a cut (the continuity skill).' },
    { id: 'opening', title: 'The opening', intent: 'What the app is, in one short story, with the button only at the end.' },
    { id: 'questions', title: 'Questions', intent: 'A few quick answers that shape what comes next.' },
  ],
  research: {
    opening: [
      { title: 'One hero carries the story', took: 'The same object is on screen from the first beat to the last; the beats change around it.' },
    ],
    questions: [
      { title: 'The answer is the button', took: 'Single picks move on by themselves; only multi-picks need Continue.' },
    ],
  },
  answers: { goal: 'focus' },
};
