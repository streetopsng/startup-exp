import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  PALETTE,
  MOMENT_ATMO,
  DOODLE_ICONS,
  FIELD_GUIDE,
  buildScreensSequence,
  extractQuote
} from '../constants/startupData';
import { MOMENT_MEDIA } from '../constants/mediaData';

const CARD_META = {
  situation:   { label: 'Situation',   icon: '❓' },
  definition:  { label: 'Meaning',     icon: '💡' },
  practice:    { label: 'Practice',    icon: '🎬' },
  consequence: { label: 'Consequence', icon: '⚡' }
};

const CHAPTER_NAMES = {
  truth: 'Startup Truth',
  translation: 'Translation',
  myth: 'Myth vs Reality',
  heard: 'Around Here',
  'reflect-pause': 'Reflect',
  'aftermath-line': 'Aftermath',
  fieldguide: 'Field Guide',
  ending: 'The End'
};

export default function StartupExperience() {
  const screens = useMemo(() => buildScreensSequence(), []);
  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [momentOpenState, setMomentOpenState] = useState({});
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [revealedExplore, setRevealedExplore] = useState(new Set());
  const [actDone, setActDone] = useState(false);
  const [actNoteVisible, setActNoteVisible] = useState(false);

  const pauseUntilRef = useRef(0);
  const appRef = useRef(null);

  const currentScreen = screens[idx] || screens[0];

  // Generate background doodles once
  const doodles = useMemo(() => {
    const items = [];
    const N = 26;
    for (let i = 0; i < N; i++) {
      const size = 26 + Math.random() * 34;
      items.push({
        id: i,
        size,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        rotate: `${(Math.random() * 50 - 25).toFixed(1)}deg`,
        svg: DOODLE_ICONS[Math.floor(Math.random() * DOODLE_ICONS.length)]
      });
    }
    return items;
  }, []);

  // Determine emotional atmosphere key and update --accent
  const atmosphereForScreen = useCallback((s) => {
    if (s.atmo) return s.atmo;
    if (s.type === 'homepage' || s.type.startsWith('intro')) return 'welcome';
    if (s.type === 'aftermath-line') return 'confidence';
    if (s.type === 'fieldguide') return 'clarity';
    if (s.type === 'ending') return 'resolved';
    if (s.m) return MOMENT_ATMO[s.m.number] || 'ambiguity';
    return 'welcome';
  }, []);

  useEffect(() => {
    const atmo = atmosphereForScreen(currentScreen);
    const accentColor = PALETTE[atmo] || PALETTE.welcome;
    document.documentElement.style.setProperty('--accent', accentColor);

    if (currentScreen.type === 'reflect-pause') {
      pauseUntilRef.current = Date.now() + 2200;
    }

    // Reset flipped cards on screen change
    setFlippedCards(new Set());
    if (appRef.current) {
      appRef.current.scrollTop = 0;
    }
  }, [currentScreen, atmosphereForScreen]);

  // Advance to next screen with smooth fade transition
  const advance = useCallback(() => {
    if (transitioning) return;
    if (idx >= screens.length - 1) return;

    setTransitioning(true);
    setTimeout(() => {
      setIdx((prev) => prev + 1);
      setTransitioning(false);
    }, 240);
  }, [transitioning, idx, screens.length]);

  const restart = useCallback(() => {
    setTransitioning(false);
    setIdx(0);
    setMomentOpenState({});
    setFlippedCards(new Set());
    setRevealedExplore(new Set());
    setActDone(false);
    setActNoteVisible(false);
  }, []);

  // Card flipping in moment grids
  const toggleFlip = useCallback((key, e) => {
    if (e) e.stopPropagation();
    if (!currentScreen || currentScreen.type !== 'moment' || !currentScreen.m) return;

    setFlippedCards((prev) => {
      const next = new Set(prev);
      const isFlipped = next.has(key);
      if (isFlipped) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

    // Mark as explored in momentOpenState
    setMomentOpenState((prev) => {
      const existing = prev[idx] ? new Set(prev[idx]) : new Set();
      existing.add(key);
      return { ...prev, [idx]: existing };
    });
  }, [currentScreen, idx]);

  const flipBackAll = useCallback(() => {
    setFlippedCards(new Set());
  }, []);

  // Global keydown listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        flipBackAll();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        // If focusing an interactive element or on moment grid, handle appropriately
        if (currentScreen.type === 'homepage' && idx === 0) {
          advance();
          return;
        }
        if (currentScreen.type === 'ending' || currentScreen.type === 'moment') return;
        advance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, idx, advance, flipBackAll]);

  // Global click listener to advance on non-interactive screens
  const handleAppClick = (e) => {
    if (currentScreen.type === 'homepage' || currentScreen.type === 'ending' || currentScreen.type === 'moment') return;
    if (e.target.closest('.explore-hot') || e.target.closest('button')) return;
    if (Date.now() < pauseUntilRef.current) return;
    advance();
  };

  // Helper: render body paragraphs with beat styling for short 1-4 word punchy lines
  const renderBodyParagraphs = (text) => {
    if (!text) return null;
    const chunks = text.split('\n\n');
    return chunks.map((c, i) => {
      const wordCount = c.trim().split(/\s+/).length;
      const isBeat = wordCount <= 4;
      return (
        <p key={i} className={isBeat ? 'beat' : ''}>
          {c}
        </p>
      );
    });
  };

  // Helper: render practice quotes with bubble styling
  const renderPracticeContent = (text) => {
    if (!text) return null;
    const q = extractQuote(text);
    if (!q) return <p>{text}</p>;
    const before = text.slice(0, q.openQ);
    const quoted = text.slice(q.openQ + 1, q.closeQ);
    const after = text.slice(q.closeQ + 1);
    return (
      <>
        {before.trim() && <p>{before}</p>}
        <div className="bubble">{quoted}</div>
        {after.trim() && <p>{after}</p>}
      </>
    );
  };

  // Helper: render founder quote box
  const renderFounderBox = (m) => {
    const styleIdx = m.number % 3;
    let icon = '💡';
    let kicker = 'Founder Insight';
    let quote = `“${m.founder}”`;

    if (styleIdx === 2) {
      icon = '🧭';
      kicker = "From the Founder's Seat";
      quote = `— ${m.founder}`;
    } else if (styleIdx === 0) {
      icon = '👀';
      kicker = 'The Thing Nobody Says Out Loud';
      quote = m.founder;
    }

    return (
      <div className="founder-box">
        <div className="founder-icon">{icon}</div>
        <div>
          <div className="founder-kicker">{kicker}</div>
          <div className="founder-quote">{quote}</div>
        </div>
      </div>
    );
  };

  // Progress metrics
  const momentNum = currentScreen.m ? currentScreen.m.number : null;
  const progressPercent = screens.length > 1 ? (idx / (screens.length - 1)) * 100 : 0;
  const showProgress = idx > 0;
  const showTapHint = currentScreen.type !== 'homepage' && currentScreen.type !== 'ending' && currentScreen.type !== 'moment';

  const openedForCurrentScreen = momentOpenState[idx] || new Set();
  const allCurrentMomentsExplored = openedForCurrentScreen.size === 4;

  return (
    <>
      {/* Background doodle texture */}
      <div id="doodle-bg">
        {doodles.map((d) => (
          <div
            key={d.id}
            className="doodle"
            style={{
              width: `${d.size}px`,
              height: `${d.size}px`,
              left: d.left,
              top: d.top,
              transform: `rotate(${d.rotate})`
            }}
            dangerouslySetInnerHTML={{ __html: d.svg }}
          />
        ))}
      </div>

      {/* Progress Bar with milestone ticks */}
      <div id="progress-wrap" className={showProgress ? 'show' : ''}>
        <div id="chapter-label">
          {momentNum ? `Moment ${momentNum} / 25` : (CHAPTER_NAMES[currentScreen.type] || 'StartUp 101')}
        </div>
        <div id="progress-track">
          <div id="progress-fill" style={{ width: `${progressPercent}%` }} />
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac, i) => {
            const milestone = Math.round(frac * (screens.length - 1));
            const isHit = idx >= milestone;
            return (
              <div
                key={i}
                className={`tick ${isHit ? 'hit' : ''}`}
                style={{ left: `${frac * 100}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Main app scroll view */}
      <div id="app" ref={appRef} onClick={handleAppClick}>
        <div id="screen-root">
          <div className={`screen ${transitioning ? 'leaving' : ''}`} id="active-screen">

            {/* SCREEN: Homepage */}
            {currentScreen.type === 'homepage' && (
              <>
                <div className="brand-tag">
                  <span className="brand-dot">🦊</span> GummyGum Culture Experience
                </div>
                <div className="wordmark">
                  StartUp <span className="accent">101</span>
                </div>
                <div className="subtitle">
                  Nobody hands you a manual for this job. So we made one.
                </div>
                <div className="stat-row">
                  <span className="stat-pill">⏱️ ~20 min</span>
                  <span className="stat-pill">🎯 25 real moments</span>
                  <span className="stat-pill">🚫 No quiz</span>
                </div>
                <div className="mascot-row">
                  <div className="mascot-circle" style={{ background: '#D9CBF5' }}>🦊</div>
                  <div className="mascot-circle" style={{ background: '#F6DE9E' }}>🐭</div>
                  <div className="mascot-circle" style={{ background: '#BBDDF5' }}>🐰</div>
                </div>
                <button className="cta" onClick={advance}>
                  {currentScreen.homepage?.entryAction || "I'm in"} &rarr;
                </button>
                <div className="micro">
                  {currentScreen.homepage?.microcopy || "20 minutes. No quiz. No certificate. Just the stuff nobody tells you on day one."}
                </div>
              </>
            )}

            {/* SCREEN: Intro Line */}
            {currentScreen.type === 'intro-line' && (
              <div className="intro-line">{currentScreen.text}</div>
            )}

            {/* SCREEN: Intro Transition */}
            {currentScreen.type === 'intro-transition' && (
              <>
                <div className="intro-line" style={{ color: 'var(--orange-deep)', fontWeight: 800 }}>
                  {currentScreen.text}
                </div>
                <div className="chip-row">
                  <span className="chip" style={{ animationDelay: '.5s' }}>New task</span>
                  <span className="chip" style={{ animationDelay: '.8s' }}>Quick question?</span>
                  <span className="chip" style={{ animationDelay: '1.1s' }}>Can you jump on this?</span>
                  <span className="chip" style={{ animationDelay: '1.4s' }}>Customer issue</span>
                  <span className="chip" style={{ animationDelay: '1.7s' }}>Deadline moved up</span>
                </div>
                <button className="cta" style={{ marginTop: '28px' }} onClick={advance}>
                  Let's go
                </button>
              </>
            )}

            {/* SCREEN: Moment (2x2 3D Flip Card Grid) */}
            {currentScreen.type === 'moment' && currentScreen.m && (
              <>
                <div className="moment-head">
                  <div className="moment-eyebrow">Moment {currentScreen.m.number} / 25</div>
                  <div className="behavior-name" style={{ textAlign: 'center' }}>
                    {currentScreen.m.behavior}
                  </div>
                </div>

                <div
                  className={`moment-grid ${flippedCards.size > 0 ? 'has-flipped' : ''}`}
                  id="moment-grid"
                >
                  {['situation', 'definition', 'practice', 'consequence'].map((key) => {
                    const meta = CARD_META[key];
                    const isOpen = openedForCurrentScreen.has(key);
                    const isFlipped = flippedCards.has(key);
                    const media = MOMENT_MEDIA[currentScreen.m.number] || {};
                    const img = media[key];

                    return (
                      <div
                        key={key}
                        className={`flip-card ${isFlipped ? 'flipped' : ''} ${isOpen ? 'opened' : ''}`}
                        data-key={key}
                        tabIndex={0}
                        role="button"
                        aria-label={`${meta.label} card, ${isOpen ? 'explored' : 'not yet explored'}`}
                        onClick={(e) => toggleFlip(key, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleFlip(key, e);
                          }
                        }}
                      >
                        <div className="tile-check">✓</div>
                        <div className="flip-inner">
                          {/* Front Face */}
                          {img ? (
                            <div className="flip-front has-image">
                              <img src={img} alt={`${meta.label} scene`} draggable={false} />
                              <div className="front-scrim" />
                              <div className="front-label-pill">
                                {meta.icon} {meta.label}
                              </div>
                              <div className="front-arrow">&#8594;</div>
                            </div>
                          ) : (
                            <div className={`flip-front icon-only ${isOpen ? 'opened' : ''}`}>
                              <div className="tile-icon-circle" style={{ background: 'var(--accent)' }}>
                                {meta.icon}
                              </div>
                              <div className="tile-label">{meta.label}</div>
                            </div>
                          )}

                          {/* Back Face */}
                          <div
                            className="flip-back"
                            onClick={(e) => {
                              if (e.target.closest('.explore-hot') || e.target.closest('button')) return;
                              toggleFlip(key, e);
                            }}
                          >
                            <button
                              className="flip-back-close"
                              onClick={(e) => toggleFlip(key, e)}
                              aria-label="Flip card back"
                            >
                              &times;
                            </button>
                            <div className="back-label">
                              {meta.icon} {meta.label}
                            </div>
                            <div className="back-body">
                              {/* Card 1: Situation */}
                              {key === 'situation' && (
                                <>
                                  <div className="moment-eyebrow">Moment {currentScreen.m.number} / 25</div>
                                  <div className="situation-tag">{currentScreen.m.situation}</div>
                                  <div className="body-copy">
                                    {renderBodyParagraphs(currentScreen.m.card1)}
                                  </div>

                                  {/* Interactive Explore widget for Moment 1 */}
                                  {currentScreen.m.number === 1 && (
                                    <div className="explore-box">
                                      <div className="explore-label">Explore — tap the underlined parts</div>
                                      <div className="explore-instruction">
                                        &ldquo;Can you{' '}
                                        <span
                                          className="explore-hot"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRevealedExplore((prev) => new Set(prev).add(0));
                                          }}
                                        >
                                          sort out
                                        </span>{' '}
                                        <span
                                          className="explore-hot"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRevealedExplore((prev) => new Set(prev).add(1));
                                          }}
                                        >
                                          the onboarding thing
                                        </span>{' '}
                                        before{' '}
                                        <span
                                          className="explore-hot"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRevealedExplore((prev) => new Set(prev).add(2));
                                          }}
                                        >
                                          Friday
                                        </span>
                                        ?&rdquo;
                                      </div>
                                      <div className={`explore-reveal ${revealedExplore.has(0) ? 'show' : ''}`} id="er-0">
                                        What does "sort out" actually mean here — fix it, document it, finish it?
                                      </div>
                                      <div className={`explore-reveal ${revealedExplore.has(1) ? 'show' : ''}`} id="er-1">
                                        Which specific part of onboarding? There could be five different things this refers to.
                                      </div>
                                      <div className={`explore-reveal ${revealedExplore.has(2) ? 'show' : ''}`} id="er-2">
                                        Friday morning, or end of day Friday? Those are very different deadlines.
                                      </div>
                                    </div>
                                  )}

                                  {/* Interactive Act widget for Moment 8 */}
                                  {currentScreen.m.number === 8 && (
                                    <div className="act-box">
                                      <button
                                        className="cta secondary"
                                        disabled={actDone}
                                        style={{ opacity: actDone ? 0.5 : 1 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActDone(true);
                                          setTimeout(() => setActNoteVisible(true), 300);
                                        }}
                                      >
                                        Mark Done &#10003;
                                      </button>
                                      <div className={`act-note ${actNoteVisible ? 'show' : ''}`} id="act-note">
                                        They don't know you're done yet.
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* Card 2: Meaning */}
                              {key === 'definition' && (
                                <>
                                  <div className="eyebrow-pill">💡 What this means</div>
                                  <div className="behavior-name">{currentScreen.m.behavior}</div>
                                  <div className="body-copy">
                                    {renderBodyParagraphs(currentScreen.m.card2)}
                                  </div>
                                </>
                              )}

                              {/* Card 3: Practice */}
                              {key === 'practice' && (
                                <>
                                  <div className="eyebrow-pill">🎬 In practice</div>
                                  <div className="body-copy">
                                    {renderPracticeContent(currentScreen.m.card3)}
                                  </div>
                                </>
                              )}

                              {/* Card 4: Consequence */}
                              {key === 'consequence' && (
                                <>
                                  <div className="eyebrow-pill">⚡ The consequence</div>
                                  <div className="body-copy">
                                    {renderBodyParagraphs(currentScreen.m.card4)}
                                  </div>
                                  {renderFounderBox(currentScreen.m)}
                                  <div className="transition-line">{currentScreen.m.transition}</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid-progress" id="grid-progress">
                  {openedForCurrentScreen.size} of 4 explored
                </div>

                <div
                  className="grid-continue"
                  id="grid-continue"
                  style={{ display: allCurrentMomentsExplored ? 'flex' : 'none' }}
                >
                  <button className="cta" onClick={advance}>
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* SCREEN: Startup Truth */}
            {currentScreen.type === 'truth' && (
              <>
                <div className="break-kicker">🧭 Startup Truth</div>
                {currentScreen.lines?.map((l, i) => (
                  <div
                    key={i}
                    className={`break-line ${
                      i === 0 ? 'hero' : i === currentScreen.lines.length - 1 ? '' : 'sub'
                    }`}
                  >
                    {l}
                  </div>
                ))}
              </>
            )}

            {/* SCREEN: Translation */}
            {currentScreen.type === 'translation' && (
              <>
                <div className="break-kicker">🗣️ What Founders Actually Mean</div>
                <div className="phrase-quote">{currentScreen.phrase}</div>
                <div className="body-copy">
                  {currentScreen.body?.map((p, i) => (
                    <p key={i} style={{ textAlign: 'center' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </>
            )}

            {/* SCREEN: Myth vs Reality */}
            {currentScreen.type === 'myth' && (
              <>
                <div className="break-kicker">🤔 Startup Myth vs Reality</div>
                <div className="myth-columns">
                  <div className="myth-col">
                    <div className="myth-col-label myth">Myth</div>
                    <div className="myth-statement">{currentScreen.myth}</div>
                  </div>
                  <div className="myth-col reality">
                    <div className="myth-col-label reality">Reality</div>
                    <div className="reality-text">
                      {currentScreen.reality?.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SCREEN: Heard Around Here */}
            {currentScreen.type === 'heard' && (
              <>
                <div className="break-kicker">👂 Things You'll Hear Around Here</div>
                <div className="phrase-quote">{currentScreen.phrase}</div>
                <div className="body-copy">
                  <p style={{ textAlign: 'center', color: 'var(--text-low)', fontStyle: 'italic' }}>
                    What it usually means:
                  </p>
                  {currentScreen.meaning?.map((p, i) => (
                    <p key={i} style={{ textAlign: 'center' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </>
            )}

            {/* SCREEN: Reflect Pause */}
            {currentScreen.type === 'reflect-pause' && (
              <>
                <div className="reflect-circle">🤔</div>
                <div className="break-line">Before we continue&hellip;</div>
                <div className="break-line sub">Think about the last time this happened to you.</div>
              </>
            )}

            {/* SCREEN: Aftermath Line */}
            {currentScreen.type === 'aftermath-line' && (
              <div
                className={`break-line ${
                  currentScreen.size === 'hero'
                    ? 'hero'
                    : currentScreen.size === 'sub'
                    ? 'sub'
                    : ''
                }`}
              >
                {currentScreen.text}
              </div>
            )}

            {/* SCREEN: Field Guide */}
            {currentScreen.type === 'fieldguide' && (
              <>
                <div className="break-kicker">📓 The Startup Field Guide</div>
                <div className="break-line hero" style={{ marginBottom: '6px' }}>
                  Twelve things worth remembering.
                </div>
                <div className="fg-list">
                  {FIELD_GUIDE.map((line, i) => (
                    <div key={i} className="fg-row">
                      <span className="fg-num">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className="fg-text"
                        dangerouslySetInnerHTML={{ __html: line }}
                      />
                    </div>
                  ))}
                </div>
                <button className="cta" onClick={advance}>
                  Continue
                </button>
              </>
            )}

            {/* SCREEN: Ending */}
            {currentScreen.type === 'ending' && (
              <>
                <div className="brand-tag">
                  <span className="brand-dot">🦊</span> GummyGum
                </div>
                <div className="mascot-row">
                  <div className="mascot-circle" style={{ background: '#F6DE9E' }}>🐭</div>
                  <div className="mascot-circle" style={{ background: '#D9CBF5' }}>🦊</div>
                  <div className="mascot-circle" style={{ background: '#BBDDF5' }}>🐰</div>
                </div>
                <div className="wordmark" style={{ fontSize: 'clamp(24px, 4.6vw, 36px)' }}>
                  You're not finishing a training.
                </div>
                <div className="supporting" style={{ maxWidth: '460px' }}>
                  Startup work isn't a script. Most of it is small moments like the ones you just walked through &mdash; and now you'll know what to do when they show up.
                </div>
                <div className="end-final">Go do the thing.</div>
                <div className="btn-row">
                  <button className="cta" onClick={restart}>
                    Restart the Experience
                  </button>
                  <button
                    className="cta secondary"
                    onClick={() => alert('This would return to the GummyGum home screen.')}
                  >
                    Return Home
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Floating tap hint */}
      <div
        className="tap-hint"
        id="tap-hint"
        style={{ display: showTapHint ? 'block' : 'none' }}
      >
        tap anywhere to continue
      </div>
    </>
  );
}
