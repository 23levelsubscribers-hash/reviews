import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';

export const PurchaseFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      aria-label="Purchase tools and activations"
      className="fixed right-4 sm:right-6 bottom-6 z-40 print:hidden flex flex-col items-end"
    >
      {/* Floating Action Button */}
      <a
        href="https://toolclubpk.com"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm shadow-2xl shadow-red-950/80 border-2 border-red-400/50 hover:border-red-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl"
        title="Purchase Original Tools on toolclubpk.com"
      >
        {/* Glowing Ambient Halo */}
        <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-emerald-500 opacity-40 blur-lg group-hover:opacity-75 transition duration-300 animate-pulse" />

        {/* Content */}
        <div className="relative flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-colors">
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </div>
            {/* Live ping dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-red-200 font-extrabold leading-none">
              Official Store
            </span>
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-1">
              Purchase Now
              <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </a>
    </aside>
  );
};
