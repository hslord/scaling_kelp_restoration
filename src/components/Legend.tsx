import type { LayerName, LayerState } from "@/types";

interface LegendProps {
  layers: LayerState;
}

const LEGEND_UNITS: Record<LayerName, string> = {
  current: "0 kg",
  past: "0 kg",
  temperature: "Low \u00B0C",
  salinity: "Low",
  ocean_current: "0",
  composite_score: "0",
};

export default function Legend({ layers }: LegendProps) {
  return (
    <div>
      {(Object.entries(layers) as [LayerName, (typeof layers)[LayerName]][]).map(
        ([key, config]) =>
          config.visible && (
            <div key={key} className="legend-row">
              <div className="legend-row-label">
                <span
                  className="legend-dot"
                  style={{ background: config.colorHigh }}
                />
                {config.name}
              </div>
              <div
                className="legend-gradient"
                style={{
                  background: `linear-gradient(to right, ${config.colorLow}, ${config.colorHigh})`,
                }}
              />
              <div className="legend-labels">
                <span>{LEGEND_UNITS[key]}</span>
                <span>Mid</span>
                <span>High</span>
              </div>
            </div>
          )
      )}
    </div>
  );
}
