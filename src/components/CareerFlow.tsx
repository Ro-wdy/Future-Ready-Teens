import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, RotateCcw, Send } from 'lucide-react';
import { ASKS, AnswerMap, INTEREST_ASK_INDEX } from '../data/asks';
import { InterestId } from '../data/interests';
import { STICKERS, Sticker, getSticker } from './Stickers';
import { AskScreen } from './screens/AskScreen';
import { InterestBoard } from './screens/InterestBoard';
import { ResultScreen } from './screens/ResultScreen';
import { LeadForm } from './screens/LeadForm';
import { scoreTraits, rankCareers, getFutureType } from '../utils/matching';
import { getInterest } from '../data/interests';
import { CareerMatch } from '../types';
import { playClickSound, playFanfare, playPop, playWhoosh, playCrunchTick } from '../utils/audio';

type Phase = 'welcome' | 'player' | 'ask' | 'crunch' | 'result';

/** Beat between tapping an answer and the next round arriving. */
const COMMIT_MS = 680;
/** Longer on Ask 06 so the mash-up name has time to land. */
const COMBO_REVEAL_MS = 1500;
/** Seconds of no touch on the result screen before the kiosk frees itself up. */
const IDLE_RESET_SECONDS = 120;
const IDLE_WARN_AT = 25;
/**
 * A teen who wanders off mid-round would otherwise leave the panel parked on
 * that round until a staff member noticed. Shorter than the result timeout,
 * because a half-finished run is worth nothing to the next person.
 */
const ROUND_IDLE_SECONDS = 75;

/**
 * Attract-loop teasers. Real careers and real mash-ups from the data, so the
 * screen is advertising the actual payoff rather than a generic strapline.
 */
const TEASERS = [
  'Sports Technology',
  'Wildlife Filmmaking',
  'Music Production',
  'Climate Tech',
  'Game Development',
  'Sports Data Analytics',
  'Eco Architecture',
  'Travel Documentary',
  'Digital Health',
  'Artist Management',
];

const CRUNCH_LINES = [
  'Reading how you answered…',
  'Crossing it with your interest mix…',
  'Checking 30 real careers…',
  'Found it.',
];

interface CareerFlowProps {
  onEarnXp: (amount: number) => void;
  onRestart: () => void;
  onOpenCareerDetails: (career: CareerMatch) => void;
  /** Hands `restart` up so the staff panel can rescue a stuck screen. */
  registerReset: (fn: () => void) => void;
}

export const CareerFlow: React.FC<CareerFlowProps> = ({
  onEarnXp,
  onRestart,
  onOpenCareerDetails,
  registerReset,
}) => {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [askIndex, setAskIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [stickerId, setStickerId] = useState<string>(STICKERS[0].id);

  const [committed, setCommitted] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [crunchLine, setCrunchLine] = useState(0);
  const [idleLeft, setIdleLeft] = useState(IDLE_RESET_SECONDS);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [teaser, setTeaser] = useState(0);

  /** Every pending advance, so Back or a restart can never fire a stale one. */
  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => clearTimers, []);

  const ask = ASKS[askIndex];
  const sticker = getSticker(stickerId) ?? STICKERS[0];
  const isInterestAsk = askIndex === INTEREST_ASK_INDEX;

  const traits = useMemo(() => scoreTraits(answers), [answers]);
  const ranked = useMemo(() => rankCareers(traits, interests), [traits, interests]);
  const futureType = useMemo(() => getFutureType(traits), [traits]);
  const interestMix = interests.map((i) => getInterest(i)?.label ?? i).join(' × ');

  /* ---------------------------------------------------------------- */

  const advance = useCallback(() => {
    setCommitted(null);
    setReaction(null);
    playWhoosh();

    if (askIndex + 1 >= ASKS.length) {
      setPhase('crunch');
      setCrunchLine(0);
    } else {
      setAskIndex((i) => i + 1);
    }
  }, [askIndex]);

  const handlePick = (optionId: string) => {
    if (committed) return;
    const option = ask.options.find((o) => o.id === optionId);
    if (!option) return;

    playPop();
    setCommitted(optionId);
    setReaction(option.reaction);
    setAnswers((prev) => ({ ...prev, [ask.id]: optionId }));
    onEarnXp(ask.xp);

    later(advance, COMMIT_MS);
  };

  const handleInterestToggle = (id: InterestId) => {
    if (interests.length >= 2) return;

    playPop();
    const next = interests.includes(id) ? interests.filter((i) => i !== id) : [...interests, id];
    setInterests(next);

    if (next.length === 2) {
      // `committed` doubles as "the board is locked" on this ask.
      setCommitted('done');
      onEarnXp(ask.xp);
      later(advance, COMBO_REVEAL_MS);
    }
  };

  const goBack = () => {
    clearTimers();
    playClickSound();
    setCommitted(null);
    setReaction(null);

    if (askIndex === 0) {
      setPhase('player');
      return;
    }

    const previous = ASKS[askIndex - 1];
    if (previous.id === ASKS[INTEREST_ASK_INDEX].id) setInterests([]);
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[previous.id];
      return next;
    });
    setAskIndex(askIndex - 1);
  };

  const restart = useCallback(() => {
    clearTimers();
    setPhase('welcome');
    setAskIndex(0);
    setAnswers({});
    setInterests([]);
    setStickerId(STICKERS[0].id);
    setCommitted(null);
    setReaction(null);
    setIdleLeft(IDLE_RESET_SECONDS);
    setLeadFormOpen(false);
    onRestart();
  }, [onRestart]);

  useEffect(() => {
    registerReset(restart);
  }, [registerReset, restart]);

  /* ---- Attract loop ---------------------------------------------- */
  useEffect(() => {
    if (phase !== 'welcome') return;
    const tick = window.setInterval(() => setTeaser((t) => (t + 1) % TEASERS.length), 2200);
    return () => window.clearInterval(tick);
  }, [phase]);

  /* ---- The "working it out" beat --------------------------------- */
  useEffect(() => {
    if (phase !== 'crunch') return;

    CRUNCH_LINES.forEach((_, i) => {
      later(() => {
        setCrunchLine(i);
        playCrunchTick(i);
      }, i * 550);
    });

    later(() => {
      setPhase('result');
      setIdleLeft(IDLE_RESET_SECONDS);
      playFanfare();
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.45 },
          colors: ['#AF144B', '#FA551E', '#0074A6', '#0B7A55', '#7A3FA8'],
          // Default is 100, which would put it over the lead form and the
          // staff panel if a fast player opens one before it settles.
          zIndex: 40,
        });
      } catch (e) {
        console.error(e);
      }
    }, CRUNCH_LINES.length * 550 + 350);
    // Timers are cleared on unmount and on any restart, so this only ever
    // runs once per crunch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---- Hand the kiosk back to the next person -------------------- */
  // Runs on every phase except the attract screen, which is already the
  // resting state. Any touch anywhere puts the full time back on the clock.
  const idleBudget = phase === 'result' ? IDLE_RESET_SECONDS : ROUND_IDLE_SECONDS;

  useEffect(() => {
    if (phase === 'welcome') {
      setIdleLeft(IDLE_RESET_SECONDS);
      return;
    }
    setIdleLeft(idleBudget);

    const bump = () => setIdleLeft(idleBudget);
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    const tick = window.setInterval(() => setIdleLeft((v) => v - 1), 1000);
    return () => {
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
      window.clearInterval(tick);
    };
  }, [phase, idleBudget]);

  useEffect(() => {
    // Never yank the screen away from someone mid-way through typing.
    if (phase !== 'welcome' && idleLeft <= 0 && !leadFormOpen) restart();
  }, [phase, idleLeft, leadFormOpen, restart]);

  /* ================================================================ */

  const themeVars = (theme: string, tint: string) =>
    ({ ['--theme' as string]: theme, ['--tint' as string]: tint });

  const Backdrop = () => (
    <>
      <span className="blob blob-a" />
      <span className="blob blob-b" />
    </>
  );

  /* ---------------------------- WELCOME --------------------------- */
  if (phase === 'welcome') {
    return (
      <div className="stage" style={themeVars('#AF144B', '#FBEAF0')}>
        <Backdrop />
        <div className="stage-scroll">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center px-6 py-12 max-w-3xl m-auto relative z-10"
        >
          <p className="eyebrow">Absa Future Ready Teens</p>

          <h1 className="type-badge mt-4 uppercase">
            What's your
            <br />
            future type?
          </h1>

          <p className="text-lg sm:text-2xl text-muted mt-7 leading-relaxed">
            You've got ideas. You've got interests. You've got skills you haven't even discovered yet.
            <br className="hidden sm:block" />
            <span className="text-ink font-bold"> Let's see where they could take you.</span>
          </p>

          <button
            id="btn-start"
            onClick={() => {
              playPop();
              setPhase('player');
            }}
            className="btn btn-primary btn-touch mt-10 text-xl px-12"
          >
            <span>LET'S GO</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="mt-10 h-8 flex items-center justify-center gap-2 text-base sm:text-lg">
            <span className="text-muted">Careers like</span>
            <span className="relative inline-block min-w-[13ch] text-left">
              <AnimatePresence mode="wait">
                <motion.span
                  key={teaser}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 whitespace-nowrap font-extrabold text-brand"
                >
                  {TEASERS[teaser]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <p className="meta mt-4">7 rounds · about 90 seconds · no typing</p>
          <p className="eyebrow mt-2">#AbsaFutureReady2026</p>
        </motion.div>
        </div>
      </div>
    );
  }

  /* -------------------------- PLAYER SELECT ----------------------- */
  if (phase === 'player') {
    return (
      <>
        <div className="stage" style={themeVars('#FA551E', '#FEE9E1')}>
          <Backdrop />
          <div className="stage-scroll">
          <div className="w-full max-w-5xl mx-auto my-auto px-5 sm:px-8 py-8 relative z-10 text-center">
            <span className="round-tag">Player select</span>
            <h2 className="ask-title mt-5">Who's playing?</h2>
            <p className="ask-setup">Tap the character that feels like you.</p>

            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mt-8">
              {STICKERS.map((s, i) => {
                const isSelected = stickerId === s.id;
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      playPop();
                      setStickerId(s.id);
                    }}
                    aria-label={`Character ${s.name}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    className={`rounded-3xl p-2.5 transition-all duration-150 active:scale-95 ${
                      isSelected ? 'bg-white ring-4 ring-accent shadow-lift' : 'bg-white/60 hover:bg-white'
                    }`}
                  >
                    <Sticker spec={s} className="w-full h-auto" />
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => {
                playWhoosh();
                setPhase('ask');
                setAskIndex(0);
              }}
              className="btn btn-primary btn-touch mt-9 px-12 text-lg"
            >
              <span>Start round 1</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          </div>
        </div>
      </>
    );
  }

  /* ------------------------------ CRUNCH -------------------------- */
  if (phase === 'crunch') {
    return (
      <div className="stage" style={themeVars('#0074A6', '#E3F1F8')}>
        <Backdrop />
        <div className="m-auto text-center px-6 relative z-10">
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="crunch-dot"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.14 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={crunchLine}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="ask-title mt-8"
            >
              {CRUNCH_LINES[crunchLine]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ------------------------------ RESULT -------------------------- */
  if (phase === 'result') {
    return (
      <>
        <div className="stage" style={themeVars('#AF144B', '#F9F8F8')}>
          <Backdrop />
          <div className="stage-scroll">
          <ResultScreen
            sticker={sticker}
            traits={traits}
            interests={interests}
            ranked={ranked}
            onOpenCareerDetails={onOpenCareerDetails}
          />
          </div>
        </div>

        <footer className="shrink-0 border-t border-line bg-surface">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              {idleLeft <= IDLE_WARN_AT ? (
                <p className="text-sm font-bold text-accent">
                  Clearing for the next player in {idleLeft}s — touch to stay
                </p>
              ) : (
                <p className="meta hidden sm:block">
                  Absa Future Ready Teens · Careers are built from skills, not job titles
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                id="btn-send-results"
                onClick={() => { playPop(); setLeadFormOpen(true); }}
                className="btn btn-primary btn-touch"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send me my results</span>
                <span className="sm:hidden">Send to me</span>
              </button>
              <button id="btn-restart" onClick={restart} className="btn btn-outline btn-touch">
                <RotateCcw className="w-5 h-5" />
                <span className="hidden sm:inline">Next player</span>
              </button>
            </div>
          </div>
        </footer>

        <LeadForm
          open={leadFormOpen}
          onClose={() => setLeadFormOpen(false)}
          futureType={futureType.badge}
          interestMix={interestMix}
          topCareer={ranked[0]?.career.title ?? ''}
          accent={futureType.primary.color}
        />
      </>
    );
  }

  /* ------------------------------- ASKS --------------------------- */
  return (
    <>
      <div className="stage" style={themeVars(ask.color, ask.tint)}>
        <Backdrop />

        {/* Progress pips — a game HUD, not a "Question 3 of 7" counter. */}
        <div className="shrink-0 px-5 sm:px-8 pt-4 relative z-10">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <button
              id="btn-back"
              onClick={goBack}
              className="p-2.5 rounded-full text-ink/50 hover:text-ink hover:bg-white/70 transition-colors shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              {ASKS.map((a, i) => (
                <span
                  key={a.id}
                  className={`pip ${i < askIndex ? 'pip-done' : ''} ${i === askIndex ? 'pip-now' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="stage-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={ask.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-h-0 flex flex-col"
          >
            {isInterestAsk ? (
              <InterestBoard
                ask={ask}
                picked={interests}
                onToggle={handleInterestToggle}
                revealing={committed !== null}
              />
            ) : (
              <AskScreen ask={ask} committed={committed} onPick={handlePick} />
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* The reaction that fires the instant they commit. */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 460, damping: 26 }}
            style={themeVars(ask.color, ask.tint)}
            className="reaction"
          >
            {reaction}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
