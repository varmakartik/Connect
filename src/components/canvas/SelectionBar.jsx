import React from "react";
import { CheckSquare, Square, Trash2 } from "lucide-react";

const SelectionBar = ({
  totalItems,
  selectedCount,
  onSelectAll,
  onBatchDelete,
  onDeleteAll,
}) => {
  if (totalItems === 0) return null;

  const isAllSelected = selectedCount > 0 && selectedCount === totalItems;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 bg-slate-900/80 border border-blue-500/30 rounded-2xl backdrop-blur-md animate-fadeIn">
      {/* Select All Toggle Button & Stats */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSelectAll}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
            isAllSelected
              ? "bg-blue-600/20 border-blue-500 text-blue-400"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {isAllSelected ? (
            <CheckSquare size={16} className="text-blue-400" />
          ) : (
            <Square size={16} className="text-slate-400" />
          )}
          <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          <strong className="text-white">{selectedCount}</strong> of{" "}
          <strong className="text-white">{totalItems}</strong> selected
        </span>
      </div>

      {/* Batch Action Buttons */}
      <div className="flex items-center gap-2.5">
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onBatchDelete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold transition-all shadow-md shadow-red-600/10 active:scale-95 cursor-pointer"
          >
            <Trash2 size={15} />
            <span>Delete Selected ({selectedCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onDeleteAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-red-500/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          title="Delete all documents"
        >
          <Trash2 size={15} />
          <span>Delete All</span>
        </button>
      </div>
    </div>
  );
};

export default SelectionBar;
