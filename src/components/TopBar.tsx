import React, { useEffect, useState } from "react";
import { Clock, Shield, Activity, Zap } from "lucide-react";

interface TopBarProps {
  simulationActive: boolean;
  simulationType: "HEAVY_RAIN" | "FIRE" | "NONE";
  resilienceScore: number;
}

export function TopBar({ simulationActive, simulationType, resilienceScore }: TopBarProps) {
  const [time, setTime] = useState<string>("09:30:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-11 bg-[#080f26] border-b border-[#00f0ff]/15 px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left Brand Area */}
      <div className="flex items-center space-x-2.5">
        <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.15)]">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono font-black text-white tracking-widest uppercase">
              CITYOS AI
            </span>
            <span className="text-[7.5px] px-1 py-0.2 bg-cyan-400/10 rounded text-cyan-300 font-bold border border-cyan-400/20">
              V4.8
            </span>
          </div>
          <div className="text-[8.5px] font-mono text-slate-400 leading-none">
            HYDERABAD DIGITAL TWIN NETWORK
          </div>
        </div>
      </div>

      <div className="w-px h-5 bg-slate-800/60" />

      {/* Center: Live Feed Pulses */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide">
            Network Live
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-slate-500 font-mono text-[9.5px]">
          <span>·</span>
          <span>142 Active Nodes</span>
          <span>·</span>
          <span>5 Core Zones Sync</span>
        </div>
      </div>

      {/* Right Area: System Resilience Meter + Clock */}
      <div className="flex items-center space-x-4 ml-auto font-mono">
        {simulationActive && (
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-400 animate-pulse text-[9px] font-bold">
            <Activity className="h-3 w-3 animate-bounce" />
            <span>CRISIS MODEL IN PLAY ({simulationType})</span>
          </div>
        )}

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[10px] uppercase">Resilience:</span>
          <span
            className={`text-xs font-black px-1.5 py-0.2 rounded font-mono ${
              resilienceScore > 75
                ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
                : resilienceScore > 50
                ? "text-yellow-500 bg-yellow-950/20 border border-yellow-500/20"
                : "text-rose-500 bg-rose-950/20 border border-rose-500/20"
            }`}
          >
            {resilienceScore}%
          </span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 bg-slate-950/80 border border-slate-900 px-2 py-0.5 rounded text-[10.5px]">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-bold tracking-wider">{time}</span>
        </div>
      </div>
    </div>
  );
}
