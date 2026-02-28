"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { DataPoint, LayerName, LayerState } from "@/types";
import { parseCSV } from "@/utils/csv-parser";
import { loadSampleCSV } from "@/utils/sample-data";
import LayerControls from "@/components/LayerControls";
import Legend from "@/components/Legend";
import CSVUploader from "@/components/CSVUploader";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LAYERS: LayerState = {
  current: {
    name: "Current Kelp",
    field: "kelp_biomass_kg",
    colorLow: "#064e3b",
    colorHigh: "#22c55e",
    visible: true,
    opacity: 0.8,
  },
  past: {
    name: "Past Kelp",
    field: "kelp_biomass_kg_past",
    colorLow: "#1e1b4b",
    colorHigh: "#f59e0b",
    visible: true,
    opacity: 0.8,
  },
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [fileName, setFileName] = useState<string | null>(null);
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

  const handleFileUpload = useCallback(async (file: File) => {
    const points = await parseCSV(file);
    setData(points);
    setFileName(file.name);
  }, []);

  const resetToSample = useCallback(() => {
    loadSampleCSV().then((points) => {
      setData(points);
      setFileName(null);
    });
  }, []);

  const toggleLayer = useCallback((layer: LayerName) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], visible: !prev[layer].visible },
    }));
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
        </div>

        <div className="sidebar-section">
          <h2>Data Source</h2>
          <CSVUploader onUpload={handleFileUpload} />
          {fileName && (
            <>
              <div className="data-badge">
                {data.length} points from {fileName}
              </div>
              <button className="btn-sample" onClick={resetToSample}>
                Reset to Sample Data
              </button>
            </>
          )}
          {!fileName && !loading && (
            <div className="data-badge">{data.length} sample points</div>
          )}
          {loading && (
            <div className="data-badge">Loading sample data&hellip;</div>
          )}
        </div>

        <div className="sidebar-section">
          <h2>Layers</h2>
          <LayerControls
            layers={layers}
            onToggle={toggleLayer}
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
      </aside>

      <main className="map-wrapper">
        <MapView data={data} layers={layers} />
      </main>
    </div>
  );
}
