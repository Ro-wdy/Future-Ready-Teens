import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Lead storage.
 *
 * Primary store is SQLite via `node:sqlite`, which ships with Node 22.5+ and
 * needs no native build — one file on disk, safe to copy off mid-event.
 * If the runtime is older (a cloud host pinned to Node 20, say) we fall back to
 * an append-only JSONL file. An event kiosk must never fail to record a lead
 * because of the storage engine, so both paths are always available.
 */

export interface Lead {
  id: string;
  createdAt: string;
  firstName: string;
  phone: string;
  email: string;
  school: string;
  yearGroup: string;
  consent: number;
  futureType: string;
  interestMix: string;
  topCareer: string;
  /** Client-side timestamp, so a queued offline lead keeps its real time. */
  capturedAt: string;
}

const COLUMNS: (keyof Lead)[] = [
  'id', 'createdAt', 'firstName', 'phone', 'email', 'school', 'yearGroup',
  'consent', 'futureType', 'interestMix', 'topCareer', 'capturedAt',
];

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const SQLITE_PATH = path.join(DATA_DIR, 'leads.db');
const JSONL_PATH = path.join(DATA_DIR, 'leads.jsonl');

type Store = {
  engine: string;
  insert: (lead: Lead) => void;
  all: () => Lead[];
  count: () => number;
};

function sqliteStore(): Store | null {
  try {
    // node:sqlite is only present on Node 22.5+; the catch below is the
    // fallback path for anything older.
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(SQLITE_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        createdAt TEXT NOT NULL,
        firstName TEXT,
        phone TEXT,
        email TEXT,
        school TEXT,
        yearGroup TEXT,
        consent INTEGER,
        futureType TEXT,
        interestMix TEXT,
        topCareer TEXT,
        capturedAt TEXT
      )
    `);

    const insert = db.prepare(
      `INSERT OR IGNORE INTO leads (${COLUMNS.join(',')})
       VALUES (${COLUMNS.map(() => '?').join(',')})`,
    );
    const selectAll = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC');
    const selectCount = db.prepare('SELECT COUNT(*) AS n FROM leads');

    return {
      engine: `sqlite (${SQLITE_PATH})`,
      insert: (lead) => insert.run(...COLUMNS.map((c) => lead[c] as string | number)),
      all: () => selectAll.all() as unknown as Lead[],
      count: () => (selectCount.get() as { n: number }).n,
    };
  } catch {
    return null;
  }
}

function jsonlStore(): Store {
  const read = (): Lead[] => {
    if (!fs.existsSync(JSONL_PATH)) return [];
    return fs
      .readFileSync(JSONL_PATH, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  };

  return {
    engine: `jsonl (${JSONL_PATH})`,
    // Append-only: a crash mid-write can lose at most the line being written.
    insert: (lead) => {
      const seen = new Set(read().map((l) => l.id));
      if (seen.has(lead.id)) return;
      fs.appendFileSync(JSONL_PATH, JSON.stringify(lead) + '\n');
    },
    all: read,
    count: () => read().length,
  };
}

const store: Store = sqliteStore() ?? jsonlStore();

export const engine = store.engine;
export const insertLead = store.insert;
export const allLeads = store.all;
export const countLeads = store.count;

/** Excel opens UTF-8 CSV correctly only with a BOM, and these have Kenyan names in them. */
export function toCsv(leads: Lead[]): string {
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = COLUMNS.join(',');
  const rows = leads.map((l) => COLUMNS.map((c) => esc(l[c])).join(','));
  return '﻿' + [header, ...rows].join('\n');
}

export { COLUMNS };
