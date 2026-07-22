import React, { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

const LoadingScreen = () => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = [
    "Securing your connection...",
    "Igniting fuel cells...",
    "Aligning thrusters...",
    "Entering hyperspace...",
    "Preparing launch pad..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b13] text-white relative overflow-hidden select-none">
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 2 + 1; // 1px to 3px
          const left = Math.random() * 100; // 0% to 100%
          const delay = Math.random() * 3; // 0s to 3s
          const duration = Math.random() * 2 + 2; // 2s to 4s
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-stars-drift"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `-20px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Main Rocket Console */}
      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Rocket Launcher Area */}
        <div className="relative flex items-center justify-center w-28 h-28 bg-slate-900/60 border border-slate-800/80 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          {/* Shaking Rocket Body */}
          <div className="relative animate-rocket-rumble flex flex-col items-center">
            <Rocket size={44} className="text-blue-400 fill-blue-500/20 transform -rotate-45" />
            
            {/* Pulsing engine flame */}
            <div className="absolute -bottom-6 w-3 h-8 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 rounded-full animate-flame-thrust blur-[1px]"></div>
            <div className="absolute -bottom-4 w-1.5 h-5 bg-white rounded-full animate-flame-thrust"></div>

            {/* Drifting smoke particles */}
            <div className="absolute -bottom-10 flex gap-1 justify-center pointer-events-none opacity-50">
              <div className="w-2.5 h-2.5 bg-slate-400/30 rounded-full animate-smoke-drift" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-slate-500/20 rounded-full animate-smoke-drift" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-600/30 rounded-full animate-smoke-drift" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Brand & Loading Info */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 animate-pulse uppercase">
            Connect
          </h2>
          <div className="h-6 flex items-center justify-center">
            <p className="text-sm text-slate-400 font-medium tracking-wide animate-fade-in transition-all duration-300">
              {taglines[taglineIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Orbit paths for premium aesthetics */}
      <div className="absolute w-[400px] h-[400px] border border-blue-500/5 rounded-full pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] border border-indigo-500/5 rounded-full pointer-events-none"></div>
    </div>
  );
};

export default LoadingScreen;

