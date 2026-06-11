import React from "react";
import { 
  Compass, 
  Activity, 
  Shield, 
  Lightbulb, 
  BarChart, 
  Flame, 
  Droplets,
  AlertOctagon,
  Bot
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  simulationActive: boolean;
  triggerHeavyRainfallSimulation: () => void;
  triggerFireSimulation: () => void;
  resetSimulation: () => void;
  alertCounts: { traffic: number; flood: number; aqi: number };
}

export function Sidebar({
  activeTab,
  setActiveTab,
  simulationActive,
  triggerHeavyRainfallSimulation,
  triggerFireSimulation,
  resetSimulation,
  alertCounts,
}: SidebarProps) {
  return (
    <div className="w-[195px] bg-[#050b1d] border-r border-[#00f0ff]/10 flex flex-col shrink-0 overflow-y-auto selection:bg-cyan-500/20">
      
      {/* SECTION 1: OPERATIONS */}
      <div className="space-y-1 py-3 px-2">
        <span className="text-[9.5px] font-mono font-black uppercase tracking-widest text-[#00f0ff]/50 px-2 block mb-2">
          OPERATIONAL VIEWS
        </span>

        {[
          { id: "Overview", label: "Overview Map", icon: Compass },
          { id: "Brief", label: "⚡ COMMAND BRIEF", icon: Shield, highlight: true },
          { id: "WhyWins", label: "💡 WHY SYSTEM WINS", icon: Lightbulb, highlight: true },
          { id: "Traffic", label: "Traffic Monitor", icon: Activity },
          { id: "Flood", label: "Flood Overlays", icon: Droplets },
          { id: "Reports", label: "Analytical Feed", icon: BarChart },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-2.5 rounded text-left transition-all text-[11.5px] font-mono group cursor-pointer ${
                isSelected
                  ? "bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white shadow-[inset_0_0_8px_rgba(0,240,255,0.15)] font-bold ms-1"
                  : tab.highlight
                  ? "bg-cyan-950/20 hover:bg-cyan-950/30 border border-cyan-500/15 text-cyan-300 hover:text-white"
                  : "bg-transparent border border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
              }`}
            >
              <IconComponent
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isSelected ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"
                }`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <hr className="border-slate-900/40 my-1 mx-3" />

      {/* SECTION 2: SIMULATORS */}
      <div className="space-y-2 py-2 px-2">
        <span className="text-[9.5px] font-mono font-black uppercase tracking-widest text-teal-400/60 px-2 block">
          CRISIS SCENARIOS
        </span>
        
        <div className="space-y-1.5 px-1 font-mono">
          <button
            onClick={triggerHeavyRainfallSimulation}
            disabled={simulationActive}
            className={`w-full flex flex-col p-2.5 rounded text-left transition-all border outline-none text-[11px] ${
              simulationActive
                ? "bg-slate-900/50 border-slate-900 text-slate-500 opacity-50 cursor-not-allowed"
                : "bg-slate-950/80 hover:bg-[#00f0ff]/5 border-cyan-500/15 hover:border-cyan-400/40 text-slate-300 cursor-pointer"
            }`}
          >
            <span className="font-bold text-white flex items-center space-x-1">
              <span>🌧️</span>
              <span>HEAVY RAIN FRONT</span>
            </span>
            <span className="text-[8.5px] text-slate-500 mt-1 leading-normal block">
              Inject storm runoff (72 mm/hr) near Kukatpally
            </span>
          </button>

          <button
            onClick={triggerFireSimulation}
            disabled={simulationActive}
            className={`w-full flex flex-col p-2.5 rounded text-left transition-all border outline-none text-[11px] ${
              simulationActive
                ? "bg-slate-900/50 border-slate-900 text-slate-500 opacity-50 cursor-not-allowed"
                : "bg-slate-950/80 hover:bg-rose-500/5 border-rose-500/15 hover:border-rose-400/40 text-slate-300 cursor-pointer"
            }`}
          >
            <span className="font-bold text-white flex items-center space-x-1">
              <span>🔥</span>
              <span>INDUSTRIAL CRISIS</span>
            </span>
            <span className="text-[8.5px] text-slate-500 mt-1 leading-normal block">
              Deploy combustible fume plume spread model
            </span>
          </button>

          {simulationActive && (
            <button
              onClick={resetSimulation}
              className="w-full py-2 bg-rose-950/20 border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-950/40 transition-all rounded text-[10px] uppercase text-center mt-2 cursor-pointer"
            >
              🔁 RESET CONSOLE
            </button>
          )}
        </div>
      </div>

      <hr className="border-slate-900/40 my-1 mx-3" />

      {/* SECTION 3: SYSTEM METRICS INTEGRATION */}
      <div className="py-2 px-4 space-y-2 mt-auto text-[10px] font-mono text-slate-400">
        <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block">
          Telemetry Feeds
        </span>
        <div className="space-y-1.5 leading-snug">
          <div className="flex justify-between">
            <span>Traffic Sensor:</span>
            <span className={`${alertCounts.traffic > 0 ? "text-yellow-500 font-bold" : "text-emerald-400"}`}>
              {alertCounts.traffic > 0 ? `⚠️ ${alertCounts.traffic}` : "Good"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Water Sensor:</span>
            <span className={`${alertCounts.flood > 0 ? "text-rose-500 font-bold animate-pulse" : "text-emerald-400"}`}>
              {alertCounts.flood > 0 ? `🌊 ${alertCounts.flood}` : "Nomial"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>AI Copilot:</span>
            <span className="text-cyan-400 font-bold flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
