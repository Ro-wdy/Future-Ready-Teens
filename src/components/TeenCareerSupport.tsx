import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  ChevronDown,
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

const SUBJECT_CLUSTERS = [
  {
    emoji: '🩺',
    title: 'Medicine & Life Sciences',
    essential: 'Biology, Chemistry, Math, Physics.',
    careers: 'Surgeon, Biomedical Scientist, Pediatrician.',
  },
  {
    emoji: '✈️',
    title: 'Aviation & Engineering',
    essential: 'Physics, Pure Math, Geography, Computer Studies.',
    careers: 'Airline Pilot, EV Engineer, Robotics Specialist.',
  },
  {
    emoji: '⚖️',
    title: 'Law & Public Policy',
    essential: 'History & Govt, English/Literature, Social Studies.',
    careers: 'Constitutional Lawyer, Diplomat, Advocate.',
  },
  {
    emoji: '💳',
    title: 'FinTech & Banking',
    essential: 'Math, Business Studies, Economics, Computer.',
    careers: 'FinTech Product Manager, Investment Analyst.',
  },
  {
    emoji: '🎨',
    title: 'Creative Media & Design',
    essential: 'Art & Design, Literature, Music, Computer.',
    careers: 'Film Director, Sustainable Architect, UI/UX Designer.',
  },
  {
    emoji: '🌾',
    title: 'AgriTech & Food Science',
    essential: 'Agriculture, Biology, Home Science, Geography.',
    careers: 'AgriTech Specialist, Executive Chef, Food Scientist.',
  },
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

  const SECTIONS: { id: 'catalog' | 'subjects' | 'faq'; label: string }[] = [
    { id: 'catalog', label: `Career Catalog · ${CAREERS_DATA.length}` },
    { id: 'subjects', label: 'Subject Guide' },
    { id: 'faq', label: 'Advisory FAQ' },
  ];

  return (
    <div className="space-y-10">
      {/* ---- Hero ---- */}
      <div className="max-w-3xl">
        <p className="eyebrow">Absa Teen Career Support Hub</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mt-3 leading-[1.1]">
          Careers are built from skills,
          <br className="hidden sm:block" /> not job titles.
        </h2>
        <p className="text-base sm:text-lg text-muted mt-4 leading-relaxed">
          Explore {CAREERS_DATA.length}+ career roadmaps across Medicine, Aviation, Law, Tech, Arts,
          Agriculture and Sports — with the exact school subjects you'll need.
        </p>
      </div>

      {/* ---- Section switcher ---- */}
      <div className="seg overflow-x-auto scrollbar-none max-w-full">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => { playClickSound(); setActiveTabSection(s.id); }}
            className={`seg-item ${activeTabSection === s.id ? 'seg-item-on' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ================= CATALOG ================= */}
      {activeTabSection === 'catalog' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Search + result count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-faint absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any career — Doctor, Pilot, Lawyer, AI, Chef, Architect…"
                className="field pl-11 pr-10 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full grid place-items-center text-faint hover:text-ink hover:bg-line transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="meta shrink-0 sm:pl-2">
              <span className="font-semibold text-ink tabular-nums">{filteredCareers.length}</span> careers
            </p>
          </div>

          {/* Skill filter — quiet chips, red only when active */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="meta">Filter by a strength you already have</p>
              {selectedSkillFilter && (
                <button
                  onClick={() => setSelectedSkillFilter(null)}
                  className="text-xs font-semibold text-brand hover:underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
              {SKILLS_DATA.map((skill) => {
                const isActive = selectedSkillFilter === skill.id;
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSelectSkillPill(skill.id)}
                    className={`chip flex items-center gap-2 shrink-0 ${isActive ? 'chip-brand-on' : ''}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isActive ? '#FFFFFF' : skill.color }}
                    />
                    <span>{skill.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pillar filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 border-t border-line pt-5 sm:flex-wrap sm:overflow-visible">
            {PILLARS.map((p) => {
              const isSelected = selectedPillar === p.value;
              return (
                <button
                  key={p.label}
                  onClick={() => { playClickSound(); setSelectedPillar(p.value); }}
                  className={`chip flex items-center gap-2 shrink-0 ${isSelected ? 'chip-on' : ''}`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Career grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCareers.map((career) => (
                <motion.button
                  key={career.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => onOpenCareerDetails(career)}
                  className="panel p-5 text-left flex flex-col hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="meta">{career.absaPillar}</span>
                    <span className="text-[11px] font-medium text-grass bg-grass-tint px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                      {career.futureOutlook}
                    </span>
                  </div>

                  <h4 className="font-semibold text-ink text-lg mt-3 leading-snug group-hover:text-brand transition-colors">
                    {career.title}
                  </h4>
                  <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                    {career.tagline}
                  </p>

                  <div className="mt-4 space-y-2.5 flex-1">
                    <p className="text-xs text-muted">
                      <span className="text-faint">Superpowers · </span>
                      {career.requiredSkillIds
                        .map((sId) => SKILLS_DATA.find((sk) => sk.id === sId)?.name.split(' ')[0])
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    {career.subjectsNeeded && (
                      <p className="text-xs text-muted">
                        <span className="text-faint">Subjects · </span>
                        {career.subjectsNeeded.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
                    <span className="meta">{career.salaryTier.split(' ')[0]} tier</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
                      Roadmap
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {filteredCareers.length === 0 && (
            <div className="text-center py-20">
              <span className="text-4xl">🔍</span>
              <h4 className="text-lg font-semibold text-ink mt-4">No careers match that search</h4>
              <p className="text-sm text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                Try clearing your search or switching back to "All Careers" to see every pathway.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedPillar('All'); setSelectedSkillFilter(null); }}
                className="btn btn-primary px-5 py-3 text-sm mt-6"
              >
                Reset filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ================= SUBJECT GUIDE ================= */}
      {activeTabSection === 'subjects' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-ink">
              High school subject combinations
            </h3>
            <p className="text-base text-muted mt-2 leading-relaxed">
              KCSE / IGCSE / High School — match your elective subjects to the career cluster you're aiming at.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SUBJECT_CLUSTERS.map((cluster) => (
              <div key={cluster.title} className="panel p-6">
                <span className="text-3xl">{cluster.emoji}</span>
                <h4 className="font-semibold text-ink text-lg mt-3">{cluster.title}</h4>
                <div className="mt-4 space-y-2.5 text-sm">
                  <p className="text-ink leading-relaxed">
                    <span className="text-faint">Essential · </span>{cluster.essential}
                  </p>
                  <p className="text-muted leading-relaxed">
                    <span className="text-faint">Careers · </span>{cluster.careers}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ================= FAQ ================= */}
      {activeTabSection === 'faq' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-8 max-w-3xl"
        >
          <div>
            <h3 className="text-2xl font-bold text-ink">
              Questions teens actually ask
            </h3>
            <p className="text-base text-muted mt-2 leading-relaxed">
              Answers from Absa career mentors to help you navigate high school and university decisions.
            </p>
          </div>

          <div className="divide-y divide-line border-t border-b border-line">
            {TEEN_CAREER_FAQS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div key={index}>
                  <button
                    onClick={() => { playClickSound(); setActiveFaqIndex(isOpen ? null : index); }}
                    className="w-full py-5 text-left flex items-start justify-between gap-4 group"
                  >
                    <span className={`text-base font-semibold leading-snug transition-colors ${isOpen ? 'text-brand' : 'text-ink group-hover:text-brand'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-faint shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-9 space-y-3">
                          <p className="text-base text-muted leading-relaxed">{faq.a}</p>
                          <p className="eyebrow">{faq.category}</p>
                        </div>
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
