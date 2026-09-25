import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';

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

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Purchase Now CTA Button - ToolClubPK Brand Green */}
          <a
            href="https://toolclubpk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-slate-950 bg-[#4ADE80] hover:bg-white rounded-xl shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_25px_#4ADE80] border border-[#4ADE80] transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide font-extrabold">Purchase Now</span>
            <ExternalLink className="w-3 h-3 text-slate-800 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
};
