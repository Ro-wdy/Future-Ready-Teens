import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Check,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { SKILLS_DATA, INTERESTS_DATA, CAREERS_DATA, WORK_STYLES } from '../data/gameData';
import { CareerMatch, TeenPassportData } from '../types';
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

interface TeenCareerPassportProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onOpenCareerDetails: (career: CareerMatch) => void;
  onOpenCertificate: (passport: TeenPassportData, topCareer: CareerMatch) => void;
}

/** Section heading used throughout the journey — a step number, not a form label. */
const StepHeading: React.FC<{
  step: number;
  title: string;
  hint: string;
  done: boolean;
  counter?: string;
}> = ({ step, title, hint, done, counter }) => (
  <div className="flex items-start gap-4 mb-5">
    <span
      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold shrink-0 transition-colors ${
        done ? 'bg-brand text-white' : 'bg-sunken text-faint'
      }`}
    >
      {done ? <Check className="w-4 h-4" strokeWidth={3} /> : step}
    </span>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-ink">{title}</h3>
        {counter && (
          <span className={`text-sm font-semibold ${done ? 'text-brand' : 'text-faint'}`}>{counter}</span>
        )}
      </div>
      <p className="text-sm text-muted mt-1">{hint}</p>
    </div>
  </div>
);

export const TeenCareerPassport: React.FC<TeenCareerPassportProps> = ({
  onEarnXp,
  onUnlockBadge,
  onOpenCareerDetails,
  onOpenCertificate,
}) => {
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('🧑🏾‍💻');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedWorkStyle, setSelectedWorkStyle] = useState<string>('style-builder');
  const [personaChosen, setPersonaChosen] = useState<boolean>(false);

  const [passportGenerated, setPassportGenerated] = useState<boolean>(false);
  const [passportData, setPassportData] = useState<TeenPassportData | null>(null);

  // Toggle skill selection (max 3)
  const toggleSkill = (skillId: string) => {
    playClickSound();
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      if (selectedSkills.length < 3) {
        setSelectedSkills([...selectedSkills, skillId]);
      }
    }
  };

  // Toggle interest selection (max 2)
  const toggleInterest = (interestId: string) => {
    playClickSound();
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else {
      if (selectedInterests.length < 2) {
        setSelectedInterests([...selectedInterests, interestId]);
      }
    }
  };

  // Calculate career matches based on selected skills & interests
  const calculateRankedCareers = () => {
    return CAREERS_DATA.map((career) => {
      let score = 0;
      // Match skills (weight 60)
      const matchedSkills = career.requiredSkillIds.filter((id) => selectedSkills.includes(id));
      score += (matchedSkills.length / Math.max(1, career.requiredSkillIds.length)) * 60;

      // Match interests (weight 30)
      const matchedInterests = career.primaryInterestIds.filter((id) => selectedInterests.includes(id));
      score += (matchedInterests.length / Math.max(1, career.primaryInterestIds.length)) * 30;

      // Base bonus
      score += 10;

      const compatibility = Math.min(99, Math.max(45, Math.round(score)));

      return {
        career,
        compatibility,
        matchedSkillsCount: matchedSkills.length,
        matchedInterestsCount: matchedInterests.length,
      };
    }).sort((a, b) => b.compatibility - a.compatibility);
  };

  const handleGeneratePassport = () => {
    if (!name.trim() || selectedSkills.length === 0) return;

    const newPassport: TeenPassportData = {
      teenName: name.trim(),
      teenAvatar: avatar,
      selectedSkillIds: selectedSkills,
      selectedInterestIds: selectedInterests,
      workStyle: selectedWorkStyle,
      generatedDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      passportId: `AFR-${Math.floor(100000 + Math.random() * 900000)}`,
      totalXp: 500,
      level: 2,
      completedQuestsCount: 0,
      matchesPlayedCount: 1,
    };

    setPassportData(newPassport);
    setPassportGenerated(true);

    playFanfare();
    onEarnXp(500, 'Unlocked Official Absa Future Ready Teen Passport');
    onUnlockBadge('badge-passport-certified');

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#DC0032', '#FFB800', '#0284C7', '#9333EA']
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resetWizard = () => {
    playClickSound();
    setPassportGenerated(false);
  };

  const rankedMatches = calculateRankedCareers();
  const topCareer = rankedMatches[0]?.career;

  const isReady = !!name.trim() && selectedSkills.length > 0;
  const stepsDone =
    (name.trim() ? 1 : 0) +
    (selectedSkills.length > 0 ? 1 : 0) +
    (selectedInterests.length > 0 ? 1 : 0) +
    (personaChosen ? 1 : 0);
  const journeyProgress = (stepsDone / 4) * 100;

  return (
    <div className="max-w-5xl 3xl:max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!passportGenerated ? (
          /* ============ THE DISCOVERY JOURNEY ============ */
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Opening */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow">Teen Career Passport</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mt-3 leading-[1.1]">
                Let's find the careers
                <br className="hidden sm:block" /> built for you.
              </h2>
              <p className="text-base sm:text-lg text-muted mt-4 leading-relaxed">
                Pick what feels like you — your strengths, your curiosity, your style.
                We'll turn them into real pathways in under a minute.
              </p>
            </div>

            {/* Journey progress — light, not a scoreboard */}
            <div className="max-w-md mx-auto mt-8">
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  animate={{ width: `${journeyProgress}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="text-center meta mt-2.5">
                {isReady ? 'Ready when you are ✨' : `${stepsDone} of 4 steps`}
              </p>
            </div>

            <div className="mt-14 space-y-16">
              {/* ---- STEP 1: Who's playing ---- */}
              <section>
                <StepHeading
                  step={1}
                  title="First — who are you?"
                  hint="Your name goes on the passport and certificate."
                  done={!!name.trim()}
                />

                <div className="sm:pl-12 space-y-6">
                  <input
                    id="input-teen-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name (e.g. Zawadi Kamau)"
                    className="field max-w-md text-lg font-medium"
                  />

                  <div>
                    <p className="meta mb-3">Choose an avatar</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => { playClickSound(); setAvatar(av.emoji); }}
                          className={`w-14 h-14 rounded-2xl text-2xl grid place-items-center transition-all duration-150 active:scale-90 ${
                            avatar === av.emoji
                              ? 'bg-brand-tint ring-2 ring-brand scale-105'
                              : 'bg-sunken hover:bg-line'
                          }`}
                          title={av.label}
                        >
                          {av.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ---- STEP 2: Superpowers ---- */}
              <section>
                <StepHeading
                  step={2}
                  title="Pick your top 3 superpowers"
                  hint="The things you're naturally good at, or want to get good at."
                  done={selectedSkills.length > 0}
                  counter={`${selectedSkills.length}/3`}
                />

                <div className="sm:pl-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {SKILLS_DATA.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    const isMaxed = !isSelected && selectedSkills.length >= 3;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`pick p-4 ${isSelected ? 'pick-on' : ''} ${
                          isMaxed ? 'opacity-45' : ''
                        }`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: skill.color }}
                          />
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-brand text-white grid place-items-center shrink-0">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <span className="block font-semibold text-ink text-sm mt-3 leading-snug">
                          {skill.name}
                        </span>
                        <span className="block text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                          {skill.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ---- STEP 3: Curiosity Passions ---- */}
              <section>
                <StepHeading
                  step={3}
                  title="What are you curious about?"
                  hint="Choose 1 or 2 worlds you'd happily fall down a rabbit hole in."
                  done={selectedInterests.length > 0}
                  counter={`${selectedInterests.length}/2`}
                />

                <div className="sm:pl-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {INTERESTS_DATA.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    const isMaxed = !isSelected && selectedInterests.length >= 2;
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`pick p-4 flex items-center gap-3 ${isSelected ? 'pick-on' : ''} ${
                          isMaxed ? 'opacity-45' : ''
                        }`}
                      >
                        <span className="text-2xl shrink-0">{interest.emoji}</span>
                        <span className="font-semibold text-ink text-sm leading-snug min-w-0 truncate">
                          {interest.name.split('&')[0]}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-brand text-white grid place-items-center shrink-0 ml-auto">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ---- STEP 4: Impact Persona ---- */}
              <section>
                <StepHeading
                  step={4}
                  title="How do you want to make impact?"
                  hint="There's no wrong answer — pick the one that sounds most like you."
                  done={personaChosen}
                />

                <div className="sm:pl-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WORK_STYLES.map((style) => {
                    const isSelected = selectedWorkStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => { playClickSound(); setSelectedWorkStyle(style.id); setPersonaChosen(true); }}
                        className={`pick p-4 flex items-start gap-3.5 ${isSelected ? 'pick-on' : ''}`}
                      >
                        <span className="text-2xl shrink-0">{style.emoji}</span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink text-sm leading-snug">
                            {style.title.replace('The ', '')}
                          </span>
                          <span className="block text-xs text-muted mt-1 leading-relaxed">
                            {style.tagline}
                          </span>
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-brand text-white grid place-items-center shrink-0 ml-auto">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* ---- The moment: primary CTA ---- */}
            <div className="sticky bottom-6 mt-14 flex justify-center px-2">
              <div className="panel w-full sm:w-auto px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 shadow-lift">
                <p className="text-sm text-muted text-center sm:text-left">
                  {isReady ? (
                    <span className="font-medium text-ink">
                      {selectedSkills.length} superpower{selectedSkills.length === 1 ? '' : 's'}
                      {selectedInterests.length > 0 && ` · ${selectedInterests.length} passion${selectedInterests.length === 1 ? '' : 's'}`} locked in
                    </span>
                  ) : (
                    'Add your name and at least one superpower'
                  )}
                </p>
                <button
                  id="btn-generate-passport"
                  disabled={!isReady}
                  onClick={handleGeneratePassport}
                  className="btn btn-primary w-full sm:w-auto px-7 py-3.5 text-base"
                >
                  ✨ Reveal My Career Matches
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============ THE REVEAL ============ */
          passportData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12"
            >
              {/* Passport identity */}
              <section className="panel p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <span className="w-16 h-16 rounded-3xl bg-brand-tint grid place-items-center text-4xl shrink-0">
                      {passportData.teenAvatar}
                    </span>
                    <div>
                      <p className="eyebrow">Official Passport · {passportData.passportId}</p>
                      <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-1.5">
                        {passportData.teenName}
                      </h2>
                      <p className="meta mt-1">
                        {passportData.generatedDate} · Absa Future Ready 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="btn-print-certificate"
                      onClick={() => topCareer && onOpenCertificate(passportData, topCareer)}
                      className="btn btn-primary px-5 py-3 text-sm"
                    >
                      <Award className="w-4 h-4" />
                      <span>Print Certificate</span>
                    </button>

                    <button
                      id="btn-reconfigure-passport"
                      onClick={resetWizard}
                      className="btn btn-quiet px-4 py-3 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Summary — plain data, no boxes */}
                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 mt-8 pt-7 border-t border-line">
                  <div>
                    <dt className="eyebrow">Superpowers</dt>
                    <dd className="text-sm font-semibold text-ink mt-1.5">
                      {selectedSkills.map((s) => SKILLS_DATA.find((sk) => sk.id === s)?.name.split(' ')[0]).join(', ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Passions</dt>
                    <dd className="text-sm font-semibold text-ink mt-1.5">
                      {selectedInterests.map((i) => INTERESTS_DATA.find((int) => int.id === i)?.name.split('&')[0].trim()).join(', ') || 'General'}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Impact Persona</dt>
                    <dd className="text-sm font-semibold text-ink mt-1.5">
                      {WORK_STYLES.find((w) => w.id === selectedWorkStyle)?.title.replace('The ', '')}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Readiness</dt>
                    <dd className="text-sm font-semibold text-grass mt-1.5">High Potential ✓</dd>
                  </div>
                </dl>
              </section>

              {/* Top matches */}
              <section>
                <div className="flex items-baseline justify-between gap-4 mb-5">
                  <h3 className="text-2xl font-bold text-ink">Your top career synergies</h3>
                  <span className="meta shrink-0">AI compatibility</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rankedMatches.slice(0, 3).map((item, index) => {
                    const career = item.career;
                    const isTopRank = index === 0;

                    return (
                      <motion.div
                        key={career.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                        className={`panel p-5 flex flex-col ${isTopRank ? 'ring-2 ring-brand' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-lg font-bold ${isTopRank ? 'text-brand' : 'text-ink'}`}>
                            {item.compatibility}%
                          </span>
                          {isTopRank && (
                            <span className="text-[11px] font-semibold text-brand bg-brand-tint px-2.5 py-1 rounded-full">
                              Top match
                            </span>
                          )}
                        </div>

                        <h4 className="font-semibold text-ink text-base mt-3 leading-snug">
                          {career.title}
                        </h4>
                        <p className="meta mt-1">{career.absaPillar}</p>

                        <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-3 flex-1">
                          {career.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {career.requiredSkillIds.map((sId) => {
                            const s = SKILLS_DATA.find((sk) => sk.id === sId);
                            const isMatched = selectedSkills.includes(sId);
                            return (
                              <span
                                key={sId}
                                className={`text-[11px] px-2 py-1 rounded-full font-medium ${
                                  isMatched ? 'bg-grass-tint text-grass' : 'bg-sunken text-muted'
                                }`}
                              >
                                {s?.name.split(' ')[0]}{isMatched ? ' ✓' : ''}
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
                          <span className="meta">{career.salaryTier.split(' ')[0]}</span>
                          <button
                            onClick={() => onOpenCareerDetails(career)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all"
                          >
                            <span>Explore</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Starter kit */}
              {topCareer && (
                <section className="panel p-6 sm:p-8">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-brand shrink-0" />
                    <h3 className="text-xl font-bold text-ink">
                      High school starter kit
                    </h3>
                  </div>
                  <p className="text-sm text-muted mt-1.5">
                    What to do today to head towards <span className="font-semibold text-ink">{topCareer.title}</span>.
                  </p>

                  <ol className="mt-6 space-y-4 max-w-3xl">
                    {topCareer.teenActionSteps.map((stepItem, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-brand-tint text-brand text-xs font-semibold grid place-items-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-sm sm:text-base text-ink leading-relaxed pt-0.5">
                          {stepItem}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <p className="meta mt-8 pt-6 border-t border-line">
                    Absa Future Ready Teens · Skill-First Career Blueprint
                  </p>
                </section>
              )}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};
