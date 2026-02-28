export interface DataPoint {
  latitude: number;
  longitude: number;
  current_kelp: number;
  composite_score: number;
}

export type LayerName = "kelp" | "composite";

export type TimestampYear = "2004" | "2024";

export interface LayerConfig {
  name: string;
  field: keyof DataPoint;
  colorLow: string;
  colorHigh: string;
  visible: boolean;
  opacity: number;
}

export type LayerState = Record<LayerName, LayerConfig>;
