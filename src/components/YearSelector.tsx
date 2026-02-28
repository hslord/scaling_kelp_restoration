import type { TimestampYear } from "@/types";

interface YearSelectorProps {
  year: TimestampYear;
  onChange: (year: TimestampYear) => void;
}

const YEARS: { value: TimestampYear; label: string }[] = [
  { value: "2004", label: "2004 — Pre-heatwave" },
  { value: "2024", label: "2024 — Post-heatwave" },
];

export default function YearSelector({ year, onChange }: YearSelectorProps) {
  return (
    <div className="year-selector">
      {YEARS.map((y) => (
        <label key={y.value} className="year-option" data-active={year === y.value}>
          <input
            type="radio"
            name="year"
            value={y.value}
            checked={year === y.value}
            onChange={() => onChange(y.value)}
          />
          <span className="year-radio-dot" />
          <span className="year-label">{y.label}</span>
        </label>
      ))}
    </div>
  );
}
