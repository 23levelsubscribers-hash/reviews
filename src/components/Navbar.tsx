import React from 'react';
import { ShieldCheck, Search, FileCheck2 } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center group focus:outline-none cursor-pointer py-1"
          aria-label="Toolclubpk - Proofs & Activations"
        >
          <img
            src="/toolclubpk-header-logo.svg"
            alt="Toolclubpk - Proofs & Activations"
            className="h-10 sm:h-12 w-auto object-contain hover:scale-[1.02] transition-transform duration-300 drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800/60 font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Live Activations</span>
          </div>
        </div>
      </div>
    </header>
  );
};
