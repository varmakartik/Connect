import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const [petals, setPetals] = useState([]);

  // Set page title for SEO
  useEffect(() => {
    document.title = "Lost in the Blossoms 🌸 - 404";
  }, []);

  // Generate randomized falling petals on component mount
  useEffect(() => {
    const petalEmojis = ["🌸", "💮", "✨", "🌸", "🌸"];
    const generatedPetals = Array.from({ length: 25 }).map((_, index) => {
      const size = Math.random() * 16 + 10; // 10px to 26px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 10 + 6; // 6s to 16s
      const delay = Math.random() * -15; // Start immediately with negative delay for natural feel
      const emoji = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
      return {
        id: index,
        emoji,
        size,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
      };
    });
    setPetals(generatedPetals);
  }, []);

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-950 via-[#1d0e11] to-slate-950 overflow-hidden p-4 select-none">
      {/* Blossom Animation Keyframe Definitions */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10%) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh) rotate(360deg) translateX(120px);
            opacity: 0;
          }
        }
        .petal {
          position: absolute;
          top: -5%;
          pointer-events: none;
          animation: fall linear infinite;
        }
      `}</style>

      {/* Ambient Glowing Blobs with Pink/Rose tones */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Falling Petals Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className="petal filter drop-shadow-[0_2px_5px_rgba(244,63,94,0.2)]"
            style={{
              left: petal.left,
              fontSize: `${petal.size}px`,
              animationDuration: petal.duration,
              animationDelay: petal.delay,
            }}
          >
            {petal.emoji}
          </span>
        ))}
      </div>

      {/* 404 Container Card */}
      <div className="relative bg-black/40 border border-pink-500/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_25px_60px_rgba(244,63,94,0.08)] w-full max-w-md text-center z-20 transition-all duration-300 hover:border-pink-500/20">
        
        {/* Soft Glowing Circle with Cherry Flower */}
        <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-pink-500/10 rounded-full border border-pink-500/20 text-pink-400">
          <span className="text-3xl animate-pulse">🌸</span>
          <div className="absolute -top-1 -right-1 p-1 bg-rose-500 rounded-lg text-white animate-bounce">
            <Sparkles size={12} />
          </div>
        </div>

        {/* 404 Status */}
        <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent tracking-widest mb-3">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-200 mb-6">
          Lost in the Blossoms
        </h2>

        {/* Inspiring Cherry Blossom Quote */}
        <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-left mb-8">
          <span className="absolute top-3 left-4 text-3xl text-pink-500/20 font-serif leading-none">“</span>
          <p className="text-xs text-rose-200 italic leading-relaxed pl-4 pr-2 font-medium">
            Like cherry blossoms, we bloom in our own time. Wandering off the path is just another way to find a new beginning.
          </p>
          <span className="absolute bottom-1 right-4 text-3xl text-pink-500/20 font-serif leading-none">”</span>
        </div>

        {/* Back Home Button */}
        <Link
          to="/"
          className="group flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-extrabold text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-pink-500/15 hover:shadow-pink-500/25 hover:scale-[1.01] active:scale-[0.98]"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Workspace</span>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
