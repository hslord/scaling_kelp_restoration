export interface DataPoint {
  latitude: number;
  longitude: number;
  kelp_biomass_kg_2025: number;
  kelp_biomass_kg_past_2015: number;
  temperature: number;
  salinity: number;
  ocean_current: number;
  composite_score: number;
}

export type LayerName = "current" | "past" | "temperature" | "salinity" | "ocean_current" | "composite_score" | "priority";

export interface LayerConfig {
  name: string;
  field: keyof DataPoint;
  colorLow: string;
  colorHigh: string;
  visible: boolean;
  opacity: number;
}

export type LayerState = Record<LayerName, LayerConfig>;

export interface UrchinReport {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  urchin_count: number;
  timestamp: string;
}
