import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, VolumeX, Trophy, ShieldCheck, Compass, HelpCircle, Maximize2, Minimize2 } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'support' | 'passport' | 'quests' | 'matrix' | 'badges';
  setCurrentTab: (tab: 'support' | 'passport' | 'quests' | 'matrix' | 'badges') => void;
  totalXp: number;
  level: number;
  unlockedBadgesCount: number;
}

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-2xs">
      {/* Top Absa Event Banner */}
      <div className="bg-[#4A0017] text-white px-4 py-1.5 text-[11px] sm:text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2.5 max-w-7xl 2xl:max-w-[1720px] mx-auto w-full">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#DC0032] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
            ABSA
          </span>
          <span className="truncate">
            Future Ready Teens 2026: <strong className="font-semibold text-rose-200">Interactive Career & Skill Matrix</strong>
          </span>
          <span className="hidden lg:inline-block ml-auto text-[10px] text-rose-200/80 uppercase tracking-wider font-bold">
            Touchscreen Kiosk Display
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <div 
              id="brand-header" 
              onClick={() => { setCurrentTab('support'); playClickSound(); }}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DC0032] to-[#990022] flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-white font-black text-xl tracking-tighter">ab</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg 2xl:text-xl font-black tracking-tight text-slate-900">
                    Career <span className="text-[#DC0032]">Support & Discovery</span>
                  </h1>
                  <span className="text-[10px] font-bold bg-rose-50 text-[#DC0032] border border-rose-200 px-2 py-0.5 rounded-md uppercase">
                    TEENS 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  High School Subjects, Superpowers & Real Pathways
                </p>
              </div>
            </div>

            {/* Mobile / Quick Action Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="btn-fullscreen-toggle-mobile"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Kiosk Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#DC0032]" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
              </button>
              <button
                id="btn-sound-toggle-mobile"
                onClick={toggleSound}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title={soundOn ? 'Mute audio' : 'Unmute audio'}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-[#DC0032]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {totalXp} XP
              </div>
            </div>
          </div>

          {/* Desktop & Kiosk Stats / Tools Bar */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DC0032] to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                L{level}
              </div>
              <div>
                <div className="flex items-center justify-between text-xs gap-3 font-bold">
                  <span className="text-slate-800">{getLevelTitle(level)}</span>
                  <span className="text-slate-500 font-mono">{totalXp}/{xpForNextLevel} XP</span>
                </div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-[#DC0032] to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="h-7 w-px bg-slate-200" />

            <button
              id="btn-nav-badges-stat"
              onClick={() => { setCurrentTab('badges'); playClickSound(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-700 hover:text-[#DC0032] transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{unlockedBadgesCount} Badges</span>
            </button>

            <button
              id="btn-sound-toggle-desktop"
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#DC0032] hover:border-slate-300 transition-colors"
              title={soundOn ? 'Mute audio' : 'Unmute audio'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#DC0032]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              id="btn-fullscreen-toggle-desktop"
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Big Screen Fullscreen Mode'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Big Screen Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Big Touch-Friendly Nav Tabs */}
        <nav className="flex items-center gap-2 sm:gap-2.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="tab-support"
            onClick={() => { setCurrentTab('support'); playClickSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              currentTab === 'support'
                ? 'bg-[#DC0032] text-white shadow-sm'
                : 'text-slate-700 bg-slate-100/80 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Teen Career Support</span>
          </button>

          <button
            id="tab-passport"
            onClick={() => { setCurrentTab('passport'); playClickSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              currentTab === 'passport'
                ? 'bg-[#DC0032] text-white shadow-sm'
                : 'text-slate-700 bg-slate-100/80 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Teen Career Passport</span>
          </button>

          <button
            id="tab-matrix"
            onClick={() => { setCurrentTab('matrix'); playClickSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              currentTab === 'matrix'
                ? 'bg-[#DC0032] text-white shadow-sm'
                : 'text-slate-700 bg-slate-100/80 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <span>🔍</span>
            <span>Skill Matrix</span>
          </button>

          <button
            id="tab-quests"
            onClick={() => { setCurrentTab('quests'); playClickSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              currentTab === 'quests'
                ? 'bg-[#DC0032] text-white shadow-sm'
                : 'text-slate-700 bg-slate-100/80 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <span>🎯</span>
            <span>Scenario Quests</span>
          </button>

          <button
            id="tab-badges"
            onClick={() => { setCurrentTab('badges'); playClickSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              currentTab === 'badges'
                ? 'bg-[#DC0032] text-white shadow-sm'
                : 'text-slate-700 bg-slate-100/80 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Badges ({unlockedBadgesCount})</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
