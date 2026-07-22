import React, { useState, useRef } from "react";
import { UploadCloud, FileText, FolderPlus, ChevronDown } from "lucide-react";

const UploadDropdown = ({ onFileUpload, isDarkMode = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div className="relative shrink-0">
      {/* Primary Upload Button in Navbar */}
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 text-white px-4.5 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 shrink-0"
        title="Upload Files or Folders"
      >
        <UploadCloud size={16} />
        <span>Upload</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`} />
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,image/*"
      />

      {/* Hidden Folder Input */}
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Dropdown Options Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border shadow-2xl z-50 p-1.5 flex flex-col gap-1 ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white shadow-black/80"
                : "bg-white border-slate-200 text-slate-900 shadow-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition ${
                isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FileText size={15} className="text-blue-400" />
              <span>Upload Files</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                folderInputRef.current?.click();
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition ${
                isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FolderPlus size={15} className="text-indigo-400" />
              <span>Upload Folder</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(UploadDropdown);
