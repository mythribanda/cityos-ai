import React, { useState, useEffect, useRef } from "react";
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
  TrendingUp,
  X,
  Sparkles,
  Zap,
  Building2,
  Volume2,
  VolumeX,
  FileText,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from "recharts";

import { ZoneData, SensorData, Alert, ChatMessage, HistoricalDataPoint } from "./types";
import { initialZones, initialSensors, initialAlerts, initialHistory } from "./data";

import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { MapPanel } from "./components/MapPanel";
import { RightPanel } from "./components/RightPanel";
import { SimulationPanel } from "./components/SimulationPanel";
import { AlertBanner } from "./components/AlertBanner";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"Overview" | "Brief" | "WhyWins" | "Traffic" | "Flood" | "Reports">("Overview");

  // Digital Twin Core States
  const [zones, setZones] = useState<ZoneData[]>(initialZones);
  const [sensors, setSensors] = useState<SensorData[]>(initialSensors);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(initialZones[0]);
  const [history, setHistory] = useState<HistoricalDataPoint[]>(initialHistory());

  // Tactical layer toggles
  const [layerTraffic, setLayerTraffic] = useState<boolean>(true);
  const [layerFlood, setLayerFlood] = useState<boolean>(true);
  const [layerWeather, setLayerWeather] = useState<boolean>(true);
  const [layerAIRoute, setLayerAIRoute] = useState<boolean>(true);
  const [layerHospital, setLayerHospital] = useState<boolean>(true);

  // Active Simulation states
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [simulationType, setSimulationType] = useState<"HEAVY_RAIN" | "FIRE" | "NONE">("NONE");
  const [simMessage, setSimMessage] = useState<string>("");
  const [rainfallMM, setRainfallMM] = useState<number>(10);

  // Dynamic Economic impact indicators
  const [citizensAffected, setCitizensAffected] = useState<number>(0);
  const [hospitalsImpacted, setHospitalsImpacted] = useState<number>(0);
  const [schoolsBlocked, setSchoolsBlocked] = useState<number>(0);
  const [economicLossCr, setEconomicLossCr] = useState<number>(0);
  const [savedEconomicLossCr, setSavedEconomicLossCr] = useState<number>(0);

  // Autonomy modes
  const [autoResponse, setAutoResponse] = useState<boolean>(true);
  const [resilienceScore, setResilienceScore] = useState<number>(86);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);

  // Real-time AI decision logs ledger
  const [decisionFeed, setDecisionFeed] = useState<Array<{ id: string; time: string; message: string; severity: "critical" | "warning" | "success" | "info" }>>([
    { id: "i-1", time: "09:30:05", message: "CityOS Central Link established. Hyderabad spatial twin active.", severity: "success" },
    { id: "i-2", time: "09:30:12", message: "Static feeds synced: 142 sensory checkpoints reported online.", severity: "info" }
  ]);

  // Alert slide notification
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(false);
  const [alertBannerText, setAlertBannerText] = useState<string>("");

  // Chat copilot states
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "c-init",
      role: "assistant",
      text: "👋 AI Copilot online. Hyderabad spatial telemetry is synchronized. Ask me about active water runoffs, ORR diversion confidence indices, or patancheru AQI warnings."
    }
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);

  // Audio feedback system
  const speakLog = (words: string) => {
    if (!audioFeedback) return;
    try {
      const speech = new SpeechSynthesisUtterance(words);
      speech.rate = 1.05;
      speech.pitch = 0.95;
      window.speechSynthesis.speak(speech);
    } catch (e) {
      console.warn("Speech Synthesis error:", e);
    }
  };

  // Helper to add decision logs
  const logDecision = (text: string, level: "critical" | "warning" | "success" | "info" = "info") => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    setDecisionFeed(prev => [
      { id: `dec-${Math.random()}`, time: timeStr, message: text, severity: level },
      ...prev
    ]);
  };

  // FLUSH/RESET SENSORS BACK TO NOMINAL STATUS
  const resetSimulation = () => {
    setSimulationActive(false);
    setSimulationType("NONE");
    setSimMessage("");
    setRainfallMM(10);
    setCitizensAffected(0);
    setHospitalsImpacted(0);
    setSchoolsBlocked(0);
    setEconomicLossCr(0);
    setSavedEconomicLossCr(0);
    setResilienceScore(86);
    setZones(initialZones);
    setSensors(initialSensors);
    setAlerts(initialAlerts);
    setShowAlertBanner(false);
    
    logDecision("System recovered. Baseline parameters established across all sectors.", "success");
    speakLog("Crisis simulation reverted. Systems nominal.");
  };

  // HEAVY RAINFALL SIMULATION STAGED TIMELINE
  const triggerHeavyRainfallSimulation = () => {
    if (simulationActive) return;
    setSimulationActive(true);
    setSimulationType("HEAVY_RAIN");
    setRainfallMM(72);
    setSimMessage("Severe cloudburst front (72 mm/hr) detected. Flood runoff warnings triggered.");
    setResilienceScore(54);
    
    speakLog("Critical rain warning! Heavy stormwater runoff expected.");

    // Step 1: Slide warning banner
    setAlertBannerText("🌧️ RED ALARM: High precipitative runoff (72mm) approaching Kukatpally & Musi sectors!");
    setShowAlertBanner(true);
    logDecision("Atmospheric warning issued: Severe convective precipitative storm cell active.", "critical");

    // Step 2: Flood values surge (Musi & Kukatpally)
    setTimeout(() => {
      setZones(prev => prev.map(z => {
        if (z.name === "Kukatpally") return { ...z, flood: 85, traffic: 92, riskScore: 89 };
        if (z.name === "Musi Riverbank") return { ...z, flood: 91, traffic: 45, riskScore: 91 };
        return { ...z, flood: Math.min(100, z.flood + 18), riskScore: Math.min(100, z.riskScore + 15) };
      }));

      // Set sensor values of water & traffic to critical
      setSensors(prev => prev.map(s => {
        if (s.id === "Water-03") return { ...s, value: 85, status: "Critical" };
        if (s.id === "Traffic-04") return { ...s, value: 92, status: "Critical" };
        return s;
      }));

      // Expose populations
      setCitizensAffected(24150);
      setHospitalsImpacted(1);
      setSchoolsBlocked(4);
      setEconomicLossCr(2.45);

      const alertItem: Alert = {
        id: "alert-f1",
        source: "Water-03 Sensor",
        type: "water",
        message: "🚨 Musi Riverbank and Kukatpally drainage channels exceeded 85% flood capacities!",
        severity: "critical",
        time: new Date().toTimeString().split(" ")[0].slice(0, 5),
        zone: "Kukatpally"
      };
      setAlerts(prev => [alertItem, ...prev]);
      logDecision("Hydrological sensors logged critical backwater pressure in Kukatpally catchment.", "critical");
    }, 1200);

    // Step 3: Copilot auto-intervention (If autoResponse)
    setTimeout(() => {
      if (autoResponse) {
        setSavedEconomicLossCr(1.85);
        setResilienceScore(72);
        
        // Add success actions logs
        const successAlert: Alert = {
          id: "alert-f2",
          source: "CityOS AI Agent",
          type: "traffic",
          message: "⭐ Dynamic bypass routing activated through Outer Ring Road. Ambulance corridors cleared.",
          severity: "info",
          time: new Date().toTimeString().split(" ")[0].slice(0, 5),
          zone: "Hitech City"
        };
        setAlerts(prev => [successAlert, ...prev]);

        logDecision("AI Engine engaged: Opened stormwater auxiliary pump gate G-4 to divert Kukatpally runoff.", "success");
        logDecision("AI Engine cleared and prioritize bypass lanes near Gandhi Hospital corridor (94% confidence).", "success");

        speakLog("Autonomous responder engaged. Outer ring road diverted; storm runoff gates activated.");

        // Append Copilot advice contextually
        setChatHistory(prev => [
          ...prev,
          {
            id: `cop-${Math.random()}`,
            role: "assistant",
            text: `### 🌊 Storm Cascade Analysis & Autonomous Mitigation

**Risk Summary**: Heavy storm front is actively drowning Kukatpally catchment. Musi canal depth is at **91%**, indicating high local flooding.
**Most Affected Zone**: **Kukatpally Sector (Road-9 Interchange)**. Traffic levels surged to **92%** due to ponding water blockages.

**Autonomous Actions Taken**:
1. Activated **bypass corridor on Outer Ring Road (ORR)** to reroute NH-65 traffic.
2. Diverted storm runoff by opening auxiliary discharge gate **G-4**.
3. Issued localized mobile warnings to **24,150 residents**.

**Estimated Impact**: Saved worth **₹1.85 Cr**. Hydrologic stress down by **22%** in 30 mins.`
          }
        ]);
      }
    }, 2800);
  };

  // INDUSTRIAL GAS LEAK FIRE SIMULATION
  const triggerFireSimulation = () => {
    if (simulationActive) return;
    setSimulationActive(true);
    setSimulationType("FIRE");
    setSimMessage("Industrial combustible plume alert triggered in Kukatpally warehouse depot.");
    setResilienceScore(45);

    speakLog("Critical fire warning! Hazardous atmospheric spread modeled.");

    // Step 1: Slide warn banner
    setAlertBannerText("🔥 INCIDENT ALARM: Highly volatile plume leakage registered in Northwest Kukatpally Depot!");
    setShowAlertBanner(true);
    logDecision("Thermal sensors registered acute localized temperature spike of 450°C.", "critical");

    // Step 2: AQI and hazard level rises
    setTimeout(() => {
      setZones(prev => prev.map(z => {
        if (z.name === "Kukatpally") return { ...z, aqi: 285, riskScore: 94 };
        if (z.name === "Gachibowli") return { ...z, aqi: 180, riskScore: 56 };
        return { ...z, aqi: Math.min(300, z.aqi + 35), riskScore: Math.min(100, z.riskScore + 10) };
      }));

      setSensors(prev => prev.map(s => {
        if (s.id === "AQI-03") return { ...s, value: 285, status: "Critical" };
        return s;
      }));

      setCitizensAffected(12500);
      setHospitalsImpacted(2);
      setSchoolsBlocked(2);
      setEconomicLossCr(1.40);

      const fireAlert: Alert = {
        id: "alert-fr1",
        source: "AQI-03 Station",
        type: "aqi",
        message: "⚠️ Kukatpally depot air quality index plummeted to 285 PM2.5 (HAZARDOUS) due to toxic particulate spread.",
        severity: "critical",
        time: new Date().toTimeString().split(" ")[0].slice(0, 5),
        zone: "Kukatpally"
      };
      setAlerts(prev => [fireAlert, ...prev]);
      logDecision("Regional air indices reached extreme toxic warnings in northwest quadrant.", "critical");
    }, 1200);

    // Step 3: Auto remediation
    setTimeout(() => {
      if (autoResponse) {
        setSavedEconomicLossCr(0.95);
        setResilienceScore(68);

        const dispatchAlert: Alert = {
          id: "alert-fr2",
          source: "CityOS AI Agent",
          type: "emergency",
          message: "🔥 Local evacuation boundary (0.5km) issued. Drone chemical mitigation deployed.",
          severity: "info",
          time: new Date().toTimeString().split(" ")[0].slice(0, 5),
          zone: "Kukatpally"
        };
        setAlerts(prev => [dispatchAlert, ...prev]);

        logDecision("AI Agent triggered: NDRF response signal beamed to regional Fire Dispatch Station.", "success");
        logDecision("Evacuation safe corridors established via Financial District bypass.", "success");

        speakLog("Evacuation warnings flashed. Regional air purification scrubbers active.");

        setChatHistory(prev => [
          ...prev,
          {
            id: `cop-${Math.random()}`,
            role: "assistant",
            text: `### 🔥 Combustible Toxic Plume Incident Report

**Risk Summary**: Air particulate sensors returned heavy toxic smoke density over Kukatpally industrial zones. AQI peak at **285**.
**Most Affected Zone**: **Kukatpally Northwest District**. Toxic clouds are drifting toward local residential corridors.

**Autonomous Actions Taken**:
1. Dispatched automated fire response request straight to **Kukatpally Core Station**.
2. Deployed localized evacuations within **0.5 km radius**.
3. Re-routed emergency ambulance corridors away from the gas plume.

**Estimated Impact**: Prevented ₹0.95 Cr damages. Evacuation safety verified with **99% compliance**.`
          }
        ]);
      }
    }, 2800);
  };

  // SEND MESSAGE TO CO-PILOT AI BACKEND
  const sendCopilotMessage = async () => {
    if (chatInput.trim() === "" || isCopilotThinking) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [
      ...prev,
      { id: `u-${Math.random()}`, role: "user", text: userMsg }
    ]);
    setIsCopilotThinking(true);

    try {
      // Build dynamic context to feed the AI
      const cityContext = {
        zones: zones.map(z => ({ name: z.name, traffic: z.traffic, flood: z.flood, aqi: z.aqi, risk: z.riskScore })),
        simulationActive,
        simulationType,
        rainfallMM,
        resilienceScore,
        activeAlertsCount: alerts.length
      };

      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          cityContext: cityContext,
          history: chatHistory.slice(-5).map(h => ({ role: h.role, text: h.text }))
        })
      });

      const data = await response.json();
      
      setChatHistory(prev => [
        ...prev,
        { id: `cop-${Math.random()}`, role: "assistant", text: data.text || "I was unable to retrieve a response from CityOS cores." }
      ]);
      speakLog("AI telemetry response received.");
    } catch (e) {
      console.error("Error communicating with copilot:", e);
      setChatHistory(prev => [
        ...prev,
        { id: `err-${Math.random()}`, role: "assistant", text: "❌ **System Interruption**: Connection to CityOS AI core timed out. Please enter another request or check your unmitigated local state." }
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#020512] flex flex-col overflow-hidden text-white select-none selection:bg-cyan-500/20">
      
      {/* Top operational bar */}
      <TopBar 
        simulationActive={simulationActive} 
        simulationType={simulationType} 
        resilienceScore={resilienceScore} 
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Operational Drawer Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            speakLog(`Navigating to ${tab} database.`);
          }}
          simulationActive={simulationActive}
          triggerHeavyRainfallSimulation={triggerHeavyRainfallSimulation}
          triggerFireSimulation={triggerFireSimulation}
          resetSimulation={resetSimulation}
          alertCounts={{
            traffic: zones.filter(z => z.traffic > 70).length,
            flood: zones.filter(z => z.flood > 50).length,
            aqi: zones.filter(z => z.aqi > 150).length
          }}
        />

        {/* Center Canvas Area wrapper */}
        <div className="flex-1 flex flex-col relative h-full bg-[#020512] overflow-hidden">

          {/* TAB 1: OVERVIEW SPATIAL DIGITAL TWIN (Integrated Map & Floating HUD HUD) */}
          {activeTab === "Overview" && (
            <div className="flex-1 w-full h-full relative flex flex-col">
              
              {/* Actual Map viewport Panel */}
              <MapPanel
                zones={zones}
                sensors={sensors}
                selectedZone={selectedZone}
                setSelectedZone={(z) => {
                  setSelectedZone(z);
                  speakLog(`Selecting ${z.name} sector.`);
                }}
                simulationActive={simulationActive}
                simulationType={simulationType}
                layerTraffic={layerTraffic}
                layerFlood={layerFlood}
                layerWeather={layerWeather}
                layerAIRoute={layerAIRoute}
                layerHospital={layerHospital}
              />

              {/* Float command HUD desk Overlay */}
              <SimulationPanel
                simulationActive={simulationActive}
                simulationType={simulationType}
                simMessage={simMessage}
                rainfallMM={rainfallMM}
                citizensAffected={citizensAffected}
                hospitalsImpacted={hospitalsImpacted}
                schoolsBlocked={schoolsBlocked}
                economicLossCr={economicLossCr}
                savedEconomicLossCr={savedEconomicLossCr}
                autoResponse={autoResponse}
                setAutoResponse={(val) => {
                  setAutoResponse(val);
                  speakLog(`Autonomous response mode ${val ? "enabled" : "disabled"}.`);
                }}
                decisionFeed={decisionFeed}
              />

              {/* Float Toggle audio assistant control */}
              <button
                onClick={() => setAudioFeedback(!audioFeedback)}
                className="absolute bottom-3 left-3 bg-[#050b1d]/90 border border-[#00f0ff]/15 p-2 rounded-lg z-20 hover:bg-slate-900 group cursor-pointer transition-all"
                title="Toggle Voice Synthesizer Alerts"
              >
                {audioFeedback ? (
                  <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-500" />
                )}
              </button>

            </div>
          )}

          {/* TAB 2: COMMAND BRIEF (Executive Operations Desk Deck) */}
          {activeTab === "Brief" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#030715] select-text">
              
              {/* Executive Summary Row Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 shrink-0">
                
                {/* 1. Threat Card */}
                <div className="bg-[#080f26]/85 border border-[#00f0ff]/10 rounded-xl p-4 relative overflow-hidden shadow-lg select-none">
                  <div className="absolute top-1 right-1 p-2 opacity-5 text-rose-500">
                    <ShieldAlert className="h-10 w-10" />
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase tracking-wider">
                    OPERATIONAL THREAT SCORE
                  </span>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      simulationActive ? "bg-rose-500 animate-ping" : "bg-emerald-400 animate-pulse"
                    }`} />
                    <span className={`text-lg font-display font-black tracking-wider uppercase ${
                      simulationActive ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {simulationActive ? `${simulationType} SEQ Active` : "🟢 Baseline Good"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-mono">
                    {simulationActive ? `Plume spreading tracking sequences override passive nodes.` : "All municipal systems registering within baseline ranges."}
                  </p>
                </div>

                {/* 2. Population Exposed */}
                <div className="bg-[#080f26]/85 border border-[#00f0ff]/10 rounded-xl p-4 relative overflow-hidden shadow-lg select-none">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase tracking-wider">
                    POPULATION IN THREAT SECTORS
                  </span>
                  <span className="text-3xl font-display font-black text-slate-100 block tracking-tight mt-1">
                    {simulationActive ? citizensAffected.toLocaleString() : "0"}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-2 font-mono">
                    {simulationActive ? `${citizensAffected.toLocaleString()} residents flagged inside active model boundaries.` : "Zone occupancy metrics within safety parameters."}
                  </p>
                </div>

                {/* 3. Economic score damage saved */}
                <div className="bg-[#080f26]/85 border border-[#00f0ff]/10 rounded-xl p-4 relative overflow-hidden shadow-lg">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase tracking-wider">
                    REGIONAL LOSS COMPASS-TRACK
                  </span>
                  <div className="space-y-1.5 mt-2 text-[11px] font-mono select-none">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Projected Damage:</span>
                      <span className={`font-bold ${simulationActive ? "text-rose-400" : "text-slate-600"}`}>
                        ₹{simulationActive ? economicLossCr.toFixed(2) : "0.00"} Cr
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900/40 pt-1">
                      <span className="text-emerald-400 font-bold">Averted / Saved:</span>
                      <span className={`font-bold ${savedEconomicLossCr > 0 ? "text-emerald-400" : "text-slate-600"}`}>
                        ₹{savedEconomicLossCr > 0 ? savedEconomicLossCr.toFixed(2) : "0.00"} Cr
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Autonomous Response Mode brain */}
                <div className="bg-gradient-to-br from-cyan-950/25 to-slate-950 border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-[9.2px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      AUTONOMOUS CO-DESK
                    </span>
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold border ${
                      autoResponse ? "bg-emerald-950 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500"
                    }`}>
                      {autoResponse ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1 leading-snug">
                    Zero-human-latency crisis alerts, water re-routing diversion logic, and automatic dispatch notifications.
                  </p>
                  <button
                    onClick={() => {
                      setAutoResponse(!autoResponse);
                      speakLog(`Autonomous responder toggled ${!autoResponse ? "engaged" : "disengaged"}.`);
                    }}
                    className="w-full mt-2 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-mono font-black text-[9px] rounded uppercase cursor-pointer"
                  >
                    Toggle responder
                  </button>
                </div>

              </div>

              {/* Sub Operation Deck rows */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Explainable AI Route Advisor (Left 7-cols) */}
                <div className="lg:col-span-8 bg-[#080f26]/60 border border-slate-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-cyan-400 animate-pulse animate-bounce" />
                    <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                      EXPLAINABLE AI ROUTE ROUTING ADVISOR (CORE INTEL)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* RECOMMENDED CORRIDOR PATHWAY */}
                    <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/25 hover:border-cyan-400/50 transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wide">
                          ✓ RECOMMENDED BYPASS CORRIDOR
                        </span>
                        <span className="text-[9px] font-bold text-white font-mono bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          94% Conf
                        </span>
                      </div>
                      <div>
                        <span className="text-[8.5px] font-mono text-slate-500 block uppercase font-bold">
                          Safe Primary Gateway
                        </span>
                        <strong className="text-xs text-white block">Gandhi Hospital Emergency Interchange</strong>
                        <span className="text-[11px] font-black text-cyan-400 block mt-0.5">
                          Outer Ring Road bypass Corridor
                        </span>
                      </div>
                      <hr className="border-slate-900" />
                      <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span className="text-emerald-400">✓</span>
                          <span>Zero water runoff or ponding on lanes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-emerald-400">✓</span>
                          <span>Average velocity grid speeds above 45km/h</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-emerald-400">✓</span>
                          <span>Evacuation emergency signal timing configured</span>
                        </div>
                      </div>
                    </div>

                    {/* PATHWAY TO AVOID */}
                    <div className="bg-slate-950/90 p-4 rounded-xl border border-rose-500/15 hover:border-rose-500/30 transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-wide">
                          ✗ SECTOR BLOCKAGE DANGER
                        </span>
                        <span className="text-[9px] font-bold text-rose-400 font-mono bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-500/30">
                          Gridlock Saturation
                        </span>
                      </div>
                      <div>
                        <span className="text-[8.5px] font-mono text-slate-500 block uppercase font-bold">
                          Do Not Dispatch Segment
                        </span>
                        <strong className="text-xs text-white block">Kukatpally Junction (Road-9 Catchment)</strong>
                        <span className="text-[11px] font-black text-rose-400 block mt-0.5">
                          Primary Hydrologic Overflow threat
                        </span>
                      </div>
                      <hr className="border-slate-900" />
                      <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span className="text-rose-400">✗</span>
                          <span>Predicted flood index reaching 87% limit</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-rose-400">✗</span>
                          <span>Absolute gridlock threat density: 92% risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-rose-400">✗</span>
                          <span>Blocked underpass makes transit catastrophic</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Spatiotemporal Future Risk Prediction Timeline (Right 5-cols) */}
                <div className="lg:col-span-4 bg-[#080f26]/60 border border-slate-900 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 block uppercase tracking-wider">
                    SPATIOTEMPORAL RISK TIME-SERIES PREDICTIONS
                  </span>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    {[
                      { label: "NOW (IMMEDIATE STATE)", val: simulationActive ? "65%" : "12%", status: "System Standby Scans" },
                      { label: "+15 MINUTES MODEL", val: simulationActive ? "78%" : "15%", status: "Predicted Runoff Ponding" },
                      { label: "+30 MINUTES MODEL", val: simulationActive ? "91%" : "19%", status: "NH-65 Saturated Blockage" },
                    ].map((step, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-900 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-slate-500 uppercase font-black block">{step.label}</span>
                          <span className="text-slate-300 font-semibold">{step.status}</span>
                        </div>
                        <span className={`text-xl font-display font-black truncate max-w-xs ${
                          simulationActive && idx >= 1 ? "text-rose-400 animate-pulse" : "text-cyan-400"
                        }`}>
                          {step.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9.5px] text-slate-500 font-mono leading-relaxed mt-2 select-none">
                    Predictions compiled using real-time drainage sensor parameters and historic precipitation timelines.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: WHY CITYOS AI WINS (Paradigm comparison sheet) */}
          {activeTab === "WhyWins" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#030715] select-text">
              <div className="text-center space-y-1 pb-2">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  🏛️ THE TRANSFORMATIVE PARADIGM ADVANTAGE: WHY SYSTEM WINS
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Traditional smart city initiatives deploy disconnected, fragmented dashboards. CityOS AI unifies spatial maps with predictive autonomous engines to save lives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                
                {/* Fragmented system paradigm */}
                <div className="bg-[#080f26]/30 border border-slate-900 rounded-xl p-5 space-y-4 relative overflow-hidden select-none">
                  <div className="absolute top-0 right-0 p-3 opacity-5 text-rose-500">
                    <X className="h-16 w-16" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-rose-400 font-black tracking-widest uppercase block mb-1">
                      TRADITIONAL OUTDATED PARADIGMS
                    </span>
                    <h4 className="text-base font-display font-black text-white uppercase">
                      The Disconnected Dashboards
                    </h4>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded space-y-1">
                      <strong className="text-rose-400 text-[10px] block uppercase">🚦 Isolated Traffic Screens</strong>
                      <p className="text-slate-500 leading-normal text-[9.5px]">Monitors road congestion but is completely blind to sudden stormwater drain backpressure or chemical dep overflows.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-900 rounded space-y-1">
                      <strong className="text-rose-400 text-[10px] block uppercase">🌊 Closed Water Levels Logs</strong>
                      <p className="text-slate-500 leading-normal text-[9.5px]">Measures water level heights inside drainage channels but lacks connectivity to redirect transits or clearance times.</p>
                    </div>
                  </div>

                  <hr className="border-slate-900" />
                  
                  <div className="text-[10px] text-rose-400 font-bold bg-rose-950/20 p-2.5 rounded border border-rose-500/15 leading-relaxed">
                    ⚠️ Consequence: Human latency results in slower responses. Local businesses face heavy rainfall gridlock commercial losses of ₹2.4 Cr per cloudburst.
                  </div>
                </div>

                {/* CityOS paradigm */}
                <div className="bg-cyan-950/5 border border-cyan-500/35 rounded-xl p-5 space-y-4 relative overflow-hidden select-none">
                  <div className="absolute top-0 right-0 p-3 opacity-15 text-cyan-400">
                    <Sparkles className="h-14 w-14" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase block mb-1">
                      CITYOS DIGITAL METROPOLITAN MATRIX
                    </span>
                    <h4 className="text-base font-display font-black text-white uppercase font-sans">
                      One Unified Map. One AI Agent.
                    </h4>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-950/90 border border-cyan-500/15 rounded space-y-1">
                      <strong className="text-cyan-400 text-[10px] block uppercase">🌌 True Spatial Digital Twin</strong>
                      <p className="text-slate-300 leading-normal text-[9.5px]">Draws traffic indices, flood indicators, and hospital telemetry directly over one high-contrast Leaflet map layout.</p>
                    </div>

                    <div className="p-3 bg-slate-950/90 border border-cyan-500/15 rounded space-y-1">
                      <strong className="text-cyan-400 text-[10px] block uppercase">🧠 Autonomous Mitigation Engine</strong>
                      <p className="text-slate-300 leading-normal text-[9.5px]">Closes failing segments, triggers storm gates, evacuation routing lanes, and issues warnings with zero human latency.</p>
                    </div>
                  </div>

                  <hr className="border-slate-900" />

                  <div className="text-[10px] text-cyan-300 font-bold bg-cyan-950/40 p-2.5 rounded border border-cyan-500/25 leading-relaxed">
                    🏆 Outcome: High proactive recovery. Saves lives and prevents regional financial damages instantly. Saved over worth ₹1.85 Cr within 3 mins of cloudburst modeling.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: TRAFFIC AND AQI MONITOR OVERVIEW */}
          {activeTab === "Traffic" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#030715]">
              <span className="text-[10.5px] font-mono font-black text-[#00f0ff] uppercase tracking-wider block">
                TRAFFIC INDEX SECTOR TELEMETRY LIST
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <div key={zone.name} className="bg-[#080f26]/80 border border-slate-900 p-4 rounded-xl space-y-2">
                    <strong className="text-white block text-sm font-display tracking-wide uppercase">{zone.name} Sector</strong>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 font-semibold">Congestion score:</span>
                      <span className={`${zone.traffic > 80 ? "text-rose-400 font-black" : "text-cyan-400 font-bold"}`}>
                        {zone.traffic}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 font-semibold">Active water runoff:</span>
                      <span className="text-slate-200">{zone.flood}%</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 font-semibold">Atmospheric AQI:</span>
                      <span className="text-slate-200">{zone.aqi} Index</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${
                        zone.traffic > 80 ? "bg-rose-500" : zone.traffic > 50 ? "bg-amber-400" : "bg-[#00f0ff]"
                      }`} style={{ width: `${zone.traffic}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FLOOD PLUMES OVERVIEW */}
          {activeTab === "Flood" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#030715]">
              <span className="text-[10.5px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                HYDROLOGIC PLUMES CATCHMET MONITOR
              </span>
              <div className="grid grid-cols-2 gap-4">
                {zones.map((zone) => (
                  <div key={zone.name} className="bg-[#080f26]/80 border border-slate-900 p-4 rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-display text-sm uppercase">{zone.name} Area</strong>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        zone.flood > 70 ? "bg-rose-950 border border-rose-500/30 text-rose-400" : "bg-slate-900 text-slate-400"
                      }`}>
                        {zone.flood > 70 ? "Overflow Alert" : "Stable Capacity"}
                      </span>
                    </div>
                    <div className="space-y-1 pl-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Water runoff Saturation:</span>
                        <strong className="text-white">{zone.flood}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Calculated peak discharge:</span>
                        <span className="text-slate-300">{(zone.flood * 1.5).toFixed(0)} M³/S</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900">
                      <button
                        onClick={() => setSelectedZone(zone)}
                        className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block hover:underline cursor-pointer"
                      >
                        ☑ Pin point sector in Digital map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & STATS CHRONOLOGY */}
          {activeTab === "Reports" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#030715] select-text">
              <span className="text-[10.5px] font-mono font-black text-[#00f0ff] uppercase tracking-wider block">
                SPATIOTEMPORAL RISK HISTORIC TREND CHART ENGINE
              </span>

              {/* Area dynamic charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 h-[260px] flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Historic Regional Congestion Indices (7-Hour series)
                  </span>
                  <div className="flex-1 min-h-0 w-full text-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history}>
                        <defs>
                          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#101827" />
                        <XAxis dataKey="time" stroke="#4b5563" fontSize={9} />
                        <YAxis stroke="#4b5563" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1f2937", color: "#f3f4f6" }} />
                        <Area type="monotone" dataKey="traffic" stroke="#38bdf8" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 h-[260px] flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Historic Capture Hydrological Saturation (%)
                  </span>
                  <div className="flex-1 min-h-0 w-full text-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history}>
                        <defs>
                          <linearGradient id="colorFlood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#101827" />
                        <XAxis dataKey="time" stroke="#4b5563" fontSize={9} />
                        <YAxis stroke="#4b5563" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1f2937", color: "#f3f4f6" }} />
                        <Area type="monotone" dataKey="flood" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFlood)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Logs chronological ledger */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  CHRONOLOGICAL SYSTEM INCIDENT LEDGER (REALTIME LOGS)
                </span>
                
                <div className="space-y-1.5 font-mono text-[10.5px]">
                  {decisionFeed.map((feed) => (
                    <div key={feed.id} className="p-2 border-b border-slate-900 last:border-0 flex justify-between items-center leading-normal">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[7.5px] px-1 rounded uppercase font-bold ${
                          feed.severity === "critical" ? "bg-rose-950/40 border border-rose-500/20 text-rose-400" :
                          feed.severity === "success" ? "bg-emerald-950/20 text-emerald-400" :
                          "bg-slate-900 text-slate-400"
                        }`}>
                          {feed.severity}
                        </span>
                        <span className="text-slate-500 font-semibold">{feed.time}</span>
                        <span className="text-slate-200">{feed.message}</span>
                      </div>
                      <span className="text-[8.5px] text-slate-600 font-bold">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Telemetry Column (Static right-screen) */}
        <RightPanel
          zones={zones}
          sensors={sensors}
          alerts={alerts}
          chatHistory={chatHistory}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendCopilotMessage={sendCopilotMessage}
          isCopilotThinking={isCopilotThinking}
          resilienceScore={resilienceScore}
        />

      </div>

      {/* Alert banner float slide-down */}
      {showAlertBanner && (
        <AlertBanner
          text={alertBannerText}
          onClose={() => setShowAlertBanner(false)}
        />
      )}

    </div>
  );
}
