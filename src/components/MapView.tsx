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
const MIN_RADIUS = 4;
const MAX_RADIUS = 18;
const STROKE_WEIGHT = 2.5;

export default function MapView({ data, layers }: MapViewProps) {
  const visibleLayers = useMemo(() => {
    return (Object.entries(layers) as [LayerName, (typeof layers)[LayerName]][])
      .filter(([, config]) => config.visible)
      .reverse();
  }, [layers]);

  // Compute max values from data for normalization
  const maxValues = useMemo(() => {
    let maxCurrent = 0;
    let maxPast = 0;
    for (const p of data) {
      if (p.kelp_biomass_kg > maxCurrent) maxCurrent = p.kelp_biomass_kg;
      if (p.kelp_biomass_kg_past > maxPast) maxPast = p.kelp_biomass_kg_past;
    }
    return {
      kelp_biomass_kg: maxCurrent || 1,
      kelp_biomass_kg_past: maxPast || 1,
    };
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
            if (raw === 0) return null;

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
                  Current: {point.kelp_biomass_kg.toLocaleString()} kg
                  <br />
                  Past: {point.kelp_biomass_kg_past.toLocaleString()} kg
                </Tooltip>
              </CircleMarker>
            );
          })
        )}
    </MapContainer>
  );
}
