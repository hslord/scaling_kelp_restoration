import { parseCSVString } from "./csv-parser";
import type { DataPoint } from "@/types";

let cachedData: DataPoint[] | null = null;

export async function loadSampleCSV(): Promise<DataPoint[]> {
  if (cachedData) return cachedData;

  const res = await fetch("/final_compass_score.csv");
  const text = await res.text();
  cachedData = parseCSVString(text);
  return cachedData;
}
