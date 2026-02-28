"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { DataPoint, LayerName, LayerState, TimestampYear } from "@/types";
import { parseCSV } from "@/utils/csv-parser";
import { SAMPLE_DATASETS } from "@/utils/sample-data";
import LayerControls from "@/components/LayerControls";
import Legend from "@/components/Legend";
import CSVUploader from "@/components/CSVUploader";
import YearSelector from "@/components/YearSelector";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LAYERS: LayerState = {
  kelp: {
    name: "Current Kelp",
    field: "current_kelp",
    colorLow: "#064e3b",
    colorHigh: "#22c55e",
    visible: true,
    opacity: 0.8,
  },
  composite: {
    name: "Composite Score",
    field: "composite_score",
    colorLow: "#1e1b4b",
    colorHigh: "#f59e0b",
    visible: true,
    opacity: 0.8,
  },
};

export default function Home() {
  const [sampleYear, setSampleYear] = useState<TimestampYear>("2024");
  const [customData, setCustomData] = useState<DataPoint[] | null>(null);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sampleLoaded, setSampleLoaded] = useState(false);

  const activeData = customData ?? (sampleLoaded ? SAMPLE_DATASETS[sampleYear] : []);

  const handleFileUpload = useCallback(async (file: File) => {
    const points = await parseCSV(file);
    setCustomData(points);
    setSampleLoaded(false);
    setFileName(file.name);
  }, []);

  const loadSampleData = useCallback(() => {
    setCustomData(null);
    setSampleLoaded(true);
    setFileName(null);
  }, []);

  const handleYearChange = useCallback((year: TimestampYear) => {
    setSampleYear(year);
    setCustomData(null);
    setSampleLoaded(true);
    setFileName(null);
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
          <h2>Time Period</h2>
          <YearSelector year={sampleYear} onChange={handleYearChange} />
        </div>

        <div className="sidebar-section">
          <h2>Data Source</h2>
          <CSVUploader onUpload={handleFileUpload} />
          {!sampleLoaded && !customData && (
            <button className="btn-sample" onClick={loadSampleData}>
              Load Sample Data
            </button>
          )}
          {fileName && (
            <div className="data-badge">{activeData.length} points from {fileName}</div>
          )}
          {sampleLoaded && !customData && (
            <div className="data-badge">{activeData.length} sample points ({sampleYear})</div>
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
          {activeData.length > 0 ? (
            <>
              <span>{activeData.length}</span> data points &middot; Lat{" "}
              <span>
                {Math.min(...activeData.map((d) => d.latitude)).toFixed(2)}&ndash;
                {Math.max(...activeData.map((d) => d.latitude)).toFixed(2)}
              </span>
            </>
          ) : (
            "Select a time period or upload a CSV to begin"
          )}
        </div>
      </aside>

      <main className="map-wrapper">
        <MapView data={activeData} layers={layers} />
      </main>
    </div>
  );
}
