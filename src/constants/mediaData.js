// moment number -> per-card-key image URLs (internal key is 'definition' for
// the Meaning card, matching the existing card2/definition naming).
// Data-driven mapping: add moments as new illustration art becomes available.

export const MOMENT_MEDIA = {
  1: {
    situation: '/media/asking_question/moment-01-asking-questions-situation.png',
    definition: '/media/asking_question/moment-01-asking-questions-meaning.png',
    practice: '/media/asking_question/moment-01-asking-questions-practice.png',
    consequence: '/media/asking_question/moment-01-asking-questions-consequence.png'
  },
  2: {
    situation: '/media/curiosity/situation.png',
    definition: '/media/curiosity/meaning.png',
    practice: '/media/curiosity/practice.png',
    consequence: '/media/curiosity/consequence.png'
  }
};
