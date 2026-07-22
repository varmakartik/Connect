import React from "react";
import { AlertCircle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Confirm",
  isDanger = true,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border bg-slate-900 border-slate-800 text-slate-100">
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-4 rounded-full mb-4 animate-bounce ${
              isDanger ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
            }`}
          >
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>

          {/* Render children prop for flexible modal body */}
          <div className="text-sm text-slate-400 mb-6">{children}</div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition shadow-lg active:scale-95 cursor-pointer ${
                isDanger
                  ? "bg-red-600 hover:bg-red-550 text-white shadow-red-600/15"
                  : "bg-blue-600 hover:bg-blue-550 text-white shadow-blue-600/15"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
