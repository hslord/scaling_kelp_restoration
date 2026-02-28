"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { DataPoint, LayerName, LayerState } from "@/types";
import { loadSampleCSV } from "@/utils/sample-data";
import LayerControls from "@/components/LayerControls";
import Legend from "@/components/Legend";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LAYERS: LayerState = {
  current: {
    name: "Kelp 2025",
    field: "kelp_biomass_kg_2025",
    colorLow: "#064e3b",
    colorHigh: "#22c55e",
    visible: true,
    opacity: 0.8,
  },
  past: {
    name: "Kelp 2015",
    field: "kelp_biomass_kg_past_2015",
    colorLow: "#4a3a00",
    colorHigh: "#f59e0b",
    visible: false,
    opacity: 0.8,
  },
  temperature: {
    name: "Temperature",
    field: "temperature",
    colorLow: "#1e3a5f",
    colorHigh: "#ef4444",
    visible: false,
    opacity: 0.8,
  },
  salinity: {
    name: "Salinity",
    field: "salinity",
    colorLow: "#0c2d48",
    colorHigh: "#38bdf8",
    visible: false,
    opacity: 0.8,
  },
  ocean_current: {
    name: "Ocean Current",
    field: "ocean_current",
    colorLow: "#1a1a2e",
    colorHigh: "#a78bfa",
    visible: false,
    opacity: 0.8,
  },
  composite_score: {
    name: "Composite Score",
    field: "composite_score",
    colorLow: "#3b1a2e",
    colorHigh: "#ec4899",
    visible: false,
    opacity: 0.8,
  },
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [loading, setLoading] = useState(true);

  // Load the bundled CSV on mount
  useEffect(() => {
    loadSampleCSV()
      .then((points) => {
        setData(points);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleLayer = useCallback((layer: LayerName) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], visible: !prev[layer].visible },
    }));
  }, []);

  const soloLayer = useCallback((layer: LayerName) => {
    setLayers((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next) as LayerName[]) {
        next[key] = { ...next[key], visible: key === layer };
      }
      return next;
    });
  }, []);

  const setOpacity = useCallback((layer: LayerName, opacity: number) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], opacity },
    }));
  }, []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Kelp Restoration Model</h1>
          <p>California Coastline Analysis</p>
          {!loading && (
            <div className="data-badge">{data.length} data points</div>
          )}
          {loading && (
            <div className="data-badge">Loading data&hellip;</div>
          )}
        </div>

        <div className="sidebar-scroll">
          <div className="sidebar-section">
            <h2>Layers</h2>
            <LayerControls
              layers={layers}
              onToggle={toggleLayer}
              onSolo={soloLayer}
              onOpacityChange={setOpacity}
            />
          </div>

          <div className="sidebar-section">
            <h2>Legend</h2>
            <Legend layers={layers} />
          </div>

          <div className="stats-bar">
            {data.length > 0 ? (
              <>
                <span>{data.length}</span> data points &middot; Lat{" "}
                <span>
                  {Math.min(...data.map((d) => d.latitude)).toFixed(2)}&ndash;
                  {Math.max(...data.map((d) => d.latitude)).toFixed(2)}
                </span>
              </>
            ) : (
              "Loading data\u2026"
            )}
          </div>
        </div>
      </aside>

      <main className="map-wrapper">
        <MapView data={data} layers={layers} />
      </main>
    </div>
  );
}
