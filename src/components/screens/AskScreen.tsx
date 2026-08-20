import React from 'react';
import { motion } from 'motion/react';
import { Ask } from '../../data/asks';

interface AskScreenProps {
  ask: Ask;
  /** Set the moment they tap, before the round turns over. */
  committed: string | null;
  onPick: (optionId: string) => void;
}

/**
 * One round of the game.
 *
 * There is deliberately no Continue button here. Tapping an answer *is* the
 * answer — the card fills, a reaction fires and the next round slides in. That
 * single decision is most of what separates this from a questionnaire.
 */
export const AskScreen: React.FC<AskScreenProps> = ({ ask, committed, onPick }) => {
  const gridClass =
    ask.layout === 'power'
      ? 'grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4'
      : ask.layout === 'pairs'
        ? 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'
        : 'grid grid-cols-1 gap-3 max-w-3xl';
  // Every answer has to be on screen at once — an option below the fold is an
  // option nobody picks, which quietly skews the whole result.

  return (
    <div className="ask-wrap w-full max-w-6xl mx-auto my-auto px-5 sm:px-8 py-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="round-tag">
          {ask.index} · {ask.title}
        </span>

        <h2 className="ask-title mt-5">{ask.prompt}</h2>
        {ask.setup && <p className="ask-setup">{ask.setup}</p>}
      </motion.div>

      <div className={`ask-grid ${gridClass} mt-7 sm:mt-9`}>
        {ask.options.map((option, i) => {
          const isCommitted = committed === option.id;
          const isPassed = committed !== null && !isCommitted;

          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={committed !== null}
              onClick={() => onPick(option.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{
                // Entrance, then the commit state: the chosen card lifts, the
                // ones they passed on step back instead of disappearing.
                opacity: isPassed ? 0.35 : 1,
                y: isCommitted ? -6 : 0,
                scale: isCommitted ? 1.03 : isPassed ? 0.97 : 1,
              }}
              transition={{
                duration: 0.3,
                delay: committed ? 0 : 0.06 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={committed ? undefined : { y: -5, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
              whileTap={committed ? undefined : { scale: 0.975, y: 0 }}
              className={`answer ${ask.layout === 'power' ? 'answer-power' : ''} ${
                isCommitted ? 'answer-committed' : ''
              }`}
            >
              {ask.layout === 'power' ? (
                <>
                  <span className="answer-chip">{option.emoji}</span>
                  <span className="answer-label block">{option.label}</span>
                  {option.sub && <span className="answer-sub">{option.sub}</span>}
                </>
              ) : (
                <span className="flex items-center gap-4">
                  <span className="answer-chip">{option.emoji}</span>
                  <span className="min-w-0">
                    <span className="answer-label block">{option.label}</span>
                    {option.sub && <span className="answer-sub">{option.sub}</span>}
                  </span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
