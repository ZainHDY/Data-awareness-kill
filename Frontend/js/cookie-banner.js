// -----------------------------------------------------------------------
// IMPORTANT — read before deploying live:
// RESPECT_REJECT controls whether clicking "Reject all" actually stops the
// analytics cookie from being set. It is currently `false`, meaning the
// analytics ID cookie is set regardless of the participant's choice — this
// is the deliberately-deceptive control flagged in the design discussion.
// Do not deploy with this set to `false` until your IRB has confirmed this
// exact mechanism by name. Flip to `true` to make "Reject all" genuinely
// block the analytics cookie.
// -----------------------------------------------------------------------
const RESPECT_REJECT = false;

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function setAnalyticsCookie() {
  if (!getCookie("analytics_id")) {
    setCookie("analytics_id", uuid(), 365);
  }
}

function recordCookieChoice(choice) {
  // Stored locally so the reveal page can show the participant their own
  // stated choice next to what was actually collected.
  localStorage.setItem("cookie_choice", choice);
  localStorage.setItem("cookie_choice_at", new Date().toISOString());
  if (window.sendToBackend) {
    window.sendToBackend("cookie_choice", { choice });
  }
}

function initCookieBanner() {
  if (localStorage.getItem("cookie_choice")) {
    // Choice already made this session/device — still honor the flag below.
    if (localStorage.getItem("cookie_choice") === "accept" || !RESPECT_REJECT) {
      setAnalyticsCookie();
    }
    return;
  }

  const dict = STRINGS[getLang()] || STRINGS.en;
  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.innerHTML = `
    <p><strong data-i18n="cookie_title">${dict.cookie_title}</strong> — <span data-i18n="cookie_body">${dict.cookie_body}</span></p>
    <div class="cookie-actions">
      <button class="cookie-link" id="cookie-policy-btn" data-i18n="cookie_policy">${dict.cookie_policy}</button>
      <button class="btn-decline" id="cookie-reject-btn" data-i18n="cookie_reject">${dict.cookie_reject}</button>
      <button class="btn-primary" id="cookie-accept-btn" data-i18n="cookie_accept">${dict.cookie_accept}</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById("cookie-accept-btn").addEventListener("click", () => {
    recordCookieChoice("accept");
    setAnalyticsCookie();
    banner.remove();
  });

  document.getElementById("cookie-reject-btn").addEventListener("click", () => {
    recordCookieChoice("reject");
    if (!RESPECT_REJECT) {
      setAnalyticsCookie();
    }
    banner.remove();
  });

  document.getElementById("cookie-policy-btn").addEventListener("click", () => {
    window.location.href = "cookie-policy.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Wait for translations.js's applyI18n to set lang/dir first.
  setTimeout(initCookieBanner, 0);
});
