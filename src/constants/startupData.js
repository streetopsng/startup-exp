import contentData from '../contentData.json';

export const ATMO = {
  welcome: {
    bg: ['#241a3d', '#0b1020'],
    particle: [196, 181, 253],
    accentA: '#8B5CF6',
    accentB: '#0090FF',
    motion: 'wander',
    polarity: 'swirl',
    orderBias: 0.05,
    pulse: 2.6,
    blur: 20,
    density: 1.00
  },
  confusion: {
    bg: ['#1b1330', '#0b1020'],
    particle: [167, 139, 250],
    accentA: '#8B5CF6',
    accentB: '#a78bfa',
    motion: 'wander',
    polarity: 'swirl',
    orderBias: -0.30,
    pulse: 1.9,
    blur: 22,
    density: 1.05
  },
  ambiguity: {
    bg: ['#1a1330', '#0b1020'],
    particle: [196, 181, 253],
    accentA: '#8B5CF6',
    accentB: '#0090FF',
    motion: 'fog',
    polarity: 'swirl',
    orderBias: -0.20,
    pulse: 2.2,
    blur: 24,
    density: 1.10
  },
  pressure: {
    bg: ['#0c0e1c', '#05060c'],
    particle: [91, 111, 168],
    accentA: '#5b6fa8',
    accentB: '#8B5CF6',
    motion: 'sink',
    polarity: 'repel',
    orderBias: -0.10,
    pulse: 1.1,
    blur: 8,
    density: 0.88
  },
  urgency: {
    bg: ['#170b13', '#0b1020'],
    particle: [255, 107, 107],
    accentA: '#ff6b6b',
    accentB: '#FFD000',
    motion: 'streak',
    polarity: 'repel',
    orderBias: -0.05,
    pulse: 0.5,
    blur: 2,
    density: 0.80
  },
  momentum: {
    bg: ['#0b1730', '#0b1020'],
    particle: [77, 184, 255],
    accentA: '#0090FF',
    accentB: '#8B5CF6',
    motion: 'flow',
    polarity: 'attractSoft',
    orderBias: 0.05,
    pulse: 1.3,
    blur: 6,
    density: 0.95
  },
  ownership: {
    bg: ['#1c1330', '#0b1020'],
    particle: [139, 92, 246],
    accentA: '#8B5CF6',
    accentB: '#4db8ff',
    motion: 'orbit',
    polarity: 'attractSoft',
    orderBias: 0.15,
    pulse: 2.0,
    blur: 10,
    density: 1.00
  },
  alignment: {
    bg: ['#0b1830', '#0b1020'],
    particle: [77, 184, 255],
    accentA: '#0090FF',
    accentB: '#8B5CF6',
    motion: 'grid',
    polarity: 'attract',
    orderBias: 0.35,
    pulse: 1.6,
    blur: 6,
    density: 1.00
  },
  recovery: {
    bg: ['#241407', '#0b1020'],
    particle: [255, 184, 77],
    accentA: '#FFD000',
    accentB: '#8B5CF6',
    motion: 'reform',
    polarity: 'attractSoft',
    orderBias: 0.05,
    pulse: 1.7,
    blur: 14,
    density: 1.00
  },
  confidence: {
    bg: ['#1a1330', '#0b1020'],
    particle: [255, 208, 0],
    accentA: '#FFD000',
    accentB: '#8B5CF6',
    motion: 'orbit',
    polarity: 'attract',
    orderBias: 0.50,
    pulse: 2.6,
    blur: 4,
    density: 1.08
  },
  clarity: {
    bg: ['#0b1220', '#05070f'],
    particle: [230, 240, 255],
    accentA: '#0090FF',
    accentB: '#FFD000',
    motion: 'grid',
    polarity: 'attract',
    orderBias: 0.65,
    pulse: 3.0,
    blur: 0,
    density: 1.15
  },
  resolved: {
    bg: ['#241a06', '#1c1330'],
    particle: [255, 208, 0],
    accentA: '#FFD000',
    accentB: '#8B5CF6',
    motion: 'orbit',
    polarity: 'attract',
    orderBias: 0.80,
    pulse: 3.2,
    blur: 0,
    density: 1.12
  }
};

export const MOMENT_ATMO = {
  1: 'confusion',
  2: 'ambiguity',
  3: 'momentum',
  4: 'momentum',
  5: 'momentum',
  6: 'ownership',
  7: 'pressure',
  8: 'clarity',
  9: 'pressure',
  10: 'urgency',
  11: 'pressure',
  12: 'alignment',
  13: 'alignment',
  14: 'clarity',
  15: 'alignment',
  16: 'momentum',
  17: 'ambiguity',
  18: 'confidence',
  19: 'alignment',
  20: 'recovery',
  21: 'momentum',
  22: 'clarity',
  23: 'ownership',
  24: 'alignment',
  25: 'confidence'
};

export const PRACTICE_OVERLAY = {
  1: 'signal',
  2: 'loop',
  3: 'paths',
  4: 'paths',
  5: 'signal',
  6: 'none',
  7: 'signal',
  8: 'loop',
  9: 'paths',
  10: 'paths',
  11: 'signal',
  12: 'signal',
  13: 'signal',
  14: 'signal',
  15: 'signal',
  16: 'loop',
  17: 'loop',
  18: 'paths',
  19: 'signal',
  20: 'none',
  21: 'paths',
  22: 'loop',
  23: 'signal',
  24: 'signal',
  25: 'paths'
};

export const CONSEQUENCE_REACTION = {
  7: 'freeze',
  8: 'stabilize',
  9: 'noise',
  10: 'break',
  11: 'freeze',
  13: 'break',
  20: 'stabilize',
  24: 'break',
  25: 'stabilize'
};

export function reactionFor(n) {
  return CONSEQUENCE_REACTION[n] || 'dim';
}

export function layoutFor(n) {
  return ['layout-center', 'layout-left', 'layout-wide'][(n - 1) % 3];
}

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
  5: [{ kind: 'truth', data: STARTUP_TRUTHS[0] }],
  8: [{ kind: 'translation', data: FOUNDER_TRANSLATIONS[0] }],
  9: [{ kind: 'heard', data: THINGS_HEARD[0] }],
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
  { prefix: "When you don't know →", action: "Ask." },
  { prefix: "When there's no answer →", action: "Explore." },
  { prefix: "When nobody tells you →", action: "Look around." },
  { prefix: "When something's wrong →", action: "Say something." },
  { prefix: "When you promise →", action: "Follow through." },
  { prefix: "When you're behind →", action: "Give an update." },
  { prefix: "When you finish →", action: "Close the loop." },
  { prefix: "When everything feels urgent →", action: "Think first." },
  { prefix: "When people depend on you →", action: "Keep them informed." },
  { prefix: "When things change →", action: "Adjust." },
  { prefix: "When you make a mistake →", action: "Own it." },
  { prefix: "When you're stuck →", action: "Ask for help." }
];

function breakScreenFor(ins) {
  if (ins.kind === 'truth') return { type: 'truth', atmo: ins.data.atmo, lines: ins.data.lines };
  if (ins.kind === 'translation') return { type: 'translation', atmo: ins.data.atmo, phrase: ins.data.phrase, body: ins.data.body };
  if (ins.kind === 'myth') return { type: 'myth', atmo: ins.data.atmo, myth: ins.data.myth, reality: ins.data.reality };
  if (ins.kind === 'heard') return { type: 'heard', atmo: ins.data.atmo, phrase: ins.data.phrase, meaning: ins.data.meaning };
  if (ins.kind === 'reflect-pause') return { type: 'reflect-pause', atmo: 'recovery', focus: true };
}

export function buildScreensSequence() {
  const { homepage, intro, moments } = contentData;
  const list = [];

  list.push({ type: 'homepage', data: homepage });

  intro.body.forEach((line, i) => {
    list.push({ type: 'intro-line', text: line, isFirst: i === 0 });
  });

  list.push({ type: 'intro-transition', text: intro.transitionToMoment1 });

  moments.forEach((m) => {
    (INSERT_BEFORE_MOMENT[m.number] || []).forEach(ins => list.push(breakScreenFor(ins)));
    list.push({ type: 'situation', m });
    list.push({ type: 'definition', m });
    list.push({ type: 'practice', m });
    list.push({ type: 'consequence', m });
    (INSERT_AFTER_MOMENT[m.number] || []).forEach(ins => list.push(breakScreenFor(ins)));
  });

  AFTERMATH_LINES.forEach(l => list.push({ type: 'aftermath-line', text: l.text, size: l.size }));
  list.push({ type: 'fieldguide' });
  list.push({ type: 'ending' });

  return list;
}

export function findClosingQuote(text, from) {
  let i = from;
  while (true) {
    i = text.indexOf('\u2019', i);
    if (i === -1) return -1;
    const nextChar = text[i + 1];
    if (!nextChar || !/[a-zA-Z]/.test(nextChar)) return i;
    i++;
  }
}

export function extractQuote(text) {
  let searchFrom = 0, lastMatch = null;
  while (true) {
    const colonQuoteIdx = text.indexOf(': \u2018', searchFrom);
    if (colonQuoteIdx === -1) break;
    const openQ = colonQuoteIdx + 2;
    const closeQ = findClosingQuote(text, openQ + 1);
    if (closeQ !== -1) lastMatch = { openQ, closeQ };
    searchFrom = colonQuoteIdx + 1;
  }
  if (lastMatch) return lastMatch;
  const openQ = text.indexOf('\u2018');
  if (openQ === -1) return null;
  const closeQ = findClosingQuote(text, openQ + 1);
  if (closeQ === -1) return null;
  return { openQ, closeQ };
}
