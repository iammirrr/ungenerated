/* The board's configuration. The design-board skill fills this in for your app.
 * sections: one row each, in the order of the flow. view: 'screens' (default), 'kit' or
 * 'transitions'. research: what you studied, keyed by section id; src is optional. */
window.BOARD = {
  name: 'Your app',
  // mark: 'assets/app-icon.png',
  startView: 'screens',
  sections: [
    { id: 'kit-foundations', view: 'kit', title: 'Foundations', intent: 'Type, colour, buttons: what every screen is drawn with.' },
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
