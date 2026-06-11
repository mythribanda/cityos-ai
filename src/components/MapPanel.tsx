import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ZoneData, SensorData } from "../types";
import { Sliders, HelpCircle, Layers, Activity } from "lucide-react";

interface MapPanelProps {
  zones: ZoneData[];
  sensors: SensorData[];
  selectedZone: ZoneData | null;
  setSelectedZone: (zone: ZoneData) => void;
  simulationActive: boolean;
  simulationType: "HEAVY_RAIN" | "FIRE" | "NONE";
  layerTraffic: boolean;
  layerFlood: boolean;
  layerWeather: boolean;
  layerAIRoute: boolean;
  layerHospital: boolean;
}

export function MapPanel({
  zones,
  sensors,
  selectedZone,
  setSelectedZone,
  simulationActive,
  simulationType,
  layerTraffic,
  layerFlood,
  layerWeather,
  layerAIRoute,
  layerHospital,
}: MapPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Layer references to dynamically update rather than full rebuild
  const polygonsLayerRef = useRef<L.FeatureGroup | null>(null);
  const markersLayerRef = useRef<L.FeatureGroup | null>(null);
  const routingLayerRef = useRef<L.FeatureGroup | null>(null);

  // Initialize leaf map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around Hyderabad coordinates
    const map = L.map(mapContainerRef.current, {
      center: [17.4435, 78.3950],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;

    // Base Layer: CartoDB Dark Matter (Perfect for Dark Sci-Fi HUD Command layouts)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19
    }).addTo(map);

    // Create container layers for easy dynamic clearing and drawing
    polygonsLayerRef.current = L.featureGroup().addTo(map);
    markersLayerRef.current = L.featureGroup().addTo(map);
    routingLayerRef.current = L.featureGroup().addTo(map);

    // Add scale indicator at bottom-left
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    // Subtle Grid Blueprint Overlay Layer
    const gridDiv = document.createElement("div");
    gridDiv.className = "absolute inset-0 pointer-events-none grid-blueprint z-10 opacity-30";
    mapContainerRef.current.appendChild(gridDiv);

    // Resize map in containers
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Polygons & Boundaries
  useEffect(() => {
    if (!mapRef.current || !polygonsLayerRef.current) return;
    
    // Clear old polygons
    polygonsLayerRef.current.clearLayers();

    zones.forEach((zone) => {
      const isSelected = selectedZone?.name === zone.name;
      
      // Compute effective colors based on layer selectors and risk indices
      let fillColor = "rgba(56, 189, 248, 0.15)";
      let strokeColor = "#38bdf8";
      
      const currentRisk = zone.riskScore;

      if (layerTraffic) {
        if (currentRisk > 80) {
          fillColor = "rgba(239, 68, 68, 0.35)";
          strokeColor = "#ef4444";
        } else if (currentRisk > 60) {
          fillColor = "rgba(245, 158, 11, 0.3)";
          strokeColor = "#f59e0b";
        } else if (currentRisk > 40) {
          fillColor = "rgba(34, 197, 94, 0.2)";
          strokeColor = "#22c55e";
        }
      }

      // If heavy rain flood overlay is active, elevate colors
      if (layerFlood && simulationActive && simulationType === "HEAVY_RAIN" && zone.flood > 50) {
        fillColor = "rgba(239, 68, 68, 0.45)";
        strokeColor = "#dc2626";
      }

      // Draw Leaflet general polygons
      const latlngs = zone.polygon.map((p) => [p.lat, p.lng] as [number, number]);
      const polygon = L.polygon(latlngs, {
        color: strokeColor,
        weight: isSelected ? 3.5 : 1.5,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.55 : 0.3,
        className: isSelected ? "neon-border-cyan glow-effect" : ""
      });

      // Bind dynamic tooltip
      polygon.bindTooltip(
        `<div class="font-mono text-[10px] bg-slate-950 p-2 border border-slate-800 text-white leading-normal space-y-1">
          <div class="text-cyan-400 font-bold uppercase">${zone.name}</div>
          <hr class="border-slate-800" />
          <div class="flex justify-between space-x-4"><span>Traffic Loss:</span><span class="font-semibold text-white">${zone.traffic}%</span></div>
          <div class="flex justify-between space-x-4"><span>Water Level:</span><span class="font-semibold text-white">${zone.flood}%</span></div>
          <div class="flex justify-between space-x-4"><span>AQI Index:</span><span class="font-semibold text-white">${zone.aqi} PM2.5</span></div>
          <div class="flex justify-between space-x-4 font-bold"><span>Risk index:</span><span class="text-yellow-400">${zone.riskScore}%</span></div>
        </div>`,
        { sticky: true, className: "custom-leaflet-tooltip" }
      );

      polygon.on("click", () => {
        setSelectedZone(zone);
      });

      polygonsLayerRef.current?.addLayer(polygon);
    });
  }, [zones, selectedZone, layerTraffic, layerFlood, simulationActive, simulationType]);

  // Update Sensors & Dispatch Markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Draw Simulated Sensor nodes
    sensors.forEach((s) => {
      // Find the center of its sector zone to offset slightly for sensor markers
      const parentZone = zones.find((z) => z.name === s.zone);
      if (!parentZone) return;

      const baseLat = parentZone.center.lat;
      const baseLng = parentZone.center.lng;

      // Slight unique pseudo-offset based on sensor ID to spread out markers
      const charCodeSum = s.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const offsetLat = ((charCodeSum % 10) - 5) * 0.0035;
      const offsetLng = (((charCodeSum * 3) % 10) - 5) * 0.0035;

      const sensorPos: [number, number] = [baseLat + offsetLat, baseLng + offsetLng];

      // Custom pulsing SVG DivIcon (No file assets broken, purely CSS!)
      let colorClass = "bg-cyan-400";
      let pingClass = "bg-cyan-400";
      
      if (s.status === "Critical") {
        colorClass = "bg-rose-500 animate-pulse";
        pingClass = "bg-rose-500 animate-ping";
      } else if (s.status === "Warning") {
        colorClass = "bg-amber-400";
        pingClass = "bg-amber-400 animate-ping";
      }

      const sensorIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-3.5 h-3.5 rounded-full ${pingClass} opacity-75"></div>
                 <div class="relative w-2 h-2 rounded-full ${colorClass} border border-slate-950"></div>
               </div>`,
        className: "custom-sensor-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker(sensorPos, { icon: sensorIcon });
      marker.bindTooltip(
        `<div class="font-mono text-[9px] bg-slate-950 p-1.5 border border-slate-800 text-slate-300">
          <strong class="text-white block uppercase">${s.name}</strong>
          <div class="mt-0.5 whitespace-nowrap">Value: ${s.value}${s.unit} (${s.status})</div>
         </div>`,
        { className: "custom-marker-tooltip" }
      );

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Draw active emergency centers if layerHospital active
    if (layerHospital) {
      zones.forEach((zone) => {
        const hospitalIcon = L.divIcon({
          html: `<div class="p-1 px-1.5 rounded bg-slate-900 border border-cyan-400 text-center text-[7px] font-mono text-cyan-300 font-bold leading-none shadow-lg whitespace-nowrap uppercase">
                  <span>HOSPITAL SYNC</span>
                </div>`,
          className: "custom-hospital-marker",
          iconSize: [50, 16],
          iconAnchor: [25, 8]
        });

        const marker = L.marker([zone.center.lat, zone.center.lng], { icon: hospitalIcon });
        marker.bindTooltip(`<strong>${zone.name} Central Hub</strong>`, { direction: "top" });
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Draw severe fire emergency pulse
    if (simulationActive && simulationType === "FIRE") {
      const kukatpallyCenter: [number, number] = [17.4855, 78.4010];
      const fireIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-12 h-12 rounded-full bg-rose-500/20 animate-ping"></div>
                 <div class="absolute w-6 h-6 rounded-full bg-rose-500/30 animate-pulse"></div>
                 <div class="relative text-[16px] leading-none select-none">🔥</div>
               </div>`,
        className: "custom-fire-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(kukatpallyCenter, { icon: fireIcon });
      marker.bindTooltip(`<strong>Kukatpally Hazardous Fire Alarm</strong>`, { direction: "top" });
      markersLayerRef.current?.addLayer(marker);
    }

  }, [sensors, zones, layerHospital, simulationActive, simulationType]);

  // Update Dynamic Routing Overlay
  useEffect(() => {
    if (!mapRef.current || !routingLayerRef.current) return;

    routingLayerRef.current.clearLayers();

    // Direct path routing when simulation is active and routing layers are on
    if (layerAIRoute && simulationActive) {
      // 1. Recommended Corridor: Safe route from Financial District to Hitech General Hospital via bypass
      const pathCoordinates: [number, number][] = [
        [17.4190, 78.3395], // Financial Dist center
        [17.4320, 78.3580], // Bypass point
        [17.4483, 78.3741]  // Hitech Hospital hub
      ];

      const polyline = L.polyline(pathCoordinates, {
        color: "#38bdf8",
        weight: 4.5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "8, 6"
      });

      // Simple animated pulse marker that traces the line (to make route advisor look extremely high-tech)
      polyline.bindTooltip(
        `<div class="font-mono text-[9px] text-[#00f0ff] uppercase bg-slate-950 p-1 rounded border border-[#00f0ff]/20 font-bold whitespace-nowrap">
          🤖 ACTIVE CO-INCIDENT BYPASS PATH
         </div>`
      );
      routingLayerRef.current?.addLayer(polyline);

      // 2. Rescue evacuation pathway (Kukatpally flooded zone -> Secunderabad safe shelter)
      const rescueCoordinates: [number, number][] = [
        [17.4855, 78.4010], // Kukatpally flood center
        [17.4600, 78.4350], // Midpoint evacuation line
        [17.4399, 78.4983]  // Secunderabad safe shelter
      ];

      const rescuePolyline = L.polyline(rescueCoordinates, {
        color: "#f87171",
        weight: 4.5,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "1, 15"
      });

      rescuePolyline.bindTooltip(
        `<div class="font-mono text-[9px] text-rose-400 uppercase bg-slate-950 p-1 rounded border border-rose-500/20 font-bold whitespace-nowrap">
          🚒 CIVILIAN EVAC FLIGHT LINE
         </div>`
      );
      routingLayerRef.current?.addLayer(rescuePolyline);
    }
  }, [layerAIRoute, simulationActive]);

  return (
    <div className="flex-1 h-full w-full relative overflow-hidden flex flex-col min-h-[420px] bg-slate-950">
      
      {/* Dynamic Overlay HUD layers selectors */}
      <div className="absolute top-3 right-4 bg-[#050b1d]/90 border border-[#00f0ff]/15 p-3 rounded-xl backdrop-blur-md z-30 max-w-xs shadow-2xl space-y-2 select-none">
        <div className="flex items-center space-x-1 mb-1.5 uppercase font-mono font-black text-[#00f0ff] tracking-wider text-[9px]">
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Tactical Map Layers</span>
        </div>
        <div className="space-y-1.5 font-mono text-[10.5px] text-slate-300">
          <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-all">
            <span className="w-4 h-4 rounded border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              <span className={`h-2.5 w-2.5 rounded-sm bg-cyan-400 ${layerTraffic ? "block" : "hidden"}`} />
            </span>
            <input type="checkbox" checked={layerTraffic} onChange={() => {}} className="hidden" readOnly />
            <span>Traffic Congestion Grid</span>
          </label>
          <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-all">
            <span className="w-4 h-4 rounded border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              <span className={`h-2.5 w-2.5 rounded-sm bg-cyan-400 ${layerFlood ? "block" : "hidden"}`} />
            </span>
            <input type="checkbox" checked={layerFlood} onChange={() => {}} className="hidden" readOnly />
            <span>Flood Hydrologic Plumes</span>
          </label>
          <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-all">
            <span className="w-4 h-4 rounded border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              <span className={`h-2.5 w-2.5 rounded-sm bg-cyan-400 ${layerWeather ? "block" : "hidden"}`} />
            </span>
            <input type="checkbox" checked={layerWeather} onChange={() => {}} className="hidden" readOnly />
            <span>Weather Radar Scan</span>
          </label>
          <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-all">
            <span className="w-4 h-4 rounded border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              <span className={`h-2.5 w-2.5 rounded-sm bg-cyan-400 ${layerAIRoute ? "block" : "hidden"}`} />
            </span>
            <input type="checkbox" checked={layerAIRoute} onChange={() => {}} className="hidden" readOnly />
            <span>AI Dynamic Route Overlays</span>
          </label>
          <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-all">
            <span className="w-4 h-4 rounded border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
              <span className={`h-2.5 w-2.5 rounded-sm bg-cyan-400 ${layerHospital ? "block" : "hidden"}`} />
            </span>
            <input type="checkbox" checked={layerHospital} onChange={() => {}} className="hidden" readOnly />
            <span>Hospital dispatch Sync</span>
          </label>
        </div>
      </div>

      {/* Actual map frame */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full relative" />

      {/* Absolute Map Legend */}
      <div className="absolute bottom-3 right-3 bg-[#050b1d]/90 border border-[#00f0ff]/15 rounded-lg p-2.5 z-20 font-mono text-[9px] text-slate-400 space-y-1.5 shadow-2xl backdrop-blur-md">
        <span className="font-bold text-slate-200 block uppercase tracking-wider mb-1">RISK SCORING CODE</span>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-3.5 bg-rose-500/40 border border-rose-500 rounded-sm shrink-0" />
          <span>Critical Risk (&gt;80%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-3.5 bg-amber-500/30 border border-amber-500 rounded-sm shrink-0" />
          <span>Moderate Warn (40-80%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-3.5 bg-emerald-500/20 border border-emerald-500 rounded-sm shrink-0" />
          <span>Operational Nominal (&lt;40%)</span>
        </div>
        {simulationActive && (
          <div className="pt-1 border-t border-slate-900/60 flex items-center space-x-1.5 text-cyan-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span>Pulsing radars = Sensors live</span>
          </div>
        )}
      </div>

    </div>
  );
}
