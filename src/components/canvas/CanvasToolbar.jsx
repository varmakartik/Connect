import React from "react";
import { Search, Code, LayoutGrid, CheckSquare } from "lucide-react";

const CanvasToolbar = ({
  searchQuery,
  onSearchChange,
  codeMode,
  setCodeMode,
  isSelectMode,
  toggleSelectMode,
  filteredCount,
  isDarkMode = true,
  children,
}) => {
  return (
    <div
      className={`px-6 py-4 flex flex-wrap items-center justify-between border-b gap-4 select-none transition-colors ${
        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <h2
          className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Document Workspace
        </h2>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-700"
          }`}
        >
          {filteredCount} items
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className={`pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition w-44 sm:w-56 ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500/50"
                : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600/50"
            }`}
          />
        </div>

        {/* View Mode Toggle */}
        <button
          type="button"
          onClick={() => setCodeMode(!codeMode)}
          className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
            codeMode
              ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
              : isDarkMode
              ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
          title={codeMode ? "Switch to Visual Cards View" : "Switch to Developer Code View"}
        >
          {codeMode ? <LayoutGrid size={15} /> : <Code size={15} />}
          <span className="hidden sm:inline">{codeMode ? "Visual" : "Code View"}</span>
        </button>

        {/* Multi-Select Toggle */}
        <button
          type="button"
          onClick={toggleSelectMode}
          className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
            isSelectMode
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
              : isDarkMode
              ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
          title="Toggle Multi-Select Mode"
        >
          <CheckSquare size={15} />
          <span className="hidden sm:inline">Select</span>
        </button>

        {children}
      </div>
    </div>
  );
};

export default React.memo(CanvasToolbar);
