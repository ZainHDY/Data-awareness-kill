# Study Backend

Minimal Express API for the thesis site: receives collected events, handles
deletion requests, and gives the researcher a way to pull the data out.

## Endpoints (matches `frontend/js/api.js` exactly — don't rename without updating both)

- `POST /api/collect` — `{ session_id, type, payload }` → `204` on success. Called by every `sendToBackend()` call in the frontend.
- `POST /api/delete` — `{ session_id }` → `{ ok, events_deleted }`. Called by the "Delete my data" button in `debrief.html`.
- `GET /health` — liveness check, no auth.
- `GET /api/admin/export` — everything in the DB, JSON. Requires `x-admin-key` header.
- `GET /api/admin/session/:id` — one session's events. Requires `x-admin-key` header.

## Storage

SQLite via Node's built-in `node:sqlite` — no native module to compile, so
there's no node-gyp / prebuilt-binary step at deploy time. Requires **Node
≥22.5**. Two tables: `sessions` (one row per session_id) and `events`
(append-only log of every `sendToBackend()` call, raw `type`+`payload`).
`deletion_log` keeps only a count of what was deleted, never the deleted
data itself, so it can prove a deletion happened without acting as a
backdoor copy.

## Running it

```bash
npm install
cp .env.example .env
# edit .env: set FRONTEND_ORIGIN, ADMIN_API_KEY, IP_HASH_SALT
# generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm start
```

Server listens on `PORT` (default 3001). `study.db` is created next to
`server.js` on first run (or wherever `DB_PATH` points).

## Going from "built" to "live"

1. Deploy this somewhere that runs Node ≥22.5 continuously (not a
   serverless function per-request — SQLite wants a persistent filesystem
   and a single process). A small VPS or a platform with persistent disk
   both work.
2. Set real env vars — especially `FRONTEND_ORIGIN` (your actual domain,
   not `*`) and `ADMIN_API_KEY`.
3. Put it behind HTTPS (reverse proxy like Caddy/nginx, or your host's
   built-in TLS) — this collects real PII, it shouldn't ever run over
   plain HTTP.
4. In `frontend/js/api.js`, set `BACKEND_BASE` to your API's URL and flip
   `API_ENABLED` to `true`. That's the only frontend change needed —
   every page already calls `sendToBackend()`/`requestDataDeletion()`.
5. Re-run the IRB-flagged-mechanism check from HANDOFF.md against the
   live URL, not just localhost, before recruiting participants.

## Access control, honestly stated

The admin routes use a single shared-secret header, not real
authentication. That's adequate for one researcher on one thesis project.
It is NOT adequate the moment a second person needs access, or if this
ever stores more than this study's own scope — upgrade to real auth
(even HTTP Basic behind a proper user table) before either of those
becomes true.
