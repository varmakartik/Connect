import React from "react";
import { CheckSquare, Square, Trash2, X, Download } from "lucide-react";

const SelectionBar = ({
  totalCount = 0,
  selectedCount = 0,
  onSelectAll,
  onBatchDelete,
  onDownloadSelected,
  isDownloading = false,
  onDeleteAll,
  onCancel,
  isDarkMode = true,
}) => {
  if (totalCount === 0) return null;

  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;

  return (
    <div
      className={`w-full border p-4 px-4 sm:px-6 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 animate-fadeIn select-none ${
        isDarkMode ? "bg-[#0b1329] border-slate-800/90 shadow-2xl" : "bg-white border-slate-200 shadow-md"
      }`}
    >
      {/* Left: Select All Checkbox & Count */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSelectAll}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isDarkMode
              ? "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200"
              : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
          }`}
        >
          {isAllSelected ? (
            <CheckSquare size={16} className="text-blue-400" />
          ) : (
            <Square size={16} className="text-slate-400" />
          )}
          <span>Select All</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          <strong className={`font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{selectedCount}</strong> of {totalCount} selected
        </span>
      </div>

      {/* Right: Delete Selected & Delete All Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedCount > 0 && onDownloadSelected && (
          <button
            type="button"
            onClick={onDownloadSelected}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 active:scale-95 transition cursor-pointer ${
              isDownloading ? "opacity-60 cursor-wait" : ""
            }`}
            title="Download selected items (multiple items download as a .zip)"
          >
            <Download size={15} />
            <span>{isDownloading ? "Preparing..." : `Download Selected (${selectedCount})`}</span>
          </button>
        )}

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onBatchDelete}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-550 text-white text-xs font-extrabold shadow-lg shadow-red-600/30 active:scale-95 transition cursor-pointer"
          >
            <Trash2 size={15} />
            <span>Delete Selected ({selectedCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onDeleteAll}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border hover:border-red-500/40 hover:text-red-500 text-xs font-bold active:scale-95 transition cursor-pointer ${
            isDarkMode ? "bg-slate-950 border-slate-800/90 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
          }`}
          title="Delete all documents"
        >
          <Trash2 size={15} />
          <span>Delete All</span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`p-2 rounded-xl text-slate-400 transition cursor-pointer ${
              isDarkMode ? "hover:text-white hover:bg-slate-800" : "hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Exit select mode"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(SelectionBar);
