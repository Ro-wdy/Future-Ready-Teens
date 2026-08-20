import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Filter
} from 'lucide-react';
import { CAREERS_DATA, SKILLS_DATA, TEEN_CAREER_FAQS } from '../data/gameData';
import { CareerMatch, AbsaPillar } from '../types';
import { playClickSound } from '../utils/audio';

interface TeenCareerSupportProps {
  onOpenCareerDetails: (career: CareerMatch) => void;
  onEarnXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

const PILLARS: { label: string; value: AbsaPillar | 'All'; icon: string }[] = [
  { label: 'All Careers', value: 'All', icon: '🌟' },
  { label: 'Health & Medicine', value: 'Health, Biotech & Medicine', icon: '🩺' },
  { label: 'Aviation & Engineering', value: 'Aviation, Engineering & Trades', icon: '✈️' },
  { label: 'FinTech & Banking', value: 'Digital & FinTech', icon: '💳' },
  { label: 'Sustainability & Green', value: 'Sustainability & Green Economy', icon: '🌱' },
  { label: 'Creative, Media & Arts', value: 'Creative, Media & Arts', icon: '🎨' },
  { label: 'Law & Governance', value: 'Trust, Law & Governance', icon: '⚖️' },
  { label: 'Agriculture & Food', value: 'Modern Agriculture & Food', icon: '🌾' },
  { label: 'Sports & Education', value: 'Education, Sports & Wellness', icon: '🏃🏽' },
];

export const TeenCareerSupport: React.FC<TeenCareerSupportProps> = ({
  onOpenCareerDetails,
  onEarnXp,
  onUnlockBadge,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPillar, setSelectedPillar] = useState<AbsaPillar | 'All'>('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [activeTabSection, setActiveTabSection] = useState<'catalog' | 'subjects' | 'faq'>('catalog');

  // Filter careers based on search, pillar, and skill
  const filteredCareers = CAREERS_DATA.filter((career) => {
    const matchesSearch = 
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPillar = selectedPillar === 'All' || career.absaPillar === selectedPillar;

    const matchesSkill = !selectedSkillFilter || career.requiredSkillIds.includes(selectedSkillFilter);

    return matchesSearch && matchesPillar && matchesSkill;
  });

  const handleSelectSkillPill = (skillId: string) => {
    playClickSound();
    if (selectedSkillFilter === skillId) {
      setSelectedSkillFilter(null);
    } else {
      setSelectedSkillFilter(skillId);
      onEarnXp(50, 'Filtered careers by skill superpower');
      onUnlockBadge('badge-support-pioneer');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner: Compact & Impactful */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-r from-[#4A0017] via-[#2E000C] to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-lg relative overflow-hidden border border-rose-900/30"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#DC0032] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>Absa Teen Career Support Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-black tracking-tight text-white">
              Discover Inclusive Careers Built from Real Skills
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 font-medium leading-normal">
              Explore 16+ career roadmaps across Medicine, Aviation, Law, Tech, Arts, Agriculture, and Sports with exact school subjects needed.
            </p>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-xs shrink-0">
            <button
              onClick={() => { playClickSound(); setActiveTabSection('catalog'); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTabSection === 'catalog'
                  ? 'bg-[#DC0032] text-white shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Career Catalog ({CAREERS_DATA.length})
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTabSection('subjects'); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTabSection === 'subjects'
                  ? 'bg-[#DC0032] text-white shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Subject Guide
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTabSection('faq'); }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTabSection === 'faq'
                  ? 'bg-[#DC0032] text-white shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Teen Advisory FAQ
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: CAREER CATALOG & 1-CLICK SKILL FILTER */}
      {activeTabSection === 'catalog' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Quick 1-Click Skill Recommender Chips */}
          <div className="bg-white rounded-2xl border border-rose-100 p-3.5 sm:p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#DC0032]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  1-Click Skill Filter: Tap a strength to filter careers
                </h3>
              </div>
              {selectedSkillFilter && (
                <button
                  onClick={() => setSelectedSkillFilter(null)}
                  className="text-[11px] font-bold text-[#DC0032] hover:underline self-start"
                >
                  Clear filter (Showing all)
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SKILLS_DATA.map((skill) => {
                const isActive = selectedSkillFilter === skill.id;
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSelectSkillPill(skill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-[#DC0032] text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isActive ? '#FFFFFF' : skill.color }} 
                    />
                    <span>{skill.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar & Pillar Categories */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any career (e.g. Doctor, Pilot, Lawyer, AI, Chef, Architect)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-medium focus:border-[#DC0032] focus:ring-2 focus:ring-rose-500/20 outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl whitespace-nowrap shrink-0">
              Showing <span className="text-[#DC0032] font-black">{filteredCareers.length}</span> Careers
            </div>
          </div>

          {/* Pillar Filters Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {PILLARS.map((p) => {
              const isSelected = selectedPillar === p.value;
              return (
                <button
                  key={p.label}
                  onClick={() => { playClickSound(); setSelectedPillar(p.value); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Inclusive Career Cards Responsive Large Screen Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-3.5">
            <AnimatePresence mode="popLayout">
              {filteredCareers.map((career) => (
                <motion.div
                  key={career.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-rose-300 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Pillar & Outlook Header */}
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#DC0032] px-2 py-0.5 rounded-md truncate max-w-[150px]">
                        {career.absaPillar}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                        ★ {career.futureOutlook}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#DC0032] transition-colors leading-snug">
                      {career.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {career.tagline}
                    </p>

                    {/* Core Skills Badges */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                        Core Superpowers:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {career.requiredSkillIds.map((sId) => {
                          const s = SKILLS_DATA.find((sk) => sk.id === sId);
                          return (
                            <span
                              key={sId}
                              className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md"
                            >
                              {s?.name.split(' ')[0]}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* High School Subjects Needed */}
                    {career.subjectsNeeded && (
                      <div className="mt-2">
                        <span className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                          Key High School Subjects:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {career.subjectsNeeded.map((sub, i) => (
                            <span key={i} className="text-[9px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Compensation & Explore Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">
                      {career.salaryTier.split(' ')[0]} tier
                    </span>

                    <button
                      onClick={() => onOpenCareerDetails(career)}
                      className="flex items-center gap-1 text-xs font-bold text-[#DC0032] group-hover:translate-x-0.5 transition-transform bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg"
                    >
                      <span>Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCareers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <span className="text-3xl">🔍</span>
              <h4 className="text-sm font-bold text-slate-800">No careers found matching your search</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting "All Careers" to view all available pathways.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedPillar('All'); setSelectedSkillFilter(null); }}
                className="px-4 py-2 rounded-xl bg-[#DC0032] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* SECTION 2: HIGH SCHOOL SUBJECT SELECTION GUIDE */}
      {activeTabSection === 'subjects' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <GraduationCap className="w-5 h-5 text-[#DC0032]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                High School Subject Combinations (KCSE / IGCSE / High School)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Match your high-school elective subjects with your target career cluster:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩺</span>
                  <h4 className="font-bold text-slate-900 text-sm">Medicine & Life Sciences</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> Biology, Chemistry, Math, Physics.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> Surgeon, Biomedical Scientist, Pediatrician.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  <h4 className="font-bold text-slate-900 text-sm">Aviation & Engineering</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> Physics, Pure Math, Geography, Computer Studies.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> Airline Pilot, EV Engineer, Robotics Specialist.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <h4 className="font-bold text-slate-900 text-sm">Law & Public Policy</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> History & Govt, English/Literature, Social Studies.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> Constitutional Lawyer, Diplomat, Advocate.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <h4 className="font-bold text-slate-900 text-sm">FinTech & Banking</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> Math, Business Studies, Economics, Computer.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> FinTech Product Manager, Investment Analyst.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <h4 className="font-bold text-slate-900 text-sm">Creative Media & Design</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> Art & Design, Literature, Music, Computer.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> Film Director, Sustainable Architect, UI/UX Designer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌾</span>
                  <h4 className="font-bold text-slate-900 text-sm">AgriTech & Food Science</h4>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Essential:</strong> Agriculture, Biology, Home Science, Geography.
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Careers:</strong> AgriTech Specialist, Executive Chef, Food Scientist.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SECTION 3: TEEN CAREER ADVISORY FAQ */}
      {activeTabSection === 'faq' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-2xs space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-[#DC0032]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Frequently Asked Teen Career Questions
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-3">
            Answers from Absa career mentors to help you navigate high school and university decisions:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {TEEN_CAREER_FAQS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-white"
                >
                  <button
                    onClick={() => { playClickSound(); setActiveFaqIndex(isOpen ? null : index); }}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-2.5 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#DC0032]">Q{index + 1}.</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3.5 py-2.5 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100"
                      >
                        <p>{faq.a}</p>
                        <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md mt-1.5">
                          Category: {faq.category}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
