import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Wand2, Loader2, Globe, User, KeyRound, Tag } from "lucide-react";
import { normalizeUrl } from "./credentialUtils";

const generatePassword = (length = 20) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+?";
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

// Add / edit form, mounted only while open. `initial` is null for a new credential.
const CredentialFormModal = ({ initial, onClose, onSave, isDarkMode = true }) => {
  const [name, setName] = useState(initial?.title || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [password, setPassword] = useState(initial?.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const normalized = normalizeUrl(url);
    if (!normalized) return setError("Enter a valid website URL (e.g. github.com/login).");
    if (!username.trim() && !password) return setError("Enter a username/email or a password.");

    setSaving(true);
    try {
      await onSave({
        title: name.trim() || new URL(normalized).hostname.replace(/^www\./, ""),
        url: normalized,
        username: username.trim(),
        password,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Could not save credential.");
      setSaving(false);
    }
  };

  const fieldWrap = `flex items-center gap-2.5 h-11 px-3.5 rounded-xl border transition focus-within:border-blue-500/60 ${
    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
  }`;
  const inputCls = `flex-1 min-w-0 bg-transparent outline-none text-sm ${
    isDarkMode ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
  }`;
  const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Edit credential" : "Add credential"}
        className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar ${
          isDarkMode ? "bg-[#0b1329] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black">{initial ? "Edit Credential" : "Add Credential"}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Website URL</label>
            <div className={fieldWrap}>
              <Globe size={15} className="text-slate-400 shrink-0" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/login"
                inputMode="url"
                autoComplete="off"
                className={inputCls}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Username / Email</label>
            <div className={fieldWrap}>
              <User size={15} className="text-slate-400 shrink-0" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <div className={fieldWrap}>
              <KeyRound size={15} className="text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                spellCheck={false}
                className={`${inputCls} font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassword(generatePassword());
                  setShowPassword(true);
                }}
                className="text-slate-400 hover:text-blue-400 cursor-pointer"
                title="Generate a strong password"
                aria-label="Generate password"
              >
                <Wand2 size={15} />
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>Name (optional)</label>
            <div className={fieldWrap}>
              <Tag size={15} className="text-slate-400 shrink-0" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Defaults to the website name"
                className={inputCls}
              />
            </div>
          </div>

          {error && <p className="text-xs font-bold text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 h-11 rounded-xl text-sm font-bold border cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold shadow-lg shadow-blue-600/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Encrypting..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CredentialFormModal;
