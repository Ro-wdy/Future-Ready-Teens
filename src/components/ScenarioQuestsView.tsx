import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Play,
} from 'lucide-react';
import { SCENARIO_QUESTS, SKILLS_DATA } from '../data/gameData';
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
    <div className="space-y-10">
      {/* ---- Intro ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="eyebrow">Scenario Quests</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3 leading-[1.1]">
            Real problems. Build the squad that solves them.
          </h2>
          <p className="text-base text-muted mt-3 leading-relaxed">
            Step into a live challenge, assemble a multidisciplinary skill squad, and run the simulation.
          </p>
        </div>

        <p className="meta shrink-0">
          <span className="font-semibold text-ink tabular-nums">{completedQuests.length}</span> of{' '}
          <span className="tabular-nums">{SCENARIO_QUESTS.length}</span> quests solved
        </p>
      </div>

      {/* ---- Quest picker ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCENARIO_QUESTS.map((quest) => {
          const isActive = quest.id === activeQuestId;
          const isDone = completedQuests.includes(quest.id);

          return (
            <button
              key={quest.id}
              onClick={() => handleSelectQuest(quest.id)}
              className={`pick p-5 flex flex-col ${isActive ? 'pick-on' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="meta">{quest.targetIndustry.split('&')[0]}</span>
                {isDone && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-grass shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-ink text-base mt-3 leading-snug flex-1">
                {quest.title.replace('Mission: ', '')}
              </h4>

              <div className="flex items-center justify-between mt-4 text-xs">
                <span className="text-faint font-medium">+{quest.xpReward} XP</span>
                <span className={`font-semibold ${isActive ? 'text-brand' : 'text-faint'}`}>
                  {isActive ? 'Active' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ---- Mission control ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Briefing */}
        <div className="lg:col-span-5 panel p-6 sm:p-8 flex flex-col gap-8 self-start lg:sticky lg:top-44">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand bg-brand-tint px-2.5 py-1 rounded-full">
                Mission briefing
              </span>
              <span className="inline-flex items-center gap-1 meta">
                <MapPin className="w-3.5 h-3.5" />
                {currentQuest.contextLocation}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-ink leading-tight">
                {currentQuest.title}
              </h3>
              <p className="text-base text-muted italic mt-2 leading-relaxed">
                "{currentQuest.tagline}"
              </p>
            </div>

            <p className="text-sm sm:text-base text-ink leading-relaxed">
              {currentQuest.challengeBrief}
            </p>

            <div className="flex items-center justify-between gap-3 pt-5 border-t border-line text-sm">
              <span className="text-muted">Required squad size</span>
              <span className="font-semibold text-ink">{currentQuest.minRequired} core skills</span>
            </div>
          </div>

          <p className="meta">Absa Future Ready Teens · Challenge Engine</p>
        </div>

        {/* Squad assembly */}
        <div className="lg:col-span-7 space-y-8">
          {/* Slots */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="meta">Your squad</p>
              <p className="meta tabular-nums">
                {selectedSkillIds.length} of {currentQuest.minRequired} filled
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((slotIdx) => {
                const sId = selectedSkillIds[slotIdx];
                const skill = SKILLS_DATA.find((s) => s.id === sId);

                return (
                  <div
                    key={slotIdx}
                    className={`h-28 rounded-2xl grid place-items-center p-3 text-center transition-all duration-200 ${
                      skill
                        ? 'bg-surface shadow-soft'
                        : 'bg-sunken border-2 border-dashed border-line'
                    }`}
                  >
                    {skill ? (
                      <div>
                        <span
                          className="block w-2 h-2 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: skill.color }}
                        />
                        <span className="block text-sm font-semibold text-ink leading-tight">
                          {skill.name}
                        </span>
                        <span className="block text-[11px] text-muted font-medium mt-1 capitalize">
                          {skill.category.replace('_', ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-faint">Slot {slotIdx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidates */}
          <div>
            <p className="meta mb-3">Candidate superpowers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuest.availableSkillIds.map((sId) => {
                const skill = SKILLS_DATA.find((s) => s.id === sId);
                if (!skill) return null;
                const isSelected = selectedSkillIds.includes(sId);

                return (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => handleToggleSkill(sId)}
                    className={`pick p-4 ${isSelected ? 'pick-on' : ''}`}
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
          </div>

          {/* Deploy */}
          <div className="flex items-center gap-3">
            <button
              id="btn-run-simulation"
              disabled={selectedSkillIds.length < currentQuest.minRequired || isSimulating}
              onClick={handleRunSimulation}
              className="btn btn-primary flex-1 py-4 px-6 text-base"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running simulation…</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Deploy squad · +{currentQuest.xpReward} XP</span>
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
                className="btn btn-outline p-4"
                title="Reset squad selection"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Outcome */}
          {simResult === 'success' && (
            <div className="rounded-3xl bg-grass-tint p-6 sm:p-7 animate-in zoom-in-95 duration-300">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-grass shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-ink">
                    Mission accomplished — squad synergy unlocked
                  </h4>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">
                    {currentQuest.explanation}
                  </p>
                  <p className="text-sm text-ink leading-relaxed italic">
                    {currentQuest.impactQuote}
                  </p>
                  <p className="text-sm text-ink pt-1">
                    <span className="text-muted">Career archetype unlocked · </span>
                    <span className="font-semibold">{currentQuest.unlockedCareerTitle}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {simResult === 'partial' && (
            <div className="rounded-3xl bg-brand-tint p-5 sm:p-6 flex items-start gap-4 animate-in fade-in duration-200">
              <XCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-semibold text-ink">
                  Sub-optimal squad combination
                </h4>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">
                  The solution struggled because it lacked one of the vital technical, commercial, or
                  creative pillars needed to deliver end-to-end impact. Adjust your squad and test again!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
