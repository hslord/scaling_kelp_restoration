import Papa from "papaparse";
import type { DataPoint } from "@/types";

interface RawRow {
  latitude: string;
  longitude: string;
  current_kelp: string;
  composite_score: string;
}

export function parseCSV(file: File): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const points: DataPoint[] = results.data
          .map((row) => ({
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            current_kelp: parseFloat(row.current_kelp),
            composite_score: parseFloat(row.composite_score),
          }))
          .filter(
            (p) =>
              !isNaN(p.latitude) &&
              !isNaN(p.longitude) &&
              !isNaN(p.current_kelp) &&
              !isNaN(p.composite_score)
          );
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
    .map((row) => ({
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      current_kelp: parseFloat(row.current_kelp),
      composite_score: parseFloat(row.composite_score),
    }))
    .filter(
      (p) =>
        !isNaN(p.latitude) &&
        !isNaN(p.longitude) &&
        !isNaN(p.current_kelp) &&
        !isNaN(p.composite_score)
    );
}
