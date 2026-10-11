// Connect Autofill background worker.
//
// Flow: Connect page -> bridge.js -> here. We open the login page in a new tab,
// keep the credential in memory-only session storage tied to that tab, and
// inject the filler each time the tab finishes loading a page on the saved
// site (multi-step logins load a separate password page). The credential is
// dropped once the password is filled, the tab closes, or after 2 minutes.

const CONNECT_ORIGINS = [
  "https://crosser.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
];
const FILL_TTL_MS = 2 * 60 * 1000;

const keyFor = (tabId) => `fill:${tabId}`;

const bareHost = (host) => host.toLowerCase().replace(/^www\./, "");

// Same site, or one is a subdomain of the other (example.com <-> login.example.com)
const hostMatches = (pageHost, savedHost) => {
  const a = bareHost(pageHost);
  const b = bareHost(savedHost);
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "AUTOFILL_DONE") {
    if (sender.tab?.id != null) chrome.storage.session.remove(keyFor(sender.tab.id));
    return;
  }

  if (msg?.type !== "AUTOFILL_OPEN") return;

  let senderOrigin = "";
  try {
    senderOrigin = new URL(sender.url).origin;
  } catch {
    // fall through to rejection
  }
  if (!CONNECT_ORIGINS.includes(senderOrigin)) {
    sendResponse({ ok: false, error: "Request did not come from Connect." });
    return;
  }

  let target;
  try {
    target = new URL(msg.url);
  } catch {
    sendResponse({ ok: false, error: "Invalid website URL." });
    return;
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    sendResponse({ ok: false, error: "Only http(s) websites can be opened." });
    return;
  }

  (async () => {
    // Open blank first so the credential is stored before the real page can load
    const tab = await chrome.tabs.create({
      url: "about:blank",
      active: true,
      openerTabId: sender.tab?.id,
    });
    await chrome.storage.session.set({
      [keyFor(tab.id)]: {
        host: target.hostname,
        username: msg.username,
        password: msg.password,
        expires: Date.now() + FILL_TTL_MS,
      },
    });
    await chrome.tabs.update(tab.id, { url: target.href });
    sendResponse({ ok: true });
  })().catch((err) => sendResponse({ ok: false, error: err.message }));

  return true; // keep sendResponse alive for the async work
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const key = keyFor(tabId);
  const { [key]: pending } = await chrome.storage.session.get(key);
  if (!pending) return;

  if (Date.now() > pending.expires) {
    await chrome.storage.session.remove(key);
    return;
  }

  let pageUrl;
  try {
    pageUrl = new URL(tab.url);
  } catch {
    return;
  }
  // Never fill on an unrelated site (e.g. after a redirect elsewhere)
  if (!/^https?:$/.test(pageUrl.protocol) || !hostMatches(pageUrl.hostname, pending.host)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: fillLoginForm,
      args: [pending.username, pending.password],
    });
  } catch (err) {
    console.warn("Connect Autofill: could not inject into tab", err);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(keyFor(tabId));
});

// Injected into the login page. Must be self-contained (no outer references).
function fillLoginForm(username, password) {
  const USER_HINT = /user|email|e-mail|login|account|identifier|phone|mobile/i;
  // Each field is filled at most once, so we never overwrite what the user types
  const filled = new WeakSet();

  const isUsable = (el) =>
    el &&
    !el.disabled &&
    !el.readOnly &&
    el.type !== "hidden" &&
    el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== "hidden";

  // Use the native setter + real events so React/Vue/Angular forms register the value
  const setValue = (el, value) => {
    if (filled.has(el)) return;
    filled.add(el);
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    el.focus();
    setter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  };

  const looksLikeUsername = (el) => {
    const auto = (el.getAttribute("autocomplete") || "").toLowerCase();
    if (auto.includes("username") || auto.includes("email")) return true;
    if (el.type === "email") return true;
    return USER_HINT.test(`${el.name} ${el.id} ${el.placeholder} ${el.getAttribute("aria-label") || ""}`);
  };

  const textInputs = () =>
    [...document.querySelectorAll("input")].filter(
      (el) => isUsable(el) && ["text", "email", "tel", ""].includes(el.type || "")
    );

  const tryFill = () => {
    const passwordField = [...document.querySelectorAll('input[type="password"]')].find(isUsable);
    let usernameField = null;

    if (passwordField) {
      // Prefer the username-looking field closest before the password field, in the same form if any
      const scope = passwordField.form ? [...passwordField.form.querySelectorAll("input")] : textInputs();
      const before = scope.filter(
        (el) =>
          isUsable(el) &&
          ["text", "email", "tel", ""].includes(el.type || "") &&
          el.compareDocumentPosition(passwordField) & Node.DOCUMENT_POSITION_FOLLOWING
      );
      // Only fall back to "nearest text field" inside a real <form>, never page-wide (search boxes)
      usernameField =
        before.reverse().find(looksLikeUsername) || (passwordField.form ? before[0] : null) || null;
    } else {
      // Step 1 of a multi-step login: only fill a field that clearly asks for the username
      usernameField = textInputs().find(looksLikeUsername) || null;
    }

    let filledUsername = false;
    let filledPassword = false;
    if (usernameField && username) {
      setValue(usernameField, username);
      filledUsername = true;
    }
    if (passwordField && password) {
      setValue(passwordField, password);
      filledPassword = true;
    }
    return { filledUsername, filledPassword };
  };

  const report = (result) => {
    // Password is the last step; once it's in, forget the credential
    if (result.filledPassword || (!password && result.filledUsername)) {
      chrome.runtime.sendMessage({ type: "AUTOFILL_DONE" });
      return true;
    }
    return false;
  };

  if (report(tryFill())) return;

  // Single-page apps often render the form after "load"; watch briefly for it
  const observer = new MutationObserver(() => {
    if (report(tryFill())) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15000);
}
