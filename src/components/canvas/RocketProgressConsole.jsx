import React, { useState, useEffect } from "react";
import { UploadCloud, XCircle, X } from "lucide-react";

const RocketProgressConsole = ({
  uploadProgress,
  onCancelUpload,
  onCancelFile,
  onCloseNotification,
  isDarkMode = true,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const overallProgress =
    typeof uploadProgress === "object"
      ? uploadProgress.overall || 0
      : uploadProgress || 0;

  const isUploading =
    typeof uploadProgress === "object"
      ? uploadProgress.active
      : uploadProgress > 0;

  const uploadFilesList =
    typeof uploadProgress === "object" ? uploadProgress.files || [] : [];

  const isCancelled =
    typeof uploadProgress === "object" ? uploadProgress.cancelled : false;

  const allTerminal =
    uploadFilesList.length > 0 &&
    uploadFilesList.every(
      (f) =>
        f.status === "success" ||
        f.status === "error" ||
        f.status === "cancelled"
    );

  const displayProgress = allTerminal ? 100 : overallProgress;

  // Trigger smooth Slide Out Right animation when upload completes
  useEffect(() => {
    if (allTerminal || displayProgress === 100) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setDismissed(true);
          if (onCloseNotification) onCloseNotification();
        }, 500);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setDismissed(false);
      setIsClosing(false);
    }
  }, [allTerminal, displayProgress, onCloseNotification]);

  const handleManualClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDismissed(true);
      if (onCloseNotification) onCloseNotification();
    }, 500);
  };

  if (!uploadProgress || dismissed) return null;
  if (!isUploading && uploadFilesList.length === 0) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[150] p-4 rounded-3xl border w-80 sm:w-96 backdrop-blur-2xl transition-all duration-500 ease-in-out select-none flex flex-col gap-3 ${
        isClosing
          ? "translate-x-[120%] opacity-0 pointer-events-none"
          : "translate-x-0 opacity-100 animate-slideInRight"
      } ${
        isDarkMode
          ? "bg-[#070e1c]/95 border-slate-800/90 text-white shadow-2xl shadow-black/90"
          : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl shadow-slate-300/80"
      }`}
    >
      {/* Header Row: Cloud Icon + Title + Percentage + Cancel All / Close */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-3 rounded-2xl border shrink-0 shadow-inner ${
              isDarkMode
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}
          >
            <UploadCloud size={20} className={!allTerminal && !isCancelled ? "animate-pulse" : ""} />
          </div>
          <div className="min-w-0">
            <h4
              className={`text-xs font-extrabold truncate tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {allTerminal
                ? "Upload Complete!"
                : isCancelled
                ? "Upload Cancelled"
                : "Uploading Asset..."}
            </h4>
            <p
              className={`text-[10px] font-medium truncate mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {allTerminal
                ? "All files uploaded successfully"
                : isCancelled
                ? "Upload process stopped"
                : "Please do not close this tab"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-black ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {Math.round(displayProgress)}%
          </span>

          {/* Cancel All Button during upload */}
          {onCancelUpload && !allTerminal && !isCancelled && (
            <button
              type="button"
              onClick={onCancelUpload}
              className="p-1 px-1.5 text-[10px] font-extrabold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center gap-1 shrink-0"
              title="Cancel all file uploads"
            >
              <XCircle size={12} />
              <span>Cancel</span>
            </button>
          )}

          {/* Close button with Slide Out effect */}
          {(allTerminal || isCancelled) && (
            <button
              type="button"
              onClick={handleManualClose}
              className={`p-1 rounded-lg transition cursor-pointer ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Close notification"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`w-full rounded-full h-1.5 overflow-hidden border ${
          isDarkMode ? "bg-slate-950 border-slate-800/80" : "bg-slate-100 border-slate-200"
        }`}
      >
        <div
          className={`h-full transition-all duration-300 ${
            displayProgress === 100
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : isCancelled
              ? "bg-amber-500"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400"
          }`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      {/* Subtitle Row */}
      <div
        className={`flex justify-between items-center text-[9px] font-black uppercase tracking-wider ${
          isDarkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        <span>Syncing to Supabase</span>
        {allTerminal || displayProgress === 100 ? (
          <span className="text-emerald-400 font-bold">Complete ✓</span>
        ) : isCancelled ? (
          <span className="text-amber-400 font-bold">Cancelled</span>
        ) : (
          <span className={isDarkMode ? "text-blue-400 font-bold animate-pulse" : "text-blue-600 font-bold animate-pulse"}>
            Active...
          </span>
        )}
      </div>

      {/* Line by Line File List with Individual Cancel Option */}
      {uploadFilesList.length > 0 && (
        <div
          className={`max-h-28 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar border-t pt-2 mt-1 ${
            isDarkMode ? "border-slate-800/60" : "border-slate-200"
          }`}
        >
          {uploadFilesList.map((file, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between text-[10px] p-1.5 px-2.5 rounded-xl border gap-2 ${
                isDarkMode
                  ? "bg-slate-950/60 border-slate-800/60 text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <span className="truncate font-semibold flex-1" title={file.name}>
                {file.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {file.status === "success" && (
                  <span className="text-emerald-400 font-bold text-[9px]">OK ✓</span>
                )}
                {file.status === "cancelled" && (
                  <span className="text-amber-400 font-bold text-[9px]">Cancelled</span>
                )}
                {file.status === "uploading" && (
                  <span
                    className={`font-bold text-[9px] animate-pulse ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {file.progress || 0}%
                  </span>
                )}
                {onCancelFile && !allTerminal && (file.status === "waiting" || file.status === "uploading") && (
                  <button
                    type="button"
                    onClick={() => onCancelFile(file.name)}
                    className="text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title={`Cancel ${file.name}`}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(RocketProgressConsole);
