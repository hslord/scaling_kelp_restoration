"use client";

import { useState } from "react";
import type { DataPoint } from "@/types";

interface UrchinReportFormProps {
  point: DataPoint;
  onSubmit: (report: { name: string; email: string; latitude: number; longitude: number; urchin_count: number }) => void;
  onCancel: () => void;
}

export default function UrchinReportForm({
  point,
  onSubmit,
  onCancel,
}: UrchinReportFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const parsedCount = parseInt(count, 10);

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!count || isNaN(parsedCount) || parsedCount < 1) {
      setError("Please enter a valid urchin count (minimum 1).");
      return;
    }

    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      latitude: point.latitude,
      longitude: point.longitude,
      urchin_count: parsedCount,
    });
  }

  return (
    <div className="urchin-modal-overlay">
      <div className="urchin-modal">
        <h2 className="urchin-modal-title">Location Details</h2>
        <p className="urchin-modal-location">
          {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
        </p>

        <div className="location-stats">
          <div className="stat-row">
            <span className="stat-label">Kelp 2025</span>
            <span className="stat-value">{point.kelp_biomass_kg_2025.toLocaleString()} kg</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Kelp 2015</span>
            <span className="stat-value">{point.kelp_biomass_kg_past_2015.toLocaleString()} kg</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Temperature</span>
            <span className="stat-value">{point.temperature.toFixed(1)}°C</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Salinity</span>
            <span className="stat-value">{point.salinity.toFixed(1)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Ocean Current</span>
            <span className="stat-value">{point.ocean_current.toFixed(3)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Priority Score</span>
            <span className="stat-value stat-priority">{point.composite_score.toFixed(3)}</span>
          </div>
        </div>

        <h3 className="urchin-form-heading">Log Urchin Removal</h3>

        <form onSubmit={handleSubmit} className="urchin-form">
          <label className="urchin-label">
            Your Name
            <input
              className="urchin-input"
              type="text"
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              autoFocus
            />
          </label>

          <label className="urchin-label">
            Email
            <input
              className="urchin-input"
              type="text"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
          </label>

          <label className="urchin-label">
            Urchins Removed (kg)
            <input
              className="urchin-input"
              type="number"
              placeholder="e.g. 42"
              min={1}
              value={count}
              onChange={(e) => { setCount(e.target.value); setError(""); }}
            />
          </label>

          {error && <p className="urchin-error">{error}</p>}

          <div className="urchin-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Close
            </button>
            <button type="submit" className="btn-submit">
              Log Removal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
