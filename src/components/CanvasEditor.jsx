import React, { useState } from "react";
import {
  FileText,
  Trash2,
  Eye,
  Edit3,
  Check,
  X,
  UploadCloud,
  AlertCircle,
  Code,
  LayoutGrid,
  FileCode,
  Image as ImageIcon,
  Download,
} from "lucide-react";

const CanvasEditor = ({
  items,
  onDelete,
  onFileUpload,
  uploadProgress,
  onUpdateTitle,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [codeMode, setCodeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDownload = async (url, filename) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "document";
      link.target = "_blank";
      link.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const startEditing = (item) => {
    setEditingId(item.id);
    setTempTitle(item.title);
  };

  const saveTitle = async (id) => {
    if (tempTitle.trim()) {
      await onUpdateTitle(id, tempTitle.trim());
    }
    setEditingId(null);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      const targetId = itemToDelete.id;
      setDeletingId(targetId);
      setShowDeleteModal(false);
      setTimeout(() => {
        onDelete(targetId);
        setDeletingId(null);
        setItemToDelete(null);
      }, 350);
    }
  };

  // Helper to get file icons
  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon size={22} />;
      case "pdf":
        return <FileCode size={22} className="text-red-400" />;
      default:
        return <FileText size={22} className="text-blue-400" />;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-3.5 sm:p-6 h-full overflow-y-auto overflow-x-hidden relative transition-colors duration-300 ${
        codeMode ? "bg-[#0d1117]" : "bg-slate-950"
      }`}
    >
      {/* DRAG AND DROP OVERLAY */}
      {isDragging && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md pointer-events-none transition-all duration-300">
          <div className="border-4 border-dashed border-blue-500/50 rounded-3xl p-12 flex flex-col items-center justify-center max-w-md w-full text-center bg-slate-900/60 shadow-2xl">
            <UploadCloud size={64} className="text-blue-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Drop your files here</h3>
            <p className="text-slate-400 text-sm">PDFs, Docs, or Images up to 50MB</p>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className={`rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border transition-all transform scale-100 ${
              codeMode
                ? "bg-[#161b22] border-[#30363d] text-white"
                : "bg-slate-900 border-slate-800 text-slate-100"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-4 animate-bounce">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Document?</h3>
              <p
                className={`text-sm mb-6 ${
                  codeMode ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold text-blue-400">
                  "{itemToDelete?.title}"
                </span>
                ? This action will permanently remove the record and its storage file.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    codeMode
                      ? "bg-[#30363d] text-white hover:bg-[#3d444d]"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-550 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-red-600/15 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2
            className={`text-2xl font-extrabold tracking-tight ${
              codeMode ? "text-white font-mono" : "text-white"
            }`}
          >
            Documents & Assets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, rename, view, and store files securely in the cloud.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Toggle Code / Grid View */}
          <button
            onClick={() => setCodeMode(!codeMode)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-bold text-xs transition-all duration-200 border ${
              codeMode
                ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {codeMode ? <Code size={16} /> : <LayoutGrid size={16} />}
            <span>{codeMode ? "Code Mode" : "Grid View"}</span>
          </button>

          {/* Upload Button */}
          <label className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]">
            <UploadCloud size={16} />
            <span>Upload</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
              accept=".pdf,.doc,.docx,image/*"
            />
          </label>
        </div>
      </div>

      {/* FLOATING UPLOAD PROGRESS STATUS CARD */}
      {uploadProgress > 0 && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-2xl shadow-black/50 w-80 flex flex-col gap-3.5 animate-slideIn select-none">
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl animate-pulse">
              <UploadCloud size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Uploading Asset...</p>
              <p className="text-[10px] text-slate-400 font-medium">Please do not close this tab</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-blue-400">{uploadProgress}%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 h-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Syncing to Supabase</span>
              {uploadProgress === 100 ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  Complete <Check size={10} />
                </span>
              ) : (
                <span className="animate-pulse">Active...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <label className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl cursor-pointer hover:bg-slate-900/30 transition-all duration-300 group">
          <UploadCloud size={48} className="text-slate-600 mb-4 animate-bounce group-hover:text-blue-500 transition-colors" />
          <p className="text-slate-400 font-semibold text-sm">No files uploaded yet</p>
          <p className="text-slate-500 text-xs mt-1 mb-5">Drag & drop files here, or click to browse</p>
          <div className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/10 active:scale-[0.98] flex items-center gap-2 transition-all">
            <UploadCloud size={14} />
            <span>Choose File</span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileUpload(e.target.files[0]);
              }
            }}
            accept=".pdf,.doc,.docx,image/*"
          />
        </label>
      )}

      {/* ITEMS CONTAINER */}
      <div
        className={
          codeMode
            ? "flex flex-col gap-3"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {items.map((item) => {
          const isDeleting = deletingId === item.id;
          return (
            <div
              key={item.id}
              className={`document-card-transition ${
                isDeleting
                  ? "scale-75 opacity-0 rotate-3 translate-y-4 pointer-events-none"
                  : "scale-100 opacity-100"
              } ${
                codeMode
                  ? `bg-[#161b22] border-l-4 border-blue-500 p-4 flex items-center justify-between group hover:bg-[#1c2128] border-y border-r border-[#30363d] rounded-r-xl ${
                      isDeleting ? "max-h-0 py-0 my-0 border-none overflow-hidden" : "max-h-[150px]"
                    }`
                  : "bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-800 hover:border-blue-500/50 group flex flex-col justify-between"
              }`}
            >
            {/* ITEM CARD CONTENTS */}
            <div className={codeMode ? "flex items-center gap-4 flex-1 min-w-0" : ""}>
              
              {/* Media Preview or Icon */}
              {!codeMode && item.type === "image" && item.url ? (
                <div className="w-full h-40 sm:h-44 bg-slate-950/60 rounded-xl overflow-hidden mb-4 border border-slate-800/80 flex items-center justify-center p-2 relative group-hover:border-blue-500/30 transition-colors">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain drop-shadow-md rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                !codeMode && (
                  <div className="p-3.5 rounded-xl bg-slate-950 text-blue-500 border border-slate-850 mb-4 w-fit shadow-inner">
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
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      className={`rounded-lg px-3 py-1.5 text-xs outline-none w-full border ${
                        codeMode
                          ? "bg-[#0d1117] text-white border-blue-500"
                          : "bg-slate-950 border-slate-850 text-white focus:border-blue-500"
                      }`}
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => saveTitle(item.id)}
                      className="text-green-400 p-1 hover:bg-slate-800 rounded-lg"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-400 p-1 hover:bg-slate-800 rounded-lg"
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
                          : "text-slate-200 mb-1"
                      }`}
                    >
                      {codeMode ? (
                        <>
                          <span className="text-blue-400 opacity-80 mr-2">const</span>
                          {item.title.replace(/[\s\W]+/g, "_")}
                          <span className="text-blue-400 opacity-80"> = </span>
                          <span className="text-orange-400">"{item.type}"</span>
                        </>
                      ) : (
                        item.title
                      )}
                    </h3>
                    {!codeMode && (
                      <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">
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
                  : "mt-4 border-t border-slate-800/80 pt-3.5"
              }`}
            >
              {!codeMode ? (
                <>
                  {/* Primary Action Buttons (View & Download) */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-550 text-white shadow-md shadow-blue-600/15 active:scale-[0.97] transition-all"
                      title="View File"
                    >
                      <Eye size={15} className="shrink-0" />
                      <span>View</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDownload(item.url, item.title)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-550 text-white shadow-md shadow-emerald-600/15 active:scale-[0.97] transition-all cursor-pointer"
                      title="Download File"
                    >
                      <Download size={15} className="shrink-0" />
                      <span>Download</span>
                    </button>
                  </div>

                  {/* Secondary Toolbar (Rename & Delete) */}
                  <div className="flex items-center justify-between pt-0.5 text-slate-400 text-xs font-semibold">
                    <button
                      onClick={() => startEditing(item)}
                      className="flex items-center gap-1.5 px-2 py-1 hover:text-blue-400 hover:bg-slate-800/80 rounded-lg transition"
                      title="Rename File"
                    >
                      <Edit3 size={14} />
                      <span className="text-[11px]">Rename</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="flex items-center gap-1.5 px-2 py-1 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                      title="Delete File"
                    >
                      <Trash2 size={14} />
                      <span className="text-[11px]">Delete</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Code Mode Actions */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition"
                    title="Rename File"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(item)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete File"
                  >
                    <Trash2 size={16} />
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 rounded-xl transition"
                    title="View File"
                  >
                    <Eye size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDownload(item.url, item.title)}
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
      })}
      </div>
    </div>
  );
};

export default CanvasEditor;
