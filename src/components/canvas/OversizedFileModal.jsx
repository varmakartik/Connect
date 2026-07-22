import React from "react";
import { AlertTriangle, FileX, UploadCloud, X } from "lucide-react";

const OversizedFileModal = ({
  isOpen,
  onClose,
  onProceedEligible,
  oversizedFiles = [],
  validSizeFiles = [],
  maxSizeMb = 50,
}) => {
  if (!isOpen) return null;

  const formatSize = (bytes) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-black/80 relative transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Warning Badge & Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Oversized Files Detected
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Maximum allowed file size per upload is{" "}
              <span className="text-amber-400 font-bold">{maxSizeMb} MB</span>.
            </p>
          </div>
        </div>

        {/* List of Oversized Files */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <FileX size={14} className="text-red-400" />
            <span>Files exceeding {maxSizeMb} MB limit:</span>
          </p>

          <div className="max-h-36 overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
            {oversizedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-slate-950/70 p-2.5 px-3 rounded-xl border border-red-500/30"
              >
                <span className="truncate text-slate-200 font-bold max-w-[240px]" title={file.name}>
                  {file.name}
                </span>
                <span className="text-red-400 font-mono font-bold text-[11px] shrink-0">
                  {formatSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Info Box */}
        {validSizeFiles.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 mb-6 font-semibold flex items-center gap-2">
            <UploadCloud size={16} className="text-blue-400 shrink-0" />
            <span>
              {validSizeFiles.length} file(s) are within the size limit and ready to upload.
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 mb-6 font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>All selected files exceed the {maxSizeMb} MB limit.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {validSizeFiles.length > 0 ? (
            <>
              <button
                type="button"
                onClick={onProceedEligible}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-550 text-white shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UploadCloud size={15} />
                <span>Upload Eligible Files ({validSizeFiles.length})</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              >
                Cancel Upload
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Close & Select Smaller Files
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OversizedFileModal;
