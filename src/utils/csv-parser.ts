import Papa from "papaparse";
import type { DataPoint } from "@/types";

interface RawRow {
  [key: string]: string;
}

function rowToDataPoint(row: RawRow): DataPoint | null {
  // Support both column naming conventions:
  // New: lat, lon, kelp_biomass_kg, kelp_biomass_kg_past
  // Old: latitude, longitude, kelp_biomass_kg, kelp_biomass_kg_past
  const lat = parseFloat(row.lat ?? row.latitude);
  const lon = parseFloat(row.lon ?? row.longitude);
  const current = parseFloat(row.kelp_biomass_kg);
  const past = parseFloat(row.kelp_biomass_kg_past);

  if (isNaN(lat) || isNaN(lon) || isNaN(current) || isNaN(past)) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lon,
    kelp_biomass_kg: current,
    kelp_biomass_kg_past: past,
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
