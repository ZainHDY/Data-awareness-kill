// Centralized point for sending data to the backend. Backend isn't built
// yet — this currently just logs to the console and keeps a local copy in
// sessionStorage so pages downstream (e.g. the reveal page) can still work
// during frontend-only development. Swap BACKEND_BASE once the API exists;
// nothing else in the frontend needs to change.

const BACKEND_BASE = ""; // e.g. "https://api.yourdomain.com" once live
const API_ENABLED = false; // flip to true once BACKEND_BASE is real

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId() {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = uuid();
    localStorage.setItem("session_id", id);
  }
  return id;
}

function logLocally(type, payload) {
  const key = "local_collected_data";
  const existing = JSON.parse(sessionStorage.getItem(key) || "[]");
  existing.push({ type, payload, at: new Date().toISOString() });
  sessionStorage.setItem(key, JSON.stringify(existing));
}

async function sendToBackend(type, payload) {
  logLocally(type, payload);
  if (!API_ENABLED) return;
  try {
    await fetch(`${BACKEND_BASE}/api/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        type,
        payload,
      }),
    });
  } catch (err) {
    console.warn("Backend send failed, data kept locally only:", err);
  }
}

window.sendToBackend = sendToBackend;
window.getSessionId = getSessionId;

// Called from debrief.html's "Delete my data" action. Clears everything
// this frontend ever wrote client-side, and — once the backend exists —
// also asks it to purge anything stored server-side for this session.
// Client-side clearing happens unconditionally, even if the backend call
// fails or isn't live yet, so "delete my data" is never a no-op.
async function requestDataDeletion() {
  const sessionId = getSessionId();
  let backendOk = null;

  if (API_ENABLED) {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      backendOk = res.ok;
    } catch (err) {
      backendOk = false;
    }
  }

  // Wipe local traces regardless of backend outcome.
  const keysToRemove = [
    "participant_profile",
    "volunteered_info",
    "consent_participation",
    "consent_at",
    "has_visited_feed",
    "cookie_choice",
    "cookie_choice_at",
    "session_id",
    "study_lang",
  ];
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("local_collected_data");
  document.cookie = "analytics_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  try {
    const req = indexedDB.deleteDatabase("study_marker_db");
    await new Promise((resolve) => {
      req.onsuccess = resolve;
      req.onerror = resolve;
      req.onblocked = resolve;
    });
  } catch (err) {
    // IndexedDB unavailable — nothing to clean up there.
  }

  return { backendContacted: API_ENABLED, backendOk };
}

window.requestDataDeletion = requestDataDeletion;
