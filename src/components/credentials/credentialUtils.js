// Accept "github.com/login" or a full URL; only http(s) is allowed so a stored
// value can never become a javascript: link when opened.
export const normalizeUrl = (raw) => {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".") && parsed.hostname !== "localhost") return null;
    return parsed.href;
  } catch {
    return null;
  }
};

export const getHostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
};

const CLIPBOARD_CLEAR_MS = 60 * 1000;
let lastSecretCopy = null;

/**
 * Copy text to the clipboard. Secrets are wiped from the clipboard after a
 * minute, but only if nothing else was copied through Connect since and the
 * page has focus (browsers refuse clipboard writes from background tabs).
 */
export const copyToClipboard = (text, { secret = false } = {}) => {
  const promise = navigator.clipboard.writeText(text);
  if (secret) {
    const token = {};
    lastSecretCopy = token;
    setTimeout(() => {
      if (lastSecretCopy === token && document.hasFocus()) {
        navigator.clipboard.writeText("").catch(() => {});
      }
    }, CLIPBOARD_CLEAR_MS);
  } else {
    lastSecretCopy = null;
  }
  return promise;
};
