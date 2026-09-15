// Storage layer. Uses Node's built-in `node:sqlite` (stable enough as of
// Node 22.5+, still flagged "experimental" in the docs) specifically so
// there's no native module to compile at deploy time — no node-gyp, no
// prebuilt-binary download, works anywhere Node itself runs.
//
// If your hosting environment pins an older Node version and this module
// isn't available, swap this file for `better-sqlite3` (same query-shape
// API) — nothing outside this file needs to change.

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "study.db");
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_id   TEXT PRIMARY KEY,
    created_at   TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    ip_hash      TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    type       TEXT NOT NULL,
    payload    TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

  CREATE TABLE IF NOT EXISTS deletion_log (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id   TEXT NOT NULL,
    deleted_at   TEXT NOT NULL,
    events_count INTEGER NOT NULL
  );
`);

const stmts = {
  upsertSession: db.prepare(`
    INSERT INTO sessions (session_id, created_at, last_seen_at, ip_hash)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET last_seen_at = excluded.last_seen_at
  `),
  insertEvent: db.prepare(`
    INSERT INTO events (session_id, type, payload, created_at)
    VALUES (?, ?, ?, ?)
  `),
  countEvents: db.prepare(`SELECT COUNT(*) AS n FROM events WHERE session_id = ?`),
  deleteEvents: db.prepare(`DELETE FROM events WHERE session_id = ?`),
  deleteSession: db.prepare(`DELETE FROM sessions WHERE session_id = ?`),
  logDeletion: db.prepare(`
    INSERT INTO deletion_log (session_id, deleted_at, events_count)
    VALUES (?, ?, ?)
  `),
  sessionExists: db.prepare(`SELECT 1 FROM sessions WHERE session_id = ?`),
  allEventsForSession: db.prepare(`
    SELECT type, payload, created_at FROM events WHERE session_id = ? ORDER BY id ASC
  `),
  allSessions: db.prepare(`SELECT session_id, created_at, last_seen_at FROM sessions ORDER BY created_at DESC`),
  allEvents: db.prepare(`SELECT session_id, type, payload, created_at FROM events ORDER BY id ASC`),
};

function recordEvent(sessionId, type, payload, ipHash) {
  const now = new Date().toISOString();
  stmts.upsertSession.run(sessionId, now, now, ipHash || null);
  stmts.insertEvent.run(sessionId, type, JSON.stringify(payload), now);
}

function deleteSessionData(sessionId) {
  const { n: eventsCount } = stmts.countEvents.get(sessionId);
  stmts.deleteEvents.run(sessionId);
  stmts.deleteSession.run(sessionId);
  // Deliberately keep only a count in the deletion log, never the data
  // itself or the session_id's associated payloads — this log exists so
  // the researcher can show a deletion actually happened, not to retain
  // a backdoor copy of deleted data.
  stmts.logDeletion.run(sessionId, new Date().toISOString(), eventsCount);
  return eventsCount;
}

function sessionExists(sessionId) {
  return !!stmts.sessionExists.get(sessionId);
}

function getSessionEvents(sessionId) {
  return stmts.allEventsForSession.all(sessionId).map((row) => ({
    ...row,
    payload: JSON.parse(row.payload),
  }));
}

function exportAll() {
  return {
    sessions: stmts.allSessions.all(),
    events: stmts.allEvents.all().map((row) => ({ ...row, payload: JSON.parse(row.payload) })),
  };
}

module.exports = { recordEvent, deleteSessionData, sessionExists, getSessionEvents, exportAll, db };
