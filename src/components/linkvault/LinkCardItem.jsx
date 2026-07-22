import React from "react";
import { Link2, ExternalLink, Copy, Check, Trash2 } from "lucide-react";

const LinkCardItem = ({
  linkItem,
  copiedId,
  onCopy,
  onDelete,
  isDarkMode = true,
  children,
}) => {
  const isCopied = copiedId === linkItem.id;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between hover:shadow-lg group ${
        isDarkMode
          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-white"
          : "bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
            <Link2 size={16} />
          </div>
          <h4 className="text-sm font-bold truncate tracking-tight">
            {linkItem.title || "Untitled Link"}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => onDelete(linkItem.id)}
          className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
          title="Delete Link"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className="text-xs text-slate-400 font-mono truncate mb-4 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
        {linkItem.url || "No URL specified"}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCopy(linkItem)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
            isCopied
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : isDarkMode
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          <span>{isCopied ? "Copied!" : "Copy Link"}</span>
        </button>

        {linkItem.url && (
          <a
            href={linkItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-blue-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition"
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
        )}
        {children}
      </div>
    </div>
  );
};

export default React.memo(LinkCardItem);
