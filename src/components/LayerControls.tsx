import type { LayerName, LayerState } from "@/types";

interface LayerControlsProps {
  layers: LayerState;
  onToggle: (layer: LayerName) => void;
  onSolo: (layer: LayerName) => void;
}

const LAYER_DESCRIPTIONS: Record<LayerName, string> = {
  current: "2025 kelp biomass (kg)",
  past: "2015 kelp biomass (kg)",
  temperature: "Sea surface temperature (\u00B0C)",
  salinity: "Salinity level",
  ocean_current: "Ocean current speed",
  composite_score: "Composite restoration score",
  priority: "Urchin removal priority",
};

export default function LayerControls({
  layers,
  onToggle,
  onSolo,
}: LayerControlsProps) {
  return (
    <div>
      {(Object.entries(layers) as [LayerName, (typeof layers)[LayerName]][]).map(
        ([key, config]) => (
          <div key={key} className="layer-toggle">
            <input
              type="checkbox"
              checked={config.visible}
              onChange={() => onToggle(key)}
              data-layer={key}
            />
            <div className="layer-info">
              <div className="layer-name-row">
                <span className="layer-name">{config.name}</span>
                <button
                  className="btn-only"
                  onClick={() => onSolo(key)}
                >
                  only
                </button>
              </div>
              <div className="layer-desc">{LAYER_DESCRIPTIONS[key]}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
