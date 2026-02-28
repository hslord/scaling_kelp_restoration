import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByLocation = query({
  args: { location_id: v.id("locations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_efforts")
      .withIndex("by_location", (q) => q.eq("location_id", args.location_id))
      .collect();
  },
});

export const listByUser = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_efforts")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();
  },
});

export const logRemovalByCoords = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    urchins_removed_kg: v.float64(),
  },
  handler: async (ctx, args) => {
    // Find matching location by coordinates
    const allLocations = await ctx.db.query("locations").collect();
    if (allLocations.length === 0) {
      throw new Error("No locations exist in the database");
    }

    // Try exact match first using toFixed(6) comparison
    let location = allLocations.find(
      (loc) =>
        loc.latitude.toFixed(6) === args.latitude.toFixed(6) &&
        loc.longitude.toFixed(6) === args.longitude.toFixed(6)
    );

    // Fall back to closest by Euclidean distance
    if (!location) {
      let minDist = Infinity;
      for (const loc of allLocations) {
        const dLat = loc.latitude - args.latitude;
        const dLng = loc.longitude - args.longitude;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDist) {
          minDist = dist;
          location = loc;
        }
      }
    }

    if (!location) {
      throw new Error("No matching location found");
    }

    // Find or create user by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    let userId;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        created_at: Date.now(),
      });
    }

    // Insert user_effort record
    await ctx.db.insert("user_efforts", {
      user_id: userId,
      location_id: location._id,
      urchins_removed_kg: args.urchins_removed_kg,
      created_at: Date.now(),
    });

    // Update location aggregate
    await ctx.db.patch(location._id, {
      urchins_removed_kg: location.urchins_removed_kg + args.urchins_removed_kg,
    });
  },
});

export const listAllWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const efforts = await ctx.db.query("user_efforts").collect();

    const results = await Promise.all(
      efforts.map(async (effort) => {
        const user = await ctx.db.get(effort.user_id);
        const location = await ctx.db.get(effort.location_id);
        return {
          _id: effort._id,
          userName: user?.name ?? "Unknown",
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          urchins_removed_kg: effort.urchins_removed_kg,
          created_at: effort.created_at,
        };
      })
    );

    return results;
  },
});

export const logEffort = mutation({
  args: {
    user_id: v.id("users"),
    location_id: v.id("locations"),
    urchins_removed_kg: v.float64(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user) {
      throw new Error("User not found");
    }

    const location = await ctx.db.get(args.location_id);
    if (!location) {
      throw new Error("Location not found");
    }

    await ctx.db.insert("user_efforts", {
      user_id: args.user_id,
      location_id: args.location_id,
      urchins_removed_kg: args.urchins_removed_kg,
      created_at: Date.now(),
    });

    // Atomically update the cached aggregate on the location
    await ctx.db.patch(args.location_id, {
      urchins_removed_kg:
        location.urchins_removed_kg + args.urchins_removed_kg,
    });
  },
});
