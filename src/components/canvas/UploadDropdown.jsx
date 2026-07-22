import React, { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

const UploadDropdown = ({ onFileUpload }) => {
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  return (
    <div className="relative flex-1 sm:flex-none shrink-0">
      <button
        type="button"
        onClick={() => setShowUploadMenu(!showUploadMenu)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
      >
        <UploadCloud size={16} />
        <span>Upload</span>
      </button>

      {showUploadMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUploadMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1">
            <label className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition">
              <FileText size={14} className="text-blue-400" />
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onFileUpload(Array.from(e.target.files));
                  }
                  setShowUploadMenu(false);
                }}
                accept=".pdf,.doc,.docx,image/*"
              />
            </label>
            <label className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition">
              <UploadCloud size={14} className="text-indigo-400" />
              <span>Upload Folders</span>
              <input
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onFileUpload(Array.from(e.target.files));
                  }
                  setShowUploadMenu(false);
                }}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadDropdown;
