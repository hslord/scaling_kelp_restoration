import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("locations").collect();
  },
});

export const getById = query({
  args: { id: v.id("locations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByLocationId = query({
  args: { location_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_location_id", (q) => q.eq("location_id", args.location_id))
      .unique();
  },
});

export const listWithPriority = query({
  args: {},
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();

    return locations.map((loc) => ({
      ...loc,
      priority_score:
        Math.max(0, loc.urchin_amount_kg - loc.urchins_removed_kg) *
        loc.compass_score,
    }));
  },
});
