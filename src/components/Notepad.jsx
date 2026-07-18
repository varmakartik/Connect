import React, { useState } from "react";
import { Plus, X, Save, Edit3, Sun, Moon } from "lucide-react";

const Notepad = ({ tabs, activeTabId, setActiveTabId, onAddTab, onUpdate, onDelete }) => {
  const [drafts, setDrafts] = useState({}); // maps noteId -> { content, title }
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [deletingTabId, setDeletingTabId] = useState(null);

  const activeNote = tabs.find((t) => t.id === activeTabId);

  // Derive current values from draft or saved data
  const currentContent = drafts[activeTabId] !== undefined 
    ? drafts[activeTabId].content 
    : (activeNote?.content || "");

  const currentTitle = drafts[activeTabId] !== undefined 
    ? drafts[activeTabId].title 
    : (activeNote?.title || "");

  const isDirty = drafts[activeTabId] !== undefined;

  const handleContentChange = (val) => {
    if (!activeNote) return;
    const dbContent = activeNote.content || "";
    const dbTitle = activeNote.title || "";
    const activeDraft = drafts[activeTabId] || { title: dbTitle };

    const isContentDifferent = val !== dbContent;
    const isTitleDifferent = activeDraft.title !== dbTitle;

    if (isContentDifferent || isTitleDifferent) {
      setDrafts((prev) => ({
        ...prev,
        [activeTabId]: { content: val, title: activeDraft.title },
      }));
    } else {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[activeTabId];
        return next;
      });
    }
  };

  const handleTitleChange = (val) => {
    if (!activeNote) return;
    const dbContent = activeNote.content || "";
    const dbTitle = activeNote.title || "";
    const activeDraft = drafts[activeTabId] || { content: dbContent };

    const isContentDifferent = activeDraft.content !== dbContent;
    const isTitleDifferent = val !== dbTitle;

    if (isContentDifferent || isTitleDifferent) {
      setDrafts((prev) => ({
        ...prev,
        [activeTabId]: { content: activeDraft.content, title: val },
      }));
    } else {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[activeTabId];
        return next;
      });
    }
  };

  const handleManualSave = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    await onUpdate(activeNote.id, currentContent, currentTitle);
    
    // Clear local draft after successful sync
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[activeTabId];
      return next;
    });
    setIsSaving(false);
  };

  const handleDeleteTab = (tabId) => {
    setDeletingTabId(tabId);
    setTimeout(() => {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[tabId];
        return next;
      });
      onDelete(tabId);
      setDeletingTabId(null);
    }, 300);
  };

  // Debounced auto-save effect to sync notes automatically
  React.useEffect(() => {
    if (!activeTabId || !drafts[activeTabId]) return;

    const timer = setTimeout(async () => {
      const draft = drafts[activeTabId];
      if (!draft) return;

      setIsSaving(true);
      try {
        await onUpdate(activeTabId, draft.content, draft.title);
        // Clear this draft on successful sync
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[activeTabId];
          return next;
        });
      } catch (e) {
        console.warn("Auto-save sync failed, retrying on next keystroke:", e);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [drafts, activeTabId, onUpdate]);

  return (
    <div
      className={`flex flex-col h-full transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Tabs Row - Mobile Scrollable */}
      <div
        className={`flex items-center gap-1.5 p-2.5 border-b transition-colors ${
          isDarkMode ? "bg-slate-900/60 border-slate-800/80" : "bg-slate-200/50 border-slate-300"
        } overflow-x-auto no-scrollbar`}
      >
        {tabs.map((tab) => {
          const tabDraft = drafts[tab.id];
          const hasDraft = tabDraft !== undefined;
          const displayTitle = tabDraft ? tabDraft.title : (tab.title || "Untitled");
          const isActive = activeTabId === tab.id;
          const isDeleting = deletingTabId === tab.id;

          return (
            <div
              key={tab.id}
              className={`tab-transition flex items-center text-xs font-semibold cursor-pointer shrink-0 ${
                isDeleting
                  ? "scale-90 opacity-0 max-w-0 px-0 mx-0 border-t-transparent overflow-hidden pointer-events-none"
                  : `gap-2.5 px-4 py-2 border-t-2 rounded-xl max-w-[200px] ${
                      isActive
                        ? isDarkMode
                          ? "bg-slate-950 border-t-blue-500 text-white shadow-lg"
                          : "bg-white border-t-blue-600 text-blue-600 shadow-md shadow-slate-200"
                        : isDarkMode
                        ? "bg-slate-900/30 border-t-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                        : "bg-slate-200/30 border-t-transparent text-slate-500 hover:bg-slate-200/80 hover:text-slate-700"
                    }`
              }`}
              onClick={() => !isDeleting && setActiveTabId(tab.id)}
            >
              {!isDeleting && (
                <>
                  <span className="max-w-[100px] truncate">{displayTitle}</span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-250 ${
                      hasDraft ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-sm"
                    }`}
                    title={hasDraft ? "Unsaved changes" : "Saved"}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTab(tab.id);
                    }}
                    className="hover:text-red-500 text-slate-400 transition-colors ml-1 p-0.5 rounded-md hover:bg-slate-805"
                  >
                    <X size={12} />
                  </button>
                </>
              )}
            </div>
          );
        })}
        <button
          onClick={onAddTab}
          className={`p-2 rounded-xl transition shrink-0 ${
            isDarkMode
              ? "hover:bg-slate-850 text-slate-400 hover:text-white bg-slate-900/20"
              : "hover:bg-slate-250 text-slate-500 hover:text-slate-700 bg-slate-200/50"
          }`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Action Bar - Mobile-optimized layout */}
      <div
        className={`px-4 py-3 flex flex-wrap items-center justify-between border-b gap-3 transition-colors ${
          isDarkMode ? "bg-slate-950 border-slate-800/80" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          {/* Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "bg-slate-900 border-slate-850 text-yellow-400 hover:bg-slate-805"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-150"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Title Input */}
          <input
            type="text"
            className={`rounded-xl px-4 py-2 text-sm font-bold outline-none transition-all duration-200 flex-1 min-w-[150px] border ${
              isDarkMode
                ? "bg-slate-900 border-slate-800/80 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600/50 focus:ring-2 focus:ring-blue-600/10"
            }`}
            value={currentTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Tab Name..."
            disabled={!activeNote}
          />
        </div>

        {/* Save Status & Button */}
        <div className="flex items-center gap-4 shrink-0">
          {activeNote && (
            <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-md shadow-emerald-500/25"
                }`}
              />
              <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                {isDirty ? "Unsaved changes" : "Synced"}
              </span>
            </div>
          )}
          <button
            onClick={handleManualSave}
            disabled={!activeNote}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/15"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/15"
            }`}
          >
            <Save size={16} />
            <span>{isSaving ? "Syncing..." : "Save Sync"}</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        {activeNote ? (
          <textarea
            className={`w-full h-full p-6 md:p-8 border rounded-2xl outline-none resize-none leading-relaxed transition-all duration-300 focus:ring-2 focus:ring-blue-500/10 ${
              isDarkMode
                ? "bg-slate-900/40 border-slate-800/80 text-slate-300 font-mono text-sm focus:border-slate-700/80"
                : "bg-white border-slate-200 text-slate-700 font-sans text-base focus:border-slate-350 shadow-inner"
            }`}
            value={currentContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Type your notes here..."
            spellCheck={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-slate-500">
            <Edit3 size={48} className="mb-3 animate-bounce" />
            <p className="font-semibold text-sm">Select a note or create one to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notepad;
