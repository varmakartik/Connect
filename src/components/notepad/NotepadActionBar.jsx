import React from "react";
import { Save, Edit3 } from "lucide-react";

const NotepadActionBar = ({
  currentTitle,
  isDirty,
  isSaving,
  activeNote,
  onTitleChange,
  onSave,
  isDarkMode = true,
  children,
}) => {
  return (
    <div
      className={`px-4 py-3 flex flex-wrap items-center justify-between border-b gap-3 transition-colors ${
        isDarkMode ? "bg-slate-950 border-slate-800/80" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-[240px]">
        {/* Title Input */}
        <input
          type="text"
          className={`rounded-xl px-4 py-2 text-sm font-bold outline-none transition-all duration-200 flex-1 min-w-[150px] border ${
            isDarkMode
              ? "bg-slate-900 border-slate-800/80 text-white focus:border-blue-500/50"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600/50"
          }`}
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isDirty) {
              onSave();
            }
          }}
          placeholder="Note Title (e.g. Note 1)..."
          disabled={!activeNote}
        />
        {children}
      </div>

      {/* Status & Save Trigger */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
          {isSaving ? (
            <span className="text-blue-400 font-bold animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
              Syncing...
            </span>
          ) : isDirty ? (
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Edit3 size={12} /> Unsaved (Ctrl+S)
            </span>
          ) : activeNote ? (
            <span className="text-emerald-500 font-bold">Saved</span>
          ) : null}
        </span>

        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving || !activeNote}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
            isDirty
              ? "bg-blue-600 hover:bg-blue-550 text-white border-blue-500 shadow-md shadow-blue-600/20 active:scale-95"
              : "bg-slate-200/50 border-slate-300 text-slate-400 border-transparent cursor-not-allowed"
          }`}
          title="Save Note (Ctrl+S)"
        >
          <Save size={14} />
          <span>Save (Ctrl+S)</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(NotepadActionBar);