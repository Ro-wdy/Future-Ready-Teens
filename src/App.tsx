import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KioskBar } from './components/KioskBar';
import { CareerFlow } from './components/CareerFlow';
import { CareerModal } from './components/CareerModal';
import { StaffPanel } from './components/StaffPanel';
import { CareerMatch } from './types';
import { playLevelUpSound } from './utils/audio';
import { startLeadSync } from './utils/leads';
import { Sparkles } from 'lucide-react';

export default function App() {
  // XP is per-participant: it starts fresh for whoever walks up to the screen,
  // so it is deliberately not persisted between runs.
  const [totalXp, setTotalXp] = useState<number>(0);

  const [selectedCareerForModal, setSelectedCareerForModal] = useState<CareerMatch | null>(null);
  const [staffOpen, setStaffOpen] = useState(false);

  // Retry anything that failed to reach the server on a previous run, and keep
  // retrying in the background for the rest of the day.
  useEffect(() => {
    startLeadSync();
  }, []);

  // CareerFlow owns the run, so the staff "reset" reaches into it through here.
  const forceResetRef = useRef<() => void>(() => {});

  // The big reaction chip already tells them *why* they scored, so this toast
  // only ever carries the number — and the level-up when one lands.
  const [toastMessage, setToastMessage] = useState<{ text: string; xp: number } | null>(null);

  // Every 400 XP is one level — the full run is a little over 1000.
  const level = Math.floor(totalXp / 400) + 1;

  const handleEarnXp = (amount: number) => {
    setTotalXp((prev) => {
      const nextXp = prev + amount;
      const prevLevel = Math.floor(prev / 400) + 1;
      const nextLevel = Math.floor(nextXp / 400) + 1;

      if (nextLevel > prevLevel) {
        playLevelUpSound();
        setToastMessage({ text: `LEVEL ${nextLevel}`, xp: amount });
      } else {
        setToastMessage({ text: 'Nice', xp: amount });
      }
      return nextXp;
    });

    setTimeout(() => setToastMessage(null), 1800);
  };

  // Hand the screen back to the next person: clear XP and dismiss anything open.
  const handleRestart = () => {
    setTotalXp(0);
    setToastMessage(null);
    setSelectedCareerForModal(null);
  };

  return (
    <div className="kiosk text-ink font-sans">
      <KioskBar totalXp={totalXp} level={level} onStaffGesture={() => setStaffOpen(true)} />

      <CareerFlow
        onEarnXp={handleEarnXp}
        onRestart={handleRestart}
        onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
        registerReset={(fn) => { forceResetRef.current = fn; }}
      />

      {/* XP toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 480, damping: 26 }}
            className="fixed top-20 right-6 z-50 bg-ink text-white pl-4 pr-5 py-3 rounded-2xl shadow-lift flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <div>
              <p className="text-xl font-extrabold leading-none text-accent tabular-nums">
                +{toastMessage.xp} XP
              </p>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/60">
                {toastMessage.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CareerModal
        career={selectedCareerForModal}
        onClose={() => setSelectedCareerForModal(null)}
      />

      <StaffPanel
        open={staffOpen}
        onClose={() => setStaffOpen(false)}
        onForceReset={() => forceResetRef.current()}
      />
    </div>
  );
}
