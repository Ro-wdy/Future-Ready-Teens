import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KioskBar } from './components/KioskBar';
import { CareerFlow } from './components/CareerFlow';
import { CareerModal } from './components/CareerModal';
import { CareerMatch } from './types';
import { playLevelUpSound } from './utils/audio';
import { Sparkles } from 'lucide-react';

export default function App() {
  // XP is per-participant: it starts fresh for whoever walks up to the screen,
  // so it is deliberately not persisted between runs.
  const [totalXp, setTotalXp] = useState<number>(0);

  const [selectedCareerForModal, setSelectedCareerForModal] = useState<CareerMatch | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; xp?: number } | null>(null);

  // Every 500 XP is one level
  const level = Math.floor(totalXp / 500) + 1;

  const handleEarnXp = (amount: number, reason: string) => {
    setTotalXp((prev) => {
      const nextXp = prev + amount;
      const prevLevel = Math.floor(prev / 500) + 1;
      const nextLevel = Math.floor(nextXp / 500) + 1;

      if (nextLevel > prevLevel) {
        playLevelUpSound();
        setToastMessage({ text: `🎉 Level ${nextLevel} reached!`, xp: amount });
      } else {
        setToastMessage({ text: reason, xp: amount });
      }
      return nextXp;
    });

    setTimeout(() => setToastMessage(null), 2600);
  };

  // Hand the screen back to the next person: clear XP and dismiss anything open.
  const handleRestart = () => {
    setTotalXp(0);
    setToastMessage(null);
    setSelectedCareerForModal(null);
  };

  return (
    <div className="kiosk text-ink font-sans">
      <KioskBar totalXp={totalXp} level={level} />

      <CareerFlow
        onEarnXp={handleEarnXp}
        onRestart={handleRestart}
        onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
      />

      {/* XP toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-20 right-6 z-50 bg-ink text-white pl-4 pr-5 py-3 rounded-2xl shadow-lift flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <div>
              <p className="text-sm font-semibold leading-tight">{toastMessage.text}</p>
              {toastMessage.xp && (
                <span className="text-xs text-white/60 font-medium">+{toastMessage.xp} XP</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CareerModal
        career={selectedCareerForModal}
        onClose={() => setSelectedCareerForModal(null)}
      />
    </div>
  );
}
