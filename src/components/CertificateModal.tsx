import React from 'react';
import { X, Printer, Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { CareerMatch, TeenPassportData } from '../types';
import { SKILLS_DATA } from '../data/gameData';
import { playClickSound } from '../utils/audio';

interface CertificateModalProps {
  passport: TeenPassportData | null;
  career: CareerMatch | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  passport,
  career,
  onClose,
}) => {
  if (!passport || !career) return null;

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-surface rounded-3xl max-w-3xl w-full shadow-lift overflow-hidden my-auto animate-in zoom-in-95 duration-200">

        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Award className="w-4 h-4 text-brand shrink-0" />
            <span>Official Absa Event Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-primary px-4 py-2.5 text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => { playClickSound(); onClose(); }}
              className="w-9 h-9 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-sunken transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div 
          id="printable-certificate"
          className="p-8 sm:p-12 bg-[#FFFDFD] relative border-4 border-[#4A0017] m-5 rounded-2xl print:m-0 print:p-8"
        >
          {/* Inner gold/crimson border frame */}
          <div className="absolute inset-2.5 border border-amber-400/70 rounded-xl pointer-events-none" />

          {/* Watermark Absa background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-9xl font-bold text-[#DC0032]">
            absa
          </div>

          {/* Certificate Header */}
          <div className="text-center relative z-10 space-y-3">
            {/* Absa Red Brand Circle */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DC0032] text-white font-bold text-xl mx-auto">
              ab
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#DC0032]">
                ABSA FUTURE READY TEENS EVENT 2026
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#4A0017] tracking-tight font-serif mt-2">
                Certificate of Future Readiness
              </h2>
              <p className="text-xs text-slate-500 mt-2 tabular-nums">
                Passport Serial: {passport.passportId} • Nairobi, Kenya
              </p>
            </div>
          </div>

          {/* Recipient Presentation */}
          <div className="text-center my-6 relative z-10 space-y-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.1em]">
              This is proudly presented to:
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 border-b-2 border-[#DC0032] pb-2.5 inline-block px-8">
              {passport.teenName} {passport.teenAvatar}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
              For actively completing the <strong>Career Match-Up Discovery</strong> and demonstrating that <span className="text-[#DC0032] font-bold">careers are built from skills, not job titles alone</span>.
            </p>
          </div>

          {/* Core Strengths & Career Archetype Summary */}
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto my-8 relative z-10 text-left">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-[0.1em] text-slate-400 block">
                Primary Superpowers:
              </span>
              <ul className="text-sm font-medium text-slate-800 mt-2 space-y-1">
                {passport.selectedSkillIds.map((sId) => {
                  const s = SKILLS_DATA.find((sk) => sk.id === sId);
                  return (
                    <li key={sId} className="flex items-center gap-1">
                      <span className="text-[#DC0032] font-bold">•</span>
                      <span>{s?.name.split(' ')[0]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold tracking-[0.1em] text-slate-400 block">
                Prime Career Synergy:
              </span>
              <p className="text-sm font-semibold text-[#DC0032] mt-2">
                {career.title}
              </p>
              <span className="text-[10px] text-slate-600 font-medium block mt-0.5">
                Pillar: {career.absaPillar}
              </span>
            </div>
          </div>

          {/* Signature & Seal Block */}
          <div className="flex items-end justify-between pt-6 border-t border-slate-200 relative z-10 text-xs">
            <div className="text-left space-y-1">
              <div className="font-serif italic text-slate-800 text-sm font-bold">
                Absa Youth Empowerment Director
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Absa Bank Kenya PLC
              </p>
            </div>

            {/* Official Seal */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500 bg-amber-50 flex flex-col items-center justify-center text-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-[8px] font-semibold uppercase tracking-wide text-amber-800 leading-tight mt-0.5">
                FUTURE READY
              </span>
            </div>

            <div className="text-right space-y-1">
              <p className="text-slate-800 font-bold text-[11px]">
                {passport.generatedDate}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Verified Event Date
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
