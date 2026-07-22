import React from "react";
import { CheckSquare, Square, Trash2, X } from "lucide-react";

const SelectionBar = ({
  totalCount = 0,
  selectedCount = 0,
  onSelectAll,
  onBatchDelete,
  onDeleteAll,
  onCancel,
  isDarkMode = true,
}) => {
  if (totalCount === 0) return null;

  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;

  return (
    <div className="w-full bg-[#0b1329] border border-slate-800/90 p-4 px-6 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 shadow-2xl animate-fadeIn select-none">
      {/* Left: Select All Checkbox & Count */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSelectAll}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
        >
          {isAllSelected ? (
            <CheckSquare size={16} className="text-blue-400" />
          ) : (
            <Square size={16} className="text-slate-400" />
          )}
          <span>Select All</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          <strong className="text-white font-extrabold">{selectedCount}</strong> of selected
        </span>
      </div>

      {/* Right: Delete Selected & Delete All Action Buttons */}
      <div className="flex items-center gap-3">
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-bold active:scale-95 transition cursor-pointer"
          title="Delete all documents"
        >
          <Trash2 size={15} />
          <span>Delete All</span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
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
