"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { DataPoint, LayerName, LayerState, UrchinReport } from "@/types";
import { loadSampleCSV } from "@/utils/sample-data";
import LayerControls from "@/components/LayerControls";
import Legend from "@/components/Legend";
import UrchinReportForm from "@/components/UrchinReportForm";

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
  priority: {
    name: "Priority",
    field: "composite_score",
    colorLow: "#1e3a8a",
    colorHigh: "#ef4444",
    visible: false,
    opacity: 0.8,
  },
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  const efforts = useQuery(api.userEfforts.listAllWithDetails) ?? [];
  const logRemoval = useMutation(api.userEfforts.logRemovalByCoords);

  const urchinReports: UrchinReport[] = efforts.map((e) => ({
    id: e._id,
    name: e.userName,
    latitude: e.latitude,
    longitude: e.longitude,
    urchin_count: e.urchins_removed_kg,
    timestamp: new Date(e.created_at).toISOString(),
  }));

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

  const handlePointClick = useCallback((point: DataPoint) => {
    setSelectedPoint(point);
  }, []);

  const handleReportSubmit = useCallback(
    async (report: { name: string; email: string; latitude: number; longitude: number; urchin_count: number }) => {
      await logRemoval({
        name: report.name,
        email: report.email,
        latitude: report.latitude,
        longitude: report.longitude,
        urchins_removed_kg: report.urchin_count,
      });
      setSelectedPoint(null);
    },
    [logRemoval]
  );

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? "\u2715" : "\u2630"}
      </button>
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
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
        <MapView
          data={data}
          layers={layers}
          urchinReports={urchinReports}
          onPointClick={handlePointClick}
        />
      </main>

      {selectedPoint && (
        <UrchinReportForm
          point={selectedPoint}
          onSubmit={handleReportSubmit}
          onCancel={() => setSelectedPoint(null)}
        />
      )}
    </div>
  );
}
