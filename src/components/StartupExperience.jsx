import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import AtmoCanvas from './AtmoCanvas';
import Mascot from './Mascot';
import {
  ATMO,
  MOMENT_ATMO,
  PRACTICE_OVERLAY,
  reactionFor,
  layoutFor,
  buildScreensSequence,
  extractQuote,
  FIELD_GUIDE
} from '../constants/startupData';

const DELAY_CLASSES = [
  'anim-delay-50',
  'anim-delay-100',
  'anim-delay-140',
  'anim-delay-180',
  'anim-delay-220',
  'anim-delay-250',
  'anim-delay-300',
  'anim-delay-350',
  'anim-delay-400',
  'anim-delay-500'
];

export default function StartupExperience() {
  const screens = useMemo(() => buildScreensSequence(), []);
  const [screenIndex, setScreenIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [portalTrigger, setPortalTrigger] = useState(0);

  // Background crossfading state
  const [activeBg, setActiveBg] = useState('A');
  const [bgAGradient, setBgAGradient] = useState(
    `radial-gradient(ellipse at 50% 30%, ${ATMO.welcome.bg[0]} 0%, ${ATMO.welcome.bg[1]} 65%)`
  );
  const [bgBGradient, setBgBGradient] = useState(
    `radial-gradient(ellipse at 50% 30%, ${ATMO.welcome.bg[0]} 0%, ${ATMO.welcome.bg[1]} 65%)`
  );

  // Interactive widgets state
  const [revealedExplore, setRevealedExplore] = useState(new Set());
  const [actDone, setActDone] = useState(false);
  const [actNoteVisible, setActNoteVisible] = useState(false);

  // Pause duration ref for reflect screens
  const pauseUntilRef = useRef(0);
  const appContainerRef = useRef(null);

  const currentScreen = screens[screenIndex] || screens[0];

  const firstMomentIdx = useMemo(
    () => screens.findIndex(s => s.type === 'situation'),
    [screens]
  );
  const lastMomentIdx = useMemo(
    () => screens.map((s, i) => (s.m ? i : -1)).filter(i => i >= 0).pop() || 0,
    [screens]
  );

  // Determine emotional atmosphere key
  const atmoKey = useMemo(() => {
    if (currentScreen.atmo) return currentScreen.atmo;
    if (currentScreen.type === 'homepage' || currentScreen.type.startsWith('intro')) {
      return 'welcome';
    }
    if (currentScreen.type === 'aftermath-line') return 'confidence';
    if (currentScreen.type === 'fieldguide') return 'clarity';
    if (currentScreen.type === 'ending') return 'resolved';
    if (currentScreen.m) return MOMENT_ATMO[currentScreen.m.number] || 'ambiguity';
    return 'welcome';
  }, [currentScreen]);

  const currentAtmo = ATMO[atmoKey] || ATMO.welcome;

  // Order progression metric for particle alignment
  const orderTarget = useMemo(() => {
    let base;
    if (currentScreen.type === 'homepage') base = 0.05;
    else if (currentScreen.type.startsWith('intro')) base = 0.08;
    else if (currentScreen.type === 'aftermath-line') base = 0.9;
    else if (currentScreen.type === 'fieldguide') base = 0.95;
    else if (currentScreen.type === 'ending') base = 1.0;
    else {
      base =
        0.15 +
        ((screenIndex - firstMomentIdx) / (lastMomentIdx - firstMomentIdx)) *
          0.72;
    }
    return Math.max(0, Math.min(1, base + currentAtmo.orderBias));
  }, [currentScreen, screenIndex, firstMomentIdx, lastMomentIdx, currentAtmo]);

  // Practice overlay
  const currentOverlay = useMemo(() => {
    if (currentScreen.type === 'practice' && currentScreen.m) {
      return PRACTICE_OVERLAY[currentScreen.m.number] || 'none';
    }
    return 'none';
  }, [currentScreen]);

  // Consequence reaction
  const currentReaction = useMemo(() => {
    if (currentScreen.type === 'consequence' && currentScreen.m) {
      return reactionFor(currentScreen.m.number);
    }
    if (currentScreen.reaction) return currentScreen.reaction;
    if (currentScreen.type === 'myth') return 'break';
    return null;
  }, [currentScreen]);

  // Apply CSS variables to root and crossfade background
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pulse-speed', `${currentAtmo.pulse}s`);
    root.style.setProperty('--pulse-fast', `${(currentAtmo.pulse * 0.55).toFixed(2)}s`);
    root.style.setProperty('--card-blur', `${currentAtmo.blur}px`);
    root.style.setProperty('--card-density', `${currentAtmo.density}`);
    root.style.setProperty('--accent-a', currentAtmo.accentA);
    root.style.setProperty('--accent-b', currentAtmo.accentB);

    const nextGrad = `radial-gradient(ellipse at 50% 30%, ${currentAtmo.bg[0]} 0%, ${currentAtmo.bg[1]} 65%)`;
    if (activeBg === 'A') {
      setBgBGradient(nextGrad);
      setActiveBg('B');
    } else {
      setBgAGradient(nextGrad);
      setActiveBg('A');
    }
  }, [currentAtmo]);

  // Handle screen setup (reflect pause & scrolling)
  useEffect(() => {
    if (currentScreen.type === 'reflect-pause') {
      pauseUntilRef.current = performance.now() + 2400;
    }
    if (appContainerRef.current) {
      appContainerRef.current.scrollTop = 0;
    }
  }, [currentScreen]);

  // Advance navigation
  const advance = useCallback(() => {
    if (isLeaving) return;
    if (screenIndex >= screens.length - 1) return;

    setIsLeaving(true);
    setPortalTrigger(prev => prev + 1);
    setBurstActive(true);

    setTimeout(() => {
      setScreenIndex(prev => prev + 1);
      setIsLeaving(false);
      setBurstActive(false);
      setRevealedExplore(new Set());
      setActDone(false);
      setActNoteVisible(false);
    }, 260);
  }, [isLeaving, screenIndex, screens.length]);

  const restart = useCallback(() => {
    setIsLeaving(false);
    setScreenIndex(0);
    setRevealedExplore(new Set());
    setActDone(false);
    setActNoteVisible(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (currentScreen.type === 'homepage' && screenIndex === 0) {
          advance();
          return;
        }
        if (currentScreen.type === 'ending') return;
        advance();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, screenIndex, advance]);

  // App shell click listener
  const handleAppClick = (e) => {
    if (currentScreen.type === 'homepage' || currentScreen.type === 'ending') return;
    if (e.target.closest('button')) return;
    if (e.target.closest('[data-interactive="true"]')) return;
    if (performance.now() < pauseUntilRef.current) return;
    advance();
  };

  // Moment progress
  const currentMomentNumber = currentScreen.m ? currentScreen.m.number : null;

  // Render body paragraphs with beat detection
  const renderBodyCopy = (text, baseDelay = 0.05) => {
    const chunks = text.split('\n\n');
    return chunks.map((c, i) => {
      const wordCount = c.trim().split(/\s+/).length;
      const isBeat = wordCount <= 4 && i > 0;
      const delayClass = DELAY_CLASSES[Math.min(i, DELAY_CLASSES.length - 1)];

      if (isBeat) {
        return (
          <p
            key={i}
            className={`text-[var(--yellow)] font-space font-semibold text-[19px] mb-4 text-left animate-[beatPop_.55s_cubic-bezier(.34,1.56,.64,1)_forwards] ${delayClass}`}
          >
            {c}
          </p>
        );
      }
      return (
        <p
          key={i}
          className={`text-[17px] leading-[1.65] text-[var(--text-mid)] mb-4 text-left last:mb-0 animate-[paraIn_.5s_var(--ease-card)_forwards] ${delayClass}`}
        >
          {c}
        </p>
      );
    });
  };

  // Render practice card with speech bubble
  const renderPracticeContent = (text) => {
    const q = extractQuote(text);
    if (!q) {
      return (
        <p className="text-[17px] leading-[1.65] text-[var(--text-mid)] text-left animate-[paraIn_.5s_var(--ease-card)_forwards] anim-delay-50">
          {text}
        </p>
      );
    }
    const before = text.slice(0, q.openQ);
    const quoted = text.slice(q.openQ + 1, q.closeQ);
    const after = text.slice(q.closeQ + 1);

    return (
      <div className="text-left">
        {before.trim() && (
          <p className="text-[17px] leading-[1.65] text-[var(--text-mid)] mb-3 animate-[paraIn_.5s_var(--ease-card)_forwards] anim-delay-50">
            {before}
          </p>
        )}
        <div className="inline-block relative [background:linear-gradient(135deg,rgba(0,144,255,0.16),rgba(139,92,246,0.14))] border border-[rgba(0,144,255,0.3)] rounded-[16px_16px_16px_4px] py-3 px-4 text-[#EAF4FF] text-base my-1.5 mb-3.5 animate-[beatPop_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-250">
          {quoted}
        </div>
        {after.trim() && (
          <p className="text-[17px] leading-[1.65] text-[var(--text-mid)] mt-1 animate-[paraIn_.5s_var(--ease-card)_forwards] anim-delay-350">
            {after}
          </p>
        )}
      </div>
    );
  };

  // Explore widget for Moment 1
  const toggleExploreItem = (idx) => {
    setRevealedExplore(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  // Act widget for Moment 8
  const handleMarkDone = () => {
    setActDone(true);
    setTimeout(() => {
      setActNoteVisible(true);
    }, 350);
  };

  // Screen content rendering
  const renderScreenContent = () => {
    const s = currentScreen;

    if (s.type === 'homepage') {
      return (
        <>
          <div className="flex items-center gap-2 font-space text-[12.5px] font-semibold tracking-[0.14em] uppercase text-[#c9b8ff] mb-[26px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-b)] shadow-[0_0_8px_2px_var(--accent-b)]" />
            GummyGum Culture Experience
          </div>
          <h1 className="font-space font-bold text-[clamp(40px,8vw,68px)] tracking-[-0.01em] bg-gradient-to-r from-white via-[#d9c8ff] to-[var(--purple)] bg-clip-text text-transparent mb-[18px] animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-120">
            {s.data.title}
          </h1>
          <p className="text-[clamp(16px,2.4vw,19px)] text-[var(--text-mid)] max-w-[480px] mb-[30px] leading-relaxed animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-220">
            {s.data.supporting}
          </p>
          <div className="flex items-end justify-center gap-[26px] my-1.5 mb-8 animate-[popReveal_.7s_var(--ease-card)_forwards] anim-delay-300">
            <Mascot variant="m-purple" />
            <Mascot variant="m-yellow" />
            <Mascot variant="m-blue" />
          </div>
          <button
            onClick={advance}
            className="font-space font-semibold text-[17px] border-none cursor-pointer py-4 px-[38px] rounded-full [background:linear-gradient(135deg,var(--accent-a),var(--accent-b))] text-white shadow-[0_8px_30px_rgba(139,92,246,0.45)] transition-all duration-200 hover:-translate-y-[3px] hover:scale-105 active:translate-y-0 active:scale-95 animate-[ctaPulse_var(--pulse-speed)_ease-in-out_infinite]"
          >
            Start
          </button>
        </>
      );
    }

    if (s.type === 'intro-line') {
      return (
        <div className="text-[clamp(19px,3vw,25px)] leading-[1.55] text-[var(--text-hi)] max-w-[560px] font-medium animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-80">
          {s.text}
        </div>
      );
    }

    if (s.type === 'intro-transition') {
      return (
        <>
          <div className="text-[clamp(19px,3vw,25px)] leading-[1.55] text-[var(--yellow)] font-semibold max-w-[560px] animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-80">
            {s.text}
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-[440px] mx-auto mt-[26px]">
            <span className="font-space text-[13px] font-semibold py-[9px] px-[15px] rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--text-mid)] animate-[chipIn_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-500">
              New task
            </span>
            <span className="font-space text-[13px] font-semibold py-[9px] px-[15px] rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--text-mid)] animate-[chipIn_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-800">
              Quick question?
            </span>
            <span className="font-space text-[13px] font-semibold py-[9px] px-[15px] rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--text-mid)] animate-[chipIn_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-1100">
              Can you jump on this?
            </span>
            <span className="font-space text-[13px] font-semibold py-[9px] px-[15px] rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--text-mid)] animate-[chipIn_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-1400">
              Customer issue
            </span>
            <span className="font-space text-[13px] font-semibold py-[9px] px-[15px] rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--text-mid)] animate-[chipIn_.5s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-1700">
              Deadline moved up
            </span>
          </div>
          <button
            onClick={advance}
            className="font-space font-semibold text-[17px] border-none cursor-pointer py-4 px-[38px] rounded-full [background:linear-gradient(135deg,var(--accent-a),var(--accent-b))] text-white shadow-[0_8px_30px_rgba(139,92,246,0.45)] transition-all duration-200 hover:-translate-y-[3px] hover:scale-105 active:translate-y-0 active:scale-95 mt-[30px]"
          >
            Let's go
          </button>
        </>
      );
    }

    if (s.type === 'situation') {
      return (
        <div className="experience-card">
          <div className="font-space text-[13px] font-semibold text-[var(--purple)] tracking-[0.08em] uppercase mb-1.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-20">
            Moment {s.m.number} / 25
          </div>
          <div className="italic text-[var(--text-low)] text-sm mb-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-100">
            {s.m.situation}
          </div>
          <div className="body-copy">
            {renderBodyCopy(s.m.card1, 0.1)}
          </div>

          {/* Explore widget for Moment 1 */}
          {s.m.number === 1 && (
            <div data-interactive="true" className="mt-[22px] p-[16px_18px] bg-white/[0.03] rounded-2xl text-left animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-550">
              <div className="text-[11px] font-space tracking-wider uppercase text-[var(--text-low)] mb-2.5">
                Explore — tap the underlined parts
              </div>
              <div className="text-base leading-relaxed text-[var(--text-hi)]">
                “Can you{' '}
                <span
                  onClick={() => toggleExploreItem(0)}
                  className={`underline decoration-dotted decoration-[rgba(255,208,0,0.6)] underline-offset-[3px] cursor-pointer font-semibold transition-colors ${
                    revealedExplore.has(0) ? 'text-[var(--text-hi)]' : 'text-[var(--yellow)]'
                  }`}
                >
                  sort out
                </span>{' '}
                <span
                  onClick={() => toggleExploreItem(1)}
                  className={`underline decoration-dotted decoration-[rgba(255,208,0,0.6)] underline-offset-[3px] cursor-pointer font-semibold transition-colors ${
                    revealedExplore.has(1) ? 'text-[var(--text-hi)]' : 'text-[var(--yellow)]'
                  }`}
                >
                  the onboarding thing
                </span>{' '}
                before{' '}
                <span
                  onClick={() => toggleExploreItem(2)}
                  className={`underline decoration-dotted decoration-[rgba(255,208,0,0.6)] underline-offset-[3px] cursor-pointer font-semibold transition-colors ${
                    revealedExplore.has(2) ? 'text-[var(--text-hi)]' : 'text-[var(--yellow)]'
                  }`}
                >
                  Friday
                </span>
                ?”
              </div>

              {revealedExplore.has(0) && (
                <div className="text-[13.5px] text-[var(--text-low)] italic mt-2 animate-[popReveal_.35s_var(--ease-card)_forwards]">
                  What does "sort out" actually mean here — fix it, document it, finish it?
                </div>
              )}
              {revealedExplore.has(1) && (
                <div className="text-[13.5px] text-[var(--text-low)] italic mt-2 animate-[popReveal_.35s_var(--ease-card)_forwards]">
                  Which specific part of onboarding? There could be five different things this refers to.
                </div>
              )}
              {revealedExplore.has(2) && (
                <div className="text-[13.5px] text-[var(--text-low)] italic mt-2 animate-[popReveal_.35s_var(--ease-card)_forwards]">
                  Friday morning, or end of day Friday? Those are very different deadlines.
                </div>
              )}
            </div>
          )}

          {/* Act widget for Moment 8 */}
          {s.m.number === 8 && (
            <div data-interactive="true" className="mt-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-500">
              <button
                onClick={handleMarkDone}
                disabled={actDone}
                className="font-space font-semibold text-[17px] border-none cursor-pointer py-3.5 px-7 rounded-full [background:linear-gradient(135deg,var(--yellow),#ffe066)] text-[#1a1200] shadow-[0_8px_26px_rgba(255,208,0,0.28)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_14px_32px_rgba(255,208,0,0.5)]"
              >
                Mark Done ✓
              </button>
              {actNoteVisible && (
                <div className="mt-3 text-[14.5px] text-[var(--yellow)] italic animate-[beatPop_.5s_cubic-bezier(.34,1.56,.64,1)_forwards]">
                  They don't know you're done yet.
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (s.type === 'definition') {
      return (
        <div className="experience-card">
          <div className="absolute w-[280px] h-[280px] rounded-full [background:radial-gradient(circle,var(--accent-a)_0%,transparent_70%)] opacity-25 blur-[30px] top-[10%] left-1/2 -translate-x-1/2 pointer-events-none -z-10 animate-[focusPulse_3.5s_ease-in-out_infinite]" />
          <div className="font-space text-xs font-semibold tracking-wider text-[var(--yellow)] uppercase mb-3.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-20">
            What this means
          </div>
          <h2 className="font-space font-bold text-[clamp(28px,5vw,40px)] text-[var(--yellow)] mb-5 text-left animate-[popReveal_.55s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-120">
            {s.m.behavior}
          </h2>
          <div className="body-copy">
            {renderBodyCopy(s.m.card2, 0.22)}
          </div>
        </div>
      );
    }

    if (s.type === 'practice') {
      return (
        <div className="experience-card">
          <div className="font-space text-xs font-semibold tracking-wider text-[var(--yellow)] uppercase mb-3.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-20">
            In practice
          </div>
          <div className="body-copy">
            {renderPracticeContent(s.m.card3)}
          </div>
        </div>
      );
    }

    if (s.type === 'consequence') {
      const styleIdx = s.m.number % 3;

      let founderBox;
      if (styleIdx === 1) {
        founderBox = (
          <div className="mt-[22px] p-[16px_18px] bg-[rgba(255,208,0,0.055)] rounded-2xl text-left flex items-start gap-3.5 animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-400">
            <div className="shrink-0 w-[34px] h-[34px] rounded-full [background:radial-gradient(circle_at_35%_30%,#fff8dc,var(--yellow)_65%)] flex items-center justify-center text-base animate-[bulbPulse_var(--pulse-speed)_ease-in-out_infinite]">
              💡
            </div>
            <div>
              <div className="font-space text-[11px] tracking-wider uppercase text-[var(--text-low)] mb-1">
                Founder Insight
              </div>
              <div className="italic text-[var(--text-hi)] text-[15.5px] leading-relaxed">
                “{s.m.founder}”
              </div>
            </div>
          </div>
        );
      } else if (styleIdx === 2) {
        founderBox = (
          <div className="mt-[22px] p-[16px_18px] bg-[rgba(139,92,246,0.06)] rounded-2xl text-left flex items-start gap-3.5 animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-400">
            <div className="shrink-0 w-[34px] h-[34px] rounded-full [background:radial-gradient(circle_at_35%_30%,#ece3ff,var(--purple)_65%)] flex items-center justify-center text-base animate-[bulbPulse_var(--pulse-speed)_ease-in-out_infinite]">
              🧭
            </div>
            <div>
              <div className="font-space text-[11px] tracking-wider uppercase text-[var(--text-low)] mb-1">
                From the Founder's Seat
              </div>
              <div className="italic text-[var(--text-hi)] text-[15.5px] leading-relaxed">
                — {s.m.founder}
              </div>
            </div>
          </div>
        );
      } else {
        founderBox = (
          <div className="mt-[22px] p-[0_0_0_16px] bg-transparent border-l-2 border-[var(--card-border)] rounded-none text-left animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-400">
            <div className="font-space text-[11px] tracking-wider uppercase text-[var(--text-low)] mb-1">
              The Thing Nobody Says Out Loud
            </div>
            <div className="text-[var(--text-hi)] text-[15.5px] leading-relaxed">
              {s.m.founder}
            </div>
          </div>
        );
      }

      return (
        <div className="experience-card">
          <div className="font-space text-xs font-semibold tracking-wider text-[var(--blue)] uppercase mb-3.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-20">
            The consequence
          </div>
          <div className="body-copy">
            {renderBodyCopy(s.m.card4, 0.05)}
          </div>
          {founderBox}
          <div className="mt-[22px] text-[14.5px] text-[var(--text-low)] italic text-left animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-500">
            {s.m.transition}
          </div>
        </div>
      );
    }

    if (s.type === 'truth') {
      return (
        <>
          <div className="font-space text-[12.5px] font-bold tracking-[0.18em] uppercase text-[var(--accent-a)] mb-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            Startup Truth
          </div>
          {s.lines.map((line, i) => {
            const isHero = i === 0;
            const isLast = i === s.lines.length - 1;
            const delayClass = DELAY_CLASSES[Math.min(i + 1, DELAY_CLASSES.length - 1)];

            if (isHero) {
              return (
                <div
                  key={i}
                  className={`font-space text-[clamp(30px,5.2vw,46px)] font-bold [background:linear-gradient(120deg,#fff_10%,var(--accent-a)_100%)] bg-clip-text text-transparent mb-3.5 leading-snug animate-[popReveal_.55s_var(--ease-card)_forwards] ${delayClass}`}
                >
                  {line}
                </div>
              );
            }
            if (isLast) {
              return (
                <div
                  key={i}
                  className={`text-[clamp(20px,3.6vw,30px)] font-semibold text-[var(--text-hi)] leading-snug mb-3.5 max-w-[600px] animate-[popReveal_.55s_var(--ease-card)_forwards] ${delayClass}`}
                >
                  {line}
                </div>
              );
            }
            return (
              <div
                key={i}
                className={`text-[clamp(16px,2.4vw,19px)] font-normal text-[var(--text-mid)] leading-relaxed mb-3.5 max-w-[600px] animate-[popReveal_.55s_var(--ease-card)_forwards] ${delayClass}`}
              >
                {line}
              </div>
            );
          })}
        </>
      );
    }

    if (s.type === 'translation') {
      return (
        <>
          <div className="font-space text-[12.5px] font-bold tracking-[0.18em] uppercase text-[var(--accent-a)] mb-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            What Founders Actually Mean
          </div>
          <div className="font-space font-bold text-[clamp(22px,4vw,30px)] text-white mb-[22px] animate-[popReveal_.55s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-100">
            {s.phrase}
          </div>
          <div className="body-copy">
            {s.body.map((p, i) => (
              <p
                key={i}
                className={`text-center text-[17px] leading-[1.65] text-[var(--text-mid)] mb-3 animate-[paraIn_.5s_var(--ease-card)_forwards] ${
                  DELAY_CLASSES[Math.min(i + 3, DELAY_CLASSES.length - 1)]
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </>
      );
    }

    if (s.type === 'myth') {
      return (
        <div className="text-left w-full max-w-[560px]">
          <div className="font-space text-xs font-bold tracking-wider uppercase text-[#ff8a8a] mb-1.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            Startup Myth
          </div>
          <div className="text-xl font-semibold text-[var(--text-mid)] line-through decoration-[rgba(255,138,138,0.5)] mb-[26px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-150">
            {s.myth}
          </div>
          <div className="font-space text-xs font-bold tracking-wider uppercase text-[var(--green)] mb-1.5 animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-550">
            Reality
          </div>
          <div>
            {s.reality.map((p, i) => (
              <p
                key={i}
                className={`text-lg leading-relaxed text-[var(--text-hi)] mb-2 animate-[popReveal_.5s_var(--ease-card)_forwards] ${
                  DELAY_CLASSES[Math.min(i + 6, DELAY_CLASSES.length - 1)]
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      );
    }

    if (s.type === 'heard') {
      return (
        <>
          <div className="font-space text-[12.5px] font-bold tracking-[0.18em] uppercase text-[var(--accent-a)] mb-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            Things You'll Hear Around Here
          </div>
          <div className="font-space font-bold text-[clamp(22px,4vw,30px)] text-white mb-[22px] animate-[popReveal_.55s_cubic-bezier(.34,1.56,.64,1)_forwards] anim-delay-100">
            {s.phrase}
          </div>
          <div className="body-copy">
            <p className="text-center text-[var(--text-low)] italic text-sm mb-3 animate-[paraIn_.5s_var(--ease-card)_forwards] anim-delay-300">
              What it usually means:
            </p>
            {s.meaning.map((p, i) => (
              <p
                key={i}
                className={`text-center text-[17px] leading-[1.65] text-[var(--text-mid)] mb-3 animate-[paraIn_.5s_var(--ease-card)_forwards] ${
                  DELAY_CLASSES[Math.min(i + 4, DELAY_CLASSES.length - 1)]
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </>
      );
    }

    if (s.type === 'reflect-pause') {
      return (
        <>
          <div className="text-[clamp(20px,3.6vw,30px)] font-semibold text-[var(--text-hi)] leading-snug mb-3.5 max-w-[600px] animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-100">
            Before we continue…
          </div>
          <div className="text-[clamp(16px,2.4vw,19px)] font-normal text-[var(--text-mid)] leading-relaxed mb-3.5 max-w-[600px] animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-400">
            Think about the last time this happened to you.
          </div>
          <div className="flex gap-2 mt-5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-low)] animate-[dotPulse_1.4s_ease-in-out_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-low)] animate-[dotPulse_1.4s_ease-in-out_infinite] anim-delay-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-low)] animate-[dotPulse_1.4s_ease-in-out_infinite] anim-delay-400" />
          </div>
        </>
      );
    }

    if (s.type === 'aftermath-line') {
      const isHero = s.size === 'hero';
      const isSub = s.size === 'sub';

      return (
        <div
          className={`leading-snug mb-3.5 max-w-[600px] animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-100 ${
            isHero
              ? 'font-space text-[clamp(30px,5.2vw,46px)] font-bold [background:linear-gradient(120deg,#fff_10%,var(--accent-a)_100%)] bg-clip-text text-transparent'
              : isSub
              ? 'text-[clamp(16px,2.4vw,19px)] font-normal text-[var(--text-mid)]'
              : 'text-[clamp(20px,3.6vw,30px)] font-semibold text-[var(--text-hi)]'
          }`}
        >
          {s.text}
        </div>
      );
    }

    if (s.type === 'fieldguide') {
      return (
        <>
          <div className="font-space text-[12.5px] font-bold tracking-[0.18em] uppercase text-[var(--accent-a)] mb-[22px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            The Startup Field Guide
          </div>
          <div className="font-space text-[clamp(30px,5.2vw,46px)] font-bold [background:linear-gradient(120deg,#fff_10%,var(--accent-a)_100%)] bg-clip-text text-transparent mb-1.5 leading-snug">
            Twelve things worth remembering.
          </div>
          <div className="w-full max-w-[520px] text-left flex flex-col gap-2.5 my-[18px] mb-6">
            {FIELD_GUIDE.map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2.5 py-2.5 px-1 border-b border-white/[0.06] animate-[popReveal_.4s_var(--ease-card)_forwards]"
              >
                <span className="font-space text-xs text-[var(--text-low)] shrink-0 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15.5px] text-[var(--text-mid)]">
                  {item.prefix} <b className="text-[var(--yellow)] font-semibold">{item.action}</b>
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={advance}
            className="font-space font-semibold text-[17px] border-none cursor-pointer py-4 px-[38px] rounded-full [background:linear-gradient(135deg,var(--accent-a),var(--accent-b))] text-white shadow-[0_8px_30px_rgba(139,92,246,0.45)] transition-all duration-200 hover:-translate-y-[3px] hover:scale-105 active:translate-y-0 active:scale-95"
          >
            Continue
          </button>
        </>
      );
    }

    if (s.type === 'ending') {
      return (
        <>
          <div className="flex items-center gap-2 font-space text-[12.5px] font-semibold tracking-[0.14em] uppercase text-[#c9b8ff] mb-[26px] animate-[popReveal_.5s_var(--ease-card)_forwards] anim-delay-50">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-b)] shadow-[0_0_8px_2px_var(--accent-b)]" />
            GummyGum
          </div>
          <div className="flex items-end justify-center gap-[22px] mb-6">
            <Mascot variant="m-yellow" />
            <Mascot variant="m-purple" />
            <Mascot variant="m-blue" />
          </div>
          <div className="font-space font-bold text-[clamp(26px,5vw,38px)] text-white mb-2 animate-[popReveal_.55s_var(--ease-card)_forwards] anim-delay-150">
            You're not finishing a training.
          </div>
          <div className="font-space font-semibold text-[clamp(18px,3.2vw,24px)] text-[var(--text-mid)] mb-[22px] animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-400">
            You're just starting the part where it actually counts.
          </div>
          <div className="text-[15.5px] text-[var(--text-low)] max-w-[440px] mx-auto mb-[26px] leading-relaxed animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-600">
            Startup work isn't a script. Most of it is small moments like the ones you just walked through — and now you'll know what to do when they show up.
          </div>
          <div className="font-space font-bold text-[clamp(24px,4vw,30px)] bg-gradient-to-r from-[var(--yellow)] to-[#ffb84d] bg-clip-text text-transparent mb-[30px] animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-800">
            Go do the thing.
          </div>
          <div className="flex gap-3.5 justify-center flex-wrap mt-2 animate-[popReveal_.6s_var(--ease-card)_forwards] anim-delay-1000">
            <button
              onClick={restart}
              className="font-space font-semibold text-[17px] border-none cursor-pointer py-4 px-[38px] rounded-full [background:linear-gradient(135deg,var(--accent-a),var(--accent-b))] text-white shadow-[0_8px_30px_rgba(139,92,246,0.45)] transition-all duration-200 hover:-translate-y-[3px] hover:scale-105 active:translate-y-0 active:scale-95"
            >
              Restart the Experience
            </button>
            <button
              onClick={() => alert('This returns to the GummyGum home screen.')}
              className="font-space font-semibold text-[17px] border-none cursor-pointer py-4 px-[38px] rounded-full [background:linear-gradient(135deg,var(--yellow),#ffe066)] text-[#1a1200] shadow-[0_8px_26px_rgba(255,208,0,0.28)] transition-all duration-200 hover:shadow-[0_14px_32px_rgba(255,208,0,0.5)]"
            >
              Return Home
            </button>
          </div>
        </>
      );
    }

    return null;
  };

  const layoutClass =
    currentScreen.type === 'situation' && currentScreen.m
      ? layoutFor(currentScreen.m.number)
      : '';

  return (
    <div
      ref={appContainerRef}
      id="app"
      onClick={handleAppClick}
      className="relative z-[3] w-screen h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center py-[9vh] px-[18px] max-sm:py-[12vh] max-sm:px-[14px]"
    >
      {/* Atmosphere Background Layer A */}
      <div
        id="bgA"
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-[1300ms] ease-in-out ${
          activeBg === 'A' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: bgAGradient }}
      />

      {/* Atmosphere Background Layer B */}
      <div
        id="bgB"
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-[1300ms] ease-in-out ${
          activeBg === 'B' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: bgBGradient }}
      />

      {/* Canvas Particle Simulation */}
      <AtmoCanvas
        atmo={currentAtmo}
        orderTarget={orderTarget}
        cardType={currentScreen.type}
        overlay={currentOverlay}
        focusFlag={!!currentScreen.focus}
        reactionType={currentReaction}
        portalTrigger={portalTrigger}
      />

      {/* Vignette */}
      <div
        id="vignette"
        className="fixed inset-0 z-[2] pointer-events-none [background:radial-gradient(ellipse_at_50%_42%,rgba(5,7,15,0.25)_0%,rgba(5,7,15,0.15)_30%,rgba(5,7,15,0.6)_100%)]"
      />

      {/* Burst Flash */}
      <div
        id="burst"
        className={`fixed inset-0 z-[4] pointer-events-none [background:radial-gradient(circle_at_50%_45%,var(--accent-b)_0%,transparent_60%)] opacity-0 ${
          burstActive ? 'animate-[burstFlash_.55s_ease-out]' : ''
        }`}
      />

      {/* Progress Wrap */}
      <div
        id="progress-wrap"
        className={`fixed top-[22px] left-1/2 -translate-x-1/2 w-[min(560px,82vw)] z-[6] flex items-center gap-2.5 pointer-events-none transition-opacity duration-600 ${
          currentMomentNumber ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div id="progress-track" className="flex-1 h-1.5 rounded-full bg-white/[0.08] relative">
          <div
            id="progress-fill"
            className="h-full rounded-full relative progress-fill-shimmer progress-fill-dot transition-[width] duration-600 ease-[cubic-bezier(.4,0,.2,1)] [background:linear-gradient(90deg,var(--accent-a),var(--accent-b))]"
            style={{
              width: currentMomentNumber
                ? `${((currentMomentNumber - 1) / 25) * 100 + 4}%`
                : '0%'
            }}
          />
          <div
            className={`absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-600 ${
              currentMomentNumber && currentMomentNumber >= 5
                ? 'bg-white shadow-[0_0_10px_3px_var(--accent-b)] scale-150'
                : 'bg-white/[0.18]'
            }`}
          />
          <div
            className={`absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-600 ${
              currentMomentNumber && currentMomentNumber >= 10
                ? 'bg-white shadow-[0_0_10px_3px_var(--accent-b)] scale-150'
                : 'bg-white/[0.18]'
            }`}
          />
          <div
            className={`absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-600 ${
              currentMomentNumber && currentMomentNumber >= 15
                ? 'bg-white shadow-[0_0_10px_3px_var(--accent-b)] scale-150'
                : 'bg-white/[0.18]'
            }`}
          />
          <div
            className={`absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-600 ${
              currentMomentNumber && currentMomentNumber >= 20
                ? 'bg-white shadow-[0_0_10px_3px_var(--accent-b)] scale-150'
                : 'bg-white/[0.18]'
            }`}
          />
          <div
            className={`absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-600 ${
              currentMomentNumber && currentMomentNumber >= 25
                ? 'bg-white shadow-[0_0_10px_3px_var(--accent-b)] scale-150'
                : 'bg-white/[0.18]'
            }`}
          />
        </div>
        <div id="progress-text" className="font-space text-xs tracking-wider text-[var(--text-low)] whitespace-nowrap">
          Moment {currentMomentNumber || 1} / 25
        </div>
      </div>

      {/* Screen Render Root */}
      <div id="screen-root" className="w-full flex justify-center">
        <div
          id="active-screen"
          key={screenIndex}
          className={`relative z-[2] w-[min(680px,88vw)] max-sm:w-[92vw] flex flex-col items-center text-center mb-[4vh] ${
            layoutClass === 'layout-left'
              ? 'items-start text-left max-w-[640px]'
              : layoutClass === 'layout-wide'
              ? 'w-[min(760px,94vw)] px-6'
              : ''
          } ${
            isLeaving
              ? 'animate-[fadeOut_.32s_cubic-bezier(.4,0,1,1)_forwards]'
              : 'animate-[riseIn_.65s_var(--ease-card)]'
          }`}
        >
          {renderScreenContent()}
        </div>
      </div>

      {/* Tap hint */}
      {currentScreen.type !== 'homepage' && currentScreen.type !== 'ending' && (
        <div
          id="tap-hint"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 text-[12.5px] text-[var(--text-low)] tracking-wider z-[5] bg-[#0b1020]/50 py-1.5 px-3.5 rounded-full backdrop-blur-sm pointer-events-none"
        >
          tap anywhere to continue
        </div>
      )}
    </div>
  );
}
