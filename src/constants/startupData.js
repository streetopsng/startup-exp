import contentData from '../contentData.json';

/* =========================================================
   PALETTE -- pastel accent per atmosphere key (reused from
   the mood-mapping system, now driving color instead of motion)
   ========================================================= */
export const PALETTE = {
  welcome: '#F6DE9E',
  confusion: '#F3AE9D',
  ambiguity: '#D9CBF5',
  pressure: '#E5E3DC',
  urgency: '#F3AE9D',
  momentum: '#BBDDF5',
  ownership: '#D9CBF5',
  alignment: '#BBDDF5',
  recovery: '#F6DE9E',
  confidence: '#F6DE9E',
  clarity: '#9FD6C7',
  resolved: '#F6DE9E'
};

export const MOMENT_ATMO = {
  1: 'confusion', 2: 'ambiguity', 3: 'momentum', 4: 'momentum', 5: 'momentum',
  6: 'ownership', 7: 'pressure', 8: 'clarity', 9: 'pressure', 10: 'urgency',
  11: 'pressure', 12: 'alignment', 13: 'alignment', 14: 'clarity', 15: 'alignment',
  16: 'momentum', 17: 'ambiguity', 18: 'confidence', 19: 'alignment', 20: 'recovery',
  21: 'momentum', 22: 'clarity', 23: 'ownership', 24: 'alignment', 25: 'confidence'
};

export const STARTUP_TRUTHS = [
  {
    atmo: 'ambiguity',
    lines: [
      "The map is incomplete.",
      "Nobody has all the instructions.",
      "That's not always poor management — sometimes the company is dealing with something it's never dealt with before.",
      "The instructions are being written while the work is happening.",
      "That's startup work."
    ]
  },
  {
    atmo: 'momentum',
    lines: [
      "Change isn't an interruption.",
      "In startups, change is often the environment itself.",
      "The plan changing doesn't always mean something went wrong.",
      "Sometimes it means the company learned something."
    ]
  },
  {
    atmo: 'recovery',
    lines: [
      "Your work travels further than you think.",
      "In a small team, small actions have bigger consequences.",
      "A missed update affects someone. A delayed decision affects a customer.",
      "A problem you notice early can prevent something much bigger."
    ]
  },
  {
    atmo: 'resolved',
    lines: [
      "Eventually, you stop seeing tasks.",
      "And start seeing the system."
    ]
  }
];

export const FOUNDER_TRANSLATIONS = [
  {
    atmo: 'ownership',
    phrase: "“I need you to take more ownership.”",
    body: [
      "Doesn't necessarily mean work more.",
      "It often means: don't stop thinking just because your assigned task is complete."
    ]
  },
  {
    atmo: 'alignment',
    phrase: "“Be more proactive.”",
    body: [
      "Often means: don't wait for the problem to become obvious before noticing it."
    ]
  },
  {
    atmo: 'momentum',
    phrase: "“Move faster.”",
    body: [
      "Doesn't mean panic, or skip thinking.",
      "It often means: reduce unnecessary waiting."
    ]
  }
];

export const MYTH_REALITY = [
  {
    atmo: 'confusion',
    myth: "Startups have no structure.",
    reality: [
      "Startups often have less established structure.",
      "Which means someone has to build it.",
      "Sometimes, that's you."
    ]
  },
  {
    atmo: 'pressure',
    myth: "Startup people simply work harder.",
    reality: [
      "Good startup teams don't just work harder.",
      "They reduce unnecessary waiting."
    ]
  }
];

export const THINGS_HEARD = [
  {
    atmo: 'urgency',
    phrase: "“Let's move fast.”",
    meaning: [
      "Usually doesn't mean rush blindly.",
      "It means: stop waiting unnecessarily."
    ]
  },
  {
    atmo: 'clarity',
    phrase: "“Who owns this?”",
    meaning: [
      "Usually means a problem exists.",
      "Someone needs to make sure it doesn't remain just a conversation."
    ]
  }
];

export const INSERT_AFTER_MOMENT = {
  5:  [{ kind: 'truth', data: STARTUP_TRUTHS[0] }],
  8:  [{ kind: 'translation', data: FOUNDER_TRANSLATIONS[0] }],
  9:  [{ kind: 'heard', data: THINGS_HEARD[0] }],
  10: [{ kind: 'myth', data: MYTH_REALITY[0] }],
  13: [{ kind: 'translation', data: FOUNDER_TRANSLATIONS[1] }],
  16: [{ kind: 'truth', data: STARTUP_TRUTHS[1] }],
  18: [{ kind: 'myth', data: MYTH_REALITY[1] }],
  20: [{ kind: 'truth', data: STARTUP_TRUTHS[2] }],
  21: [{ kind: 'translation', data: FOUNDER_TRANSLATIONS[2] }],
  22: [{ kind: 'heard', data: THINGS_HEARD[1] }]
};

export const INSERT_BEFORE_MOMENT = {
  20: [{ kind: 'reflect-pause' }]
};

export const AFTERMATH_LINES = [
  { text: "So.", size: 'hero' },
  { text: "You've made it through 25 moments.", size: 'normal' },
  { text: "No quiz. No score. No certificate. Because that's not really the point.", size: 'sub' },
  { text: "The point is what happens next.", size: 'normal' },
  { text: "Tomorrow, one of these moments will happen again. You won't understand something. Something will change. A customer will have a problem. A teammate will be waiting. You'll notice something. You'll make a mistake.", size: 'sub' },
  { text: "And maybe — you'll catch yourself. Right in the middle of it.", size: 'normal' },
  { text: "“Oh. This is one of those moments.”", size: 'hero' },
  { text: "That's when StartUp 101 actually begins.", size: 'normal' }
];

export const FIELD_GUIDE = [
  "When you don't know → <b>Ask.</b>",
  "When there's no answer → <b>Explore.</b>",
  "When nobody tells you → <b>Look around.</b>",
  "When something's wrong → <b>Say something.</b>",
  "When you promise → <b>Follow through.</b>",
  "When you're behind → <b>Give an update.</b>",
  "When you finish → <b>Close the loop.</b>",
  "When everything feels urgent → <b>Think first.</b>",
  "When people depend on you → <b>Keep them informed.</b>",
  "When things change → <b>Adjust.</b>",
  "When you make a mistake → <b>Own it.</b>",
  "When you're stuck → <b>Ask for help.</b>"
];

export const DOODLE_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3a8.4 8.4 0 0 1 8.5 8.5z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2 2 19h20L12 2zM12 9v5M12 17h.01"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 9 17l-5-5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3v18h18M7 15l3-4 4 3 5-7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 12l4-2M8 7l1-4M6 18l-2 3"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17 8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M3 8h18l-1.5 12.5a1 1 0 0 1-1 .5H5.5a1 1 0 0 1-1-.5L3 8z"/></svg>'
];

export function breakScreenFor(ins) {
  if (ins.kind === 'truth') return { type: 'truth', atmo: ins.data.atmo, lines: ins.data.lines };
  if (ins.kind === 'translation') return { type: 'translation', atmo: ins.data.atmo, phrase: ins.data.phrase, body: ins.data.body };
  if (ins.kind === 'myth') return { type: 'myth', atmo: ins.data.atmo, myth: ins.data.myth, reality: ins.data.reality };
  if (ins.kind === 'heard') return { type: 'heard', atmo: ins.data.atmo, phrase: ins.data.phrase, meaning: ins.data.meaning };
  if (ins.kind === 'reflect-pause') return { type: 'reflect-pause', atmo: 'recovery' };
  return null;
}

export function buildScreensSequence() {
  const { homepage, intro, moments } = contentData;
  const screens = [];

  screens.push({ type: 'homepage', homepage });

  intro.body.forEach((line, i) => {
    screens.push({ type: 'intro-line', text: line, isFirst: i === 0 });
  });

  screens.push({ type: 'intro-transition', text: intro.transitionToMoment1 });

  moments.forEach((m) => {
    (INSERT_BEFORE_MOMENT[m.number] || []).forEach(ins => {
      const b = breakScreenFor(ins);
      if (b) screens.push(b);
    });

    screens.push({ type: 'moment', m });

    (INSERT_AFTER_MOMENT[m.number] || []).forEach(ins => {
      const b = breakScreenFor(ins);
      if (b) screens.push(b);
    });
  });

  AFTERMATH_LINES.forEach(l => {
    screens.push({ type: 'aftermath-line', text: l.text, size: l.size });
  });

  screens.push({ type: 'fieldguide' });
  screens.push({ type: 'ending' });

  return screens;
}

export function findClosingQuote(text, from) {
  let i = from;
  while (true) {
    i = text.indexOf('’', i);
    if (i === -1) return -1;
    const nextChar = text[i + 1];
    if (!nextChar || !/[a-zA-Z]/.test(nextChar)) return i;
    i++;
  }
}

export function extractQuote(text) {
  let searchFrom = 0;
  let lastMatch = null;
  while (true) {
    const colonQuoteIdx = text.indexOf(': ‘', searchFrom);
    if (colonQuoteIdx === -1) break;
    const openQ = colonQuoteIdx + 2;
    const closeQ = findClosingQuote(text, openQ + 1);
    if (closeQ !== -1) lastMatch = { openQ, closeQ };
    searchFrom = colonQuoteIdx + 1;
  }
  if (lastMatch) return lastMatch;

  const openQ = text.indexOf('‘');
  if (openQ === -1) return null;
  const closeQ = findClosingQuote(text, openQ + 1);
  if (closeQ === -1) return null;
  return { openQ, closeQ };
}
