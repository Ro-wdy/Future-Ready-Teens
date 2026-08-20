import React, { useState } from 'react';
import { Search, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { SKILLS_DATA, CAREERS_DATA } from '../data/gameData';
import { CareerMatch } from '../types';
import { playClickSound } from '../utils/audio';

interface SkillCareerMatrixViewProps {
  onOpenCareerDetails: (career: CareerMatch) => void;
}

export const SkillCareerMatrixView: React.FC<SkillCareerMatrixViewProps> = ({
  onOpenCareerDetails,
}) => {
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleSkill = (skillId: string) => {
    playClickSound();
    if (activeSkills.includes(skillId)) {
      setActiveSkills(activeSkills.filter((id) => id !== skillId));
    } else {
      setActiveSkills([...activeSkills, skillId]);
    }
  };

  const clearFilters = () => {
    playClickSound();
    setActiveSkills([]);
    setSelectedPillar('all');
    setSearchQuery('');
  };

  // Filter careers and calculate match score based on selected active skills
  const filteredCareers = CAREERS_DATA.filter((career) => {
    if (selectedPillar !== 'all' && career.absaPillar !== selectedPillar) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = career.title.toLowerCase().includes(q);
      const matchTag = career.tagline.toLowerCase().includes(q);
      const matchPillar = career.absaPillar.toLowerCase().includes(q);
      if (!matchTitle && !matchTag && !matchPillar) return false;
    }
    return true;
  }).map((career) => {
    if (activeSkills.length === 0) {
      return { career, matchRatio: 100, matchingSkillsCount: 0 };
    }
    const matched = career.requiredSkillIds.filter((id) => activeSkills.includes(id));
    const ratio = Math.round((matched.length / career.requiredSkillIds.length) * 100);
    return { career, matchRatio: ratio, matchingSkillsCount: matched.length };
  }).sort((a, b) => b.matchRatio - a.matchRatio);

  const pillarsList = [
    'all',
    'Health, Biotech & Medicine',
    'Aviation, Engineering & Trades',
    'Digital & FinTech',
    'Sustainability & Green Economy',
    'Creative, Media & Arts',
    'Trust, Law & Governance',
    'Modern Agriculture & Food',
    'Education, Sports & Wellness',
  ];

  const hasFilters = activeSkills.length > 0 || selectedPillar !== 'all' || !!searchQuery;

  return (
    <div className="space-y-10">
      {/* ---- Intro ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="eyebrow">Skill-to-Career Matrix</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3 leading-[1.1]">
            Pick your skills. Watch careers appear.
          </h2>
          <p className="text-base text-muted mt-3 leading-relaxed">
            Job titles evolve, but <span className="font-semibold text-ink">transferable skills</span> stay
            with you for life. Tap the ones you have to see where they can take you.
          </p>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="btn btn-quiet px-4 py-2.5 text-sm self-start shrink-0">
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ---- Skill selector ---- */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="meta">
            Tap skills to filter
            {activeSkills.length > 0 && (
              <span className="text-brand font-semibold"> · {activeSkills.length} selected</span>
            )}
          </p>
          {activeSkills.length > 0 && (
            <button
              onClick={() => setActiveSkills([])}
              className="text-xs font-semibold text-brand hover:underline shrink-0"
            >
              Clear skills
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SKILLS_DATA.map((skill) => {
            const isSelected = activeSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`chip flex items-center gap-2 ${isSelected ? 'chip-brand-on' : ''}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : skill.color }}
                />
                <span>{skill.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Search + discipline ---- */}
      <div className="border-t border-line pt-6 space-y-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pathways, skills, or roles…"
            className="field pl-11 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
          {pillarsList.map((p) => (
            <button
              key={p}
              onClick={() => { playClickSound(); setSelectedPillar(p); }}
              className={`chip shrink-0 ${selectedPillar === p ? 'chip-on' : ''}`}
            >
              {p === 'all' ? 'All Disciplines' : p.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Results ---- */}
      <div>
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h3 className="text-xl font-bold text-ink">
            Matching pathways <span className="text-faint font-medium tabular-nums">{filteredCareers.length}</span>
          </h3>
          <span className="meta shrink-0">
            {activeSkills.length > 0 ? 'Sorted by skill synergy' : 'All inclusive pathways'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
          {filteredCareers.map(({ career, matchRatio }) => {
            const isFullMatch = activeSkills.length > 0 && matchRatio === 100;
            const isPartialMatch = activeSkills.length > 0 && matchRatio > 0 && matchRatio < 100;

            return (
              <button
                key={career.id}
                onClick={() => onOpenCareerDetails(career)}
                className={`panel p-5 text-left flex flex-col hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 group ${
                  isFullMatch ? 'ring-2 ring-grass' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="meta">{career.absaPillar}</span>
                  {activeSkills.length > 0 && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        isFullMatch
                          ? 'bg-grass-tint text-grass'
                          : isPartialMatch
                          ? 'bg-gold-tint text-gold'
                          : 'bg-sunken text-faint'
                      }`}
                    >
                      {matchRatio}%
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-ink text-lg mt-3 leading-snug group-hover:text-brand transition-colors">
                  {career.title}
                </h4>

                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2 flex-1">
                  {career.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {career.requiredSkillIds.map((sId) => {
                    const s = SKILLS_DATA.find((sk) => sk.id === sId);
                    const isSkillActive = activeSkills.includes(sId);
                    return (
                      <span
                        key={sId}
                        className={`text-[11px] px-2 py-1 rounded-full font-medium ${
                          isSkillActive ? 'bg-grass-tint text-grass' : 'bg-sunken text-muted'
                        }`}
                      >
                        {s?.name.split(' ')[0]}{isSkillActive ? ' ✓' : ''}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
                  <span className="meta truncate">{career.futureOutlook}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all shrink-0">
                    Blueprint
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
