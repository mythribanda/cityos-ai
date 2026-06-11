import { ZoneData, SensorData, PredictionResult, Alert, HistoricalDataPoint } from "./types";

// Hyderabad zones with representative coordinates (centered on exact zones)
export const initialZones: ZoneData[] = [
  {
    name: 'Hitech City',
    traffic: 72,
    flood: 34,
    aqi: 128,
    riskScore: 68,
    center: { lat: 17.4483, lng: 78.3741 },
    polygon: [
      { lat: 17.4583, lng: 78.3641 },
      { lat: 17.4583, lng: 78.3841 },
      { lat: 17.4383, lng: 78.3841 },
      { lat: 17.4383, lng: 78.3641 },
    ]
  },
  {
    name: 'Gachibowli',
    traffic: 68,
    flood: 42,
    aqi: 135,
    riskScore: 71,
    center: { lat: 17.4401, lng: 78.3489 },
    polygon: [
      { lat: 17.4501, lng: 78.3389 },
      { lat: 17.4501, lng: 78.3589 },
      { lat: 17.4301, lng: 78.3589 },
      { lat: 17.4301, lng: 78.3389 },
    ]
  },
  {
    name: 'Financial District',
    traffic: 58,
    flood: 28,
    aqi: 145,
    riskScore: 59,
    center: { lat: 17.4190, lng: 78.3395 },
    polygon: [
      { lat: 17.4290, lng: 78.3295 },
      { lat: 17.4290, lng: 78.3495 },
      { lat: 17.4090, lng: 78.3495 },
      { lat: 17.4090, lng: 78.3295 },
    ]
  },
  {
    name: 'Kukatpally',
    traffic: 81,
    flood: 65,
    aqi: 152,
    riskScore: 84,
    center: { lat: 17.4855, lng: 78.4010 },
    polygon: [
      { lat: 17.4955, lng: 78.3910 },
      { lat: 17.4955, lng: 78.4110 },
      { lat: 17.4755, lng: 78.4110 },
      { lat: 17.4755, lng: 78.3910 },
    ]
  },
  {
    name: 'Secunderabad',
    traffic: 64,
    flood: 48,
    aqi: 110,
    riskScore: 61,
    center: { lat: 17.4399, lng: 78.4983 },
    polygon: [
      { lat: 17.4499, lng: 78.4883 },
      { lat: 17.4499, lng: 78.5083 },
      { lat: 17.4299, lng: 78.5083 },
      { lat: 17.4299, lng: 78.4883 },
    ]
  }
];

// Virtual Sensors definition with lat long values inside their respective zones
export const initialSensors: SensorData[] = [
  // Traffic Sensors
  { id: "Traffic-01", name: "Hitech Corridor Camera", type: "traffic", value: 72, status: "Normal", unit: "%", zone: "Hitech City" },
  { id: "Traffic-02", name: "Gachibowli Junction Radar", type: "traffic", value: 68, status: "Normal", unit: "%", zone: "Gachibowli" },
  { id: "Traffic-03", name: "Wipro Circle Sentinel", type: "traffic", value: 58, status: "Normal", unit: "%", zone: "Financial District" },
  { id: "Traffic-04", name: "JNTU Main Road Feed", type: "traffic", value: 81, status: "Warning", unit: "%", zone: "Kukatpally" },
  { id: "Traffic-05", name: "Paradise Junction Scanner", type: "traffic", value: 64, status: "Normal", unit: "%", zone: "Secunderabad" },

  // Water Sensors
  { id: "Water-01", name: "Mindspace Drainage Flow", type: "water", value: 34, status: "Normal", unit: "% Capacity", zone: "Hitech City" },
  { id: "Water-02", name: "DLF Lake Overflow Guard", type: "water", value: 42, status: "Normal", unit: "% Capacity", zone: "Gachibowli" },
  { id: "Water-03", name: "Kukatpally Nala Depth Meter", type: "water", value: 65, status: "Warning", unit: "% Capacity", zone: "Kukatpally" },

  // Waste Sensors
  { id: "Waste-01", name: "Cyber Towers Bin Smart Node", type: "waste", value: 46, status: "Normal", unit: "% Fill", zone: "Hitech City" },
  { id: "Waste-02", name: "Financial District Hub Waste Cap", type: "waste", value: 52, status: "Normal", unit: "% Fill", zone: "Financial District" },
  { id: "Waste-03", name: "Kukatpally Bazaar Bin Cluster", type: "waste", value: 73, status: "Warning", unit: "% Fill", zone: "Kukatpally" },

  // AQI Sensors
  { id: "AQI-01", name: "Hitech Cyber Towers EPA Monitor", type: "aqi", value: 128, status: "Warning", unit: "AQI", zone: "Hitech City" },
  { id: "AQI-02", name: "Gachibowli ORR Air Station", type: "aqi", value: 135, status: "Warning", unit: "AQI", zone: "Gachibowli" },
  { id: "AQI-03", name: "Kukatpally Metro Pillar Sensor", type: "aqi", value: 152, status: "Critical", unit: "AQI", zone: "Kukatpally" }
];

// Predictors calculation logic
export function calculatePredictions(
  trafficVal: number,
  floodVal: number,
  wasteVal: number,
  aqiVal: number,
  rainfall: number, // mm
  timeOfDay: string, // "HH:MM"
  collectionDelay: number // hours
): PredictionResult {
  const isPeak = timeOfDay.startsWith("09:") || timeOfDay.startsWith("18:") || timeOfDay.startsWith("19:");
  const rainImpact = rainfall * 0.8;
  const predictedTraffic = Math.min(100, Math.round(trafficVal + rainImpact + (isPeak ? 15 : 0)));
  
  let trafficRisk: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (predictedTraffic > 85) trafficRisk = "Critical";
  else if (predictedTraffic > 70) trafficRisk = "High";
  else if (predictedTraffic > 50) trafficRisk = "Moderate";

  const drainageCapacity = 200;
  const drainageStress = Math.max(0, (floodVal * 1.5 + rainfall * 3));
  const floodRiskPercent = Math.min(100, Math.round((drainageStress / drainageCapacity) * 100));

  let floodRisk: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (floodRiskPercent > 80) floodRisk = "Critical";
  else if (floodRiskPercent > 60) floodRisk = "High";
  else if (floodRiskPercent > 40) floodRisk = "Moderate";

  const overflowProb = Math.min(100, Math.round(wasteVal + (collectionDelay * 8)));
  let wasteRisk: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (overflowProb > 80) wasteRisk = "Critical";
  else if (overflowProb > 60) wasteRisk = "High";
  else if (overflowProb > 40) wasteRisk = "Moderate";

  const isDusty = rainfall < 2;
  const predictedAqi = Math.round(aqiVal + (isDusty ? 15 : -10));
  
  let aqiStatus: "Good" | "Moderate" | "Unhealthy" | "Hazardous" = "Good";
  if (predictedAqi > 150) aqiStatus = "Hazardous";
  else if (predictedAqi > 100) aqiStatus = "Unhealthy";
  else if (predictedAqi > 50) aqiStatus = "Moderate";

  return {
    traffic: { predicted_traffic: predictedTraffic, risk: trafficRisk },
    flood: { flood_risk: floodRiskPercent, risk: floodRisk },
    waste: { overflow_probability: overflowProb, risk: wasteRisk },
    aqi: { predicted_aqi: predictedAqi, status: aqiStatus }
  };
}

// Initial Alert feeds
export const initialAlerts: Alert[] = [
  { id: "A1", source: "Water-03 Sensor", type: "water", message: "Kukatpally drainage channels approaching 65% storm capacity limit", severity: "warning", time: "07:35", zone: "Kukatpally" },
  { id: "A2", source: "AQI-03 Station", type: "aqi", message: "Regional AQI PM2.5 threshold warning in Kukatpally (152 AQI)", severity: "critical", time: "07:30", zone: "Kukatpally" },
  { id: "A3", source: "Traffic-04 Radar", type: "traffic", message: "Significant grid traffic density reported near Metro underpass junction", severity: "warning", time: "07:12", zone: "Kukatpally" },
];

export const initialHistory = (): HistoricalDataPoint[] => {
  const points: HistoricalDataPoint[] = [];
  const baseTime = 6;
  for (let i = baseTime; i >= 0; i--) {
    const hour = (7 - i + 24) % 24;
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    points.push({
      time: timeStr,
      traffic: 65 + Math.sin(i) * 10 + i * 2,
      flood: 30 + Math.cos(i) * 15 - i * 1,
      aqi: 120 + i * 4 + Math.sin(i * 1.5) * 8,
      waste: 45 + Math.cos(i * 0.8) * 10 + i * 1
    });
  }
  return points;
};
