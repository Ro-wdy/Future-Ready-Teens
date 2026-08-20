import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { SKILLS_DATA, INTERESTS_DATA, CAREERS_DATA, WORK_STYLES } from '../data/gameData';
import { CareerMatch } from '../types';
import { playClickSound, playFanfare } from '../utils/audio';

const AVATARS = [
  { id: 'av-1', emoji: '🧑🏾‍💻', label: 'Tech' },
  { id: 'av-2', emoji: '🩺', label: 'Health' },
  { id: 'av-3', emoji: '✈️', label: 'Aviation' },
  { id: 'av-4', emoji: '👩🏽‍🎨', label: 'Creative' },
  { id: 'av-5', emoji: '⚖️', label: 'Law' },
  { id: 'av-6', emoji: '🌱', label: 'Green' },
  { id: 'av-7', emoji: '🌾', label: 'Agri' },
  { id: 'av-8', emoji: '🚀', label: 'Leader' },
];

/** Welcome = 0, four questions = 1–4, result = 5. */
const QUESTION_COUNT = 4;
const RESULT_STEP = 5;

/** Seconds of no touch on the result screen before the kiosk frees itself up. */
const IDLE_RESET_SECONDS = 90;
const IDLE_WARN_AT = 20;

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
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('🧑🏾‍💻');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedWorkStyle, setSelectedWorkStyle] = useState<string>('style-builder');
  const [rewardedSteps, setRewardedSteps] = useState<number[]>([]);
  const [idleLeft, setIdleLeft] = useState<number>(IDLE_RESET_SECONDS);

  const toggleSkill = (skillId: string) => {
    playClickSound();
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const toggleInterest = (interestId: string) => {
    playClickSound();
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else if (selectedInterests.length < 2) {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  // Career matches, scored from the answers given
  const rankedMatches = CAREERS_DATA.map((career) => {
    let score = 0;
    const matchedSkills = career.requiredSkillIds.filter((id) => selectedSkills.includes(id));
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

  const finish = () => {
    setStep(RESULT_STEP);
    setIdleLeft(IDLE_RESET_SECONDS);

    playFanfare();
    onEarnXp(500, 'Career Passport unlocked');

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

    // Each answered question is worth a little XP, once
    if (step >= 1 && step <= QUESTION_COUNT && !rewardedSteps.includes(step)) {
      setRewardedSteps((prev) => [...prev, step]);
      onEarnXp(40, 'Step complete');
    }

    if (step === QUESTION_COUNT) {
      finish();
    } else {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    playClickSound();
    setStep(Math.max(0, step - 1));
  };

  const restart = useCallback(() => {
    setStep(0);
    setName('');
    setAvatar('🧑🏾‍💻');
    setSelectedSkills([]);
    setSelectedInterests([]);
    setSelectedWorkStyle('style-builder');
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

  const canAdvance =
    step === 1 ? name.trim().length > 0 :
    step === 2 ? selectedSkills.length > 0 :
    true;

  const nextLabel = step === QUESTION_COUNT ? '✨ Reveal My Career Matches' : 'Continue';

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
            Careers are built
            <br /> from skills.
          </h1>
          <p className="text-lg sm:text-xl text-muted mt-6 leading-relaxed">
            Answer four quick questions about what you're good at and what you love.
            We'll show you the careers built for you — takes about a minute.
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
    const runnersUp = rankedMatches.slice(1, 3);

    return (
      <>
        <div className="kiosk-body">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-8"
          >
            {/* Who this is */}
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-brand-tint grid place-items-center text-3xl shrink-0">
                {avatar}
              </span>
              <div className="min-w-0">
                <p className="eyebrow">Your career match</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-1">
                  {name.trim()}, here's your match
                </h2>
              </div>
            </div>

            {/* Top match */}
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

              <h3 className="text-2xl sm:text-3xl font-bold text-ink mt-4 leading-tight">
                {topCareer.title}
              </h3>
              <p className="meta mt-1.5">{topCareer.absaPillar}</p>
              <p className="text-base text-muted mt-4 leading-relaxed">{topCareer.tagline}</p>

              <div className="flex flex-wrap gap-2 mt-5">
                {topCareer.requiredSkillIds.map((sId) => {
                  const s = SKILLS_DATA.find((sk) => sk.id === sId);
                  const isMatched = selectedSkills.includes(sId);
                  return (
                    <span
                      key={sId}
                      className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${
                        isMatched ? 'bg-grass-tint text-grass' : 'bg-sunken text-muted'
                      }`}
                    >
                      {s?.name.split(' ')[0]}{isMatched ? ' ✓' : ''}
                    </span>
                  );
                })}
              </div>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand mt-6 group-hover:gap-2.5 transition-all">
                See the full roadmap
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Runners up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {runnersUp.map((item) => (
                <button
                  key={item.career.id}
                  onClick={() => onOpenCareerDetails(item.career)}
                  className="panel p-5 text-left hover:shadow-lift transition-all group"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="meta">{item.career.absaPillar}</span>
                    <span className="text-lg font-bold text-ink tabular-nums shrink-0">
                      {item.compatibility}%
                    </span>
                  </div>
                  <h4 className="font-semibold text-ink text-lg mt-2 leading-snug group-hover:text-brand transition-colors">
                    {item.career.title}
                  </h4>
                  <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                    {item.career.tagline}
                  </p>
                </button>
              ))}
            </div>

            {/* Starter kit */}
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

        {/* Result actions */}
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

            <button
              id="btn-restart"
              onClick={restart}
              className="btn btn-primary btn-touch shrink-0"
            >
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
      {/* Progress */}
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
            {/* ---- Q1: identity ---- */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                  First — what should we call you?
                </h2>
                <p className="text-base text-muted mt-2.5">
                  Just so your results feel like yours.
                </p>

                <input
                  id="input-teen-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="off"
                  className="field max-w-xl mt-8 text-xl py-5"
                />

                <p className="meta mt-10 mb-4">Pick an avatar</p>
                <div className="flex flex-wrap gap-3">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { playClickSound(); setAvatar(av.emoji); }}
                      className={`w-20 h-20 rounded-2xl text-4xl grid place-items-center transition-all duration-150 active:scale-90 ${
                        avatar === av.emoji
                          ? 'bg-brand-tint ring-2 ring-brand'
                          : 'bg-sunken hover:bg-line'
                      }`}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- Q2: superpowers ---- */}
            {step === 2 && (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                    What are your superpowers?
                  </h2>
                  <span className={`text-lg font-semibold ${selectedSkills.length ? 'text-brand' : 'text-faint'}`}>
                    {selectedSkills.length}/3
                  </span>
                </div>
                <p className="text-base text-muted mt-2.5">
                  Pick up to three things you're good at, or want to be.
                </p>

                <div className="q-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                  {SKILLS_DATA.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    const isMaxed = !isSelected && selectedSkills.length >= 3;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`pick p-4 sm:p-5 ${isSelected ? 'pick-on' : ''} ${isMaxed ? 'opacity-40' : ''}`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className="w-3 h-3 rounded-full mt-1 shrink-0"
                            style={{ backgroundColor: skill.color }}
                          />
                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-brand text-white grid place-items-center shrink-0">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <span className="pick-label block font-semibold text-ink text-base mt-3 leading-snug">
                          {skill.name}
                        </span>
                        <span className="pick-sub">{skill.tagline}</span>
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
                    What are you curious about?
                  </h2>
                  <span className={`text-lg font-semibold ${selectedInterests.length ? 'text-brand' : 'text-faint'}`}>
                    {selectedInterests.length}/2
                  </span>
                </div>
                <p className="text-base text-muted mt-2.5">
                  Choose one or two worlds you'd happily get lost in.
                </p>

                <div className="q-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                  {INTERESTS_DATA.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    const isMaxed = !isSelected && selectedInterests.length >= 2;
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

            {/* ---- Q4: impact persona ---- */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                  How do you want to make impact?
                </h2>
                <p className="text-base text-muted mt-2.5">
                  No wrong answer — pick the one that sounds most like you.
                </p>

                <div className="q-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {WORK_STYLES.map((style) => {
                    const isSelected = selectedWorkStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => { playClickSound(); setSelectedWorkStyle(style.id); }}
                        className={`pick p-6 flex items-start gap-4 ${isSelected ? 'pick-on' : ''}`}
                      >
                        <span className="text-4xl shrink-0">{style.emoji}</span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink text-lg leading-snug">
                            {style.title.replace('The ', '')}
                          </span>
                          <span className="block text-sm text-muted mt-1.5 leading-relaxed">
                            {style.tagline}
                          </span>
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

      {/* Step navigation */}
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
