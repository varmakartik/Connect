import React, { useState } from "react";
import { X } from "lucide-react";

const NotepadTabItem = ({
  tab,
  isActive,
  hasDraft,
  displayTitle,
  isEditingInline,
  onSelect,
  onDelete,
  onStartInlineEdit,
  onSaveInlineEdit,
  isDarkMode = true,
  children,
}) => {
  const [inlineTitle, setInlineTitle] = useState(displayTitle);

  return (
    <div
      className={`tab-transition group flex items-center text-xs font-semibold cursor-pointer shrink-0 gap-1.5 pl-3 pr-1.5 h-8 rounded-lg border max-w-[160px] sm:max-w-[200px] ${
        isActive
          ? isDarkMode
            ? "bg-slate-800/80 border-slate-700 text-white"
            : "bg-white border-slate-300 text-blue-600 shadow-sm"
          : isDarkMode
          ? "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
          : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200/80 hover:text-slate-700"
      }`}
      onClick={() => onSelect(tab.id)}
    >
      {isEditingInline ? (
        <input
          type="text"
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          onBlur={() => onSaveInlineEdit(tab.id, inlineTitle)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveInlineEdit(tab.id, inlineTitle);
            if (e.key === "Escape") onSaveInlineEdit(tab.id, displayTitle);
          }}
          className={`px-2 py-0.5 rounded outline-none border text-xs w-24 font-bold ${
            isDarkMode
              ? "bg-slate-950 border-blue-500 text-white"
              : "bg-white border-blue-600 text-blue-600"
          }`}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="min-w-0 truncate"
          onDoubleClick={(e) => {
            e.stopPropagation();
            onStartInlineEdit(tab);
          }}
          title="Double-click to rename tab"
        >
          {displayTitle || "Note 1"}
        </span>
      )}

      {children}

      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-250 ${
          hasDraft ? "bg-amber-500 animate-pulse" : isActive ? "bg-emerald-500" : "bg-emerald-500/50"
        }`}
        title={hasDraft ? "Unsaved changes" : "Saved"}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(tab.id);
        }}
        className={`text-slate-400 hover:text-red-500 transition p-1 rounded-md hover:bg-slate-500/20 ${isActive ? "opacity-100" : "opacity-60 sm:opacity-0 sm:group-hover:opacity-100"}`}
        title="Close tab"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default React.memo(NotepadTabItem);
