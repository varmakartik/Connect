import React from "react";
import { Github, Linkedin, Globe, Instagram, Mail, Sparkles, Heart } from "lucide-react";

const Footer = ({ isDarkMode = true }) => {
  return (
    <footer
      className={`border-t py-3 sm:py-6 px-4 sm:px-10 transition-colors ${
        isDarkMode
          ? "bg-[#070d19]/95 border-slate-800/80 text-slate-300"
          : "bg-white border-slate-200 text-slate-700 shadow-inner"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4">
        {/* TOP ROW: DIRECT SOCIAL ICON BUTTONS & COLLABORATE BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          {/* Social Icon Redirect Buttons with Hover Tooltips */}
          <div className="flex items-center gap-3">
            {/* Portfolio Icon Button & Tooltip */}
            <div className="relative group flex flex-col items-center">
              <a
                href="https://kartikvarma.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 shadow-md shadow-blue-500/10"
                    : "bg-slate-100 border-slate-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Globe size={16} />
              </a>
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-blue-400 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none shadow-xl z-30">
                Personal Portfolio
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* GitHub Icon Button & Tooltip */}
            <div className="relative group flex flex-col items-center">
              <a
                href="https://github.com/varmakartik"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 shadow-md shadow-black/20"
                    : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                }`}
              >
                <Github size={16} />
              </a>
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none shadow-xl z-30">
                GitHub
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* LinkedIn Icon Button & Tooltip */}
            <div className="relative group flex flex-col items-center">
              <a
                href="https://linkedin.com/in/kartivarma200430"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/50 shadow-md shadow-sky-500/10"
                    : "bg-slate-100 border-slate-200 text-sky-600 hover:bg-sky-50"
                }`}
              >
                <Linkedin size={16} />
              </a>
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-sky-400 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none shadow-xl z-30">
                LinkedIn
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Instagram Icon Button & Tooltip */}
            <div className="relative group flex flex-col items-center">
              <a
                href="https://instagram.com/ig_crosser"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/50 shadow-md shadow-pink-500/10"
                    : "bg-slate-100 border-slate-200 text-pink-600 hover:bg-pink-50"
                }`}
              >
                <Instagram size={16} />
              </a>
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-pink-400 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none shadow-xl z-30">
                Instagram
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Email Icon Button & Tooltip */}
            <div className="relative group flex flex-col items-center">
              <a
                href="mailto:kartikvarma.dev@gmail.com"
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-md shadow-emerald-500/10"
                    : "bg-slate-100 border-slate-200 text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                <Mail size={16} />
              </a>
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-emerald-400 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none shadow-xl z-30">
                Email Me
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>

          {/* Collaborate CTA Button */}
          <a
            href="mailto:kartikvarma.dev@gmail.com"
            className="text-[11px] font-extrabold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-550 text-white shadow-md shadow-blue-600/25 transition active:scale-95 flex items-center gap-1.5 shrink-0"
            title="Collaborate with Kartik Varma"
          >
            <Mail size={13} />
            <span>Collaborate</span>
          </a>
        </div>

        {/* BOTTOM ROW: DEVELOPER QUOTE & COPYRIGHT STAMP */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-300 italic">
              "Great ideas connect when passion meets precision code."
            </p>
          </div>

          <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 flex items-center justify-center gap-1 shrink-0">
            <span>⚡ CONNECT © 2026 | Built with</span>
            <Heart size={11} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by Kartik Varma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
