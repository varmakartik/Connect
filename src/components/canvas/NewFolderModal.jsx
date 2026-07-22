import React, { useState, useEffect, useRef } from "react";
import { FolderPlus, X } from "lucide-react";

const NewFolderModal = ({ isOpen, onClose, onCreateFolder, isDarkMode = true }) => {
  const [folderTitle, setFolderTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFolderTitle("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderTitle.trim()) {
      onCreateFolder(folderTitle.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? "bg-[#0b1329] border-slate-800 text-white shadow-black/80"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-200"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Create New Folder</h3>
              <p className="text-xs text-slate-400 font-medium">Organize your files and assets cleanly</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Folder Name</label>
            <input
              ref={inputRef}
              type="text"
              value={folderTitle}
              onChange={(e) => setFolderTitle(e.target.value)}
              placeholder="e.g. Design Assets, Project X, PDFs..."
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border transition-colors ${
                isDarkMode
                  ? "bg-slate-950 border-slate-800 text-white focus:border-amber-500/60"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500/60"
              }`}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderTitle.trim()}
              className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-450 hover:to-orange-450 text-white shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(NewFolderModal);
