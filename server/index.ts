// Must be first: db.ts reads DATA_DIR the moment it is imported, and ESM
// evaluates imports in source order. Real environment variables always win
// over .env, so a cloud host's config is never overwritten by a stray file.
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { allLeads, countLeads, engine, insertLead, toCsv } from './db.ts';
// Node strips types rather than compiling them, so a type-only import has to
// say so explicitly or it is emitted as a real (missing) binding.
import type { Lead } from './db.ts';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
/**
 * Staff key guards the leads. It is not a login — it stops a curious teen
 * poking /staff on the panel, which is all it needs to do on a closed stand.
 */
const DEFAULT_STAFF_KEY = 'absa2026';
const STAFF_KEY = process.env.STAFF_KEY || DEFAULT_STAFF_KEY;

const app = express();
app.use(express.json({ limit: '64kb' }));

// The panel is served from this same origin, but a laptop-on-the-LAN setup can
// end up on a different one, so keep the API reachable either way.
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));

const str = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, engine, leads: countLeads() });
});

app.post('/api/leads', (req, res) => {
  const body = req.body ?? {};

  const firstName = str(body.firstName, 60);
  const phone = str(body.phone, 30);
  const email = str(body.email, 120);

  // A lead with no name and no way to reach them is not a lead.
  if (!firstName || (!phone && !email)) {
    return res.status(400).json({ ok: false, error: 'A first name and either a phone number or an email are required.' });
  }
  if (!body.consent) {
    return res.status(400).json({ ok: false, error: 'Consent is required before we can store these details.' });
  }

  const lead: Lead = {
    // The client sends its own id so a retried offline submission cannot
    // create a duplicate row.
    id: str(body.id, 64) || crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    firstName,
    phone,
    email,
    school: str(body.school, 120),
    yearGroup: str(body.yearGroup, 40),
    consent: 1,
    futureType: str(body.futureType, 80),
    interestMix: str(body.interestMix, 80),
    topCareer: str(body.topCareer, 120),
    capturedAt: str(body.capturedAt, 40) || new Date().toISOString(),
  };

  try {
    insertLead(lead);
    res.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error('[leads] insert failed', err);
    res.status(500).json({ ok: false, error: 'Could not save. It will be retried.' });
  }
});

/* ---------------- staff ---------------- */

const authed = (req: express.Request) =>
  str(req.query.key, 100) === STAFF_KEY || req.get('x-staff-key') === STAFF_KEY;

app.get('/api/leads.csv', (req, res) => {
  if (!authed(req)) return res.status(401).send('Add ?key=<staff key> to this URL.');
  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="absa-future-ready-leads-${stamp}.csv"`);
  res.send(toCsv(allLeads()));
});

app.get('/staff', (req, res) => {
  if (!authed(req)) {
    return res.status(401).send(page('Staff', `
      <h1>Staff</h1>
      <p class="muted">Open this page with the staff key, e.g. <code>/staff?key=YOUR_KEY</code></p>`));
  }

  const leads = allLeads();
  const key = encodeURIComponent(str(req.query.key, 100) || STAFF_KEY);
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = leads.filter((l) => l.createdAt.startsWith(today)).length;

  const rows = leads.length
    ? leads.map((l) => `<tr>
        <td>${esc(l.firstName)}</td>
        <td>${esc(l.phone)}</td>
        <td>${esc(l.email)}</td>
        <td>${esc(l.school)}${l.yearGroup ? ` · ${esc(l.yearGroup)}` : ''}</td>
        <td>${esc(l.futureType)}</td>
        <td>${esc(l.interestMix)}</td>
        <td>${esc(l.topCareer)}</td>
        <td class="num">${esc(l.capturedAt.slice(11, 16))}</td>
      </tr>`).join('')
    : '<tr><td colspan="8" class="muted">No leads captured yet.</td></tr>';

  res.send(page('Leads', `
    <header>
      <div>
        <p class="eyebrow">Absa Future Ready Teens</p>
        <h1>Leads</h1>
      </div>
      <a class="btn" href="/api/leads.csv?key=${key}">Download CSV</a>
    </header>
    <div class="stats">
      <div class="stat"><b>${leads.length}</b><span>total captured</span></div>
      <div class="stat"><b>${todayCount}</b><span>today</span></div>
      <div class="stat"><b>${esc(engine.split(' ')[0])}</b><span>storage engine</span></div>
    </div>
    <div class="scroll">
      <table>
        <thead><tr>
          <th>Name</th><th>Phone</th><th>Email</th><th>School</th>
          <th>Future type</th><th>Mix</th><th>Top career</th><th>Time</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="muted foot">Refreshes on reload. Storage: ${esc(engine)}</p>
  `));
});

/* ---------------- static app ---------------- */

const DIST = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.get('/', (_req, res) =>
    res.status(503).send(page('Not built', `
      <h1>The app has not been built yet</h1>
      <p class="muted">Run <code>npm run build</code>, then restart this server.</p>
      <p class="muted">During development run <code>npm run dev</code> instead &mdash; it proxies the API here.</p>`)));
}

if (STAFF_KEY === DEFAULT_STAFF_KEY) {
  console.warn(
    '\n  \x1b[33m!\x1b[0m STAFF_KEY is still the default. Anyone who guesses it can read every lead.\n'
    + '    Set STAFF_KEY in .env before the event.\n',
  );
}

app.listen(PORT, HOST, () => {
  console.log(`\n  Career Match-Up server`);
  console.log(`  ├ app     http://localhost:${PORT}`);
  console.log(`  ├ staff   http://localhost:${PORT}/staff?key=${STAFF_KEY}`);
  console.log(`  ├ storage ${engine}`);
  console.log(`  └ leads   ${countLeads()} recorded\n`);
  console.log(`  Point the Android panel at this machine's LAN address on port ${PORT}.\n`);
});

/* ---------------- tiny view helpers ---------------- */

function esc(v: unknown) {
  return String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function page(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Absa Future Ready Teens</title>
<style>
  :root { color-scheme: light dark; --ink:#2D2323; --muted:#6B5F5F; --line:#E3E2E2; --bg:#F9F8F8; --surface:#fff; --brand:#AF144B; }
  @media (prefers-color-scheme: dark) { :root { --ink:#F2ECEB; --muted:#B0A4A3; --line:#332A2B; --bg:#171213; --surface:#201A1B; --brand:#EE5A8C; } }
  * { box-sizing: border-box; }
  body { margin:0; padding:clamp(1rem,4vw,2.5rem); background:var(--bg); color:var(--ink);
         font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
  header { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  h1 { margin:.25rem 0 0; font-size:clamp(1.5rem,4vw,2.1rem); letter-spacing:-.02em; }
  .eyebrow { margin:0; font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
  .btn { background:var(--brand); color:#fff; text-decoration:none; font-weight:600;
         padding:.7rem 1.2rem; border-radius:999px; white-space:nowrap; }
  .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:1px;
           margin:1.5rem 0; background:var(--line); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
  .stat { background:var(--surface); padding:1rem 1.1rem; }
  .stat b { display:block; font-size:1.6rem; letter-spacing:-.03em; font-variant-numeric:tabular-nums; }
  .stat span { display:block; margin-top:.2rem; font-size:.8rem; color:var(--muted); }
  .scroll { overflow-x:auto; border:1px solid var(--line); border-radius:12px; background:var(--surface); }
  table { border-collapse:collapse; width:100%; min-width:900px; }
  th, td { text-align:left; padding:.7rem .9rem; border-bottom:1px solid var(--line); white-space:nowrap; }
  th { font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); }
  tr:last-child td { border-bottom:0; }
  .num { font-variant-numeric:tabular-nums; }
  .muted { color:var(--muted); }
  .foot { margin-top:1rem; font-size:.8rem; }
  code { background:var(--surface); border:1px solid var(--line); padding:.1rem .4rem; border-radius:5px; }
</style></head><body>${body}</body></html>`;
}
