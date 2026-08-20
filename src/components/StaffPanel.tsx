import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, CloudOff, CloudCheck, Download } from 'lucide-react';
import { flushQueue, queueStats } from '../utils/leads';

interface StaffPanelProps {
  open: boolean;
  onClose: () => void;
  onForceReset: () => void;
}

/**
 * Staff-only. Reached by tapping the logo five times, which no teen finds by
 * accident and any staff member can be shown in five seconds.
 *
 * The full lead list lives on the server at /staff — this is deliberately just
 * the two things you need while standing at a panel: is it stuck, and has
 * anything failed to send.
 */
export const StaffPanel: React.FC<StaffPanelProps> = ({ open, onClose, onForceReset }) => {
  const [stats, setStats] = useState(() => queueStats());
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStats(queueStats());
    const tick = window.setInterval(() => setStats(queueStats()), 3000);
    return () => window.clearInterval(tick);
  }, [open]);

  const retryNow = async () => {
    setFlushing(true);
    await flushQueue();
    setStats(queueStats());
    setFlushing(false);
  };

  if (!open) return null;

  const allSynced = stats.unsynced === 0;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-3xl max-w-md w-full shadow-lift p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Staff only</p>
              <h3 className="text-2xl font-extrabold text-ink mt-1">This screen</h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-sunken transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-sunken p-5">
            <div className="flex items-center gap-3">
              {allSynced ? (
                <CloudCheck className="w-5 h-5 text-grass shrink-0" />
              ) : (
                <CloudOff className="w-5 h-5 text-accent shrink-0" />
              )}
              <p className="text-base font-bold text-ink">
                {allSynced ? 'Everything sent' : `${stats.unsynced} waiting to send`}
              </p>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {stats.total} captured on this screen.{' '}
              {allSynced
                ? 'Nothing is stuck here.'
                : 'These are saved safely and will send by themselves once the wifi is back.'}
            </p>

            {!allSynced && (
              <button onClick={retryNow} disabled={flushing} className="btn btn-outline px-5 py-2.5 mt-4 text-sm">
                <RefreshCw className={`w-4 h-4 ${flushing ? 'animate-spin' : ''}`} />
                <span>{flushing ? 'Sending…' : 'Try sending now'}</span>
              </button>
            )}
          </div>

          <a
            href="/staff"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline w-full mt-3 px-5 py-3.5 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Open the full lead list &amp; CSV</span>
          </a>

          <button
            onClick={() => { onForceReset(); onClose(); }}
            className="btn btn-primary btn-touch w-full mt-3"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset screen for next player</span>
          </button>

          <p className="meta mt-4 text-center">Tap the logo five times to open this.</p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
