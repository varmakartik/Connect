import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated premium loader spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-400 animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold tracking-wide text-blue-400 animate-pulse">Connect</h2>
        <p className="text-xs text-slate-500">Securing your connection...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
