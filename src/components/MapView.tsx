"use client";

import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import type { DataPoint, LayerName, LayerState, UrchinReport } from "@/types";
import { interpolateColor } from "@/utils/color";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  data: DataPoint[];
  layers: LayerState;
  urchinReports: UrchinReport[];
  onPointClick: (point: DataPoint) => void;
}

const CENTER: [number, number] = [34.5, -120.0];
const ZOOM = 7;
const MIN_RADIUS = 3;
const MAX_RADIUS = 20;
const STROKE_WEIGHT = 2.5;

const FLAG_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30">
    <line x1="3" y1="2" x2="3" y2="28" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <polygon points="3,2 19,7 3,13" fill="#a855f7" stroke="#ffffff" stroke-width="1.2"/>
    <circle cx="3" cy="28" r="2.5" fill="#a855f7" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`,
  className: "",
  iconSize: [22, 30],
  iconAnchor: [3, 28],
});

export default function MapView({
  data,
  layers,
  urchinReports,
  onPointClick,
}: MapViewProps) {
  const visibleLayers = useMemo(() => {
    return (Object.entries(layers) as [LayerName, (typeof layers)[LayerName]][])
      .filter(([, config]) => config.visible)
      .reverse();
  }, [layers]);

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
            const radius = layerName === "priority"
              ? 4
              : MIN_RADIUS + normalized * (MAX_RADIUS - MIN_RADIUS);

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
                eventHandlers={{
                  click: () => onPointClick(point),
                }}
              />
            );
          })
        )}

      {urchinReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={FLAG_ICON}
        />
      ))}
    </MapContainer>
  );
}
