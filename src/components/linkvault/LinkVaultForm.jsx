import React from "react";
import { Bookmark, Globe, Plus, Link as LinkIcon } from "lucide-react";

const LinkVaultForm = ({
  title,
  setTitle,
  url,
  setUrl,
  isAdding,
  onSubmit,
  isDarkMode = true,
  children,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-3xl p-6 sm:p-7 mb-8 border backdrop-blur-2xl transition-all shadow-2xl relative overflow-hidden group ${
        isDarkMode
          ? "bg-slate-900/90 border-slate-800/90 text-white shadow-black/60 hover:border-blue-500/30"
          : "bg-white border-slate-200 text-slate-900 shadow-slate-200/80 hover:border-blue-400/40"
      }`}
    >
      {/* Decorative Gradient Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-500" />

      <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/60 relative z-10">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 shadow-inner">
          <LinkIcon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            Add New Saved Link
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Quickly bookmark URLs for instant access and 1-click copying.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Bookmark size={13} className="text-blue-400" />
            <span>Link Title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. GitHub Repository, Figma Design..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold outline-none border transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Globe size={13} className="text-indigo-400" />
            <span>Target URL</span>
          </label>
          <input
            type="url"
            placeholder="https://example.com/project"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold outline-none border transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 relative z-10">
        {children}
        <button
          type="submit"
          disabled={isAdding}
          className="ml-auto px-6 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-550 hover:to-indigo-550 text-white shadow-xl shadow-blue-600/25 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Plus size={16} />
          <span>Save Link to Vault</span>
        </button>
      </div>
    </form>
  );
};

export default React.memo(LinkVaultForm);
