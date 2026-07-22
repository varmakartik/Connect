import React from "react";
import { Edit3 } from "lucide-react";

const NotepadEditorBody = ({
  activeNote,
  currentContent,
  textColor = "default",
  isDarkMode = true,
  onContentChange,
  children,
}) => {
  return (
    <div
      className={`flex-1 relative overflow-hidden flex flex-col min-h-[300px] sm:min-h-[450px] ${
        isDarkMode ? "bg-[#060b14] text-slate-100" : "bg-white text-slate-800"
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {activeNote ? (
        <div className="flex-1 flex flex-col animate-fadeIn">
          <textarea
            className={`w-full flex-1 p-4 sm:p-6 text-xs sm:text-sm font-medium leading-relaxed resize-none outline-none custom-scrollbar transition-colors min-h-[260px] sm:min-h-[400px] ${
              isDarkMode
                ? "bg-[#060b14] placeholder-slate-600 focus:bg-[#060b14]"
                : "bg-white placeholder-slate-400 focus:bg-white"
            }`}
            style={{
              color:
                textColor !== "default"
                  ? textColor
                  : isDarkMode
                  ? "#f8fafc"
                  : "#1e293b",
            }}
            placeholder="Type your notes here... (Ctrl+S to save)"
            value={currentContent}
            onChange={(e) => onContentChange(e.target.value)}
          />
          {children}
        </div>
      ) : (
        /* Notepad Empty State with Standalone Pencil Icon */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none animate-fadeIn min-h-[260px]">
          <div className="mb-4 animate-bounce">
            <Edit3
              size={48}
              className={`transition-colors ${
                isDarkMode ? "text-slate-500/80" : "text-slate-400"
              }`}
            />
          </div>
          <h3
            className={`text-base font-extrabold mb-1 tracking-tight ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            No Note Selected
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Select a note or create one to start editing
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(NotepadEditorBody);
