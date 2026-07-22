import React from "react";
import {
  FileText,
  Trash2,
  Eye,
  Edit3,
  Check,
  X,
  FileCode,
  Image as ImageIcon,
  Download,
  Square,
  CheckSquare,
} from "lucide-react";

const DocumentCard = ({
  item,
  codeMode,
  isSelectMode,
  selected,
  isDeleting,
  onToggleSelect,
  onStartEditing,
  onSaveTitle,
  onCancelEditing,
  isEditing,
  tempTitle,
  setTempTitle,
  onConfirmDelete,
  onDownload,
  isDarkMode = true,
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon size={22} />;
      case "pdf":
        return <FileCode size={22} className="text-red-500" />;
      default:
        return <FileText size={22} className="text-blue-500" />;
    }
  };

  return (
    <div
      onClick={() => {
        if (isSelectMode) onToggleSelect(item.id);
      }}
      className={`document-card-transition relative ${
        isDeleting
          ? "scale-75 opacity-0 rotate-3 translate-y-4 pointer-events-none"
          : "scale-100 opacity-100"
      } ${
        codeMode
          ? `bg-[#161b22] border-l-4 ${
              isSelectMode && selected
                ? "border-blue-400 bg-blue-950/30"
                : "border-blue-500"
            } p-4 flex items-center justify-between group hover:bg-[#1c2128] border-y border-r border-[#30363d] rounded-r-xl ${
              isDeleting
                ? "max-h-0 py-0 my-0 border-none overflow-hidden"
                : "max-h-[150px]"
            }`
          : `${
              isDarkMode
                ? "bg-slate-900 border-slate-800 shadow-xl"
                : "bg-white border-slate-200 shadow-md"
            } p-4 sm:p-5 rounded-2xl border ${
              isSelectMode && selected
                ? isDarkMode
                  ? "border-blue-500 ring-2 ring-blue-500/50 bg-blue-950/20"
                  : "border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50"
                : "hover:border-blue-500/50"
            } group flex flex-col justify-between ${
              isSelectMode ? "cursor-pointer" : ""
            }`
      }`}
    >
      {/* CARD SELECTION CHECKBOX (GRID & CODE MODE) */}
      {isSelectMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id);
          }}
          className={`z-20 p-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            codeMode ? "mr-2 shrink-0" : "absolute top-3 right-3"
          } ${
            selected
              ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30 scale-105"
              : isDarkMode
              ? "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 opacity-80 group-hover:opacity-100"
              : "bg-white border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 opacity-80 group-hover:opacity-100"
          }`}
          title={selected ? "Deselect item" : "Select item"}
        >
          {selected ? <CheckSquare size={16} /> : <Square size={16} />}
        </button>
      )}

      {/* ITEM CARD CONTENTS */}
      <div className={codeMode ? "flex items-center gap-4 flex-1 min-w-0" : ""}>
        {!codeMode && item.type === "image" && item.url ? (
          <div
            className={`w-full h-40 sm:h-44 rounded-xl overflow-hidden mb-4 border flex items-center justify-center p-2 relative transition-colors ${
              isDarkMode
                ? "bg-slate-950/60 border-slate-800/80 group-hover:border-blue-500/30"
                : "bg-slate-100 border-slate-200 group-hover:border-blue-500/30"
            }`}
          >
            <img
              src={item.url}
              alt={item.title}
              className="max-h-full max-w-full object-contain drop-shadow-md rounded-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          !codeMode && (
            <div
              className={`p-3.5 rounded-xl border mb-4 w-fit shadow-inner ${
                isDarkMode
                  ? "bg-slate-950 text-blue-400 border-slate-850"
                  : "bg-slate-100 text-blue-600 border-slate-200"
              }`}
            >
              {getFileIcon(item.type)}
            </div>
          )
        )}

        {codeMode && (
          <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
            {getFileIcon(item.type)}
          </div>
        )}

        {/* Title / Info */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                className={`rounded-lg px-3 py-1.5 text-xs outline-none w-full border ${
                  codeMode
                    ? "bg-[#0d1117] text-white border-blue-500"
                    : isDarkMode
                    ? "bg-slate-950 border-slate-850 text-white focus:border-blue-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600"
                }`}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveTitle(item.id);
                }}
                className="text-green-500 p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelEditing();
                }}
                className="text-red-500 p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <h3
                className={`font-bold truncate ${
                  codeMode
                    ? "text-slate-300 font-mono text-sm"
                    : isDarkMode
                    ? "text-slate-200 mb-1"
                    : "text-slate-800 mb-1"
                }`}
              >
                {codeMode ? (
                  <>
                    <span className="text-blue-400 opacity-80 mr-2">const</span>
                    {(item.title || "Doc_1").replace(/[\s\W]+/g, "_")}
                    <span className="text-blue-400 opacity-80"> = </span>
                    <span className="text-orange-400">"{item.type}"</span>
                  </>
                ) : (
                  item.title || "Doc 1"
                )}
              </h3>
              {!codeMode && (
                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">
                  {item.type}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div
        className={`flex flex-col gap-3 ${
          codeMode
            ? "ml-4 !flex-row items-center justify-between"
            : `mt-4 border-t pt-3.5 ${
                isDarkMode ? "border-slate-800/80" : "border-slate-200"
              }`
        }`}
      >
        {!codeMode ? (
          <>
            <div className="grid grid-cols-2 gap-2 w-full">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-550 text-white shadow-md shadow-blue-600/15 active:scale-[0.97] transition-all"
                title="View File"
              >
                <Eye size={15} className="shrink-0" />
                <span>View</span>
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item.url, item.title);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-550 text-white shadow-md shadow-emerald-600/15 active:scale-[0.97] transition-all cursor-pointer"
                title="Download File"
              >
                <Download size={15} className="shrink-0" />
                <span>Download</span>
              </button>
            </div>

            <div
              className={`flex items-center justify-between pt-0.5 text-xs font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEditing(item);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition cursor-pointer ${
                  isDarkMode
                    ? "hover:text-blue-400 hover:bg-slate-800/80"
                    : "hover:text-blue-600 hover:bg-slate-100"
                }`}
                title="Rename File"
              >
                <Edit3 size={14} />
                <span className="text-[11px]">Rename</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDelete(item);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition cursor-pointer ${
                  isDarkMode
                    ? "hover:text-red-400 hover:bg-slate-800/80"
                    : "hover:text-red-600 hover:bg-slate-100"
                }`}
                title="Delete File"
              >
                <Trash2 size={14} />
                <span className="text-[11px]">Delete</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEditing(item);
              }}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Rename File"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirmDelete(item);
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Delete File"
            >
              <Trash2 size={16} />
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 rounded-xl transition"
              title="View File"
            >
              <Eye size={16} />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(item.url, item.title);
              }}
              className="p-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 rounded-xl transition cursor-pointer"
              title="Download File"
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DocumentCard);
