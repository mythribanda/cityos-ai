export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ZoneData {
  name: string;
  traffic: number;
  flood: number;
  aqi: number;
  riskScore: number;
  center: Coordinate;
  polygon: Coordinate[];
}

export interface SensorData {
  id: string;
  name: string;
  type: "traffic" | "water" | "waste" | "aqi";
  value: number;
  status: "Normal" | "Warning" | "Critical";
  unit: string;
  zone: string;
}

export interface PredictionResult {
  traffic: {
    predicted_traffic: number;
    risk: "Low" | "Moderate" | "High" | "Critical";
  };
  flood: {
    flood_risk: number;
    risk: "Low" | "Moderate" | "High" | "Critical";
  };
  waste: {
    overflow_probability: number;
    risk: "Low" | "Moderate" | "High" | "Critical";
  };
  aqi: {
    predicted_aqi: number;
    status: "Good" | "Moderate" | "Unhealthy" | "Hazardous";
  };
}

export interface Alert {
  id: string;
  source: string;
  type: "traffic" | "water" | "waste" | "aqi" | "emergency";
  message: string;
  severity: "info" | "warning" | "critical";
  time: string;
  zone: string;
}

export type SimulationType = "Normal" | "Heavy Rainfall" | "Festival Event" | "Gas Leak" | "Power Failure";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface HistoricalDataPoint {
  time: string;
  traffic: number;
  flood: number;
  aqi: number;
  waste: number;
}
