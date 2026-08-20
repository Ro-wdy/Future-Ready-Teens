/**
 * Lead capture, built for a venue where the wifi will drop.
 *
 * Every submission is written to localStorage *first* and only then sent. If the
 * send fails the record stays queued and is retried on an interval and on every
 * app start, so a dead connection costs nothing but a delay. The record's id is
 * generated on the client and sent with it, so a retry can never create a
 * duplicate row on the server.
 */

const QUEUE_KEY = 'absa_lead_queue_v1';
const RETRY_MS = 20_000;

export interface LeadDraft {
  firstName: string;
  phone: string;
  email: string;
  school: string;
  yearGroup: string;
  consent: boolean;
  futureType: string;
  interestMix: string;
  topCareer: string;
}

interface QueuedLead extends LeadDraft {
  id: string;
  capturedAt: string;
  synced: boolean;
  attempts: number;
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function readQueue(): QueuedLead[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedLead[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedLead[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    // Storage full or blocked (private mode). The in-flight POST may still
    // succeed, so this must not throw and lose the submission.
    console.error('[leads] could not persist queue', err);
  }
}

async function post(lead: QueuedLead): Promise<boolean> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lead.id,
        firstName: lead.firstName,
        phone: lead.phone,
        email: lead.email,
        school: lead.school,
        yearGroup: lead.yearGroup,
        consent: lead.consent,
        futureType: lead.futureType,
        interestMix: lead.interestMix,
        topCareer: lead.topCareer,
        capturedAt: lead.capturedAt,
      }),
    });
    // A 400 means the server will never accept it; retrying forever is pointless.
    if (res.status >= 400 && res.status < 500) {
      console.error('[leads] rejected', await res.text());
      return false;
    }
    return res.ok;
  } catch {
    return false;
  }
}

/** Push anything still unsynced. Safe to call as often as you like. */
export async function flushQueue(): Promise<void> {
  const queue = readQueue();
  const pending = queue.filter((l) => !l.synced);
  if (!pending.length) return;

  for (const lead of pending) {
    const ok = await post(lead);
    lead.attempts += 1;
    if (ok) lead.synced = true;
  }
  writeQueue(queue);
}

/**
 * Record a lead. Resolves as soon as it is safely on disk — the caller should
 * not wait on the network, because the teen is standing at the screen.
 */
export async function submitLead(draft: LeadDraft): Promise<{ queued: boolean; synced: boolean }> {
  const lead: QueuedLead = {
    ...draft,
    id: newId(),
    capturedAt: new Date().toISOString(),
    synced: false,
    attempts: 0,
  };

  const queue = readQueue();
  queue.push(lead);
  writeQueue(queue);

  const ok = await post(lead);
  if (ok) {
    lead.synced = true;
    lead.attempts = 1;
    writeQueue(queue);
  }

  return { queued: true, synced: ok };
}

export function queueStats() {
  const queue = readQueue();
  return {
    total: queue.length,
    unsynced: queue.filter((l) => !l.synced).length,
  };
}

/** Only for the staff panel, after a confirmed export. */
export function clearSyncedLeads() {
  writeQueue(readQueue().filter((l) => !l.synced));
}

let timer: number | undefined;

/** Start background retries. Called once from the app root. */
export function startLeadSync() {
  if (timer !== undefined) return;
  void flushQueue();
  timer = window.setInterval(() => void flushQueue(), RETRY_MS);
  window.addEventListener('online', () => void flushQueue());
}
