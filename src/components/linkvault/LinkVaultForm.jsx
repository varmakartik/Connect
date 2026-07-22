import React from "react";
import { PlusCircle, Bookmark, Globe, Plus } from "lucide-react";

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
      className={`rounded-3xl p-6 mb-8 border backdrop-blur-xl transition-all shadow-xl ${
        isDarkMode
          ? "bg-slate-900/90 border-slate-800 text-white shadow-black/50"
          : "bg-white border-slate-200 text-slate-900 shadow-slate-200/80"
      }`}
    >
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800/50">
        <div className="p-2 rounded-xl bg-blue-600/15 text-blue-500 border border-blue-500/20">
          <PlusCircle size={20} />
        </div>
        <div>
          <h3 className="text-base font-extrabold tracking-tight">Add New Saved Link</h3>
          <p className="text-xs text-slate-400 font-medium">
            Quickly bookmark URLs for instant access and 1-click copying.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Bookmark size={13} className="text-blue-400" />
            <span>Link Title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. GitHub Repository, Figma Design..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Globe size={13} className="text-blue-400" />
            <span>Target URL</span>
          </label>
          <input
            type="url"
            placeholder="https://example.com/project"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {children}
        <button
          type="submit"
          disabled={isAdding}
          className="ml-auto px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 text-white shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Plus size={16} />
          <span>Save Link to Vault</span>
        </button>
      </div>
    </form>
  );
};

export default React.memo(LinkVaultForm);
