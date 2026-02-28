import Papa from "papaparse";
import type { DataPoint } from "@/types";

interface RawRow {
  [key: string]: string;
}

/** Trim keys so trailing spaces in CSV headers don't break lookups */
function trimKeys(row: RawRow): RawRow {
  const out: RawRow = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.trim()] = v;
  }
  return out;
}

function rowToDataPoint(raw: RawRow): DataPoint | null {
  const row = trimKeys(raw);

  const lat = parseFloat(row.lat ?? row.latitude);
  const lon = parseFloat(row.lon ?? row.longitude);
  const current = parseFloat(
    row.kelp_biomass_kg_2025 ?? row.kelp_biomass_kg ?? "0"
  );
  const past = parseFloat(
    row.kelp_biomass_kg_past_2015 ?? row.kelp_biomass_kg_past ?? "0"
  );
  const temperature = parseFloat(row.Temperature ?? row.temperature ?? "0");
  const salinity = parseFloat(
    row["Salinity level"] ?? row.salinity ?? "0"
  );
  const oceanCurrent = parseFloat(
    row["Ocean Current"] ?? row.ocean_current ?? "0"
  );
  const compositeScore = parseFloat(
    row["Composite Score"] ?? row.composite_score ?? "0"
  );

  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lon,
    kelp_biomass_kg_2025: isNaN(current) ? 0 : current,
    kelp_biomass_kg_past_2015: isNaN(past) ? 0 : past,
    temperature: isNaN(temperature) ? 0 : temperature,
    salinity: isNaN(salinity) ? 0 : salinity,
    ocean_current: isNaN(oceanCurrent) ? 0 : oceanCurrent,
    composite_score: isNaN(compositeScore) ? 0 : compositeScore,
  };
}

export function parseCSV(file: File): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const points = results.data
          .map(rowToDataPoint)
          .filter((p): p is DataPoint => p !== null);
        resolve(points);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export function parseCSVString(csvString: string): DataPoint[] {
  const result = Papa.parse<RawRow>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .map(rowToDataPoint)
    .filter((p): p is DataPoint => p !== null);
}
