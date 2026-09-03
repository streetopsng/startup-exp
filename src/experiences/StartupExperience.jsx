import React, { useState, useEffect } from 'react';

const HOME = {
  eyebrow: "GummyGum Executive Series",
  category: "WORKPLACE HABITS & FOUNDATIONS",
  title: "StartUp 101",
  sub: "Foundations & High-Impact Workplace Habits",
  description: "25 foundational habits detailing the exact behaviors that separate exceptional team members from average ones in high-velocity startups.",
  cta: "Start Experience",
  specs: ["⏱ 15–20 Mins", "🚀 25 Habits", "👥 All Team Members"],
  outcomes: [
    { title: "Proactive Communication", desc: "Master bias for action, async documentation, and early risk escalation." },
    { title: "Low Friction Collaboration", desc: "Build cross-functional empathy, direct feedback, and meeting discipline." },
    { title: "Owner Mindset", desc: "Treat company resources with extreme care and focus on customer ROI." }
  ]
};

const INTRO = {
  line1: "Welcome to StartUp 101.",
  line2: "Fast-growing startups move with extreme speed, expectations shift rapidly, and nobody hands you a corporate manual.",
  line3: "These 25 core habits represent what founders and executives quietly observe when identifying key leaders.",
  transitionToMoment1: "Begin Scenarios"
};

const MOMENTS = [
  {
    number: 1,
    behavior: "Asking Clarifying Questions Early",
    situation: "You are handed a vague task with a tight deadline.",
    card1: "Your instinct might be to nod, say 'got it', and spend three hours guessing what was meant. That feels safe in the moment.",
    card2: "What actually happens: you deliver something that missed the mark, and now there are only thirty minutes left to fix it.",
    card3: "Great startup team members ask clarifying questions immediately: 'To make sure I hit the target, what does success look like for this by 5 PM?'",
    card4: "Asking questions in minute five saves hours of rework on hour three.",
    founder: "I'd rather spend two minutes clarifying a task at 9 AM than three hours fixing a wrong delivery at 5 PM."
  },
  {
    number: 2,
    behavior: "Bias for Action",
    situation: "You notice a small problem that isn't explicitly your job.",
    card1: "In traditional environments, people wait to be assigned a task before taking any action.",
    card2: "In a startup, waiting for permission to fix an obvious issue creates massive organizational drag.",
    card3: "Bias for action means fixing small things immediately or drafting a quick solution before asking for approval.",
    card4: "Don't just point out a broken link or missing document — fix it or propose the exact fix.",
    founder: "Doers who solve problems without waiting for a command are the engine of every startup."
  },
  {
    number: 3,
    behavior: "Closing Communication Loops",
    situation: "You complete a task someone asked you to look into.",
    card1: "Completing a task silently leaves the requestor wondering if it ever happened.",
    card2: "They have to spend mental energy following up with you to check status.",
    card3: "Closing the loop means sending a simple 10-second update: 'Done. Updated in CRM.'",
    card4: "Proactive status updates build fast trust with founders and managers.",
    founder: "When I don't have to follow up on a task, my trust in that person triples instantly."
  },
  {
    number: 4,
    behavior: "Bringing Solutions, Not Just Problems",
    situation: "You discover a blocker or roadblock in a project.",
    card1: "Coming to your manager with 'X is broken, what should we do?' shifts 100% of the cognitive load back to them.",
    card2: "Instead, frame it as: 'X is broken. I recommend Option A because of Y, but we could also do Option B.'",
    card3: "Even if your manager picks Option B, you've demonstrated strategic thinking and agency.",
    card4: "Train yourself to never bring a problem without at least one proposed recommendation.",
    founder: "Bring me choices, not just chaos."
  },
  {
    number: 5,
    behavior: "Defaulting to Asynchronous Documentation",
    situation: "You figure out how to handle a complex customer issue.",
    card1: "If you keep the solution in your head, the next person faced with the issue will have to interrupt you.",
    card2: "Documenting the solution in a searchable workspace creates compound organizational speed.",
    card3: "Spend 2 minutes recording the solution once so the whole team benefits forever.",
    card4: "Documentation is a gift to your future teammates.",
    founder: "If it isn't documented, it didn't scale."
  },
  {
    number: 6,
    behavior: "Managing Your Own Energy & Focus",
    situation: "You have 5 competing tasks on your desk.",
    card1: "Trying to do everything at once leads to half-baked execution across the board.",
    card2: "Identify the top 20% lever that moves the needle most today and protect focused time for it.",
    card3: "Communicate your priority focus clearly so stakeholders know what to expect.",
    card4: "High performers manage their bandwidth proactively before burnout occurs.",
    founder: "I respect people who protect focus on what actually matters."
  },
  {
    number: 7,
    behavior: "Embracing Feedback Without Defensiveness",
    situation: "You receive constructive critique on a draft.",
    card1: "Defensiveness signals to leaders that giving you feedback is painful and exhausting.",
    card2: "Over time, people stop giving you feedback — halting your professional growth.",
    card3: "Treat critique of your work as critique of the artifact, not of your character.",
    card4: "Say: 'Thank you for the feedback. Let me incorporate this right away.'",
    founder: "Fast feedback loops are how startups win."
  },
  {
    number: 8,
    behavior: "Thinking Like an Owner",
    situation: "A company resource or asset is being wasted.",
    card1: "An employee thinks: 'Not my money, not my problem.'",
    card2: "An owner thinks: 'How can we get maximum ROI from every dollar and hour we invest?'",
    card3: "Owner mindsets treat company resources with the same care as personal investments.",
    card4: "Resourcefulness over wastefulness.",
    founder: "Act like an owner, and soon you'll be treated like one."
  },
  {
    number: 9,
    behavior: "Direct Communication Over Hallway Gossip",
    situation: "You disagree with a decision made by another department.",
    card1: "Complaining sideways to peers creates toxic culture drift.",
    card2: "Go directly to the decision-maker with a calm, constructive conversation.",
    card3: "Disagree and commit: voice concerns directly, but support the final decision once made.",
    card4: "Directness builds psychological safety.",
    founder: "Clear is kind. Unclear is unkind."
  },
  {
    number: 10,
    behavior: "Over-Communicating Risks Early",
    situation: "You realize a launch date might be missed by 2 days.",
    card1: "Hiding a delay until the day of launch leaves zero buffer to pivot.",
    card2: "Raising the red flag 5 days in advance allows the team to adjust scope or deploy help.",
    card3: "Bad news does not improve with age.",
    card4: "Escalate early when bad news is fixable.",
    founder: "Tell me bad news early while we can still fix it together."
  },
  {
    number: 11,
    behavior: "Continuous Curiosity & Learning",
    situation: "A new software tool or AI capability is introduced.",
    card1: "Waiting to be formally trained on new tools holds you back.",
    card2: "Spend 30 minutes experimenting and discovering how to leverage it.",
    card3: "Self-starters adapt to changing technology effortlessly.",
    card4: "Curiosity is a superpower in fast-moving industries.",
    founder: "The best team members train themselves ahead of the curve."
  },
  {
    number: 12,
    behavior: "Respecting Teammate Focus Time",
    situation: "You have a quick question for a developer in deep work.",
    card1: "Tapping someone on the shoulder breaks 30 minutes of deep focus state.",
    card2: "Use async messages for non-urgent queries and batch your questions.",
    card3: "Protecting deep work time for your peers accelerates total team output.",
    card4: "Respect cognitive momentum.",
    founder: "Flow state is expensive. Protect it."
  },
  {
    number: 13,
    behavior: "Ruthless Simplification",
    situation: "A workflow is becoming overly complicated with 10 manual steps.",
    card1: "Complexity is easy; simplicity takes deliberate effort.",
    card2: "Continuously audit processes to strip out unnecessary friction.",
    card3: "Keep instructions, docs, and communication as simple as possible.",
    card4: "Simplicity scales. Complexity breaks.",
    founder: "Make it simple enough that a new hire understands it on day one."
  },
  {
    number: 14,
    behavior: "Punctuality and Meeting Readiness",
    situation: "A key team sync starts at 10:00 AM.",
    card1: "Arriving at 10:04 AM wastes 4 minutes of 5 people's time — 20 total minutes of company productivity.",
    card2: "Be ready with doc links open 1 minute before start time.",
    card3: "Punctuality is a signal of respect for your team's time.",
    card4: "Show up prepared.",
    founder: "Respecting meeting times means respecting your colleagues."
  },
  {
    number: 15,
    behavior: "Celebrating Teammate Wins",
    situation: "A peer ships a tough feature or closes a deal.",
    card1: "Ignoring peer achievements leads to siloed, transactional cultures.",
    card2: "Give public shoutouts in team channels to elevate team morale.",
    card3: "Recognition fosters high-trust community.",
    card4: "Generosity with praise costs nothing and yields everything.",
    founder: "Great teams cheer for each other's success."
  },
  {
    number: 16,
    behavior: "Admitting Mistakes Quickly",
    situation: "You accidentally broke a configuration or sent a wrong email.",
    card1: "Trying to cover up a mistake multiplies the damage.",
    card2: "Own it immediately: 'I made a mistake on X. Here is what happened and how I'm fixing it.'",
    card3: "Psychological safety starts with radical honesty.",
    card4: "Mistakes are learning moments when owned openly.",
    founder: "Fail fast, own it fast, fix it faster."
  },
  {
    number: 17,
    behavior: "Focusing on Customer Impact",
    situation: "Debating between two feature implementations.",
    card1: "Internal politics often distract from customer experience.",
    card2: "Anchor every debate in: 'Which option delivers more value to the customer?'",
    card3: "Customer obsession aligns divergent opinions instantly.",
    card4: "Customer value is the ultimate North Star.",
    founder: "When in doubt, ask what the customer needs."
  },
  {
    number: 18,
    behavior: "Writing Clear, Actionable Titles",
    situation: "Creating a calendar invite or Slack message.",
    card1: "Vague titles like 'Quick Chat' create unnecessary anxiety and context switching.",
    card2: "Use descriptive titles: 'Decision Required: Pricing Model Update for Q3'.",
    card3: "Give attendees the context they need before they enter the room.",
    card4: "Context reduces cognitive fatigue.",
    founder: "Good communication starts with clear labels."
  },
  {
    number: 19,
    behavior: "Building Cross-Functional Empathy",
    situation: "Engineering is waiting on Design, or Sales is pushing Product.",
    card1: "Assuming other departments are lazy or slow breeds toxicity.",
    card2: "Take time to understand the constraints and realities of adjacent roles.",
    card3: "Cross-functional empathy turns friction into collaboration.",
    card4: "We are all on the same mission.",
    founder: "One team, one dream."
  },
  {
    number: 20,
    behavior: "Writing Down Meeting Notes & Action Items",
    situation: "A 30-minute alignment call is wrapping up.",
    card1: "Ending calls without explicit action items means 50% of decisions vanish.",
    card2: "Spend 2 minutes summarizing: 'Who is doing What by When (WWW)'.",
    card3: "Action items turn talk into execution.",
    card4: "Always capture the WWW.",
    founder: "No action items means the meeting didn't happen."
  },
  {
    number: 21,
    behavior: "Testing Your Work Before Handing Off",
    situation: "Finishing a draft, code PR, or design deck.",
    card1: "Handing off unverified work forces your peer to act as your QA tester.",
    card2: "Do a self-review check: click every link, read every sentence out loud.",
    card3: "Pride in craft shows in the polish of your first handoff.",
    card4: "Inspect what you expect.",
    founder: "High standards are non-negotiable."
  },
  {
    number: 22,
    behavior: "Managing Up Proactively",
    situation: "Your manager is overwhelmed with executive priorities.",
    card1: "Waiting for your manager to direct your daily micro-steps bogs them down.",
    card2: "Send weekly bulleted summaries: 'What I shipped, What I'm shipping next, Blockers'.",
    card3: "Managing up gives your leader peace of mind.",
    card4: "Be easy to manage.",
    founder: "Proactive communicators are a manager's dream."
  },
  {
    number: 23,
    behavior: "Fostering Inclusion & Open Floor",
    situation: "In a meeting where quiet team members haven't spoken.",
    card1: "Dominating the conversation leaves valuable perspective on the table.",
    card2: "Invite input: 'Sarah, you've worked on this codebase — what are your thoughts?'",
    card3: "Inclusive meetings surface hidden brilliance.",
    card4: "Amplify quiet voices.",
    founder: "Diverse perspectives build better products."
  },
  {
    number: 24,
    behavior: "Decisive Execution Under Uncertainty",
    situation: "You have 70% of the information needed for a decision.",
    card1: "Waiting for 100% information leads to analysis paralysis.",
    card2: "Make reversible decisions quickly with 70% data.",
    card3: "Speed of iteration beats perfection of planning.",
    card4: "Move fast, learn faster.",
    founder: "Most decisions are two-way doors. Make them fast."
  },
  {
    number: 25,
    behavior: "Protecting the Culture Code",
    situation: "Observing behavior that violates company values.",
    card1: "Ignoring poor behavior quietly sets a new lower standard for the team.",
    card2: "Uphold standards kindly and firmly: 'That's not how we treat customers here.'",
    card3: "Culture is defined by the worst behavior leadership tolerates.",
    card4: "Be a guardian of team culture.",
    founder: "Culture is built in every daily interaction."
  }
];

// Screen generator
const screens = [
  { kind: 'home' },
  { kind: 'intro', text: INTRO.line1, isLast: false },
  { kind: 'intro', text: INTRO.line2, isLast: false },
  { kind: 'intro', text: INTRO.line3, isLast: true },
];

MOMENTS.forEach(m => {
  for (let cardNum = 1; cardNum <= 4; cardNum++) {
    screens.push({
      kind: 'card',
      moment: m,
      cardNum: cardNum
    });
  }
});

screens.push({ kind: 'outro' });

export default function StartupExperience({ onBackToHub }) {
  const [current, setCurrent] = useState(0);
  const s = screens[current];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrent(c => Math.min(screens.length - 1, c + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrent(c => Math.max(0, c - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const go = (delta) => {
    setCurrent(c => Math.max(0, Math.min(screens.length - 1, c + delta)));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between py-4 px-3 sm:px-6 text-slate-900 bg-white selection:bg-emerald-600 selection:text-white">
      
      {/* Main Content Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-auto">
        {s.kind === 'home' && (
          <div className="w-full max-w-4xl p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xl shadow-slate-200/50 animate-fade-in flex flex-col gap-8 my-auto">
            
            {/* Top Badge & Header */}
            <div className="flex flex-col gap-3 text-left">
              <div className="inline-flex items-center gap-2 w-fit font-mono text-xs text-emerald-800 bg-emerald-100 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-widest font-semibold">
                <span>🚀 {HOME.eyebrow}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                {HOME.title}
              </h1>
              <p className="text-lg sm:text-xl font-display font-semibold text-emerald-900 italic">
                {HOME.sub}
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-slate-700 font-body leading-relaxed max-w-3xl text-left border-l-3 border-emerald-600 pl-4">
              {HOME.description}
            </p>

            {/* Outcomes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {HOME.outcomes.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-1.5 shadow-sm hover:border-emerald-300 transition-all">
                  <span className="font-display font-bold text-emerald-800 text-sm">{item.title}</span>
                  <span className="font-body text-xs text-slate-600 leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 font-mono text-xs text-slate-600">
                {HOME.specs.map((spec, idx) => (
                  <span key={idx} className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    {spec}
                  </span>
                ))}
              </div>
              <button
                onClick={() => go(1)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-sm tracking-wide shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{HOME.cta}</span>
                <span>➔</span>
              </button>
            </div>

          </div>
        )}

        {s.kind === 'intro' && (
          <div className="w-full max-w-2xl p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl text-left space-y-6 animate-fade-in my-auto">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
              <span>WORKPLACE HABITS</span>
            </div>

            <p className="text-lg sm:text-2xl font-display text-slate-800 font-medium leading-relaxed">
              {s.text}
            </p>

            {s.isLast && (
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => go(1)}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-sm shadow-md transition-all cursor-pointer"
                >
                  {INTRO.transitionToMoment1} ➔
                </button>
              </div>
            )}
          </div>
        )}

        {s.kind === 'card' && (
          <div className="w-full max-w-3xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 flex flex-col justify-between space-y-6 animate-fade-in my-auto">
            
            {/* Card Header Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                {s.moment.behavior}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                Habit {s.moment.number} of {MOMENTS.length} • Step {s.cardNum}/4
              </span>
            </div>

            <div className="text-lg sm:text-xl font-display font-bold italic text-amber-900 text-left bg-amber-50/60 border-l-4 border-amber-500 p-4 rounded-r-2xl">
              {s.moment.situation}
            </div>

            <div className="space-y-3 text-base sm:text-lg text-slate-800 leading-relaxed font-body text-left">
              <p className="whitespace-pre-line">{s.moment[`card${s.cardNum}`]}</p>
            </div>

            {s.cardNum === 4 && s.moment.founder && (
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 text-xs sm:text-sm font-display font-semibold italic shadow-xs text-left flex items-start gap-3">
                <span className="text-base">💡</span>
                <span>"{s.moment.founder}"</span>
              </div>
            )}
          </div>
        )}

        {s.kind === 'outro' && (
          <div className="w-full max-w-xl p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in my-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Go do the thing.
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-body">
              Startup work isn’t a script. It’s a series of moments — most of them small, none of them dramatic on their own, all of them adding up to what people mean when they call someone ‘good to work with.’
            </p>
            <button
              onClick={onBackToHub}
              className="mt-4 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer"
            >
              Return to Experience Hub
            </button>
          </div>
        )}
      </div>

      {/* Navigation Footer Controls (Hidden on Homepage) */}
      {s.kind !== 'home' && (
        <div className="w-full flex items-center justify-between shrink-0 pt-3 border-t border-slate-200 mt-2">
          <button
            onClick={() => go(-1)}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-200 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline font-medium">
            Use ← / → arrow keys to navigate
          </span>

          <button
            onClick={() => go(1)}
            disabled={current === screens.length - 1}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display font-semibold tracking-wide cursor-pointer shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
