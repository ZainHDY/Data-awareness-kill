// Data-collection helpers for feed.html. Everything here goes through the
// existing sendToBackend() stub in api.js, tagged by type, so it lands in
// the same session log that reveal.html will read back out.
//
// Scope note: this file intentionally does NOT do anything from the
// "declined" list in HANDOFF.md — no WebRTC IP leak, no hidden autofill
// fields, no covert attribute inference. Everything collected here is
// standard passive browser/behavioral telemetry of the kind any ordinary
// analytics script gathers, which is the whole point of the study.

(function () {
  "use strict";

  // ---- 1. Device / browser fingerprint (one-shot, on load) ----
  function getWebGLInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return null;
      const dbgInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        vendor: dbgInfo ? gl.getParameter(dbgInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: dbgInfo ? gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      };
    } catch (e) {
      return null;
    }
  }

  function collectFingerprint() {
    const fp = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemory: navigator.deviceMemory || null,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      referrer: document.referrer || null,
      webgl: getWebGLInfo(),
    };
    window.sendToBackend("fingerprint", fp);
    return fp;
  }

  // ---- 2. Return-visit marker (localStorage + IndexedDB) ----
  function checkReturnVisit() {
    const isReturning = localStorage.getItem("has_visited_feed") === "true";
    localStorage.setItem("has_visited_feed", "true");

    // IndexedDB mirror, since some participants may clear localStorage
    // between sessions but not IndexedDB.
    const req = indexedDB.open("study_marker_db", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("markers");
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction("markers", "readwrite");
      const store = tx.objectStore("markers");
      const getReq = store.get("visited");
      getReq.onsuccess = () => {
        const idbReturning = getReq.result === true;
        store.put(true, "visited");
        window.sendToBackend("return_visit", {
          localStorageFlag: isReturning,
          indexedDBFlag: idbReturning,
        });
      };
    };
    req.onerror = () => {
      // IndexedDB unavailable (private mode etc.) — still report the
      // localStorage half rather than dropping the signal entirely.
      window.sendToBackend("return_visit", {
        localStorageFlag: isReturning,
        indexedDBFlag: null,
      });
    };
  }

  // ---- 3. Scroll depth (max % of page height reached) ----
  function trackScrollDepth() {
    let maxDepth = 0;
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      if (pct > maxDepth) maxDepth = pct;
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("beforeunload", () => {
      window.sendToBackend("scroll_depth", { maxPercent: maxDepth });
    });
    // Also flush periodically in case the tab is killed rather than
    // navigated away from cleanly.
    setInterval(() => window.sendToBackend("scroll_depth", { maxPercent: maxDepth }), 5000);
  }

  // ---- 4. Per-post dwell time via IntersectionObserver ----
  function trackPostDwell() {
    const dwellStart = new Map();
    const dwellTotal = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.dataset.postId;
          const topic = entry.target.dataset.topic;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            dwellStart.set(postId, performance.now());
          } else if (dwellStart.has(postId)) {
            const elapsed = performance.now() - dwellStart.get(postId);
            dwellTotal.set(postId, (dwellTotal.get(postId) || 0) + elapsed);
            dwellStart.delete(postId);
            window.sendToBackend("post_dwell", {
              postId,
              topic,
              dwellMs: Math.round(dwellTotal.get(postId)),
            });
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    document.querySelectorAll(".post").forEach((el) => observer.observe(el));

    window.addEventListener("beforeunload", () => {
      dwellStart.forEach((start, postId) => {
        const elapsed = performance.now() - start;
        dwellTotal.set(postId, (dwellTotal.get(postId) || 0) + elapsed);
      });
      const summary = {};
      dwellTotal.forEach((ms, postId) => (summary[postId] = Math.round(ms)));
      window.sendToBackend("post_dwell_final", summary);
    });
  }

  // ---- 5. Comment-field focus / blur / abandonment ----
  // Abandonment = focused, something typed, then blurred without a
  // "post" click. Purely about interaction with the field itself —
  // no hidden fields, nothing autofilled.
  function trackFieldEngagement() {
    document.querySelectorAll(".post-comment-box input").forEach((input) => {
      const postId = input.closest(".post").dataset.postId;
      let focusedAt = null;
      let typed = false;

      input.addEventListener("focus", () => {
        focusedAt = performance.now();
        window.sendToBackend("field_focus", { postId, field: "comment" });
      });
      input.addEventListener("input", () => {
        typed = true;
      });
      input.addEventListener("blur", () => {
        const dwellMs = focusedAt ? Math.round(performance.now() - focusedAt) : null;
        window.sendToBackend("field_blur", {
          postId,
          field: "comment",
          dwellMs,
          abandoned: typed && input.value.trim().length > 0,
        });
        typed = false;
      });
    });
  }

  window.initFeedCollectors = function () {
    collectFingerprint();
    checkReturnVisit();
    trackScrollDepth();
    trackPostDwell();
    trackFieldEngagement();
  };
})();
