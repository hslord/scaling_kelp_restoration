export interface DataPoint {
  latitude: number;
  longitude: number;
  kelp_biomass_kg: number;
  kelp_biomass_kg_past: number;
}

export type LayerName = "current" | "past";

export interface LayerConfig {
  name: string;
  field: keyof DataPoint;
  colorLow: string;
  colorHigh: string;
  visible: boolean;
  opacity: number;
}

export type LayerState = Record<LayerName, LayerConfig>;
