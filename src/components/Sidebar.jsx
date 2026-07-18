import React from "react";
import { LogOut, FileText, StickyNote, Sparkles } from "lucide-react";

const Sidebar = ({ userEmail, setViewType, viewType, onLogout }) => {
  return (
    <div className="w-64 bg-slate-900/90 backdrop-blur-md text-white flex flex-col h-full border-r border-slate-800 shadow-2xl">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <img
            src="/connect.png"
            alt="Connect Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/10"
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-100">
            Connect
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3 truncate max-w-full">
          Logged as: <span className="text-blue-400 font-normal lowercase">{userEmail}</span>
        </p>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 p-4 space-y-1.5 mt-4">
        <button
          onClick={() => setViewType("notes")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
            viewType === "notes"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <StickyNote
            size={18}
            className={`transition-colors duration-200 ${
              viewType === "notes" ? "text-white" : "text-slate-500 group-hover:text-slate-300"
            }`}
          />
          My Notes
        </button>

        <button
          onClick={() => setViewType("canvas")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
            viewType === "canvas"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <FileText
            size={18}
            className={`transition-colors duration-200 ${
              viewType === "canvas" ? "text-white" : "text-slate-500 group-hover:text-slate-300"
            }`}
          />
          Documents
        </button>

        <button
          onClick={() => setViewType("story")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
            viewType === "story"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Sparkles
            size={18}
            className={`transition-colors duration-200 ${
              viewType === "story" ? "text-white" : "text-slate-500 group-hover:text-slate-300"
            }`}
          />
          Behind the Spark ✨
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 font-medium text-sm hover:text-red-300 group active:scale-[0.98]"
        >
          <LogOut
            size={18}
            className="text-red-400/80 group-hover:text-red-300 transition-colors"
          />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
