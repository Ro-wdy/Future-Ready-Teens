import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Send, WifiOff } from 'lucide-react';
import { submitLead } from '../../utils/leads';
import { playClickSound, playPop, playMatchSuccess } from '../../utils/audio';

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  /** Stored alongside the contact details so outreach can reference the result. */
  futureType: string;
  interestMix: string;
  topCareer: string;
  accent: string;
}

const YEARS = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Finished school'];

export const LeadForm: React.FC<LeadFormProps> = ({
  open, onClose, futureType, interestMix, topCareer, accent,
}) => {
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [yearGroup, setYearGroup] = useState('');
  const [consent, setConsent] = useState(false);

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | { synced: boolean }>(null);
  const [error, setError] = useState('');

  const reset = () => {
    setFirstName(''); setPhone(''); setEmail(''); setSchool('');
    setYearGroup(''); setConsent(false); setDone(null); setError(''); setSending(false);
  };

  const close = () => { playClickSound(); reset(); onClose(); };

  // One contact route is enough — insisting on both costs completions, and a
  // teen with no email is not a teen we want to turn away.
  const canSend = firstName.trim() !== '' && (phone.trim() !== '' || email.trim() !== '') && consent;

  const handleSend = async () => {
    if (!canSend || sending) return;
    setSending(true);
    setError('');
    playPop();

    try {
      const result = await submitLead({
        firstName, phone, email, school, yearGroup, consent,
        futureType, interestMix, topCareer,
      });
      playMatchSuccess();
      setDone({ synced: result.synced });
    } catch {
      setError('Something went wrong. Try once more.');
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-ink/45 backdrop-blur-sm"
        onClick={close}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-[1.75rem] max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-lift relative"
        >
          {done ? (
            /* ---------------- sent ---------------- */
            <div className="px-7 sm:px-9 py-12 text-center">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                className="w-20 h-20 rounded-full grid place-items-center mx-auto text-white"
                style={{ background: accent }}
              >
                <Check className="w-10 h-10" strokeWidth={3} />
              </motion.span>

              <h3 className="text-3xl font-extrabold text-ink mt-6">
                Sorted, {firstName.trim().split(' ')[0]}.
              </h3>
              <p className="text-base text-muted mt-3 leading-relaxed">
                We&apos;ve got your details. Someone from Absa Future Ready Teens will send your
                results and what to do next.
              </p>

              {!done.synced && (
                <p className="text-sm text-muted mt-5 flex items-center justify-center gap-2">
                  <WifiOff className="w-4 h-4 shrink-0" />
                  Saved on this screen — it&apos;ll send as soon as the wifi is back.
                </p>
              )}

              <button onClick={close} className="btn btn-primary btn-touch mt-8 px-10">
                Done
              </button>
            </div>
          ) : (
            /* ---------------- form ---------------- */
            <>
              <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md px-7 sm:px-9 pt-7 pb-4 flex items-start justify-between gap-4 border-b border-line">
                <div className="min-w-0">
                  <p className="eyebrow">Absa Future Ready Teens</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1.5 leading-tight">
                    Want this sent to you?
                  </h3>
                </div>
                <button
                  onClick={close}
                  className="w-10 h-10 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-sunken transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-7 sm:px-9 py-7 space-y-5">
                <p className="text-base text-muted leading-relaxed">
                  Your future type, your career matches and the steps to get there — plus an
                  invite when we run the next one.
                </p>

                <div>
                  <label className="eyebrow block mb-2" htmlFor="lead-name">First name</label>
                  <input
                    id="lead-name" className="field text-lg" autoComplete="off"
                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="What should we call you?"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="eyebrow block mb-2" htmlFor="lead-phone">Phone</label>
                    <input
                      id="lead-phone" className="field text-lg" type="tel" inputMode="tel" autoComplete="off"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="07xx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" htmlFor="lead-email">Email</label>
                    <input
                      id="lead-email" className="field text-lg" type="email" inputMode="email" autoComplete="off"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="eyebrow block mb-2" htmlFor="lead-school">School</label>
                  <input
                    id="lead-school" className="field text-lg" autoComplete="off"
                    value={school} onChange={(e) => setSchool(e.target.value)}
                    placeholder="optional"
                  />
                </div>

                <div>
                  <span className="eyebrow block mb-2">Year</span>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => { playClickSound(); setYearGroup(yearGroup === year ? '' : year); }}
                        className={`chip ${yearGroup === year ? 'chip-brand-on' : ''}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Most players are under 18, so consent is explicit and unticked
                    by default rather than buried in small print. */}
                <button
                  type="button"
                  onClick={() => { playClickSound(); setConsent(!consent); }}
                  className={`w-full flex items-start gap-3.5 text-left rounded-2xl p-4 border-2 transition-colors ${
                    consent ? 'border-transparent bg-brand-tint' : 'border-line hover:border-faint/60'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md grid place-items-center shrink-0 mt-0.5 border-2 ${
                      consent ? 'border-transparent text-white' : 'border-line'
                    }`}
                    style={consent ? { background: accent } : undefined}
                  >
                    {consent && <Check className="w-3.5 h-3.5" strokeWidth={3.5} />}
                  </span>
                  <span className="text-sm text-ink leading-relaxed">
                    I&apos;m happy for Absa to keep these details and contact me about Future Ready
                    Teens. If I&apos;m under 18, I&apos;ve checked with a parent or guardian first.
                  </span>
                </button>

                {error && <p className="text-sm font-semibold text-accent">{error}</p>}

                <div className="flex items-center justify-between gap-4 pt-1">
                  <button onClick={close} className="btn btn-quiet px-5 py-3">
                    No thanks
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!canSend || sending}
                    className="btn btn-primary btn-touch px-8"
                  >
                    <Send className="w-5 h-5" />
                    <span>{sending ? 'Sending…' : 'Send it to me'}</span>
                  </button>
                </div>

                <p className="meta">
                  Name plus a phone number or an email is all we need. Nothing is shared outside Absa.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
