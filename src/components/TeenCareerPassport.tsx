import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Printer, 
  Award, 
  Compass, 
  RotateCcw,
  BookOpen,
  Target,
  UserCheck
} from 'lucide-react';
import { SKILLS_DATA, INTERESTS_DATA, CAREERS_DATA, WORK_STYLES } from '../data/gameData';
import { CareerMatch, TeenPassportData } from '../types';
import { playClickSound, playFanfare, playMatchSuccess } from '../utils/audio';

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

  return (
    <div className="space-y-5 max-w-6xl 2xl:max-w-[1600px] mx-auto">
      <AnimatePresence mode="wait">
        {!passportGenerated ? (
          /* STREAMLINED 1-PAGE EXPRESS DISCOVERY FORM */
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-6 shadow-xs space-y-5"
          >
            {/* Header */}
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC0032] uppercase tracking-wider bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>2-Step Express Match</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Build Your Teen Career Passport
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select your superpowers & passions to instantly unlock your career compatibility score.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-center">
                Fast Discovery
              </div>
            </div>

            {/* Split Grid for Large Screens: Left side (Identity & Skills), Right side (Passions, Impact & Launch) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column (6 cols): Identity & Superpowers */}
              <div className="lg:col-span-6 space-y-4">
                {/* SECTION A: Teen Name & Avatar */}
                <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Your Name / Nickname *
                    </label>
                    <input
                      id="input-teen-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name (e.g. Zawadi Kamau)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#DC0032] focus:ring-2 focus:ring-rose-500/20 outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Avatar Persona
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => { playClickSound(); setAvatar(av.emoji); }}
                          className={`p-2 rounded-xl text-lg sm:text-xl transition-all shrink-0 active:scale-90 ${
                            avatar === av.emoji
                              ? 'bg-[#DC0032] text-white shadow-xs scale-105'
                              : 'bg-white border border-slate-200 hover:border-slate-300'
                          }`}
                          title={av.label}
                        >
                          {av.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION B: Top 3 Superpowers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <span>1. Pick Top 3 Superpowers</span>
                      <span className="text-xs font-bold text-[#DC0032]">({selectedSkills.length}/3)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Tap to select</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {SKILLS_DATA.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => toggleSkill(skill.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between select-none relative active:scale-95 ${
                            isSelected
                              ? 'border-[#DC0032] bg-rose-50/70 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: skill.color }}
                            />
                            {isSelected && (
                              <span className="text-[10px] font-bold text-[#DC0032]">✓</span>
                            )}
                          </div>
                          <div className="mt-1">
                            <h4 className="font-bold text-slate-900 text-xs leading-tight">
                              {skill.name}
                            </h4>
                            <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                              {skill.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column (6 cols): Passions, Impact & Launch */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* SECTION C: Curiosity Domains */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                        <span>2. Pick 1-2 Curiosity Passions</span>
                        <span className="text-xs font-bold text-amber-700">({selectedInterests.length}/2)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
                      {INTERESTS_DATA.map((interest) => {
                        const isSelected = selectedInterests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 active:scale-95 ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className="text-xl">{interest.emoji}</span>
                            <div className="truncate">
                              <h4 className="font-bold text-slate-900 text-xs truncate">
                                {interest.name.split('&')[0]}
                              </h4>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION D: Impact Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider block">
                      3. Your Impact Persona
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                      {WORK_STYLES.map((style) => {
                        const isSelected = selectedWorkStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => { playClickSound(); setSelectedWorkStyle(style.id); }}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 active:scale-95 ${
                              isSelected
                                ? 'border-[#DC0032] bg-rose-50/60 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className="text-xl">{style.emoji}</span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs leading-tight">
                                {style.title.replace('The ', '')}
                              </h4>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Submit Launch Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-rose-50/40 p-3 rounded-2xl border border-rose-100">
                  <div className="text-xs text-slate-600 font-medium">
                    {name.trim() && selectedSkills.length > 0 ? (
                      <span className="text-emerald-700 font-bold">✓ Ready to generate passport</span>
                    ) : (
                      <span>Enter name & pick 1-3 superpowers</span>
                    )}
                  </div>

                  <button
                    id="btn-generate-passport"
                    disabled={!name.trim() || selectedSkills.length === 0}
                    onClick={handleGeneratePassport}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 ${
                      name.trim() && selectedSkills.length > 0
                        ? 'bg-[#DC0032] text-white hover:bg-[#B40026] shadow-red-500/20 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Passport</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* PASSPORT RESULTS VIEW */
          passportData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Identity Header Card */}
              <div className="bg-gradient-to-br from-[#4A0017] via-[#2E000C] to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden border border-rose-900/40">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
                      {passportData.teenAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#DC0032] text-white px-2 py-0.5 rounded-md">
                          OFFICIAL PASSPORT
                        </span>
                        <span className="text-xs text-rose-200 font-mono">
                          {passportData.passportId}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        {passportData.teenName}
                      </h2>
                      <p className="text-xs text-rose-200/80">
                        {passportData.generatedDate} • Absa Future Ready 2026
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-print-certificate"
                      onClick={() => topCareer && onOpenCertificate(passportData, topCareer)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <Award className="w-4 h-4 text-slate-950" />
                      <span>Print Certificate</span>
                    </button>

                    <button
                      id="btn-reconfigure-passport"
                      onClick={resetWizard}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs transition-colors active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Badges Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-200/80 block">Superpowers</span>
                    <span className="font-bold text-white">
                      {selectedSkills.map((s) => SKILLS_DATA.find((sk) => sk.id === s)?.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-200/80 block">Passions</span>
                    <span className="font-bold text-amber-200">
                      {selectedInterests.map((i) => INTERESTS_DATA.find((int) => int.id === i)?.name.split('&')[0]).join(', ') || 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-200/80 block">Impact Persona</span>
                    <span className="font-bold text-white">
                      {WORK_STYLES.find((w) => w.id === selectedWorkStyle)?.title.replace('The ', '')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-200/80 block">Readiness</span>
                    <span className="font-bold text-emerald-400">High Potential ✓</span>
                  </div>
                </div>
              </div>

              {/* TOP MATCHES & ACTION ROADMAP SIDE-BY-SIDE ON LARGE DISPLAYS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Top Matches (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#DC0032]" />
                      <span>Top Future Career Synergies</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      AI Compatibility
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {rankedMatches.slice(0, 3).map((item, index) => {
                      const career = item.career;
                      const isTopRank = index === 0;

                      return (
                        <div
                          key={career.id}
                          className={`rounded-2xl border-2 p-3.5 bg-white transition-all flex flex-col justify-between relative ${
                            isTopRank
                              ? 'border-[#DC0032] shadow-xs'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isTopRank && (
                            <span className="absolute top-0 right-0 bg-[#DC0032] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-bl-lg">
                              ★ Top Synergy
                            </span>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#DC0032]">
                                {item.compatibility}% Match
                              </span>
                              <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                                {career.absaPillar}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-1.5 leading-snug">
                              {career.title}
                            </h4>

                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {career.tagline}
                            </p>

                            {/* Skill Tags */}
                            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                              {career.requiredSkillIds.map((sId) => {
                                const s = SKILLS_DATA.find((sk) => sk.id === sId);
                                const isMatched = selectedSkills.includes(sId);
                                return (
                                  <span
                                    key={sId}
                                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
                                      isMatched
                                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {s?.name.split(' ')[0]} {isMatched ? '✓' : ''}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              {career.salaryTier.split(' ')[0]}
                            </span>
                            <button
                              onClick={() => onOpenCareerDetails(career)}
                              className="text-xs font-bold text-[#DC0032] hover:underline flex items-center gap-1"
                            >
                              <span>Explore</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* High School Roadmap for Top Match (5 cols) */}
                {topCareer && (
                  <div className="lg:col-span-5 bg-rose-50/70 border border-rose-200 rounded-3xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-[#DC0032]" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                          High School Starter Kit: <span className="text-[#DC0032]">{topCareer.title}</span>
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {topCareer.teenActionSteps.map((stepItem, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-2.5 border border-rose-100 text-xs flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#DC0032] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="font-medium text-slate-700 leading-normal">
                              {stepItem}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500 text-center font-medium">
                      Absa Future Ready Teens • Skill-First Career Blueprint
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};
