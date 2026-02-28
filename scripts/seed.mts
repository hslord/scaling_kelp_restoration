import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL in .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

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

function safeFloat(val: string | undefined, fallback = 0): number {
  const n = parseFloat(val ?? "");
  return isNaN(n) ? fallback : n;
}

async function main() {
  const csvPath = path.resolve("public/final_compass_score.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const result = Papa.parse<RawRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const locations = result.data.map((raw) => {
    const row = trimKeys(raw);
    return {
      location_id: row["s.no"] ?? "0",
      latitude: safeFloat(row.latitude),
      longitude: safeFloat(row.longitude),
      kelp_biomass_kg_2025: safeFloat(row.kelp_biomass_kg_2025),
      kelp_biomass_kg_past_2015: safeFloat(row.kelp_biomass_kg_past_2015),
      temperature: safeFloat(row.Temperature ?? row.temperature),
      salinity: safeFloat(row["Salinity level"] ?? row.salinity),
      ocean_current: safeFloat(row["Ocean Current"] ?? row.ocean_current),
      compass_score: safeFloat(row.compass_score),
      urchin_amount_kg: 400,
      urchins_removed_kg: 0,
    };
  });

  console.log(`Parsed ${locations.length} locations from CSV`);

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < locations.length; i += BATCH_SIZE) {
    const batch = locations.slice(i, i + BATCH_SIZE);
    const insertBatch = makeFunctionReference<"mutation">("seed:insertLocationBatch");
    await client.mutation(insertBatch, { locations: batch });
    console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(locations.length / BATCH_SIZE)}`);
  }

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
