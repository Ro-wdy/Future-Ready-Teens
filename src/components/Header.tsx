import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Trophy, ShieldCheck, Compass, Maximize2, Minimize2, Search, Target } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'support' | 'passport' | 'quests' | 'matrix' | 'badges';
  setCurrentTab: (tab: 'support' | 'passport' | 'quests' | 'matrix' | 'badges') => void;
  totalXp: number;
  level: number;
  unlockedBadgesCount: number;
}

const TABS: {
  id: 'support' | 'passport' | 'quests' | 'matrix' | 'badges';
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'support', label: 'Career Support', icon: <Compass className="w-4 h-4" /> },
  { id: 'passport', label: 'Career Passport', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'matrix', label: 'Skill Matrix', icon: <Search className="w-4 h-4" /> },
  { id: 'quests', label: 'Scenario Quests', icon: <Target className="w-4 h-4" /> },
  { id: 'badges', label: 'Badges', icon: <Trophy className="w-4 h-4" /> },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  totalXp,
  level,
  unlockedBadgesCount,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playClickSound();
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 1) return 'Curious Explorer';
    if (lvl === 2) return 'Skill Alchemist';
    if (lvl === 3) return 'Future Architect';
    return 'Visionary Pioneer';
  };

  const xpForNextLevel = level * 500;
  const currentLevelBaseXp = (level - 1) * 500;
  const levelProgress = Math.min(
    100,
    Math.max(0, ((totalXp - currentLevelBaseXp) / 500) * 100)
  );

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-xl">
      {/* Slim event strip */}
      <div className="border-b border-line/70">
        <div className="max-w-7xl 3xl:max-w-[1720px] mx-auto px-5 sm:px-8 py-2 flex items-center gap-2.5 text-[11px] text-muted">
          <span className="font-semibold text-brand">Absa</span>
          <span className="h-3 w-px bg-line" />
          <span className="truncate">
            Future Ready Teens 2026 — <span className="font-medium text-ink">Interactive Career &amp; Skill Matrix</span>
          </span>
          <span className="hidden lg:inline ml-auto text-faint">Touchscreen Kiosk Display</span>
        </div>
      </div>

      <div className="max-w-7xl 3xl:max-w-[1720px] mx-auto px-5 sm:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-4 pt-4 pb-3">
          <button
            id="brand-header"
            onClick={() => { setCurrentTab('support'); playClickSound(); }}
            className="flex items-center gap-3 group text-left"
          >
            <span className="w-10 h-10 rounded-2xl bg-brand text-white grid place-items-center font-bold text-lg tracking-tight shrink-0 group-hover:scale-105 transition-transform">
              ab
            </span>
            <span>
              <span className="block text-base sm:text-xl font-bold text-ink leading-tight">
                Career Support &amp; Discovery
              </span>
              <span className="block text-xs text-muted mt-0.5">
                High School Subjects, Superpowers &amp; Real Pathways
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Level + XP — quiet progress, no gradients */}
            <div className="hidden sm:flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-sunken">
              <span className="w-8 h-8 rounded-full bg-surface text-brand grid place-items-center text-xs font-bold shrink-0">
                {level}
              </span>
              <span className="min-w-[8.5rem]">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-semibold text-ink">{getLevelTitle(level)}</span>
                  <span className="text-[11px] text-faint tabular-nums">{totalXp}/{xpForNextLevel}</span>
                </span>
                <span className="block h-1 rounded-full bg-line overflow-hidden mt-1.5">
                  <span
                    className="block h-full bg-brand rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </span>
              </span>
            </div>

            {/* Compact XP for small screens */}
            <span className="sm:hidden px-3 py-1.5 rounded-full bg-sunken text-xs font-semibold text-ink tabular-nums">
              {totalXp} XP
            </span>

            <button
              id="btn-nav-badges-stat"
              onClick={() => { setCurrentTab('badges'); playClickSound(); }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-muted hover:text-ink hover:bg-sunken transition-colors"
              title="View your badges"
            >
              <Trophy className="w-4 h-4" />
              <span className="tabular-nums">{unlockedBadgesCount}</span>
            </button>

            <button
              id="btn-sound-toggle-desktop"
              onClick={toggleSound}
              className="p-2 rounded-full text-muted hover:text-ink hover:bg-sunken transition-colors"
              title={soundOn ? 'Mute audio' : 'Unmute audio'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="btn-fullscreen-toggle-desktop"
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-muted hover:text-ink hover:bg-sunken transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Big Screen Fullscreen Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => { setCurrentTab(tab.id); playClickSound(); }}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'text-brand' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.icon}
                <span>
                  {tab.label}
                  {tab.id === 'badges' && unlockedBadgesCount > 0 && (
                    <span className="ml-1 text-faint tabular-nums font-medium">{unlockedBadgesCount}</span>
                  )}
                </span>
                <span
                  className={`absolute left-2 right-2 -bottom-px h-0.5 rounded-full transition-all duration-200 ${
                    isActive ? 'bg-brand opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="h-px bg-line/70" />
    </header>
  );
};
