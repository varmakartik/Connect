import React, { useState, useCallback, useRef, useEffect } from "react";
import { Palette, Copy, Check, Save, Download, ChevronDown, FileText, Code, FileSpreadsheet, Printer, Terminal } from "lucide-react";
import { NOTE_COLORS, resolveNoteColor } from "./noteColors";

const EXPORT_OPTIONS = [
  { id: "txt", label: "Plain Text (.txt)", icon: <FileText size={13} /> },
  { id: "md", label: "Markdown (.md)", icon: <Code size={13} /> },
  { id: "docx", label: "Word Doc (.docx)", icon: <FileText size={13} /> },
  { id: "xlsx", label: "Excel Sheet (.xlsx)", icon: <FileSpreadsheet size={13} /> },
  { id: "pdf", label: "Print / PDF (.pdf)", icon: <Printer size={13} /> },
];

const NotepadActionBar = ({
  currentTitle,
  currentContent,
  isDirty,
  isSaving,
  activeNote,
  onTitleChange,
  onSave,
  autoSaveEnabled = true,
  onToggleAutoSave,
  textColor = "default",
  onTextColorChange,
  isDarkMode = true,
  onDownload,
  onShare,
  isSharing,
  children,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // "export" | "color" | null
  const exportRef = useRef(null);
  const colorRef = useRef(null);

  const handleCopyAll = useCallback(async () => {
    if (!currentContent) return;
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Failed to copy note:", err);
    }
  }, [currentContent]);

  // Click outside to close whichever dropdown is open
  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (e) => {
      const ref = openMenu === "export" ? exportRef : colorRef;
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenu]);

  const iconBtn = `flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-40 disabled:cursor-not-allowed ${
    isDarkMode
      ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
      : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
  }`;

  const menuPanel = `absolute top-full mt-1.5 rounded-xl border shadow-xl z-50 overflow-hidden animate-slideIn ${
    isDarkMode
      ? "bg-[#0c1424]/95 border-slate-800 text-white backdrop-blur-xl shadow-black/45"
      : "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
  }`;

  const activeColorHex = resolveNoteColor(textColor, isDarkMode);

  return (
    <div
      className={`px-3 sm:px-4 py-2 flex flex-col lg:flex-row lg:items-center gap-2 border-b transition-colors ${
        isDarkMode ? "bg-[#070d18] border-slate-800/80 text-white" : "bg-white border-slate-200"
      }`}
    >
      {/* Title + status + save */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="text"
          className={`h-8 rounded-lg px-3 text-sm font-bold outline-none transition-colors flex-1 min-w-0 border ${
            isDarkMode
              ? "bg-transparent border-transparent hover:border-slate-800 text-white focus:border-blue-500/60 focus:bg-slate-950/80"
              : "bg-transparent border-transparent hover:border-slate-200 text-slate-900 focus:border-blue-600/60 focus:bg-slate-50"
          }`}
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isDirty) onSave();
          }}
          placeholder="Untitled note"
          disabled={!activeNote}
          aria-label="Note title"
        />

        {activeNote && (
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold shrink-0 ${
              isSaving ? "text-blue-400" : isDirty ? "text-amber-400" : "text-emerald-400"
            }`}
            title={isSaving ? "Saving..." : isDirty ? "Unsaved changes" : "All changes saved"}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSaving ? "bg-blue-400 animate-pulse" : isDirty ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            <span className="hidden sm:inline">{isSaving ? "Saving" : isDirty ? "Unsaved" : "Saved"}</span>
          </span>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving || !activeNote}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold transition-all duration-200 border shrink-0 ${
            isDirty && !isSaving
              ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
              : isDarkMode
              ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          title="Save (Ctrl+S)"
        >
          <Save size={14} />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Compact tool row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Text color popover */}
        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => setOpenMenu((m) => (m === "color" ? null : "color"))}
            disabled={!activeNote}
            className={iconBtn}
            title="Text color"
            aria-label="Text color"
            aria-expanded={openMenu === "color"}
          >
            <Palette size={14} />
            <span
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: activeColorHex }}
            />
          </button>
          {openMenu === "color" && (
            <div className={`${menuPanel} left-0 p-2 flex items-center gap-2`}>
              {NOTE_COLORS.map((opt) => {
                const isSelected = textColor === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onTextColorChange(opt.id);
                      setOpenMenu(null);
                    }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? `ring-2 ring-sky-400 ring-offset-2 ${isDarkMode ? "ring-offset-[#0c1424]" : "ring-offset-white"} scale-110`
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: isDarkMode ? opt.dark : opt.light }}
                    title={opt.label}
                    aria-label={`Text color ${opt.label}`}
                  >
                    {isSelected && (
                      <Check size={12} className={opt.id === "default" && isDarkMode ? "text-slate-900" : "text-white"} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Auto Save toggle */}
        <button
          type="button"
          onClick={onToggleAutoSave}
          className={`${iconBtn} ${
            autoSaveEnabled
              ? isDarkMode
                ? "bg-emerald-950/40! border-emerald-500/30! text-emerald-400!"
                : "bg-emerald-50! border-emerald-300! text-emerald-700!"
              : ""
          }`}
          title={autoSaveEnabled ? "Auto Save is ON" : "Auto Save is OFF"}
          aria-pressed={autoSaveEnabled}
        >
          <span className="text-[11px]">Auto</span>
          <span className={`w-6 h-3.5 rounded-full p-0.5 transition-colors ${autoSaveEnabled ? "bg-emerald-500" : "bg-slate-600"}`}>
            <span
              className={`block w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                autoSaveEnabled ? "translate-x-2.5" : "translate-x-0"
              }`}
            />
          </span>
        </button>

        <span className={`w-px h-5 mx-0.5 ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />

        {/* Copy all */}
        <button
          type="button"
          onClick={handleCopyAll}
          disabled={!activeNote || !currentContent}
          className={`${iconBtn} ${copiedAll ? "bg-emerald-500/20! text-emerald-400! border-emerald-500/40!" : ""}`}
          title="Copy entire note"
          aria-label={copiedAll ? "Note text copied" : "Copy all note text"}
        >
          {copiedAll ? <Check size={14} /> : <Copy size={14} />}
          <span className="hidden md:inline">{copiedAll ? "Copied" : "Copy"}</span>
        </button>

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setOpenMenu((m) => (m === "export" ? null : "export"))}
            disabled={!activeNote}
            className={`${iconBtn} ${openMenu === "export" ? "bg-blue-600! text-white! border-blue-500!" : ""}`}
            title="Export note"
            aria-expanded={openMenu === "export"}
          >
            <Download size={14} />
            <span className="hidden md:inline">Export</span>
            <ChevronDown size={11} className={`transition-transform ${openMenu === "export" ? "rotate-180" : ""}`} />
          </button>
          {openMenu === "export" && (
            <div className={`${menuPanel} left-0 lg:left-auto lg:right-0 w-44`}>
              {EXPORT_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onDownload(item.id);
                    setOpenMenu(null);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isDarkMode ? "hover:bg-slate-800/80 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="text-slate-400 shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Share to terminal */}
        <button
          type="button"
          onClick={onShare}
          disabled={!activeNote || isSharing}
          className={`${iconBtn} ${isSharing ? "animate-pulse" : ""}`}
          title="Share note as a CLI command"
        >
          {isSharing ? (
            <span className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
          ) : (
            <Terminal size={14} />
          )}
          <span className="hidden md:inline">{isSharing ? "Sharing..." : "Share CLI"}</span>
        </button>

        {children}
      </div>
    </div>
  );
};

export default React.memo(NotepadActionBar);
