import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { TeenCareerSupport } from './components/TeenCareerSupport';
import { TeenCareerPassport } from './components/TeenCareerPassport';
import { ScenarioQuestsView } from './components/ScenarioQuestsView';
import { SkillCareerMatrixView } from './components/SkillCareerMatrixView';
import { AchievementsView } from './components/AchievementsView';
import { CareerModal } from './components/CareerModal';
import { CertificateModal } from './components/CertificateModal';
import { CareerMatch, TeenPassportData } from './types';
import { playLevelUpSound, playClickSound } from './utils/audio';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'support' | 'passport' | 'quests' | 'matrix' | 'badges'>('support');
  
  const [totalXp, setTotalXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('absa_career_xp');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('absa_unlocked_badges');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [matchesPlayed, setMatchesPlayed] = useState<number>(0);
  const [selectedCareerForModal, setSelectedCareerForModal] = useState<CareerMatch | null>(null);
  const [certificateModalData, setCertificateModalData] = useState<{
    passport: TeenPassportData;
    career: CareerMatch;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; xp?: number } | null>(null);

  // Compute level: every 500 XP is 1 level
  const level = Math.floor(totalXp / 500) + 1;

  // Persist stats
  useEffect(() => {
    localStorage.setItem('absa_career_xp', totalXp.toString());
  }, [totalXp]);

  useEffect(() => {
    localStorage.setItem('absa_unlocked_badges', JSON.stringify(unlockedBadgeIds));
  }, [unlockedBadgeIds]);

  const handleEarnXp = (amount: number, reason: string) => {
    setTotalXp((prev) => {
      const nextXp = prev + amount;
      const prevLevel = Math.floor(prev / 500) + 1;
      const nextLevel = Math.floor(nextXp / 500) + 1;

      if (nextLevel > prevLevel) {
        playLevelUpSound();
        setToastMessage({ text: `🎉 Level ${nextLevel} Reached!`, xp: amount });
      } else {
        setToastMessage({ text: reason, xp: amount });
      }
      return nextXp;
    });

    setMatchesPlayed((prev) => prev + 1);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadgeIds.includes(badgeId)) {
      setUnlockedBadgeIds((prev) => [...prev, badgeId]);
      handleEarnXp(150, '🏆 Achievement Unlocked!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalXp={totalXp}
        level={level}
        unlockedBadgesCount={unlockedBadgeIds.length}
      />

      {/* Floating XP / Reward Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-ink text-white pl-4 pr-5 py-3 rounded-2xl shadow-lift flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <div>
              <p className="text-sm font-semibold leading-tight">{toastMessage.text}</p>
              {toastMessage.xp && (
                <span className="text-xs text-white/60 font-medium">
                  +{toastMessage.xp} XP
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic View Area with subtle Motion transitions */}
      <main className="flex-1 max-w-7xl 3xl:max-w-[1720px] w-full mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {currentTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeenCareerSupport
                onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
                onEarnXp={handleEarnXp}
                onUnlockBadge={handleUnlockBadge}
              />
            </motion.div>
          )}

          {currentTab === 'passport' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeenCareerPassport
                onEarnXp={handleEarnXp}
                onUnlockBadge={handleUnlockBadge}
                onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
                onOpenCertificate={(passport, topCareer) =>
                  setCertificateModalData({ passport, career: topCareer })
                }
              />
            </motion.div>
          )}

          {currentTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScenarioQuestsView
                onEarnXp={handleEarnXp}
                onUnlockBadge={handleUnlockBadge}
              />
            </motion.div>
          )}

          {currentTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <SkillCareerMatrixView
                onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
              />
            </motion.div>
          )}

          {currentTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <AchievementsView
                unlockedBadgeIds={unlockedBadgeIds}
                totalXp={totalXp}
                level={level}
                matchesPlayed={matchesPlayed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <CareerModal
        career={selectedCareerForModal}
        onClose={() => setSelectedCareerForModal(null)}
      />

      <CertificateModal
        passport={certificateModalData?.passport || null}
        career={certificateModalData?.career || null}
        onClose={() => setCertificateModalData(null)}
      />

      {/* Event Footer */}
      <footer className="mt-16 border-t border-line">
        <div className="max-w-7xl 3xl:max-w-[1720px] mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-brand text-white grid place-items-center font-bold text-[11px] shrink-0">
              ab
            </span>
            <div>
              <p className="font-semibold text-ink">Absa Future Ready Teens</p>
              <p className="text-faint mt-0.5">
                Skills-first empowerment for high school students across Africa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span>Absa ReadytoWork</span>
            <span className="w-1 h-1 rounded-full bg-line" />
            <span className="font-semibold text-brand">#AbsaFutureReady2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
