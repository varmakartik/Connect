import React, { useState } from "react";
import { ExternalLink, Copy, Check, Eye, EyeOff, Pencil, Trash2, Link2, ClipboardList, AlertTriangle } from "lucide-react";
import { getHostname } from "./credentialUtils";

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-purple-500 to-violet-600",
  "from-sky-500 to-cyan-600",
];

const CredentialCard = ({ item, secret, copiedKey, onCopy, onOpen, onEdit, onDelete, isDarkMode = true }) => {
  const [revealed, setRevealed] = useState(false);
  const hostname = getHostname(item.url);
  const initial = (item.title || hostname || "?").trim().charAt(0).toUpperCase();
  const colorIdx = [...hostname].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const isCopied = (field) => copiedKey === `${item.id}:${field}`;
  const failed = secret?.error;

  const rowCls = `flex items-center gap-2 h-10 pl-3 pr-1 rounded-xl border ${
    isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
  }`;
  const iconBtn = `p-2 rounded-lg transition cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
    isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
  }`;
  const copiedCls = "text-emerald-400!";

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors animate-popIn ${
        isDarkMode
          ? "bg-[#0b1329]/95 border-slate-800/90 hover:border-blue-500/40"
          : "bg-white border-slate-200 shadow-sm hover:border-blue-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} text-white font-black flex items-center justify-center shrink-0 shadow-md`}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-extrabold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`} title={item.title}>
            {item.title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate" title={item.url}>
            {hostname}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpen(item, secret)}
          disabled={failed}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md shadow-blue-600/25 active:scale-95 transition cursor-pointer shrink-0 disabled:opacity-40"
          title="Open the login page and fill in this credential"
        >
          <ExternalLink size={14} />
          <span>Open</span>
        </button>
      </div>

      {failed ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
          <AlertTriangle size={14} className="shrink-0" />
          <span>This entry could not be decrypted.</span>
        </div>
      ) : (
        <>
          {/* Username */}
          <div className={rowCls}>
            <span className={`flex-1 min-w-0 truncate text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              {secret?.username || <span className="text-slate-500 italic">No username</span>}
            </span>
            <button
              type="button"
              onClick={() => onCopy(item, "username", secret?.username)}
              disabled={!secret?.username}
              className={`${iconBtn} ${isCopied("username") ? copiedCls : ""}`}
              title="Copy username"
              aria-label="Copy username"
            >
              {isCopied("username") ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Password */}
          <div className={rowCls}>
            <span className={`flex-1 min-w-0 truncate text-xs font-mono ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              {secret?.password
                ? revealed
                  ? secret.password
                  : "•".repeat(Math.min(secret.password.length, 14))
                : <span className="text-slate-500 italic font-sans">No password</span>}
            </span>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              disabled={!secret?.password}
              className={iconBtn}
              title={revealed ? "Hide password" : "Show password"}
              aria-label={revealed ? "Hide password" : "Show password"}
            >
              {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              type="button"
              onClick={() => onCopy(item, "password", secret?.password, true)}
              disabled={!secret?.password}
              className={`${iconBtn} ${isCopied("password") ? copiedCls : ""}`}
              title="Copy password"
              aria-label="Copy password"
            >
              {isCopied("password") ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </>
      )}

      {/* Footer actions */}
      <div className={`grid grid-cols-4 gap-1 pt-2 border-t text-[11px] font-bold ${isDarkMode ? "border-slate-800/70" : "border-slate-100"}`}>
        <button
          type="button"
          onClick={() => onCopy(item, "url", item.url)}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg cursor-pointer transition ${
            isCopied("url") ? "text-emerald-400" : "text-slate-400 hover:text-blue-400"
          }`}
          title="Copy website URL"
        >
          {isCopied("url") ? <Check size={12} /> : <Link2 size={12} />}
          <span>URL</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onCopy(
              item,
              "all",
              `Website: ${item.url}\nUsername: ${secret?.username || ""}\nPassword: ${secret?.password || ""}`,
              true
            )
          }
          disabled={failed}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg cursor-pointer transition disabled:opacity-30 ${
            isCopied("all") ? "text-emerald-400" : "text-slate-400 hover:text-blue-400"
          }`}
          title="Copy website, username and password together"
        >
          {isCopied("all") ? <Check size={12} /> : <ClipboardList size={12} />}
          <span>Copy all</span>
        </button>
        <button
          type="button"
          onClick={() => onEdit(item, secret)}
          disabled={failed}
          className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-slate-400 hover:text-amber-400 cursor-pointer transition disabled:opacity-30"
          title="Edit credential"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer transition"
          title="Delete credential"
        >
          <Trash2 size={12} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(CredentialCard);
