require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("node:crypto");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || null;
const IP_HASH_SALT = process.env.IP_HASH_SALT || "dev-only-change-me";

if (!ADMIN_API_KEY) {
  console.warn(
    "[warn] ADMIN_API_KEY is not set — /api/admin/* routes are disabled until you set one in .env"
  );
}
if (FRONTEND_ORIGIN === "*") {
  console.warn(
    "[warn] FRONTEND_ORIGIN is '*' — fine for local dev, set it to your real site's origin before going live"
  );
}

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "256kb" }));

// ---- helpers ----

function hashIp(req) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(IP_HASH_SALT + ip).digest("hex").slice(0, 16);
}

const SESSION_ID_RE = /^[a-zA-Z0-9-]{8,64}$/;
const TYPE_RE = /^[a-zA-Z0-9_]{1,64}$/;

function requireAdmin(req, res, next) {
  if (!ADMIN_API_KEY) return res.status(503).json({ error: "admin_disabled" });
  const key = req.get("x-admin-key");
  if (!key || key !== ADMIN_API_KEY) return res.status(401).json({ error: "unauthorized" });
  next();
}

// ---- rate limits ----
// Generous on /api/collect since a single feed session fires many small
// events (scroll flushes every 5s, per-post dwell, field focus/blur, etc).
const collectLimiter = rateLimit({ windowMs: 60 * 1000, max: 240, standardHeaders: true, legacyHeaders: false });
const deleteLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const adminLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

// ---- routes ----

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/collect", collectLimiter, (req, res) => {
  const { session_id, type, payload } = req.body || {};

  if (typeof session_id !== "string" || !SESSION_ID_RE.test(session_id)) {
    return res.status(400).json({ error: "invalid_session_id" });
  }
  if (typeof type !== "string" || !TYPE_RE.test(type)) {
    return res.status(400).json({ error: "invalid_type" });
  }
  if (payload === undefined || payload === null || typeof payload !== "object") {
    return res.status(400).json({ error: "invalid_payload" });
  }

  try {
    db.recordEvent(session_id, type, payload, hashIp(req));
    res.status(204).end();
  } catch (err) {
    console.error("collect error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

app.post("/api/delete", deleteLimiter, (req, res) => {
  const { session_id } = req.body || {};

  if (typeof session_id !== "string" || !SESSION_ID_RE.test(session_id)) {
    return res.status(400).json({ error: "invalid_session_id" });
  }

  try {
    const deletedCount = db.deleteSessionData(session_id);
    res.json({ ok: true, events_deleted: deletedCount });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// ---- admin (researcher-only) routes ----
// Protected by a shared secret header, not full auth — adequate for a
// single-researcher thesis project, NOT adequate if more than one person
// needs access or this handles data beyond the study's own scope. Upgrade
// to real auth before that changes.

app.get("/api/admin/export", adminLimiter, requireAdmin, (req, res) => {
  res.json(db.exportAll());
});

app.get("/api/admin/session/:id", adminLimiter, requireAdmin, (req, res) => {
  const { id } = req.params;
  if (!SESSION_ID_RE.test(id)) return res.status(400).json({ error: "invalid_session_id" });
  if (!db.sessionExists(id)) return res.status(404).json({ error: "not_found" });
  res.json({ session_id: id, events: db.getSessionEvents(id) });
});

app.use((req, res) => res.status(404).json({ error: "not_found" }));

app.listen(PORT, () => {
  console.log(`Study backend listening on port ${PORT}`);
});
