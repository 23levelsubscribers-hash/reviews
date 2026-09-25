import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome, onNavigateAdmin }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-500 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-slate-300 font-semibold focus:outline-none cursor-pointer"
        >
          <img
            src="/toolclubpk-logo.svg"
            alt="Toolclubpk Logo"
            className="w-7 h-7 rounded-full object-contain bg-black border border-slate-700"
          />
          <span className="font-bold text-slate-200">Toolclubpk</span>
        </button>

        <div className="flex items-center gap-4 text-slate-400">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Toolclubpk. Official Customer Delivery &amp; Proofs Showcase.
          </p>
        </div>

        {/* Admin Panel button at bottom / end */}
        <button
          onClick={onNavigateAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-red-400" />
          <span>Admin Panel</span>
        </button>
      </div>
    </footer>
  );
};
