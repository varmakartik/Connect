import React from "react";
import { Edit3 } from "lucide-react";

const NotepadEditorBody = ({
  activeNote,
  currentContent,
  isDarkMode = true,
  onContentChange,
  children,
}) => {
  return (
    <div
      className={`flex-1 relative overflow-hidden flex flex-col ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {activeNote ? (
        <>
          <textarea
            className={`w-full flex-1 p-6 text-sm font-medium leading-relaxed resize-none outline-none custom-scrollbar transition-colors ${
              isDarkMode
                ? "bg-slate-950 text-slate-100 placeholder-slate-600 focus:bg-slate-950"
                : "bg-white text-slate-800 placeholder-slate-400 focus:bg-white"
            }`}
            placeholder="Type your notes here... (Ctrl+S to save)"
            value={currentContent}
            onChange={(e) => onContentChange(e.target.value)}
          />
          {children}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
          <div
            className={`p-4 rounded-3xl mb-4 border ${
              isDarkMode
                ? "bg-slate-900/50 border-slate-800 text-slate-600"
                : "bg-slate-100 border-slate-200 text-slate-400"
            }`}
          >
            <Edit3 size={36} />
          </div>
          <h3
            className={`text-base font-bold mb-1 ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            No Note Selected
          </h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Select a note tab above or click the + button to create a new note tab (e.g. Note 1).
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(NotepadEditorBody);
