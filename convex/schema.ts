import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  locations: defineTable({
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
    .index("by_location_id", ["location_id"])
    .index("by_compass_score", ["compass_score"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    created_at: v.float64(),
  }).index("by_email", ["email"]),

  user_efforts: defineTable({
    user_id: v.id("users"),
    location_id: v.id("locations"),
    urchins_removed_kg: v.float64(),
    created_at: v.float64(),
  })
    .index("by_user", ["user_id"])
    .index("by_location", ["location_id"])
    .index("by_user_and_location", ["user_id", "location_id"]),
});
