import React from "react";
import { AlertCircle, X, ShieldAlert } from "lucide-react";

interface AlertBannerProps {
  text: string;
  onClose: () => void;
}

export function AlertBanner({ text, onClose }: AlertBannerProps) {
  return (
    <div className="absolute top-13 left-1/2 -translate-x-1/2 bg-rose-950/95 border-2 border-rose-500 rounded-xl px-5 py-3 flex items-center space-x-3.5 z-40 max-w-lg shadow-[0_10px_35px_rgba(239,68,68,0.25)] backdrop-blur-md animate-slide-down">
      <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center shrink-0">
        <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
      </div>
      
      <div className="flex-1 font-mono text-[11px] text-slate-100 uppercase tracking-wide leading-relaxed selection:bg-rose-500/30">
        <strong className="text-rose-400 block text-[9px] tracking-widest font-black mb-0.5">
          ⚠️ HYDERABAD CRISIS COMMAND WARNING
        </strong>
        {text}
      </div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded shrink-0 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
