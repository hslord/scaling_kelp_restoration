/** Interpolate between two hex colors based on a 0–1 value. */
export function interpolateColor(
  colorLow: string,
  colorHigh: string,
  t: number
): string {
  const clamped = Math.max(0, Math.min(1, t));
  const low = hexToRgb(colorLow);
  const high = hexToRgb(colorHigh);

  const r = Math.round(low.r + (high.r - low.r) * clamped);
  const g = Math.round(low.g + (high.g - low.g) * clamped);
  const b = Math.round(low.b + (high.b - low.b) * clamped);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}
