import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Check, RotateCcw, Lightbulb } from 'lucide-react';
import { INTERESTS_DATA, CAREERS_DATA } from '../data/gameData';
import { PERSONALITIES, getPersonality } from '../data/personalities';
import { STICKERS, Sticker, getSticker } from './Stickers';
import { CareerMatch } from '../types';
import { playClickSound, playFanfare } from '../utils/audio';

/** Welcome = 0, three questions = 1–3, result = 4. */
const QUESTION_COUNT = 3;
const RESULT_STEP = 4;

/** Seconds of no touch on the result screen before the kiosk frees itself up. */
const IDLE_RESET_SECONDS = 90;
const IDLE_WARN_AT = 20;

const MAX_PERSONALITIES = 3;
const MAX_INTERESTS = 2;

interface CareerFlowProps {
  onEarnXp: (amount: number, reason: string) => void;
  onRestart: () => void;
  onOpenCareerDetails: (career: CareerMatch) => void;
}

export const CareerFlow: React.FC<CareerFlowProps> = ({
  onEarnXp,
  onRestart,
  onOpenCareerDetails,
}) => {
  const [step, setStep] = useState<number>(0);
  const [stickerId, setStickerId] = useState<string>(STICKERS[0].id);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [rewardedSteps, setRewardedSteps] = useState<number[]>([]);
  const [idleLeft, setIdleLeft] = useState<number>(IDLE_RESET_SECONDS);

  const togglePersonality = (id: string) => {
    playClickSound();
    if (selectedPersonalities.includes(id)) {
      setSelectedPersonalities(selectedPersonalities.filter((p) => p !== id));
    } else if (selectedPersonalities.length < MAX_PERSONALITIES) {
      setSelectedPersonalities([...selectedPersonalities, id]);
    }
  };

  const toggleInterest = (id: string) => {
    playClickSound();
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else if (selectedInterests.length < MAX_INTERESTS) {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const chosenPersonalities = selectedPersonalities
    .map(getPersonality)
    .filter((p): p is NonNullable<typeof p> => !!p);

  // Personalities stand in for skills, so the existing career scoring is unchanged.
  const activeSkillIds = Array.from(new Set(chosenPersonalities.flatMap((p) => p.skillIds)));

  const rankedMatches = CAREERS_DATA.map((career) => {
    let score = 0;
    const matchedSkills = career.requiredSkillIds.filter((id) => activeSkillIds.includes(id));
    score += (matchedSkills.length / Math.max(1, career.requiredSkillIds.length)) * 60;

    const matchedInterests = career.primaryInterestIds.filter((id) => selectedInterests.includes(id));
    score += (matchedInterests.length / Math.max(1, career.primaryInterestIds.length)) * 30;

    score += 10;

    return {
      career,
      compatibility: Math.min(99, Math.max(45, Math.round(score))),
      matchedSkillsCount: matchedSkills.length,
    };
  }).sort((a, b) => b.compatibility - a.compatibility);

  const topCareer = rankedMatches[0]?.career;
  const sticker = getSticker(stickerId) || STICKERS[0];

  const finish = () => {
    setStep(RESULT_STEP);
    setIdleLeft(IDLE_RESET_SECONDS);

    playFanfare();
    onEarnXp(500, 'Career match unlocked');

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#AF144B', '#FA551E', '#0074A6', '#95052A'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const goNext = () => {
    playClickSound();

    if (step >= 1 && step <= QUESTION_COUNT && !rewardedSteps.includes(step)) {
      setRewardedSteps((prev) => [...prev, step]);
      onEarnXp(40, 'Step complete');
    }

    if (step === QUESTION_COUNT) finish();
    else setStep(step + 1);
  };

  const goBack = () => {
    playClickSound();
    setStep(Math.max(0, step - 1));
  };

  const restart = useCallback(() => {
    setStep(0);
    setStickerId(STICKERS[0].id);
    setSelectedPersonalities([]);
    setSelectedInterests([]);
    setRewardedSteps([]);
    setIdleLeft(IDLE_RESET_SECONDS);
    onRestart();
  }, [onRestart]);

  // On the result screen, hand the kiosk back to the next person if nobody
  // touches it. Any interaction puts the full time back on the clock.
  useEffect(() => {
    if (step !== RESULT_STEP) {
      setIdleLeft(IDLE_RESET_SECONDS);
      return;
    }
    const bump = () => setIdleLeft(IDLE_RESET_SECONDS);
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    const tick = window.setInterval(() => setIdleLeft((v) => v - 1), 1000);
    return () => {
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
      window.clearInterval(tick);
    };
  }, [step]);

  useEffect(() => {
    if (step === RESULT_STEP && idleLeft <= 0) restart();
  }, [step, idleLeft, restart]);

  const canAdvance = step === 2 ? selectedPersonalities.length > 0 : true;
  const nextLabel = step === QUESTION_COUNT ? '✨ Show My Careers' : 'Continue';

  /* ============================ WELCOME ============================ */
  if (step === 0) {
    return (
      <div className="kiosk-body">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center px-6 py-12 max-w-2xl m-auto"
        >
          <p className="eyebrow">Absa Future Ready Teens</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mt-4 leading-[1.05]">
            What kind of
            <br /> person are you?
          </h1>
          <p className="text-lg sm:text-xl text-muted mt-6 leading-relaxed">
            Answer three quick questions — no typing, just tap.
            We'll show you the careers that fit who you already are.
          </p>

          <button
            id="btn-start"
            onClick={() => { playClickSound(); setStep(1); }}
            className="btn btn-primary btn-touch mt-10"
          >
            <span>Start</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="meta mt-10">#AbsaFutureReady2026</p>
        </motion.div>
      </div>
    );
  }

  /* ============================ RESULT ============================ */
  if (step === RESULT_STEP && topCareer) {
    const top = rankedMatches[0];
    const alsoConsider = rankedMatches.slice(1, 6);
    const lead = chosenPersonalities[0];
    const personalityNames = chosenPersonalities.map((p) => p.name.replace('The ', ''));
    const label =
      personalityNames.length > 1
        ? `${personalityNames.slice(0, -1).join(', ')} + ${personalityNames[personalityNames.length - 1]}`
        : personalityNames[0];

    return (
      <>
        <div className="kiosk-body">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-8"
          >
            {/* Who they said they are */}
            <div className="flex items-center gap-5">
              <Sticker spec={sticker} className="w-20 h-20 shrink-0" />
              <div className="min-w-0">
                <p className="eyebrow">You're a</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-ink mt-1 leading-tight">{label}</h2>
                {lead && (
                  <p className="text-base text-muted mt-2">
                    Best at <span className="text-ink font-semibold">{lead.strength}</span>.
                  </p>
                )}
              </div>
            </div>

            {/* Advice, earned by the personalities they picked */}
            <div className="panel p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-accent shrink-0" />
                <h3 className="text-lg font-bold text-ink">Your career advice</h3>
              </div>
              <div className="mt-4 space-y-4">
                {chosenPersonalities.map((p) => (
                  <div key={p.id} className="flex items-start gap-3.5">
                    <span className="text-2xl shrink-0 leading-none mt-0.5">{p.emoji}</span>
                    <p className="text-base text-ink leading-relaxed">{p.advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Best fit */}
            <div>
              <h3 className="text-xl font-bold text-ink mb-4">Your best career match</h3>
              <button
                onClick={() => onOpenCareerDetails(topCareer)}
                className="panel w-full p-6 sm:p-8 text-left ring-2 ring-brand hover:shadow-lift transition-all group"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-brand bg-brand-tint px-3 py-1.5 rounded-full">
                    Top match
                  </span>
                  <span className="text-3xl font-bold text-brand tabular-nums">{top.compatibility}%</span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold text-ink mt-4 leading-tight">
                  {topCareer.title}
                </h4>
                <p className="meta mt-1.5">{topCareer.absaPillar}</p>
                <p className="text-base text-muted mt-4 leading-relaxed">{topCareer.tagline}</p>

                <p className="text-sm text-ink mt-4 leading-relaxed">
                  <span className="font-semibold">Why it fits you · </span>
                  {topCareer.matchExplanation}
                </p>

                {topCareer.subjectsNeeded && (
                  <p className="text-sm text-muted mt-3">
                    <span className="text-faint">Subjects to take · </span>
                    {topCareer.subjectsNeeded.join(' · ')}
                  </p>
                )}

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand mt-6 group-hover:gap-2.5 transition-all">
                  See the full roadmap
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Everything else they could do */}
            <div>
              <h3 className="text-xl font-bold text-ink">Other careers you could do</h3>
              <p className="text-sm text-muted mt-1.5">
                Tap any of these to see the subjects and the steps to get there.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {alsoConsider.map((item) => (
                  <button
                    key={item.career.id}
                    onClick={() => onOpenCareerDetails(item.career)}
                    className="panel p-5 text-left hover:shadow-lift transition-all group flex flex-col"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="meta truncate">{item.career.absaPillar}</span>
                      <span className="text-base font-bold text-ink tabular-nums shrink-0">
                        {item.compatibility}%
                      </span>
                    </div>
                    <h4 className="font-semibold text-ink text-base mt-2 leading-snug group-hover:text-brand transition-colors">
                      {item.career.title}
                    </h4>
                    <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2 flex-1">
                      {item.career.tagline}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand mt-4 group-hover:gap-2 transition-all">
                      How to get there
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* First steps */}
            <div className="panel p-6 sm:p-8">
              <h3 className="text-xl font-bold text-ink">Start here, in high school</h3>
              <p className="text-sm text-muted mt-1.5">
                Three things you can do now towards {topCareer.title}.
              </p>
              <ol className="mt-6 space-y-4">
                {topCareer.teenActionSteps.map((stepItem, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-brand-tint text-brand text-xs font-semibold grid place-items-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-base text-ink leading-relaxed pt-0.5">{stepItem}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>

        <footer className="shrink-0 border-t border-line bg-surface">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              {idleLeft <= IDLE_WARN_AT ? (
                <p className="text-sm font-medium text-accent">
                  Clearing for the next person in {idleLeft}s — touch to stay
                </p>
              ) : (
                <p className="meta hidden sm:block">Absa Future Ready Teens · Skill-first careers</p>
              )}
            </div>

            <button id="btn-restart" onClick={restart} className="btn btn-primary btn-touch shrink-0">
              <RotateCcw className="w-5 h-5" />
              <span>Start again</span>
            </button>
          </div>
        </footer>
      </>
    );
  }

  /* ============================ QUESTIONS ============================ */
  return (
    <>
      <div className="shrink-0 px-5 sm:px-8 pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="rail">
            <motion.div
              className="rail-fill"
              animate={{ width: `${(step / QUESTION_COUNT) * 100}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="meta mt-2">Question {step} of {QUESTION_COUNT}</p>
        </div>
      </div>

      <div className="kiosk-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-6xl mx-auto my-auto px-5 sm:px-8 py-5 sm:py-7"
          >
            {/* ---- Q1: pick a sticker ---- */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                  Pick your sticker
                </h2>
                <p className="text-base text-muted mt-2.5">
                  This one's just for fun — choose the character that feels like you.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
                  {STICKERS.map((s) => {
                    const isSelected = stickerId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { playClickSound(); setStickerId(s.id); }}
                        className={`rounded-3xl p-3 transition-all duration-150 active:scale-95 ${
                          isSelected ? 'bg-brand-tint ring-2 ring-brand' : 'bg-sunken hover:bg-line'
                        }`}
                      >
                        <Sticker spec={s} className="w-full h-auto" />
                        <span
                          className={`block text-sm font-semibold mt-2 ${
                            isSelected ? 'text-brand' : 'text-muted'
                          }`}
                        >
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- Q2: personalities ---- */}
            {step === 2 && (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                    Which of these sound like you?
                  </h2>
                  <span
                    className={`text-lg font-semibold ${
                      selectedPersonalities.length ? 'text-brand' : 'text-faint'
                    }`}
                  >
                    {selectedPersonalities.length}/{MAX_PERSONALITIES}
                  </span>
                </div>
                <p className="text-base text-muted mt-2.5">
                  Pick up to three. There are no wrong answers.
                </p>

                <div className="q-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                  {PERSONALITIES.map((p) => {
                    const isSelected = selectedPersonalities.includes(p.id);
                    const isMaxed = !isSelected && selectedPersonalities.length >= MAX_PERSONALITIES;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePersonality(p.id)}
                        className={`pick p-4 sm:p-5 ${isSelected ? 'pick-on' : ''} ${isMaxed ? 'opacity-40' : ''}`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-3xl leading-none">{p.emoji}</span>
                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-brand text-white grid place-items-center shrink-0">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <span className="pick-label block font-semibold text-ink text-base mt-3 leading-snug">
                          {p.name}
                        </span>
                        <span className="pick-sub">{p.blurb}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- Q3: passions ---- */}
            {step === 3 && (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                    What are you into?
                  </h2>
                  <span
                    className={`text-lg font-semibold ${
                      selectedInterests.length ? 'text-brand' : 'text-faint'
                    }`}
                  >
                    {selectedInterests.length}/{MAX_INTERESTS}
                  </span>
                </div>
                <p className="text-base text-muted mt-2.5">
                  Choose one or two you'd happily spend a whole weekend on.
                </p>

                <div className="q-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                  {INTERESTS_DATA.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    const isMaxed = !isSelected && selectedInterests.length >= MAX_INTERESTS;
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`pick p-4 sm:p-5 flex items-center gap-3.5 ${isSelected ? 'pick-on' : ''} ${isMaxed ? 'opacity-40' : ''}`}
                      >
                        <span className="text-3xl shrink-0">{interest.emoji}</span>
                        <span className="pick-label font-semibold text-ink text-base leading-snug min-w-0">
                          {interest.name.split('&')[0].trim()}
                        </span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-brand text-white grid place-items-center shrink-0 ml-auto">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="shrink-0 border-t border-line bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <button id="btn-back" onClick={goBack} className="btn btn-quiet btn-touch">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            id="btn-next"
            onClick={goNext}
            disabled={!canAdvance}
            className="btn btn-primary btn-touch"
          >
            <span>{nextLabel}</span>
            {step !== QUESTION_COUNT && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </footer>
    </>
  );
};
