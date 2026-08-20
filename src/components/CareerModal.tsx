import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen } from 'lucide-react';
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm"
        onClick={() => { playClickSound(); onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-lift relative"
        >
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md px-6 sm:px-8 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-line">
            <div className="min-w-0">
              <p className="eyebrow truncate">{career.absaPillar}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink mt-1.5 leading-tight">
                {career.title}
              </h3>
            </div>
            <button
              onClick={() => { playClickSound(); onClose(); }}
              className="w-9 h-9 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-sunken transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 sm:px-8 py-7 space-y-8">
            <div>
              <p className="text-base text-muted leading-relaxed">{career.tagline}</p>
              <p className="text-sm font-medium text-grass mt-3">{career.futureOutlook}</p>
            </div>

            {/* Subjects */}
            {career.subjectsNeeded && (
              <div>
                <h4 className="eyebrow">Recommended high school subjects</h4>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {career.subjectsNeeded.map((sub, idx) => (
                    <span key={idx} className="text-sm font-medium text-ink bg-sunken px-3 py-1.5 rounded-full">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill blueprint */}
            <div>
              <h4 className="eyebrow">Skill synergy blueprint</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {career.requiredSkillIds.map((sId) => {
                  const skill = SKILLS_DATA.find((s) => s.id === sId);
                  return (
                    <div key={sId} className="rounded-2xl bg-sunken p-4">
                      <span
                        className="block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: skill?.color || '#AF144B' }}
                      />
                      <h5 className="font-semibold text-ink text-sm mt-2.5 leading-snug">
                        {skill?.name}
                      </h5>
                      <p className="text-xs text-muted mt-1 capitalize">
                        {skill?.category.replace('_', ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted mt-4 leading-relaxed">
                <span className="font-semibold text-ink">Why this matters · </span>
                {career.matchExplanation}
              </p>
            </div>

            {/* Daily mission */}
            <div>
              <h4 className="eyebrow">A day in this job</h4>
              <p className="text-base text-muted leading-relaxed mt-3">{career.dailyMission}</p>
            </div>

            {/* Quote */}
            <blockquote className="text-base italic text-ink leading-relaxed border-l-2 border-brand pl-5">
              {career.hybridQuote}
            </blockquote>

            {/* Action steps */}
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand shrink-0" />
                <h4 className="eyebrow">What to do in high school today</h4>
              </div>
              <ol className="mt-4 space-y-3.5">
                {career.teenActionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-brand-tint text-brand text-xs font-semibold grid place-items-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base text-ink leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
              <div>
                <p className="eyebrow">Compensation tier</p>
                <p className="text-sm font-semibold text-ink mt-1">{career.salaryTier}</p>
              </div>

              <button
                onClick={() => { playClickSound(); onClose(); }}
                className="btn btn-dark px-6 py-3 text-sm"
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
