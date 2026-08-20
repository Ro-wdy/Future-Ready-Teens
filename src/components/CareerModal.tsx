import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  Coins, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { CareerMatch } from '../types';
import { SKILLS_DATA } from '../data/gameData';
import { playClickSound } from '../utils/audio';

interface CareerModalProps {
  career: CareerMatch | null;
  onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({ career, onClose }) => {
  if (!career) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-rose-100 shadow-2xl relative"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-br from-[#4A0017] via-[#2E000C] to-slate-950 text-white p-6 sm:p-7 relative overflow-hidden rounded-t-3xl">
            <div className="absolute right-0 top-0 w-48 h-48 bg-[#DC0032]/25 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => { playClickSound(); onClose(); }}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DC0032] text-white px-2.5 py-0.5 rounded-full">
                  {career.absaPillar}
                </span>
                <span className="text-xs text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-md">
                  ⚡ {career.futureOutlook}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {career.title}
              </h3>

              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
                {career.tagline}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* High School Subjects Prerequisite */}
            {career.subjectsNeeded && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span>Recommended High School Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {career.subjectsNeeded.map((sub, idx) => (
                    <span key={idx} className="text-xs font-bold bg-white text-slate-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Fusion Blueprint */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#DC0032]" />
                <span>Skill Synergy Blueprint:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {career.requiredSkillIds.map((sId) => {
                  const skill = SKILLS_DATA.find((s) => s.id === sId);
                  return (
                    <div key={sId} className="bg-rose-50/50 border border-rose-200 rounded-xl p-2.5">
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase text-white"
                        style={{ backgroundColor: skill?.color || '#DC0032' }}
                      >
                        {skill?.category.replace('_', ' ')}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs mt-1">
                        {skill?.name}
                      </h5>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900">Why this matters:</strong> {career.matchExplanation}
              </p>
            </div>

            {/* Daily Mission */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-[#DC0032]" />
                <span>Daily Mission Snapshot</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {career.dailyMission}
              </p>
            </div>

            {/* Quote */}
            <blockquote className="text-xs italic text-slate-700 bg-rose-50/50 p-3 rounded-xl border-l-4 border-[#DC0032]">
              {career.hybridQuote}
            </blockquote>

            {/* Teen High School Action Roadmap */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-[#DC0032]" />
                <span>What To Do In High School Today:</span>
              </h4>
              <div className="space-y-1.5">
                {career.teenActionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Salary & Close */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Compensation Tier
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  {career.salaryTier}
                </span>
              </div>

              <button
                onClick={() => { playClickSound(); onClose(); }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
