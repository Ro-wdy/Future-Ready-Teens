import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Zap,
  Briefcase,
  SlidersHorizontal
} from 'lucide-react';
import { SKILLS_DATA, CAREERS_DATA } from '../data/gameData';
import { CareerMatch, AbsaPillar } from '../types';
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

  return (
    <div className="space-y-4">
      {/* View Title & Core Philosophy */}
      <div className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-50 text-[#DC0032]">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                The Skill-to-Career Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-700 mt-0.5 max-w-3xl">
              Job titles evolve, but <strong className="text-slate-900 font-semibold">transferable skills</strong> empower you for life. Select skills below to filter career pathways.
            </p>
          </div>

          {/* Quick Clear Button */}
          {(activeSkills.length > 0 || selectedPillar !== 'all' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors self-start md:self-auto active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search & Pillar Filters */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pathways, skills, or roles..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 focus:border-[#DC0032] text-xs font-medium outline-hidden"
            />
          </div>

          {/* Pillar Horizontal Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full pb-0.5 scrollbar-none">
            {pillarsList.map((p) => (
              <button
                key={p}
                onClick={() => { playClickSound(); setSelectedPillar(p); }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors active:scale-95 ${
                  selectedPillar === p
                    ? 'bg-[#DC0032] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'all' ? 'All Disciplines' : p.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Skill Selector Grid */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Tap Skills to Filter ({activeSkills.length} selected):
            </h3>
          </div>
          {activeSkills.length > 0 && (
            <button
              onClick={() => setActiveSkills([])}
              className="text-[11px] text-amber-300 underline font-semibold hover:text-amber-200 self-start"
            >
              Clear Skills
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
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border select-none active:scale-95 ${
                  isSelected
                    ? 'bg-[#DC0032] text-white border-red-500 shadow-sm scale-102'
                    : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
                <span>{skill.name}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Career Matrix Grid Output */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#DC0032]" />
            <span>Matching Pathways ({filteredCareers.length})</span>
          </h3>
          <span className="text-[11px] text-slate-600 font-medium">
            {activeSkills.length > 0 ? 'Sorted by Skill Synergy' : 'All Inclusive Pathways'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
          {filteredCareers.map(({ career, matchRatio, matchingSkillsCount }) => {
            const isFullMatch = activeSkills.length > 0 && matchRatio === 100;
            const isPartialMatch = activeSkills.length > 0 && matchRatio > 0 && matchRatio < 100;

            return (
              <div
                key={career.id}
                className={`bg-white rounded-2xl border-2 p-3.5 transition-all flex flex-col justify-between relative overflow-hidden ${
                  isFullMatch
                    ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/10'
                    : isPartialMatch
                    ? 'border-amber-400 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase bg-rose-50 text-[#DC0032] border border-rose-200 truncate max-w-[130px]">
                      {career.absaPillar}
                    </span>
                    {activeSkills.length > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                        isFullMatch 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isPartialMatch 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {matchRatio}% Match
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-2 leading-snug">
                    {career.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {career.tagline}
                  </p>

                  {/* Required Skills Checklist */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSkillIds.map((sId) => {
                        const s = SKILLS_DATA.find((sk) => sk.id === sId);
                        const isSkillActive = activeSkills.includes(sId);
                        return (
                          <span
                            key={sId}
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5 ${
                              isSkillActive
                                ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s?.name.split(' ')[0]} {isSkillActive ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-[90px]">
                    ⚡ {career.futureOutlook}
                  </span>
                  <button
                    onClick={() => onOpenCareerDetails(career)}
                    className="text-xs font-bold text-[#DC0032] hover:underline flex items-center gap-0.5"
                  >
                    <span>Blueprint</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
