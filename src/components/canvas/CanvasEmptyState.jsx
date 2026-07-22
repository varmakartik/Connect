import React from "react";
import { UploadCloud } from "lucide-react";
import UploadDropdown from "./UploadDropdown";

const CanvasEmptyState = ({
  onFileUpload,
  isDragging,
  isDarkMode = true,
  children,
}) => {
  return (
    <div
      className={`h-full flex-1 flex flex-col items-center justify-center p-8 text-center select-none rounded-3xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
          : isDarkMode
          ? "border-slate-800 bg-slate-900/20"
          : "border-slate-300 bg-slate-50"
      }`}
    >
      <div
        className={`p-5 rounded-3xl mb-4 border transition-transform duration-300 hover:scale-110 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-blue-400 shadow-xl shadow-blue-500/5"
            : "bg-white border-slate-200 text-blue-600 shadow-lg shadow-slate-200"
        }`}
      >
        <UploadCloud size={44} />
      </div>

      <h3
        className={`text-lg font-extrabold mb-1 tracking-tight ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        No Documents Uploaded Yet
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        Drag & drop files anywhere here, or click below to upload PDFs, Images, Text, or full Folders.
      </p>

      <div className="flex items-center gap-3">
        <UploadDropdown onFileUpload={onFileUpload} isDarkMode={isDarkMode} />
        {children}
      </div>
    </div>
  );
};

export default React.memo(CanvasEmptyState);
