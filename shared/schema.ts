import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema definition with business profile
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
  // Business profile fields
  isBusiness: boolean("is_business").default(false),
  businessName: text("business_name"),
  businessType: text("business_type"),
  businessDescription: text("business_description"),
  industry: text("industry"),
  province: text("province"),
  employeeCount: text("employee_count"),
  yearFounded: text("year_founded"),
  website: text("website"),
  phoneNumber: text("phone_number"),
  address: text("address")
});

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
  // Netflix filter fields
  industry: text("industry"),
  province: text("province"),
  competitionLevel: text("competition_level", { enum: ["Low", "Medium", "High"] }).default("Medium"),
  createdAt: text("created_at").notNull()
});

// User grants list (favorites) with application status tracking
export const userGrants = pgTable("user_grants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  grantId: integer("grant_id").notNull(),
  savedAt: text("saved_at").notNull().default(new Date().toISOString()),
  status: text("status", { enum: ["saved", "applying", "submitted", "approved", "rejected"] }).default("saved"),
  notes: text("notes")
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertGrantSchema = createInsertSchema(grants).omit({ id: true });
export const insertUserGrantSchema = createInsertSchema(userGrants).omit({ id: true });

// Authentication schemas
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  isBusiness: z.boolean().default(false),
  // Business profile fields (optional)
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessDescription: z.string().optional(),
  industry: z.string().optional(),
  province: z.string().optional(),
  employeeCount: z.string().optional(),
  yearFounded: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Business profile update schema
export const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessDescription: z.string().min(1, "Business description is required"),
  industry: z.string(),
  province: z.string(),
  employeeCount: z.string(),
  yearFounded: z.string(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  phoneNumber: z.string(),
  address: z.string(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Grant = typeof grants.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type UserGrant = typeof userGrants.$inferSelect;
export type InsertUserGrant = z.infer<typeof insertUserGrantSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type BusinessProfileData = z.infer<typeof businessProfileSchema>;
