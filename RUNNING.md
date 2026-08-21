# Running Career Match-Up on the event screen

## What this is

A React kiosk game served by a small Express server that also records the leads
teens submit at the end. Leads go into a SQLite file on disk; no third-party
service is involved, which matters because most players are minors.

## One-time setup

```bash
npm install
cp .env.example .env
npm run build
```

Then set the staff key (see below). The server reads `.env` on boot and prints
a warning for as long as `STAFF_KEY` is still the default.

Node 22.5 or newer is required (the server uses the built-in `node:sqlite`).
On older Node it automatically falls back to an append-only `leads.jsonl` — the
app still works, nothing is lost.

## Running it

```bash
npm start
```

Serves the game and the API on one port (3000 by default).

| What | Where |
|---|---|
| The game | `http://<this-machine>:3000` |
| Leads + CSV | `http://<this-machine>:3000/staff?key=<STAFF_KEY>` |
| Health check | `http://<this-machine>:3000/api/health` |
| Lead data | `data/leads.db` |

## The staff key

`STAFF_KEY` is the only thing between a curious teen and every lead you have
captured. Generate a fresh one per event:

```bash
node -e "console.log('frt-'+require('crypto').randomBytes(6).toString('hex'))"
```

Put it in `.env` as `STAFF_KEY=...` and restart the server. On boot it prints
the full staff URL, key included — bookmark that on the staff phone rather than
typing it each time. `.env` is gitignored, so the key never reaches the repo;
on a cloud host set it as an environment variable in the host's dashboard
instead (a real environment variable always wins over `.env`).

## What gets tracked

Nothing is recorded until a player fills in the form on the result screen and
ticks consent. At that point one row is written containing their name, phone
and/or email, school, year group, and — because it is what makes the follow-up
worth reading — the future type, interest mix and top career the game gave
them. Answers to individual rounds are not stored.

Each row carries a client-generated `id`, so a submission that is retried after
a wifi drop updates its own row instead of creating a second one. `capturedAt`
is the panel's own timestamp (when the teen actually filled it in) and
`createdAt` is when the server received it — on a queued offline lead these
differ, which is the intended behaviour.

Check it is working at any point: `/api/health` returns the live lead count.

## Pointing the Android screen at it

The panel just opens a URL, so both setups work unchanged:

**Laptop on the venue LAN** — run `npm start` on the laptop, find its address
with `hostname -I` (or `ipconfig` on Windows), and open
`http://192.168.x.x:3000` on the panel. No internet needed at all.

**Cloud-hosted** — see Deploying below.

Either way, open the game in Chrome on the panel and use the fullscreen control
in the top-right so the browser chrome is hidden. Android's own "Add to home
screen" plus a kiosk-launcher app keeps teens out of the browser UI.

## During the event

- **A screen is stuck.** Tap the Absa logo five times to open the staff panel,
  then "Reset screen for next player". Every round also resets itself after 75
  seconds of no touch, so this is rarely needed.
- **The wifi drops.** Nothing breaks. Submissions are written to the panel's
  local storage first and resend automatically once the connection is back.
  The staff panel shows how many are still waiting.
- **Before packing up**, check the staff panel on each screen reads
  "Everything sent", then download the CSV from `/staff`.

## Deploying to a host

Only needed if the panel will not share a network with a laptop. Requirements
are unusual enough to rule most hosts out:

- **Node 22.5+** — older runtimes silently fall back to JSONL storage.
- **A persistent disk.** Leads are a file on disk. Render, Railway and Fly.io
  can attach a volume; Vercel and Netlify cannot — their filesystems are wiped
  between requests, so every lead would be lost. Do not deploy there.

On Render (the shortest path):

1. New → Web Service, connect this repo.
2. Build command `npm install && npm run build`, start command `npm start`.
3. Add a disk, mount path `/data`, 1 GB.
4. Environment variables: `STAFF_KEY` (a fresh key), `DATA_DIR=/data`.
   Leave `PORT` unset — the host provides it.
5. Deploy, then open `https://<your-app>/api/health` and confirm it reports
   `sqlite`. If it reports `jsonl`, the Node version is too old.

Railway and Fly.io are the same shape: attach a volume, point `DATA_DIR` at its
mount path, set `STAFF_KEY`.

Before the doors open, on the real deployment: play one full round on the panel
itself, submit the form, and confirm the row appears at `/staff?key=...`. A
capture path that was only ever tested on a laptop is a capture path that has
not been tested.

Back up mid-event by downloading the CSV from `/staff` — it is a live export,
safe to pull as often as you like.

## Data notes

- The consent checkbox is unticked by default and must be tapped before the
  form will send. The wording asks under-18s to confirm with a parent or
  guardian — Absa's team should review it against their own policy.
- `STAFF_KEY` is a soft guard for a staffed stand, not authentication. Do not
  expose `/staff` on the public internet without putting real auth in front.
- `data/` is gitignored. Copy `data/leads.db` off the machine to back it up.
