import type { DataPoint, TimestampYear } from "@/types";

/**
 * 2004 — Healthy kelp forests before marine heatwave era.
 * High current kelp, high composite restoration scores.
 */
const DATA_2004: DataPoint[] = [
  // Monterey Bay area
  { latitude: 36.62, longitude: -121.90, current_kelp: 0.92, composite_score: 0.88 },
  { latitude: 36.60, longitude: -121.88, current_kelp: 0.88, composite_score: 0.84 },
  { latitude: 36.58, longitude: -121.92, current_kelp: 0.95, composite_score: 0.92 },
  { latitude: 36.55, longitude: -121.94, current_kelp: 0.82, composite_score: 0.78 },
  { latitude: 36.63, longitude: -121.87, current_kelp: 0.85, composite_score: 0.80 },
  { latitude: 36.57, longitude: -121.96, current_kelp: 0.90, composite_score: 0.87 },
  { latitude: 36.61, longitude: -121.85, current_kelp: 0.78, composite_score: 0.74 },
  { latitude: 36.59, longitude: -121.91, current_kelp: 0.88, composite_score: 0.85 },

  // Big Sur coast
  { latitude: 36.30, longitude: -121.88, current_kelp: 0.85, composite_score: 0.82 },
  { latitude: 36.25, longitude: -121.86, current_kelp: 0.80, composite_score: 0.76 },
  { latitude: 36.20, longitude: -121.82, current_kelp: 0.75, composite_score: 0.72 },
  { latitude: 36.15, longitude: -121.78, current_kelp: 0.70, composite_score: 0.68 },
  { latitude: 36.35, longitude: -121.90, current_kelp: 0.88, composite_score: 0.85 },
  { latitude: 36.28, longitude: -121.84, current_kelp: 0.78, composite_score: 0.74 },

  // San Simeon / Cambria
  { latitude: 35.60, longitude: -121.15, current_kelp: 0.80, composite_score: 0.76 },
  { latitude: 35.55, longitude: -121.10, current_kelp: 0.75, composite_score: 0.72 },
  { latitude: 35.50, longitude: -121.05, current_kelp: 0.78, composite_score: 0.74 },
  { latitude: 35.45, longitude: -121.00, current_kelp: 0.72, composite_score: 0.70 },
  { latitude: 35.58, longitude: -121.12, current_kelp: 0.82, composite_score: 0.78 },

  // Point Conception / Santa Barbara
  { latitude: 34.45, longitude: -120.47, current_kelp: 0.94, composite_score: 0.92 },
  { latitude: 34.42, longitude: -120.45, current_kelp: 0.90, composite_score: 0.88 },
  { latitude: 34.40, longitude: -119.85, current_kelp: 0.85, composite_score: 0.82 },
  { latitude: 34.39, longitude: -119.70, current_kelp: 0.80, composite_score: 0.76 },
  { latitude: 34.41, longitude: -119.95, current_kelp: 0.88, composite_score: 0.85 },
  { latitude: 34.38, longitude: -119.60, current_kelp: 0.75, composite_score: 0.72 },

  // Channel Islands
  { latitude: 34.05, longitude: -119.80, current_kelp: 0.96, composite_score: 0.94 },
  { latitude: 34.02, longitude: -119.75, current_kelp: 0.94, composite_score: 0.92 },
  { latitude: 34.00, longitude: -119.55, current_kelp: 0.92, composite_score: 0.90 },
  { latitude: 33.95, longitude: -119.60, current_kelp: 0.88, composite_score: 0.85 },
  { latitude: 33.98, longitude: -119.85, current_kelp: 0.95, composite_score: 0.93 },
  { latitude: 34.08, longitude: -119.90, current_kelp: 0.90, composite_score: 0.88 },
  { latitude: 33.90, longitude: -119.50, current_kelp: 0.82, composite_score: 0.78 },
  { latitude: 34.03, longitude: -119.65, current_kelp: 0.92, composite_score: 0.90 },

  // Palos Verdes / Los Angeles coast
  { latitude: 33.74, longitude: -118.42, current_kelp: 0.65, composite_score: 0.60 },
  { latitude: 33.72, longitude: -118.40, current_kelp: 0.60, composite_score: 0.55 },
  { latitude: 33.76, longitude: -118.38, current_kelp: 0.70, composite_score: 0.65 },
  { latitude: 33.70, longitude: -118.44, current_kelp: 0.55, composite_score: 0.50 },
  { latitude: 33.73, longitude: -118.36, current_kelp: 0.62, composite_score: 0.58 },

  // San Diego / La Jolla
  { latitude: 32.87, longitude: -117.27, current_kelp: 0.82, composite_score: 0.78 },
  { latitude: 32.85, longitude: -117.28, current_kelp: 0.78, composite_score: 0.74 },
  { latitude: 32.83, longitude: -117.30, current_kelp: 0.75, composite_score: 0.72 },
  { latitude: 32.89, longitude: -117.25, current_kelp: 0.85, composite_score: 0.82 },
  { latitude: 32.86, longitude: -117.26, current_kelp: 0.80, composite_score: 0.76 },
  { latitude: 32.80, longitude: -117.32, current_kelp: 0.70, composite_score: 0.65 },
];

/**
 * 2024 — Post-heatwave degradation. Kelp declined broadly,
 * composite scores dropped. Channel Islands still holding.
 */
const DATA_2024: DataPoint[] = [
  // Monterey Bay area — moderate decline
  { latitude: 36.62, longitude: -121.90, current_kelp: 0.70, composite_score: 0.58 },
  { latitude: 36.60, longitude: -121.88, current_kelp: 0.62, composite_score: 0.50 },
  { latitude: 36.58, longitude: -121.92, current_kelp: 0.78, composite_score: 0.65 },
  { latitude: 36.55, longitude: -121.94, current_kelp: 0.45, composite_score: 0.35 },
  { latitude: 36.63, longitude: -121.87, current_kelp: 0.55, composite_score: 0.42 },
  { latitude: 36.57, longitude: -121.96, current_kelp: 0.72, composite_score: 0.60 },
  { latitude: 36.61, longitude: -121.85, current_kelp: 0.35, composite_score: 0.28 },
  { latitude: 36.59, longitude: -121.91, current_kelp: 0.65, composite_score: 0.52 },

  // Big Sur coast — significant decline
  { latitude: 36.30, longitude: -121.88, current_kelp: 0.50, composite_score: 0.38 },
  { latitude: 36.25, longitude: -121.86, current_kelp: 0.35, composite_score: 0.25 },
  { latitude: 36.20, longitude: -121.82, current_kelp: 0.22, composite_score: 0.18 },
  { latitude: 36.15, longitude: -121.78, current_kelp: 0.18, composite_score: 0.15 },
  { latitude: 36.35, longitude: -121.90, current_kelp: 0.60, composite_score: 0.48 },
  { latitude: 36.28, longitude: -121.84, current_kelp: 0.28, composite_score: 0.22 },

  // San Simeon / Cambria — urchin barrens
  { latitude: 35.60, longitude: -121.15, current_kelp: 0.05, composite_score: 0.08 },
  { latitude: 35.55, longitude: -121.10, current_kelp: 0.03, composite_score: 0.05 },
  { latitude: 35.50, longitude: -121.05, current_kelp: 0.08, composite_score: 0.10 },
  { latitude: 35.45, longitude: -121.00, current_kelp: 0.06, composite_score: 0.07 },
  { latitude: 35.58, longitude: -121.12, current_kelp: 0.02, composite_score: 0.04 },

  // Point Conception / Santa Barbara — moderate decline
  { latitude: 34.45, longitude: -120.47, current_kelp: 0.75, composite_score: 0.62 },
  { latitude: 34.42, longitude: -120.45, current_kelp: 0.68, composite_score: 0.55 },
  { latitude: 34.40, longitude: -119.85, current_kelp: 0.55, composite_score: 0.42 },
  { latitude: 34.39, longitude: -119.70, current_kelp: 0.45, composite_score: 0.35 },
  { latitude: 34.41, longitude: -119.95, current_kelp: 0.62, composite_score: 0.50 },
  { latitude: 34.38, longitude: -119.60, current_kelp: 0.38, composite_score: 0.30 },

  // Channel Islands — still relatively healthy (MPA)
  { latitude: 34.05, longitude: -119.80, current_kelp: 0.88, composite_score: 0.82 },
  { latitude: 34.02, longitude: -119.75, current_kelp: 0.82, composite_score: 0.78 },
  { latitude: 34.00, longitude: -119.55, current_kelp: 0.80, composite_score: 0.75 },
  { latitude: 33.95, longitude: -119.60, current_kelp: 0.65, composite_score: 0.58 },
  { latitude: 33.98, longitude: -119.85, current_kelp: 0.85, composite_score: 0.80 },
  { latitude: 34.08, longitude: -119.90, current_kelp: 0.72, composite_score: 0.65 },
  { latitude: 33.90, longitude: -119.50, current_kelp: 0.50, composite_score: 0.42 },
  { latitude: 34.03, longitude: -119.65, current_kelp: 0.78, composite_score: 0.72 },

  // Palos Verdes / Los Angeles coast — heavy decline
  { latitude: 33.74, longitude: -118.42, current_kelp: 0.20, composite_score: 0.15 },
  { latitude: 33.72, longitude: -118.40, current_kelp: 0.15, composite_score: 0.12 },
  { latitude: 33.76, longitude: -118.38, current_kelp: 0.28, composite_score: 0.22 },
  { latitude: 33.70, longitude: -118.44, current_kelp: 0.10, composite_score: 0.08 },
  { latitude: 33.73, longitude: -118.36, current_kelp: 0.22, composite_score: 0.18 },

  // San Diego / La Jolla — moderate decline
  { latitude: 32.87, longitude: -117.27, current_kelp: 0.55, composite_score: 0.45 },
  { latitude: 32.85, longitude: -117.28, current_kelp: 0.48, composite_score: 0.38 },
  { latitude: 32.83, longitude: -117.30, current_kelp: 0.38, composite_score: 0.30 },
  { latitude: 32.89, longitude: -117.25, current_kelp: 0.62, composite_score: 0.52 },
  { latitude: 32.86, longitude: -117.26, current_kelp: 0.52, composite_score: 0.42 },
  { latitude: 32.80, longitude: -117.32, current_kelp: 0.30, composite_score: 0.24 },
];

export const SAMPLE_DATASETS: Record<TimestampYear, DataPoint[]> = {
  "2004": DATA_2004,
  "2024": DATA_2024,
};
