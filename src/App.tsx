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
import { Sparkles, Heart } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F7] text-slate-900 font-sans">
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
            className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-rose-500/30 flex items-center gap-2.5"
          >
            <div className="p-1 rounded-lg bg-[#DC0032] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold">{toastMessage.text}</p>
              {toastMessage.xp && (
                <span className="text-[10px] text-amber-300 font-extrabold">
                  +{toastMessage.xp} XP
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic View Area with subtle Motion transitions */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1720px] 3xl:max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <AnimatePresence mode="wait">
          {currentTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SkillCareerMatrixView
                onOpenCareerDetails={(career) => setSelectedCareerForModal(career)}
              />
            </motion.div>
          )}

          {currentTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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
      <footer className="bg-white border-t border-rose-100 py-6 px-4 sm:px-6 lg:px-8 mt-10 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#DC0032] text-white flex items-center justify-center font-bold text-xs">
              ab
            </div>
            <div>
              <span className="font-bold text-slate-900">Absa Future Ready Teens</span>
              <p className="text-[11px] text-slate-500">
                Skills-first empowerment for high school students across Africa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-slate-500">Absa ReadytoWork</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#DC0032] font-bold">#AbsaFutureReady2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
