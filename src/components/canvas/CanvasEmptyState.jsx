import React, { useRef } from "react";
import { UploadCloud, Folder } from "lucide-react";

const CanvasEmptyState = ({
  onFileUpload,
  isDragging,
  activeFolder,
  isDarkMode = true,
  children,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div
      className={`w-full min-h-[340px] sm:min-h-[400px] my-auto flex flex-col items-center justify-center py-12 px-6 sm:px-10 text-center select-none rounded-[2.5rem] border-2 border-dashed transition-all duration-300 group cursor-pointer ${
        isDragging
          ? "border-blue-500 bg-blue-500/15 ring-4 ring-blue-500/20 scale-[0.99] shadow-2xl shadow-blue-500/30"
          : isDarkMode
          ? "border-slate-800/90 bg-[#060c18]/40 hover:border-blue-500 hover:bg-blue-950/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          : "border-slate-300 bg-slate-50/80 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-xl"
      }`}
    >
      {/* Standalone Upload Icon */}
      <div className="mb-5 animate-bounce group-hover:scale-110 transition-transform duration-300">
        {activeFolder ? (
          <Folder
            size={56}
            className={`transition-all duration-300 ${
              isDarkMode
                ? "text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                : "text-amber-500 drop-shadow-md"
            }`}
          />
        ) : (
          <UploadCloud
            size={56}
            className={`transition-all duration-300 ${
              isDarkMode
                ? "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                : "text-blue-600 drop-shadow-md"
            }`}
          />
        )}
      </div>

      <h3
        className={`text-xl font-extrabold mb-1 tracking-tight ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {activeFolder ? `"${activeFolder.title || "Folder"}" is Empty` : "No Documents Uploaded Yet"}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {activeFolder
          ? `Drag & drop files anywhere here, or click below to upload files directly into "${activeFolder.title || "this folder"}".`
          : "Drag & drop files anywhere here, or click below to upload PDFs, Images, Text, or full Folders."}
      </p>

      {/* Direct 1-Click Upload Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 shrink-0"
          title="Click to Upload Files Directly"
        >
          <UploadCloud size={16} />
          <span>Upload File</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,image/*"
        />

        {children}
      </div>
    </div>
  );
};

export default React.memo(CanvasEmptyState);
