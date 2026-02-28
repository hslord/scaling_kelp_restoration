import type { LayerName, LayerState } from "@/types";

interface LegendProps {
  layers: LayerState;
}

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
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )
      )}
    </div>
  );
}
