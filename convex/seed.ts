import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insertLocationBatch = mutation({
  args: {
    locations: v.array(
      v.object({
        location_id: v.string(),
        latitude: v.float64(),
        longitude: v.float64(),
        kelp_biomass_kg_2025: v.float64(),
        kelp_biomass_kg_past_2015: v.float64(),
        temperature: v.float64(),
        salinity: v.float64(),
        ocean_current: v.float64(),
        compass_score: v.float64(),
        urchin_amount_kg: v.float64(),
        urchins_removed_kg: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const loc of args.locations) {
      await ctx.db.insert("locations", loc);
    }
  },
});

export const clearLocations = mutation({
  args: {},
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();
    for (const loc of locations) {
      await ctx.db.delete(loc._id);
    }
  },
});
