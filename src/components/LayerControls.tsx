import type { LayerName, LayerState } from "@/types";

interface LayerControlsProps {
  layers: LayerState;
  onToggle: (layer: LayerName) => void;
  onOpacityChange: (layer: LayerName, opacity: number) => void;
}

const LAYER_DESCRIPTIONS: Record<LayerName, string> = {
  kelp: "Current kelp canopy coverage",
  composite: "Combined restoration suitability",
};

export default function LayerControls({
  layers,
  onToggle,
  onOpacityChange,
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
              <div className="layer-name">{config.name}</div>
              <div className="layer-desc">{LAYER_DESCRIPTIONS[key]}</div>
              <div className="opacity-control">
                <label>Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.opacity}
                  onChange={(e) =>
                    onOpacityChange(key, parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
