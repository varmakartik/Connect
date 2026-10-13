import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle2, AlertCircle, X, Info } from "lucide-react";

const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { type = "warning", title, message } = notification;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="text-red-500 shrink-0" size={22} />;
      case "success":
        return <CheckCircle2 className="text-emerald-500 shrink-0" size={22} />;
      case "info":
        return <Info className="text-blue-500 shrink-0" size={22} />;
      default:
        return <AlertTriangle className="text-amber-500 shrink-0" size={22} />;
    }
  };

  // Toasts render in many places without a theme prop; read the app-wide theme flag
  const isLight = document.documentElement.dataset.theme !== "dark";

  const getBorderColor = () => {
    const surface = isLight ? "bg-white/95 text-slate-800" : "bg-slate-900/95 text-slate-100";
    switch (type) {
      case "error":
        return `border-red-500/50 shadow-red-500/20 ${surface}`;
      case "success":
        return `border-emerald-500/50 shadow-emerald-500/20 ${surface}`;
      case "info":
        return `border-blue-500/50 shadow-blue-500/20 ${surface}`;
      default:
        return `border-amber-500/60 shadow-amber-500/20 ${surface}`;
    }
  };

  return (
    <div
      // Phones: full width inside a 12px margin. Larger screens: top-right card.
      className="fixed z-200 top-3 inset-x-3 sm:inset-x-auto sm:top-6 sm:right-6 sm:w-full sm:max-w-md animate-slideIn"
      role="status"
      aria-live="polite"
    >
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all ${getBorderColor()}`}
      >
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0 pr-2">
          <h4 className={`font-extrabold text-sm truncate ${isLight ? "text-slate-900" : "text-white"}`}>
            {title || "Notice"}
          </h4>
          {/* Long unbroken text (URLs, tokens) wraps anywhere and is capped at 4 lines */}
          <p
            className={`text-xs font-medium mt-0.5 leading-relaxed [overflow-wrap:anywhere] line-clamp-4 ${
              isLight ? "text-slate-600" : "text-slate-300"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className={`text-slate-400 p-1 rounded-lg transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
            isLight ? "hover:text-slate-900 hover:bg-slate-100" : "hover:text-white hover:bg-slate-800"
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
