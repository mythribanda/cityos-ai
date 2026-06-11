import React from "react";
import { 
  Bot, 
  Flame, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  Calendar,
  CheckCircle2,
  TrendingDown
} from "lucide-react";

interface DecisionPoint {
  id: string;
  time: string;
  message: string;
  severity: "critical" | "warning" | "success" | "info";
}

interface SimulationPanelProps {
  simulationActive: boolean;
  simulationType: "HEAVY_RAIN" | "FIRE" | "NONE";
  simMessage: string;
  rainfallMM: number;
  citizensAffected: number;
  hospitalsImpacted: number;
  schoolsBlocked: number;
  economicLossCr: number;
  savedEconomicLossCr: number;
  autoResponse: boolean;
  setAutoResponse: (val: boolean) => void;
  decisionFeed: DecisionPoint[];
}

export function SimulationPanel({
  simulationActive,
  simulationType,
  simMessage,
  rainfallMM,
  citizensAffected,
  hospitalsImpacted,
  schoolsBlocked,
  economicLossCr,
  savedEconomicLossCr,
  autoResponse,
  setAutoResponse,
  decisionFeed,
}: SimulationPanelProps) {
  
  if (!simulationActive) {
    return (
      <div className="absolute top-3 left-4 bg-[#050b1d]/90 border border-slate-900 rounded-xl p-3.5 backdrop-blur-md z-30 max-w-sm shadow-2xl space-y-2 select-none text-slate-400 font-mono text-[11px] leading-relaxed">
        <div className="flex items-center space-x-1.5 uppercase font-black text-[#00f0ff] text-[9.5px]">
          <Bot className="h-4 w-4 shrink-0 animate-pulse text-cyan-400" />
          <span>CityOS Copilot Sensors Standby</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Digital twin of Hyderabad is stable. Use the <strong className="text-white">Crisis Simulators</strong> in the left drawer to model storm fronts or industrial fire plumes.
        </p>
        <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 text-[9px]">
          <span className="flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-semibold text-emerald-400">Continuous scans passive</span>
          </span>
          <span>72% Regional Integrity</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-3 left-4 bg-[#050b1d]/95 border border-slate-800 rounded-xl p-4 backdrop-blur-lg z-30 max-w-sm shadow-2xl space-y-3 font-mono text-[11px] h-[395px] flex flex-col justify-between select-none">
      
      {/* Simulation Header */}
      <div className="shrink-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
              {simulationType === "HEAVY_RAIN" ? "🌊 ACTIVE HEAVY RAIN CASCADE" : "🔥 PLUME HAZARD DISPERSION"}
            </span>
          </div>
          <span className="text-[7.5px] px-1 bg-rose-500/10 rounded font-black border border-rose-500/25 text-rose-400">
            SIM TIMELINE RUNNING
          </span>
        </div>
        
        <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed border-l-2 border-cyan-400 pl-2">
          {simMessage}
        </p>
      </div>

      <hr className="border-slate-900/60 shrink-0" />

      {/* Embedded Live Weather gauges */}
      <div className="grid grid-cols-3 gap-2 text-center shrink-0">
        <div className="bg-slate-950/60 rounded border border-slate-900 p-1.5">
          <span className="text-[7.5px] text-slate-500 block uppercase font-bold">Rainfall</span>
          <span className="text-xs font-black text-white">{rainfallMM} mm/hr</span>
          <span className="text-[7px] text-rose-400 block mt-0.5 leading-none">Saturation</span>
        </div>
        <div className="bg-slate-950/60 rounded border border-slate-900 p-1.5">
          <span className="text-[7.5px] text-slate-500 block uppercase font-bold">Atmosphere</span>
          <span className="text-xs font-black text-white">92% Humid</span>
          <span className="text-[7px] text-slate-500 block mt-0.5 leading-none">Precipitative</span>
        </div>
        <div className="bg-slate-950/60 rounded border border-slate-900 p-1.5">
          <span className="text-[7.5px] text-slate-500 block uppercase font-bold">Gust Wind</span>
          <span className="text-xs font-black text-white">18 km/h</span>
          <span className="text-[7px] text-emerald-400 block mt-0.5 leading-none">Convective</span>
        </div>
      </div>

      {/* Dynamic Economic & Citizen Impact Tracker */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1.5 shrink-0">
        <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 block">
          PROJECTED REGIONAL INCIDENT DEVIATIONS
        </span>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Econ Loss:</span>
            <span className="text-rose-400 font-bold">₹{economicLossCr.toFixed(2)} Cr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Exposed Pop:</span>
            <span className="text-yellow-400 font-bold">{citizensAffected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Hospitals Red:</span>
            <span className="text-rose-400 font-bold">{hospitalsImpacted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Blocked Schools:</span>
            <span className="text-amber-400 font-bold">{schoolsBlocked}</span>
          </div>
        </div>

        {savedEconomicLossCr > 0 && (
          <div className="text-[8.5px] text-emerald-400 font-bold bg-emerald-950/20 p-1 px-1.5 rounded border border-emerald-500/25 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <TrendingDown className="h-3 w-3 shrink-0" />
              <span>Averted Damage:</span>
            </span>
            <span>₹{savedEconomicLossCr.toFixed(2)} Cr saved!</span>
          </div>
        )}
      </div>

      {/* LIVE AI DECISIONAL FEED - Dynamic updating */}
      <div className="flex-1 min-h-0 flex flex-col space-y-1 my-1">
        <div className="flex justify-between items-center text-[8.5px] uppercase font-bold text-slate-500 shrink-0">
          <span>CO-PILOT CONSTRUCT DECISIONS LOG</span>
          <span className="text-cyan-400">ACTIVE TELEMETRY</span>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950/70 border border-slate-900 rounded p-1.5 space-y-1.5 text-[9.5px]">
          {decisionFeed.slice(0, 4).map((feed) => (
            <div key={feed.id} className="leading-snug flex items-start space-x-1.5 text-slate-300">
              <span className={`text-[7px] px-1 rounded leading-none mt-0.5 whitespace-nowrap ${
                feed.severity === "critical" ? "bg-rose-950 text-rose-400 border border-rose-500/20" :
                feed.severity === "warning" ? "bg-amber-950 text-amber-500" :
                feed.severity === "success" ? "bg-emerald-950 text-emerald-400 font-bold" :
                "bg-slate-900 text-slate-400"
              }`}>
                {feed.severity}
              </span>
              <div className="flex-1">
                <span className="text-slate-500 font-bold mr-1">{feed.time}</span>
                <span>{feed.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUTONOMOUS RESPONSE TOGGLE */}
      <div className="shrink-0 pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px]">
        <div className="flex flex-col">
          <span className="font-bold text-slate-300">Autonomous Responder</span>
          <span className="text-[8.5px] text-slate-500">Auto-deploy tactical pumps & bypass</span>
        </div>
        <button
          onClick={() => setAutoResponse(!autoResponse)}
          className={`px-3 py-1 rounded font-bold border transition-all text-[9.5px] uppercase cursor-pointer outline-none ${
            autoResponse
              ? "bg-emerald-950 border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
              : "bg-slate-950 border-slate-800 text-slate-500"
          }`}
        >
          {autoResponse ? "ON (AUTO-RECOVERY)" : "MANUAL INTERVENT"}
        </button>
      </div>

    </div>
  );
}
