import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Grants table definition
export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["federal", "provincial"] }).notNull(),
  imageUrl: text("image_url").notNull(),
  deadline: text("deadline").notNull(),
  fundingAmount: text("funding_amount").notNull(),
  category: text("category").notNull(),
  eligibilityCriteria: text("eligibility_criteria").notNull().array(),
  pros: text("pros").notNull().array(),
  cons: text("cons").notNull().array(),
  websiteUrl: text("website_url").notNull(),
  featured: boolean("featured").default(false),
  createdAt: text("created_at").notNull()
});

// User grants list (favorites)
export const userGrants = pgTable("user_grants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  grantId: integer("grant_id").notNull(),
});

// Insert schemas
export const insertGrantSchema = createInsertSchema(grants).omit({ id: true });
export const insertUserGrantSchema = createInsertSchema(userGrants).omit({ id: true });

// Types
export type Grant = typeof grants.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type UserGrant = typeof userGrants.$inferSelect;
export type InsertUserGrant = z.infer<typeof insertUserGrantSchema>;

// Users (imported from existing schema)
export { users };
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
