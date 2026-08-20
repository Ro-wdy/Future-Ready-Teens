import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Sticker, StickerSpec } from '../Stickers';
import { TRAITS } from '../../data/traits';
import { InterestId, getInterest, getCombo } from '../../data/interests';
import { ScoredCareer, TraitScore, getFutureType, explainMatch } from '../../utils/matching';
import { CareerMatch } from '../../types';

interface ResultScreenProps {
  sticker: StickerSpec;
  traits: TraitScore[];
  interests: InterestId[];
  ranked: ScoredCareer[];
  onOpenCareerDetails: (career: CareerMatch) => void;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export const ResultScreen: React.FC<ResultScreenProps> = ({
  sticker,
  traits,
  interests,
  ranked,
  onOpenCareerDetails,
}) => {
  const { primary, secondary } = getFutureType(traits);
  const combo = interests.length === 2 ? getCombo(interests[0], interests[1]) : null;
  const top = ranked[0];
  const others = ranked.slice(1, 7);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-9 relative z-10">
      {/* ---- The badge ---- */}
      <motion.div {...rise(0)} className="flex items-center gap-5 sm:gap-7">
        <div className="relative shrink-0">
          <Sticker spec={sticker} className="w-24 h-24 sm:w-32 sm:h-32" />
          <span
            className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full grid place-items-center text-xl sm:text-2xl ring-4 ring-white"
            style={{ background: primary.tint }}
          >
            {primary.emoji}
          </span>
        </div>

        <div className="min-w-0">
          <p className="eyebrow">Your future type</p>
          {/* Stacked on purpose — "CHANGEMAKER × CONNECTOR" on one line wraps
              somewhere different on every screen width. */}
          <h2 className="type-badge mt-1 uppercase">
            <span className="block">{primary.short}</span>
            <span className="block">
              <span style={{ color: secondary.color }}>×</span> {secondary.short}
            </span>
          </h2>
          <p className="text-base sm:text-xl text-muted mt-3 leading-relaxed">{primary.line}</p>
        </div>
      </motion.div>

      {/* ---- What that actually means ---- */}
      <motion.div {...rise(0.08)} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="panel p-6 sm:p-7 lg:col-span-3">
          <h3 className="text-lg font-extrabold text-ink">What you're already good at</h3>
          <ul className="mt-4 space-y-3">
            {[...primary.goodAt.slice(0, 2), secondary.goodAt[0]].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 mt-1 shrink-0" style={{ color: primary.color }} />
                <span className="text-base text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted mt-5 leading-relaxed">{primary.atWork}</p>
        </div>

        {/* Score bars — the only place a number appears, and it is framed as a
            mix rather than a mark out of anything. */}
        <div className="panel p-6 sm:p-7 lg:col-span-2">
          <h3 className="text-lg font-extrabold text-ink">Your mix</h3>
          <div className="mt-4 space-y-3.5">
            {traits.slice(0, 5).map((t, i) => {
              const trait = TRAITS[t.id];
              return (
                <div key={t.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-ink">{trait.short}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: trait.color }}>
                      {t.pct}%
                    </span>
                  </div>
                  <div className="bar-track mt-1.5">
                    <motion.div
                      className="bar-fill"
                      style={{ background: trait.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${t.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ---- The mash-up ---- */}
      {combo && (
        <motion.div
          {...rise(0.16)}
          className="rounded-[1.75rem] p-6 sm:p-8 text-white"
          style={{
            background: `linear-gradient(120deg, ${getInterest(interests[0])?.color}, ${getInterest(interests[1])?.color})`,
          }}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/75">
            Your interest mix
          </p>
          <p className="text-lg sm:text-2xl font-extrabold mt-2">
            {getInterest(interests[0])?.label} × {getInterest(interests[1])?.label}
          </p>
          <p className="text-2xl sm:text-4xl font-extrabold mt-1 leading-tight">{combo.name}</p>
          <p className="text-sm sm:text-base text-white/80 mt-3">
            Most people never hear these two put together. These are real fields you could work in:
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {combo.fields.map((field) => (
              <span key={field} className="field-chip bg-white/20">
                {field}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ---- Top match ---- */}
      {top && (
        <motion.div {...rise(0.22)}>
          <h3 className="text-xl font-extrabold text-ink mb-4">Your closest career match</h3>
          <button
            onClick={() => onOpenCareerDetails(top.career)}
            className="panel w-full p-6 sm:p-8 text-left ring-2 hover:shadow-lift transition-all group"
            style={{ ['--tw-ring-color' as string]: primary.color }}
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className="text-xs font-extrabold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full text-white"
                style={{ background: primary.color }}
              >
                Top match
              </span>
              <span className="text-3xl font-extrabold tabular-nums" style={{ color: primary.color }}>
                {top.compatibility}%
              </span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-extrabold text-ink mt-4 leading-tight">
              {top.career.title}
            </h4>
            <p className="meta mt-1.5">{top.career.absaPillar}</p>
            <p className="text-base text-muted mt-4 leading-relaxed">{top.career.tagline}</p>

            <p className="text-sm text-ink mt-4 leading-relaxed">
              <span className="font-bold">Why you got this · </span>
              {explainMatch(top)}
            </p>

            {top.career.subjectsNeeded && (
              <p className="text-sm text-muted mt-3">
                <span className="text-faint">Subjects to take · </span>
                {top.career.subjectsNeeded.join(' · ')}
              </p>
            )}

            <span
              className="inline-flex items-center gap-1.5 text-sm font-bold mt-6 group-hover:gap-2.5 transition-all"
              style={{ color: primary.color }}
            >
              See the full roadmap
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </motion.div>
      )}

      {/* ---- The rest ---- */}
      <motion.div {...rise(0.28)}>
        <h3 className="text-xl font-extrabold text-ink">Six more that fit you</h3>
        <p className="text-sm text-muted mt-1.5">
          Tap any of them for the subjects and the steps to get there.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {others.map((item) => (
            <button
              key={item.career.id}
              onClick={() => onOpenCareerDetails(item.career)}
              className="panel p-5 text-left hover:shadow-lift transition-all group flex flex-col"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="meta truncate">{item.career.absaPillar}</span>
                <span className="text-base font-extrabold text-ink tabular-nums shrink-0">
                  {item.compatibility}%
                </span>
              </div>
              <h4 className="font-bold text-ink text-base mt-2 leading-snug">{item.career.title}</h4>
              <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2 flex-1">
                {item.career.tagline}
              </p>
              <span
                className="inline-flex items-center gap-1 text-sm font-bold mt-4 group-hover:gap-2 transition-all"
                style={{ color: primary.color }}
              >
                How to get there
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ---- Do this now ---- */}
      {top && (
        <motion.div {...rise(0.34)} className="panel p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-ink">Do these three things</h3>
          <p className="text-sm text-muted mt-1.5">
            Small, real steps towards {top.career.title} — starting this term.
          </p>
          <ol className="mt-6 space-y-4">
            {top.career.teenActionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span
                  className="w-8 h-8 rounded-full text-white text-sm font-extrabold grid place-items-center shrink-0"
                  style={{ background: primary.color }}
                >
                  {idx + 1}
                </span>
                <p className="text-base text-ink leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
};
