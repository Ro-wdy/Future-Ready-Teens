import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

interface KioskBarProps {
  totalXp: number;
  level: number;
}

const LEVEL_TITLES = ['Curious Explorer', 'Skill Alchemist', 'Future Architect', 'Visionary Pioneer'];

export const KioskBar: React.FC<KioskBarProps> = ({ totalXp, level }) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const levelTitle = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-brand text-white grid place-items-center font-bold text-base shrink-0">
            ab
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink leading-tight truncate">
              Absa Future Ready Teens
            </span>
            <span className="block text-xs text-faint leading-tight truncate">
              Career Match-Up 2026
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* XP — quiet, and only once there's something to show */}
          {totalXp > 0 && (
            <span className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full bg-sunken">
              <span className="w-7 h-7 rounded-full bg-surface text-brand grid place-items-center text-xs font-bold shrink-0">
                {level}
              </span>
              <span className="hidden sm:block text-xs font-semibold text-ink">{levelTitle}</span>
              <span className="text-xs font-semibold text-accent tabular-nums">{totalXp} XP</span>
            </span>
          )}

          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            className="p-2.5 rounded-full text-muted hover:text-ink hover:bg-sunken transition-colors"
            title={soundOn ? 'Mute audio' : 'Unmute audio'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="btn-fullscreen-toggle"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full text-muted hover:text-ink hover:bg-sunken transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Kiosk fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
