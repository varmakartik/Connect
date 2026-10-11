import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LockKeyhole, Plus, Search, Lock, ShieldCheck, Zap, X } from "lucide-react";
import ToastNotification from "./common/ToastNotification";
import ConfirmModal from "./canvas/ConfirmModal";
import VaultGate from "./credentials/VaultGate";
import CredentialCard from "./credentials/CredentialCard";
import CredentialFormModal from "./credentials/CredentialFormModal";
import { copyToClipboard } from "./credentials/credentialUtils";
import {
  AUTO_LOCK_MINUTES,
  createVault,
  decryptJSON,
  encryptJSON,
  getSessionKey,
  lockSession,
  setSessionKey,
  touchSession,
  unlockVault,
} from "../lib/vault";

// The Connect Autofill extension marks the page when it's installed (extension/bridge.js)
const getAutofillExtension = () => document.documentElement.dataset.connectAutofill || null;

const CredentialVault = ({ items = [], onUpsert, onDelete, onDeleteMultiple, isDarkMode = true }) => {
  const [vaultKey, setVaultKey] = useState(() => getSessionKey());
  const [secrets, setSecrets] = useState({}); // id -> { username, password } | { error }
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [formState, setFormState] = useState(null); // { initial } while the form is open
  const [pendingDelete, setPendingDelete] = useState(null);
  const decryptCache = useRef(new Map()); // `${id}:${content}` -> secret
  const [autofillVersion] = useState(getAutofillExtension);
  const [hideAutofillHint, setHideAutofillHint] = useState(() => {
    try {
      return localStorage.getItem("connect_hide_autofill_hint") === "1";
    } catch {
      return false;
    }
  });

  // Errors reported back by the extension for an "open and fill" request
  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== window || event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.source !== "connect-extension" || data.type !== "AUTOFILL_RESULT" || data.ok) return;
      setToast({ type: "error", title: "Autofill Failed", message: data.error || "The extension could not open the site." });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Oldest vault row wins if two were ever created concurrently
  const vaultRow = useMemo(
    () =>
      items
        .filter((i) => i.type === "vault")
        .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))[0],
    [items]
  );

  const credentials = useMemo(
    () =>
      items
        .filter((i) => i.type === "credential")
        .sort((a, b) => (a.title || "").localeCompare(b.title || "")),
    [items]
  );

  // Auto-lock: poll the in-memory session and refresh it on interaction
  useEffect(() => {
    if (!vaultKey) return;
    const timer = setInterval(() => {
      if (!getSessionKey()) {
        setVaultKey(null);
        setToast({ type: "info", title: "Vault Locked", message: `Locked after ${AUTO_LOCK_MINUTES} minutes of inactivity.` });
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [vaultKey]);

  // Decrypt entries whenever rows or the key change; unchanged rows come from cache
  useEffect(() => {
    if (!vaultKey) return;
    let active = true;
    Promise.all(
      credentials.map(async (row) => {
        const cacheKey = `${row.id}:${row.content}`;
        if (decryptCache.current.has(cacheKey)) return [row.id, decryptCache.current.get(cacheKey)];
        let value;
        try {
          value = await decryptJSON(vaultKey, row.content);
        } catch {
          value = { error: true };
        }
        decryptCache.current.set(cacheKey, value);
        return [row.id, value];
      })
    ).then((entries) => {
      if (active) setSecrets(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [credentials, vaultKey]);

  const handleLock = useCallback(() => {
    lockSession();
    decryptCache.current.clear();
    setSecrets({});
    setVaultKey(null);
  }, []);

  const handleCreateVault = useCallback(
    async (password) => {
      const { meta, key } = await createVault(password);
      await onUpsert({ type: "vault", title: "Credential Vault", content: meta });
      setSessionKey(key);
      setVaultKey(key);
    },
    [onUpsert]
  );

  const handleUnlock = useCallback(
    async (password) => {
      const key = await unlockVault(password, vaultRow.content);
      setSessionKey(key);
      setVaultKey(key);
    },
    [vaultRow]
  );

  const handleResetVault = useCallback(async () => {
    const ids = items.filter((i) => i.type === "credential" || i.type === "vault").map((i) => i.id);
    await onDeleteMultiple(ids);
    handleLock();
    setToast({ type: "info", title: "Vault Reset", message: "All credentials were deleted. Create a new vault password." });
  }, [items, onDeleteMultiple, handleLock]);

  const handleCopy = useCallback((item, field, text, secret = false) => {
    if (!text) return;
    touchSession();
    copyToClipboard(text, { secret })
      .then(() => {
        setCopiedKey(`${item.id}:${field}`);
        setTimeout(() => setCopiedKey((k) => (k === `${item.id}:${field}` ? null : k)), 1800);
      })
      .catch(() => setToast({ type: "error", title: "Copy Failed", message: "The browser blocked clipboard access." }));
  }, []);

  // With the extension installed, hand the login to it: it opens the site and
  // fills the form. Without it a website can't fill another site's form, so put
  // the password on the clipboard (while this page has focus) and open the page.
  const handleOpen = useCallback((item, secret) => {
    touchSession();

    if (autofillVersion) {
      window.postMessage(
        {
          source: "connect-app",
          type: "AUTOFILL_OPEN",
          requestId: `${item.id}:${Date.now()}`,
          url: item.url,
          username: secret?.username || "",
          password: secret?.password || "",
        },
        window.location.origin
      );
      return;
    }

    const toCopy = secret?.password || secret?.username;
    if (toCopy) {
      copyToClipboard(toCopy, { secret: true }).catch(() => {});
    }
    window.open(item.url, "_blank", "noopener,noreferrer");
    if (toCopy) {
      setToast({
        type: "success",
        title: secret?.password ? "Password Copied" : "Username Copied",
        message: "Paste it into the login form on the page that just opened.",
      });
    }
  }, [autofillVersion]);

  const handleSave = useCallback(
    async ({ title, url, username, password }) => {
      const key = getSessionKey();
      if (!key) {
        setVaultKey(null);
        throw new Error("Vault locked. Unlock it and try again.");
      }
      touchSession();
      const content = await encryptJSON(key, { username, password });
      await onUpsert({ id: formState?.initial?.id, type: "credential", title, url, content });
      setToast({ type: "success", title: "Credential Saved", message: `"${title}" is stored encrypted.` });
    },
    [onUpsert, formState]
  );

  const handleEdit = useCallback((item, secret) => {
    setFormState({ initial: { id: item.id, title: item.title, url: item.url, ...secret } });
  }, []);

  const closeForm = useCallback(() => setFormState(null), []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return credentials;
    return credentials.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.url || "").toLowerCase().includes(q) ||
        (secrets[c.id]?.username || "").toLowerCase().includes(q)
    );
  }, [credentials, secrets, searchQuery]);

  if (!vaultKey) {
    return (
      <div className={`flex-1 flex flex-col ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
        <ToastNotification notification={toast} onClose={() => setToast(null)} />
        <VaultGate
          hasVault={!!vaultRow}
          onCreate={handleCreateVault}
          onUnlock={handleUnlock}
          onReset={handleResetVault}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col p-3 sm:p-6 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}
      onPointerDown={touchSession}
      onKeyDown={touchSession}
    >
      <ToastNotification notification={toast} onClose={() => setToast(null)} />

      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">Credentials</h2>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" />
                {credentials.length} saved · end-to-end encrypted
                {autofillVersion && (
                  <span className="ml-1 inline-flex items-center gap-0.5 text-blue-400">
                    · <Zap size={10} /> Autofill on
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLock}
            className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
            title="Lock vault"
          >
            <Lock size={14} />
            <span>Lock</span>
          </button>
          <button
            type="button"
            onClick={() => setFormState({ initial: null })}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/25 cursor-pointer transition active:scale-95"
          >
            <Plus size={15} />
            <span>Add</span>
          </button>
        </div>

        {!autofillVersion && !hideAutofillHint && (
          <div
            className={`flex items-start gap-2.5 p-3 mb-4 rounded-xl border text-xs leading-relaxed ${
              isDarkMode ? "bg-blue-500/5 border-blue-500/20 text-slate-300" : "bg-blue-50 border-blue-200 text-slate-700"
            }`}
          >
            <Zap size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <span className="flex-1">
              <strong>Want logins filled in automatically?</strong> Install the <strong>Connect Autofill</strong> browser
              extension (desktop Chrome, Edge or Brave). Without it, <em>Open</em> copies the password for you to paste.
            </span>
            <button
              type="button"
              onClick={() => {
                setHideAutofillHint(true);
                try {
                  localStorage.setItem("connect_hide_autofill_hint", "1");
                } catch {
                  // Hint will just show again next time
                }
              }}
              className="p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {credentials.length > 0 && (
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, website or username..."
              className={`w-full h-11 pl-10 pr-3 rounded-xl text-sm outline-none border transition ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500/50"
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600/50"
              }`}
            />
          </div>
        )}

        {credentials.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/25 text-blue-400 flex items-center justify-center mb-4">
              <LockKeyhole size={28} />
            </div>
            <h3 className="text-base font-extrabold mb-1">No credentials yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              Save a website login. Use Open to copy the password and jump straight to the login page.
            </p>
            <button
              type="button"
              onClick={() => setFormState({ initial: null })}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold cursor-pointer"
            >
              <Plus size={15} />
              Add your first credential
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">No credentials match "{searchQuery}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <CredentialCard
                key={item.id}
                item={item}
                secret={secrets[item.id]}
                copiedKey={copiedKey?.startsWith(`${item.id}:`) ? copiedKey : null}
                onCopy={handleCopy}
                onOpen={handleOpen}
                onEdit={handleEdit}
                onDelete={setPendingDelete}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}
      </div>

      {formState && (
        <CredentialFormModal
          key={formState.initial?.id || "new"}
          initial={formState.initial}
          onClose={closeForm}
          onSave={handleSave}
          isDarkMode={isDarkMode}
        />
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          const target = pendingDelete;
          setPendingDelete(null);
          await onDelete(target.id);
        }}
        title="Delete Credential?"
        message={`"${pendingDelete?.title}" will be permanently deleted.`}
        confirmText="Delete"
        isDanger
      />
    </div>
  );
};

export default React.memo(CredentialVault);
