import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award,
  Users,
  Compass,
  Play
} from 'lucide-react';
import { SCENARIO_QUESTS, SKILLS_DATA } from '../data/gameData';
import { ScenarioQuest } from '../types';
import { playClickSound, playFanfare, playMatchError, playMatchSuccess } from '../utils/audio';

interface ScenarioQuestsViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const ScenarioQuestsView: React.FC<ScenarioQuestsViewProps> = ({
  onEarnXp,
  onUnlockBadge,
}) => {
  const [activeQuestId, setActiveQuestId] = useState<string>(SCENARIO_QUESTS[0].id);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<'idle' | 'success' | 'partial'>('idle');
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const currentQuest = SCENARIO_QUESTS.find((q) => q.id === activeQuestId) || SCENARIO_QUESTS[0];

  const handleSelectQuest = (questId: string) => {
    playClickSound();
    setActiveQuestId(questId);
    setSelectedSkillIds([]);
    setSimResult('idle');
  };

  const handleToggleSkill = (skillId: string) => {
    if (simResult === 'success') return;
    playClickSound();

    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
      if (simResult === 'partial') setSimResult('idle');
    } else {
      if (selectedSkillIds.length < currentQuest.minRequired) {
        setSelectedSkillIds([...selectedSkillIds, skillId]);
      }
    }
  };

  const handleRunSimulation = () => {
    if (selectedSkillIds.length < currentQuest.minRequired) return;

    setIsSimulating(true);
    playClickSound();

    setTimeout(() => {
      setIsSimulating(false);
      const isPerfectMatch = currentQuest.correctSkillIds.every((id) => selectedSkillIds.includes(id));

      if (isPerfectMatch) {
        playMatchSuccess();
        playFanfare();
        setSimResult('success');

        if (!completedQuests.includes(currentQuest.id)) {
          setCompletedQuests([...completedQuests, currentQuest.id]);
          onEarnXp(currentQuest.xpReward, `Completed Quest: ${currentQuest.title}`);

          if (currentQuest.id === 'quest-cyber-defense') {
            onUnlockBadge('badge-cyber-sentinel');
          } else if (currentQuest.id === 'quest-community-solar' || currentQuest.id === 'quest-agri-wallet') {
            onUnlockBadge('badge-eco-warrior');
          }
        }

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#DC0032', '#FFB800', '#16A34A']
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        playMatchError();
        setSimResult('partial');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-[#DC0032]">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Future Scenario Missions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            Step into real-world challenges. Assemble multidisciplinary skill squads to deploy game-changing solutions!
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{completedQuests.length} of {SCENARIO_QUESTS.length} Quests Solved</span>
        </div>
      </div>

      {/* Quest Selection Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCENARIO_QUESTS.map((quest) => {
          const isActive = quest.id === activeQuestId;
          const isDone = completedQuests.includes(quest.id);

          return (
            <button
              key={quest.id}
              onClick={() => handleSelectQuest(quest.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-[#DC0032] bg-rose-50/40 shadow-xs'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC0032] bg-white px-2 py-0.5 rounded-md border border-rose-200">
                    {quest.targetIndustry.split('&')[0]}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solved
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-2 leading-tight">
                  {quest.title.replace('Mission: ', '')}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-700">
                <span>+{quest.xpReward} XP</span>
                <span className="text-[#DC0032] font-semibold">{isActive ? 'Active Mission' : 'Select'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Quest Mission Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Mission Briefing (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#2E000C] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#DC0032] text-white px-2.5 py-1 rounded-full">
                MISSION BRIEFING
              </span>
              <div className="flex items-center gap-1 text-xs text-rose-200">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentQuest.contextLocation}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentQuest.title}
              </h3>
              <p className="text-xs sm:text-sm text-rose-200/90 italic mt-1 font-medium">
                "{currentQuest.tagline}"
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-xs sm:text-sm text-rose-50 leading-relaxed space-y-2 backdrop-blur-xs">
              <p>{currentQuest.challengeBrief}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-rose-200 bg-white/5 p-3 rounded-xl border border-white/5">
              <span>Required Squad Size:</span>
              <strong className="text-white font-bold">{currentQuest.minRequired} Core Skills</strong>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 text-xs text-rose-200/80">
            Absa Future Ready Teens • Challenge Engine
          </div>
        </div>

        {/* Right: Squad Assembly & Interactive Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Selected Squad Slots */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#DC0032]" />
                <span>Your Multidisciplinary Squad Slots</span>
              </h4>
              <span className="text-xs text-slate-700">
                {selectedSkillIds.length} of {currentQuest.minRequired} filled
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((slotIdx) => {
                const sId = selectedSkillIds[slotIdx];
                const skill = SKILLS_DATA.find((s) => s.id === sId);

                return (
                  <div
                    key={slotIdx}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                      skill
                        ? 'bg-rose-50/50 border-[#DC0032] shadow-xs'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {skill ? (
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-[#DC0032] font-semibold block mt-1 uppercase">
                          {skill.category.replace('_', ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold">Slot {slotIdx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Skill Cards to Choose From */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Available Candidate Superpowers:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuest.availableSkillIds.map((sId) => {
                const skill = SKILLS_DATA.find((s) => s.id === sId);
                if (!skill) return null;
                const isSelected = selectedSkillIds.includes(sId);

                return (
                  <div
                    key={sId}
                    onClick={() => handleToggleSkill(sId)}
                    className={`cursor-pointer rounded-2xl border-2 p-3.5 transition-all select-none flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#DC0032] bg-rose-50/60 shadow-xs scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase text-white"
                          style={{ backgroundColor: skill.color }}
                        >
                          {skill.category.replace('_', ' ')}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#DC0032] text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5">
                        {skill.name}
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {skill.tagline}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger / Simulation Button */}
          <div className="flex items-center gap-3">
            <button
              id="btn-run-simulation"
              disabled={selectedSkillIds.length < currentQuest.minRequired || isSimulating}
              onClick={handleRunSimulation}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all ${
                selectedSkillIds.length >= currentQuest.minRequired && !isSimulating
                  ? 'bg-[#DC0032] text-white hover:bg-[#B40026] shadow-red-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating Squad Solution...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Deploy & Run Simulation (+{currentQuest.xpReward} XP)</span>
                </>
              )}
            </button>

            {simResult !== 'idle' && (
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedSkillIds([]);
                  setSimResult('idle');
                }}
                className="p-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Reset squad selection"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Simulation Outcome Card */}
          {simResult === 'success' && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-md animate-in zoom-in-95 duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-2xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-bold text-emerald-900">
                    Mission Accomplished! Squad Synergy Unlocked
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    {currentQuest.explanation}
                  </p>
                  <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                    {currentQuest.impactQuote}
                  </div>
                  <div className="pt-2 text-xs font-bold text-emerald-900">
                    Unlocked Future Career Archetype: <span className="underline">{currentQuest.unlockedCareerTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {simResult === 'partial' && (
            <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-200">
              <div className="p-1.5 bg-rose-500 text-white rounded-xl shrink-0 mt-0.5">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-900">
                  Sub-Optimal Squad Combination
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  The solution struggled because it lacked one of the vital technical, commercial, or creative pillars needed to deliver end-to-end impact. Adjust your squad and test again!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
