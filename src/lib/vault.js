// Client-side encryption for the Credentials vault.
//
// The vault password never leaves the browser. It is stretched with PBKDF2 into
// an AES-256-GCM key; the database only ever sees the salt, a check value and
// ciphertext. The derived key lives in memory for this tab only and is dropped
// after a period of inactivity or on reload.

const KDF_ITERATIONS = 600000;
const CHECK_PLAINTEXT = "connect-vault-ok";
const AUTO_LOCK_MS = 15 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toB64 = (bytes) => {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
};

const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const deriveKey = async (password, saltBytes, iterations) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable: the raw key can't be read back out of memory via the API
    ["encrypt", "decrypt"]
  );
};

const encryptString = async (key, text) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
  return { v: 1, iv: toB64(iv), ct: toB64(ct) };
};

const decryptString = async (key, payload) => {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(payload.iv) },
    key,
    fromB64(payload.ct)
  );
  return decoder.decode(plain);
};

export const encryptJSON = async (key, value) =>
  JSON.stringify(await encryptString(key, JSON.stringify(value)));

export const decryptJSON = async (key, stored) =>
  JSON.parse(await decryptString(key, JSON.parse(stored)));

/** Create vault metadata for a new vault password. Returns { meta, key }. */
export const createVault = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt, KDF_ITERATIONS);
  const meta = {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iterations: KDF_ITERATIONS,
    salt: toB64(salt),
    check: await encryptString(key, CHECK_PLAINTEXT),
  };
  return { meta: JSON.stringify(meta), key };
};

/** Derive the key from a vault password; throws if the password is wrong. */
export const unlockVault = async (password, metaString) => {
  const meta = JSON.parse(metaString);
  const key = await deriveKey(password, fromB64(meta.salt), meta.iterations);
  let check;
  try {
    check = await decryptString(key, meta.check);
  } catch {
    throw new Error("Incorrect vault password.");
  }
  if (check !== CHECK_PLAINTEXT) throw new Error("Incorrect vault password.");
  return key;
};

// ---- In-memory session key ------------------------------------------------

let sessionKey = null;
let lastActivity = 0;

export const setSessionKey = (key) => {
  sessionKey = key;
  lastActivity = Date.now();
};

export const getSessionKey = () => {
  if (sessionKey && Date.now() - lastActivity > AUTO_LOCK_MS) sessionKey = null;
  return sessionKey;
};

export const touchSession = () => {
  if (sessionKey) lastActivity = Date.now();
};

export const lockSession = () => {
  sessionKey = null;
};

export const AUTO_LOCK_MINUTES = AUTO_LOCK_MS / 60000;
