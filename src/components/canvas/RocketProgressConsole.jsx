import React from "react";
import { Rocket, Check, XCircle, X } from "lucide-react";

const RocketProgressConsole = ({
  uploadProgress,
  onCancelUpload,
  onCancelFile,
}) => {
  const overallProgress =
    typeof uploadProgress === "object"
      ? uploadProgress.overall
      : uploadProgress;
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

  const rocketBottom =
    displayProgress >= 100 ? "120%" : `${displayProgress * 0.8}%`;
  const showFlame = displayProgress > 0 && displayProgress < 100 && !isCancelled;

  if (!isUploading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[120] bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl shadow-2xl shadow-black/60 w-[360px] flex gap-4 animate-slideIn select-none items-center">
      {/* Rocket Tube */}
      <div className="relative h-28 w-12 bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-end items-center pb-2.5 shrink-0 shadow-inner">
        <div className="absolute inset-y-2 w-[1px] bg-dashed border-slate-800/50"></div>
        <div
          className="absolute transition-all duration-300 ease-out flex flex-col items-center"
          style={{ bottom: rocketBottom }}
        >
          <Rocket
            size={20}
            className={`text-blue-400 fill-blue-500/20 transform -rotate-45 ${
              showFlame ? "animate-rocket-rumble" : ""
            }`}
          />
          {showFlame && (
            <div className="w-1.5 h-4 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 rounded-full animate-flame-thrust blur-[0.5px] mt-0.5"></div>
          )}
        </div>
      </div>

      {/* Launch Console Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-black text-white flex items-center gap-2">
              <span>Rocket Upload Console</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {allTerminal
                ? "Upload batch completed!"
                : isCancelled
                ? "Upload cancelled by user"
                : "Launching assets securely..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black ${
                displayProgress === 100 ? "text-emerald-400" : "text-blue-400"
              }`}
            >
              {displayProgress}%
            </span>
            {onCancelUpload && displayProgress < 100 && !isCancelled && !allTerminal && (
              <button
                type="button"
                onClick={onCancelUpload}
                className="p-1 px-2 text-[10px] font-bold rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white transition flex items-center gap-1 cursor-pointer shrink-0"
                title="Cancel folder upload"
              >
                <XCircle size={12} />
                <span>Cancel All</span>
              </button>
            )}
          </div>
        </div>

        {uploadFilesList.length > 0 && (
          <div className="max-h-24 overflow-y-auto pr-1 flex flex-col gap-1.5 custom-scrollbar">
            {uploadFilesList.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[9.5px] bg-slate-950/60 p-1.5 px-2 rounded-xl border border-slate-800/80 gap-2"
              >
                <span
                  className="truncate text-slate-200 font-bold flex-1"
                  title={file.name}
                >
                  {file.name}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {file.status === "success" && (
                    <span className="text-emerald-400 font-black flex items-center gap-0.5">
                      OK <Check size={10} />
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="text-red-400 font-black" title={file.error}>
                      ERR
                    </span>
                  )}
                  {file.status === "cancelled" && (
                    <span className="text-amber-400 font-extrabold text-[8.5px]">
                      CANCELLED
                    </span>
                  )}
                  {file.status === "uploading" && (
                    <span className="text-blue-400 font-black animate-pulse">
                      {file.progress}%
                    </span>
                  )}
                  {file.status === "waiting" && (
                    <span className="text-slate-500 font-bold">WAIT</span>
                  )}

                  {/* Individual File Cancel Button */}
                  {onCancelFile &&
                    !allTerminal &&
                    (file.status === "waiting" || file.status === "uploading") && (
                      <button
                        type="button"
                        onClick={() => onCancelFile(file.name)}
                        className="p-0.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title={`Cancel upload for ${file.name}`}
                      >
                        <X size={11} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-1">
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-850">
            <div
              className={`h-full transition-all duration-300 ${
                displayProgress === 100
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  : isCancelled
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              }`}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[8px] text-slate-500 font-black uppercase tracking-wider">
            <span>Supabase Sync</span>
            {allTerminal || displayProgress === 100 ? (
              <span className="text-emerald-400 font-bold animate-pulse">
                Batch Complete!
              </span>
            ) : isCancelled ? (
              <span className="text-amber-400 font-bold">Aborted</span>
            ) : (
              <span className="animate-pulse">Active Thrusters...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RocketProgressConsole);
