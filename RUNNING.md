# Running Career Match-Up on the event screen

## What this is

A React kiosk game served by a small Express server that also records the leads
teens submit at the end. Leads go into a SQLite file on disk; no third-party
service is involved, which matters because most players are minors.

## One-time setup

```bash
npm install
cp .env.example .env      # then change STAFF_KEY
npm run build
```

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

## Pointing the Android screen at it

The panel just opens a URL, so both setups work unchanged:

**Laptop on the venue LAN** — run `npm start` on the laptop, find its address
with `hostname -I` (or `ipconfig` on Windows), and open
`http://192.168.x.x:3000` on the panel. No internet needed at all.

**Cloud-hosted** — deploy this repo anywhere that runs Node 22, set the same
env vars, and open the public URL on the panel.

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

## Data notes

- The consent checkbox is unticked by default and must be tapped before the
  form will send. The wording asks under-18s to confirm with a parent or
  guardian — Absa's team should review it against their own policy.
- `STAFF_KEY` is a soft guard for a staffed stand, not authentication. Do not
  expose `/staff` on the public internet without putting real auth in front.
- `data/` is gitignored. Copy `data/leads.db` off the machine to back it up.
