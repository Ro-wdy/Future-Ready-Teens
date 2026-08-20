import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ask } from '../../data/asks';
import { INTERESTS, InterestId, getInterest, getCombo } from '../../data/interests';

interface InterestBoardProps {
  ask: Ask;
  picked: InterestId[];
  onToggle: (id: InterestId) => void;
  /** True once both slots are full and the mash-up is being revealed. */
  revealing: boolean;
}

/**
 * Ask 06 — the mix.
 *
 * The two empty slots at the top are the whole trick: they turn picking into
 * filling something in rather than answering something. And the second a teen
 * fills the second slot, the mash-up name lands on screen — SPORT × TECH
 * becoming "Sports Technology" is the moment the room usually reacts.
 */
export const InterestBoard: React.FC<InterestBoardProps> = ({ ask, picked, onToggle, revealing }) => {
  const combo = picked.length === 2 ? getCombo(picked[0], picked[1]) : null;

  const Slot: React.FC<{ index: number }> = ({ index }) => {
    const id = picked[index];
    const interest = id ? getInterest(id) : undefined;

    return (
      <div
        className="rounded-2xl border-2 border-dashed grid place-items-center px-4 h-16 sm:h-20 min-w-[7.5rem] sm:min-w-[10rem] transition-all duration-200"
        style={{
          borderColor: interest ? 'transparent' : 'rgba(45,35,35,0.18)',
          background: interest?.color ?? 'transparent',
        }}
      >
        {interest ? (
          <motion.span
            key={interest.id}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="text-white font-extrabold text-sm sm:text-lg tracking-tight whitespace-nowrap"
          >
            {interest.emoji} {interest.label}
          </motion.span>
        ) : (
          <span className="text-faint font-bold text-sm">Pick one</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-auto px-5 sm:px-8 py-5 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="round-tag">
          {ask.index} · {ask.title}
        </span>
        <h2 className="ask-title mt-4">{ask.prompt}</h2>
        <p className="ask-setup !mt-2">{ask.setup}</p>
      </motion.div>

      {/* The two slots */}
      <div className="flex items-center gap-3 sm:gap-4 mt-5">
        <Slot index={0} />
        <span className="text-2xl sm:text-3xl font-extrabold text-ink/25">×</span>
        <Slot index={1} />

        <AnimatePresence>
          {combo && revealing && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0 ml-1 sm:ml-3"
            >
              <p className="eyebrow">Which unlocks</p>
              <p className="text-lg sm:text-2xl font-extrabold text-ink leading-tight truncate">
                {combo.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The board */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
        {INTERESTS.map((interest, i) => {
          const isOn = picked.includes(interest.id);
          const isLocked = !isOn && picked.length >= 2;

          return (
            <motion.button
              key={interest.id}
              type="button"
              disabled={isLocked || revealing}
              onClick={() => onToggle(interest.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: isLocked ? 0.4 : 1,
                y: isOn ? -4 : 0,
                scale: isOn ? 1.04 : 1,
              }}
              transition={{ duration: 0.28, delay: picked.length ? 0 : 0.05 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
              whileHover={isLocked || isOn ? undefined : { y: -4 }}
              whileTap={isLocked ? undefined : { scale: 0.97 }}
              style={{ ['--tile' as string]: interest.color }}
              className={`tile ${isOn ? 'tile-on' : ''} ${isLocked ? 'tile-locked' : ''}`}
            >
              <span className="block text-3xl sm:text-4xl leading-none">{interest.emoji}</span>
              <span className="tile-label">{interest.label}</span>
              <span className="tile-hint">{interest.hint}</span>
            </motion.button>
          );
        })}
      </div>

      <p className="meta mt-4">
        {picked.length === 0 && 'Two picks. Go with your gut.'}
        {picked.length === 1 && 'One more — try something that has nothing to do with the first.'}
        {picked.length === 2 && 'Locked in.'}
      </p>
    </div>
  );
};
