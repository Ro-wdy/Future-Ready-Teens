import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Coins, 
  Sprout 
} from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../data/gameData';
import { AchievementBadge } from '../types';

interface AchievementsViewProps {
  unlockedBadgeIds: string[];
  totalXp: number;
  level: number;
  matchesPlayed: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  unlockedBadgeIds,
  totalXp,
  level,
  matchesPlayed,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#DC0032]" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-amber-500" />;
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-sky-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-purple-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-orange-500" />;
      default:
        return <Trophy className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Overview Stats */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Trophy className="w-6 h-6" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Achievements & Readiness Milestones
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Celebrate your progress as you explore multidisciplinary career combinations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3 text-center">
              <span className="text-xs font-bold text-slate-700 uppercase">Total XP</span>
              <p className="text-lg font-black text-[#DC0032] mt-0.5">{totalXp}</p>
            </div>
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3 text-center">
              <span className="text-xs font-bold text-slate-700 uppercase">Level</span>
              <p className="text-lg font-black text-amber-700 mt-0.5">L{level}</p>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 text-center">
              <span className="text-xs font-bold text-slate-700 uppercase">Badges</span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">
                {unlockedBadgeIds.length} / {ACHIEVEMENT_BADGES.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENT_BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl border-2 p-5 transition-all flex flex-col justify-between relative overflow-hidden ${
                isUnlocked
                  ? 'bg-white border-amber-400/80 shadow-md ring-2 ring-amber-400/10'
                  : 'bg-slate-50/80 border-slate-200 opacity-65'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${isUnlocked ? 'bg-amber-50 border border-amber-200' : 'bg-slate-200 text-slate-400'}`}>
                    {getBadgeIcon(badge.icon)}
                  </div>
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-base mt-3">
                  {badge.title}
                </h4>

                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-700">
                {isUnlocked ? '✦ Event Milestone Verified' : 'Complete in Match Arena or Quests'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Absa Inspiration Card */}
      <div className="bg-gradient-to-r from-[#DC0032] to-[#990022] text-white rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-rose-100">
            ABSA YOUTH MANIFESTO
          </span>
          <h3 className="text-xl font-extrabold text-white">
            "Your Future is Built From Skills, Not Static Job Titles."
          </h3>
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
            Whether you want to solve food security through AgriTech, power clean energy microgrids, or defend digital wallets with cybersecurity, you start with the curiosity to learn and the courage to combine skills.
          </p>
        </div>
      </div>
    </div>
  );
};
