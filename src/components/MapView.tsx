"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import type { DataPoint, LayerName, LayerState } from "@/types";
import { interpolateColor } from "@/utils/color";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  data: DataPoint[];
  layers: LayerState;
}

const CENTER: [number, number] = [34.5, -120.0];
const ZOOM = 7;
const MIN_RADIUS = 3;
const MAX_RADIUS = 10;
const STROKE_WEIGHT = 2.5;

export default function MapView({ data, layers }: MapViewProps) {
  const visibleLayers = useMemo(() => {
    return (Object.entries(layers) as [LayerName, (typeof layers)[LayerName]][])
      .filter(([, config]) => config.visible)
      .reverse();
  }, [layers]);

  // Compute max values from data for normalization
  const maxValues = useMemo(() => {
    const maxes = {
      kelp_biomass_kg_2025: 0,
      kelp_biomass_kg_past_2015: 0,
      temperature: 0,
      salinity: 0,
      ocean_current: 0,
      composite_score: 0,
    };
    for (const p of data) {
      for (const key of Object.keys(maxes) as (keyof typeof maxes)[]) {
        if (p[key] > maxes[key]) maxes[key] = p[key];
      }
    }
    // Ensure no zero divisors
    for (const key of Object.keys(maxes) as (keyof typeof maxes)[]) {
      if (maxes[key] === 0) maxes[key] = 1;
    }
    return maxes;
  }, [data]);

  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {data.length > 0 &&
        visibleLayers.map(([layerName, config]) =>
          data.map((point, i) => {
            const raw = point[config.field] as number;
            const maxVal = maxValues[config.field as keyof typeof maxValues] ?? 1;
            const normalized = Math.min(raw / maxVal, 1);
            const color = interpolateColor(
              config.colorLow,
              config.colorHigh,
              normalized
            );
            const radius = MIN_RADIUS + normalized * (MAX_RADIUS - MIN_RADIUS);

            return (
              <CircleMarker
                key={`${layerName}-${i}`}
                center={[point.latitude, point.longitude]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.5,
                  color: color,
                  weight: STROKE_WEIGHT,
                  opacity: 1,
                }}
              >
                <Tooltip className="point-tooltip">
                  <strong>
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </strong>
                  Kelp 2025: {point.kelp_biomass_kg_2025.toLocaleString()} kg
                  <br />
                  Kelp 2015: {point.kelp_biomass_kg_past_2015.toLocaleString()} kg
                  <br />
                  Temp: {point.temperature.toFixed(1)}°C | Salinity: {point.salinity.toFixed(1)}
                  <br />
                  Current: {point.ocean_current.toFixed(3)} | Composite: {point.composite_score.toFixed(3)}
                </Tooltip>
              </CircleMarker>
            );
          })
        )}
    </MapContainer>
  );
}
