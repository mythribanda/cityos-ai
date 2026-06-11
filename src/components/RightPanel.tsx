import React, { useState } from "react";
import { 
  Send, 
  Bot, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CornerDownLeft, 
  Droplets,
  Clock
} from "lucide-react";
import { ZoneData, SensorData, Alert, ChatMessage } from "../types";

interface RightPanelProps {
  zones: ZoneData[];
  sensors: SensorData[];
  alerts: Alert[];
  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  sendCopilotMessage: () => void;
  isCopilotThinking: boolean;
  resilienceScore: number;
}

export function RightPanel({
  zones,
  sensors,
  alerts,
  chatHistory,
  chatInput,
  setChatInput,
  sendCopilotMessage,
  isCopilotThinking,
  resilienceScore,
}: RightPanelProps) {
  
  // Calculate aggregate metrics for city vitals
  const activeAlertsCount = alerts.length;
  const avgTraffic = Math.round(
    zones.reduce((acc, z) => acc + z.traffic, 0) / zones.length
  );
  const criticalFloodsCount = zones.filter((z) => z.flood > 55).length;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chatInput.trim() !== "") {
      sendCopilotMessage();
    }
  };

  return (
    <div className="w-[270px] bg-[#050b1d] border-l border-[#00f0ff]/10 flex flex-col shrink-0 overflow-hidden font-mono text-xs select-none">
      
      {/* SECTION 1: SYSTEM EXECUTIVE METRICS */}
      <div className="p-3 border-b border-[#00f0ff]/10 space-y-2 pb-3.5 bg-slate-950/25">
        <span className="text-[10px] font-black uppercase text-[#00f0ff]/60 tracking-widest block">
          CITY GENERAL VITALS
        </span>

        <div className="grid grid-cols-2 gap-2 text-left">
          
          <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-slate-300">
            <span className="text-[8px] text-slate-500 uppercase block tracking-wider">
              Health Index
            </span>
            <span className="text-sm font-black text-slate-100 font-mono">
              {resilienceScore}%
            </span>
            <div className="text-[7.5px] text-emerald-400 mt-0.5 leading-none">
              ● nominal rate
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-slate-300">
            <span className="text-[8px] text-slate-500 uppercase block tracking-wider">
              Active Alerts
            </span>
            <span className={`text-sm font-black font-mono ${
              activeAlertsCount > 2 ? "text-rose-400 animate-pulse" : "text-slate-100"
            }`}>
              {activeAlertsCount}
            </span>
            <div className="text-[7.5px] text-slate-500 mt-0.5 leading-none">
              In queue telemetry
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-slate-300">
            <span className="text-[8px] text-slate-500 uppercase block tracking-wider">
              Avg Congestion
            </span>
            <span className="text-sm font-black text-slate-100 font-mono">
              {avgTraffic}%
            </span>
            <div className="text-[7.5px] text-[#00f0ff] mt-0.5 leading-none">
              All sectors
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-slate-300">
            <span className="text-[8px] text-slate-500 uppercase block tracking-wider">
              Flood Plumes
            </span>
            <span className={`text-sm font-black font-mono ${
              criticalFloodsCount > 0 ? "text-rose-400 animate-pulse" : "text-slate-100"
            }`}>
              {criticalFloodsCount} Sector
            </span>
            <div className="text-[7.5px] text-slate-500 mt-0.5 leading-none">
              Critical water cap
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: LIVE ALERTS LOG ENGINE */}
      <div className="flex-1 overflow-y-auto p-3 border-b border-[#00f0ff]/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#00f0ff]/60 tracking-widest block">
            LIVE EVENTS DISPATCH QUEUE
          </span>
          <span className="text-[8px] bg-cyan-400/10 px-1 py-0.2 rounded text-cyan-400 font-bold border border-cyan-400/25">
            LOG ACTIVE
          </span>
        </div>

        <div className="space-y-1.5 overflow-hidden">
          {alerts.map((alert) => {
            const isCrit = alert.severity === "critical";
            const isWarn = alert.severity === "warning";
            
            return (
              <div
                key={alert.id}
                className={`p-2.5 rounded border text-[10.5px] transition-all leading-relaxed ${
                  isCrit
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-300 shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]"
                    : isWarn
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                    : "bg-slate-950/70 border-slate-900 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[8.5px] font-bold uppercase tracking-wider ${
                    isCrit ? "text-rose-400" : isWarn ? "text-amber-400" : "text-[#00f0ff]"
                  }`}>
                    {alert.type}
                  </span>
                  <div className="flex items-center space-x-1 text-[8px] text-slate-500">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{alert.time}</span>
                  </div>
                </div>
                <div className="leading-snug text-slate-200">{alert.message}</div>
                <div className="mt-1 text-[8.5px] font-semibold text-slate-500 uppercase">
                  Sector: {alert.zone} · {alert.source}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SYSTEM CO-COPILOT CHAT MODULE */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-900/60 flex flex-col space-y-2 h-[260px] select-text">
        <div className="flex items-center space-x-1.5 shrink-0">
          <Bot className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[9.5px] font-black uppercase text-[#00f0ff] tracking-widest block">
            CITY CO-PILOT ADVISOR
          </span>
          <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping ml-auto" />
        </div>

        {/* Dynamic chat thread container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[10.5px] bg-[#030612]/80 border border-slate-900 p-2.5 rounded">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="space-y-0.5">
              <span className={`text-[8.5px] font-bold uppercase block ${
                chat.role === "assistant" ? "text-cyan-400" : "text-slate-400"
              }`}>
                {chat.role === "assistant" ? "🤖 AI Advisor" : "👤 Chief Administrator"}
              </span>
              <div className="text-slate-200 leading-relaxed break-words whitespace-pre-line p-1">
                {chat.text}
              </div>
              <hr className="border-slate-900/40 my-1 last:hidden" />
            </div>
          ))}

          {isCopilotThinking && (
            <div className="flex items-center space-x-1.5 text-slate-500 animate-pulse text-[10px] italic">
              <span className="shrink-0 h-1 w-1 bg-cyan-500 rounded-full animate-bounce" />
              <span className="shrink-0 h-1 w-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="shrink-0 h-1 w-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>AI Analysing digital twin vectors...</span>
            </div>
          )}
        </div>

        {/* Chat input form container */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isCopilotThinking}
            placeholder="Query smart telemetry..."
            className="flex-1 bg-[#030612]/90 border border-slate-900 rounded px-2 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-[11px] font-mono leading-none disabled:opacity-55"
          />
          <button
            onClick={sendCopilotMessage}
            disabled={isCopilotThinking || chatInput.trim() === ""}
            className="p-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] rounded hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
