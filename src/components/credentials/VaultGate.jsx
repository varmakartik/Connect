import React, { useState } from "react";
import { LockKeyhole, ShieldCheck, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";

// Setup / unlock / reset screen shown while the vault has no key in memory.
const VaultGate = ({ hasVault, onCreate, onUnlock, onReset, isDarkMode = true }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetText, setResetText] = useState("");

  const inputCls = `w-full h-11 rounded-xl px-3.5 pr-10 text-sm outline-none border transition ${
    isDarkMode
      ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500/60"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600/60"
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!hasVault) {
      if (password.length < 8) return setError("Use at least 8 characters.");
      if (password !== confirm) return setError("Passwords do not match.");
    } else if (!password) {
      return setError("Enter your vault password.");
    }

    setBusy(true);
    try {
      if (hasVault) await onUnlock(password);
      else await onCreate(password);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      await onReset();
      setShowReset(false);
      setResetText("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Reset failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm rounded-3xl border p-6 sm:p-8 shadow-2xl animate-popIn ${
          isDarkMode ? "bg-[#0b1329] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
            {hasVault ? <LockKeyhole size={26} /> : <ShieldCheck size={26} />}
          </div>
          <h2 className="text-lg font-black tracking-tight">
            {hasVault ? "Unlock Credentials" : "Create Your Vault"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {hasVault
              ? "Enter your vault password to view saved logins."
              : "Set a vault password. Your logins are encrypted in this browser with it before being saved."}
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Vault password"
              autoComplete={hasVault ? "current-password" : "new-password"}
              className={inputCls}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {!hasVault && (
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm vault password"
              autoComplete="new-password"
              className={inputCls}
            />
          )}

          {error && <p className="text-xs font-bold text-red-400">{error}</p>}

          {!hasVault && (
            <div className="flex gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] leading-relaxed text-left">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>
                This password cannot be recovered. If you forget it, saved credentials are lost and the vault must be reset.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold shadow-lg shadow-blue-600/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {hasVault ? (busy ? "Unlocking..." : "Unlock") : busy ? "Creating..." : "Create Vault"}
          </button>
        </div>

        {hasVault && !showReset && (
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="mt-5 w-full text-[11px] font-bold text-slate-500 hover:text-red-400 transition cursor-pointer"
          >
            Forgot vault password?
          </button>
        )}

        {hasVault && showReset && (
          <div className="mt-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 text-left space-y-2.5">
            <p className="text-[11px] text-red-300 leading-relaxed">
              Resetting permanently deletes <strong>every saved credential</strong> so you can create a new vault. Type{" "}
              <strong>RESET</strong> to confirm.
            </p>
            <input
              value={resetText}
              onChange={(e) => setResetText(e.target.value)}
              placeholder="RESET"
              className={`${inputCls} h-9 text-xs`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setResetText("");
                }}
                className="flex-1 h-9 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetText !== "RESET" || busy}
                onClick={handleReset}
                className="flex-1 h-9 rounded-lg text-xs font-extrabold bg-red-600 hover:bg-red-500 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reset Vault
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VaultGate;
