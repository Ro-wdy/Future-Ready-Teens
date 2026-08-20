import React from 'react';
import {
  Trophy,
  Sparkles,
  Award,
  Lock,
  Zap,
  ShieldCheck,
  Coins,
  Sprout,
  Check,
} from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../data/gameData';

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
}) => {
  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-6 h-6 ${unlocked ? '' : 'text-faint'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={cls} style={unlocked ? { color: '#DC0032' } : undefined} />;
      case 'Coins':
        return <Coins className={cls} style={unlocked ? { color: '#F0A500' } : undefined} />;
      case 'Sprout':
        return <Sprout className={cls} style={unlocked ? { color: '#10A45B' } : undefined} />;
      case 'ShieldCheck':
        return <ShieldCheck className={cls} style={unlocked ? { color: '#0284C7' } : undefined} />;
      case 'Award':
        return <Award className={cls} style={unlocked ? { color: '#7C3AED' } : undefined} />;
      case 'Zap':
        return <Zap className={cls} style={unlocked ? { color: '#EA580C' } : undefined} />;
      default:
        return <Trophy className={cls} style={unlocked ? { color: '#F0A500' } : undefined} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* ---- Overview ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <p className="eyebrow">Achievements</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3 leading-[1.1]">
            Milestones you've unlocked
          </h2>
          <p className="text-base text-muted mt-3 leading-relaxed">
            Celebrate your progress as you explore multidisciplinary career combinations.
          </p>
        </div>

        {/* Stats — plain numbers, no boxes */}
        <dl className="flex items-start gap-8 shrink-0">
          <div>
            <dt className="eyebrow">Total XP</dt>
            <dd className="text-3xl font-bold text-ink mt-1.5 tabular-nums">{totalXp}</dd>
          </div>
          <div>
            <dt className="eyebrow">Level</dt>
            <dd className="text-3xl font-bold text-ink mt-1.5 tabular-nums">{level}</dd>
          </div>
          <div>
            <dt className="eyebrow">Badges</dt>
            <dd className="text-3xl font-bold text-brand mt-1.5 tabular-nums">
              {unlockedBadgeIds.length}
              <span className="text-faint font-medium text-lg">/{ACHIEVEMENT_BADGES.length}</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* ---- Badge grid ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENT_BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl flex flex-col transition-all ${
                isUnlocked ? 'panel' : 'bg-sunken'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${
                    isUnlocked ? 'bg-canvas' : 'bg-line/60'
                  }`}
                >
                  {getBadgeIcon(badge.icon, isUnlocked)}
                </span>
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-grass bg-grass-tint px-2.5 py-1 rounded-full shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} /> Unlocked
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-faint shrink-0 mt-1" />
                )}
              </div>

              <h4 className={`font-semibold text-lg mt-4 ${isUnlocked ? 'text-ink' : 'text-muted'}`}>
                {badge.title}
              </h4>

              <p className="text-sm text-muted mt-2 leading-relaxed flex-1">
                {badge.description}
              </p>

              <p className="meta mt-5 pt-4 border-t border-line">
                {isUnlocked ? 'Event milestone verified' : 'Complete in Match Arena or Quests'}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---- Manifesto ---- */}
      <div className="rounded-3xl bg-brand text-white p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70">
            Absa Youth Manifesto
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-4 leading-tight">
            "Your future is built from skills, not static job titles."
          </h3>
          <p className="text-base text-white/80 mt-4 leading-relaxed">
            Whether you want to solve food security through AgriTech, power clean energy microgrids,
            or defend digital wallets with cybersecurity, you start with the curiosity to learn and
            the courage to combine skills.
          </p>
        </div>
      </div>
    </div>
  );
};
