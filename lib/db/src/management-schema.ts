import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

const management = pgSchema("management");

export const adminRole = management.enum("admin_role", ["superadmin", "catalog_manager"]);
export const adminStatus = management.enum("admin_status", ["active", "disabled", "locked"]);
export const offerType = management.enum("offer_type", ["percentage", "fixed"]);
export const managementAuditSeverity = management.enum("audit_severity", ["info", "warn", "error", "critical"]);

export const adminUsers = management.table("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  role: adminRole("role").notNull().default("catalog_manager"),
  status: adminStatus("status").notNull().default("active"),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("admin_users_status_idx").on(table.status)]);

export const adminSessions = management.table("admin_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminUserId: uuid("admin_user_id").references(() => adminUsers.id, { onDelete: "cascade" }).notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("admin_sessions_lookup_idx").on(table.tokenHash, table.expiresAt)]);

export const managedProducts = management.table("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  accent: text("accent").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull().default([]),
  ingredients: text("ingredients").array().notNull().default([]),
  shelfLife: text("shelf_life").notNull(),
  heat: text("heat").notNull(),
  vegetarian: boolean("vegetarian").notNull().default(true),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("management_products_active_idx").on(table.active)]);

export const managedVariants = management.table("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id").references(() => managedProducts.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  grams: integer("grams").notNull(),
  price: integer("price").notNull(),
  compareAt: integer("compare_at"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [unique("management_product_variant_label").on(table.productId, table.label)]);

export const managedOffers = management.table("product_offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id").references(() => managedProducts.id, { onDelete: "cascade" }).notNull(),
  variantId: uuid("variant_id").references(() => managedVariants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").unique(),
  type: offerType("type").notNull(),
  value: integer("value").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  maxRedemptions: integer("max_redemptions"),
  redemptionCount: integer("redemption_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdBy: uuid("created_by").references(() => adminUsers.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("management_offers_live_idx").on(table.productId, table.active, table.startsAt, table.endsAt)]);

export const managementAuditEvents = management.table("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  severity: managementAuditSeverity("severity").notNull().default("info"),
  adminUserId: uuid("admin_user_id").references(() => adminUsers.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  requestId: text("request_id"),
  correlationId: text("correlation_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  before: jsonb("before"),
  after: jsonb("after"),
  metadata: jsonb("metadata"),
  errorCode: text("error_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("management_audit_entity_idx").on(table.entityType, table.entityId, table.createdAt),
  index("management_audit_admin_idx").on(table.adminUserId, table.createdAt),
]);

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const insertManagedProductSchema = createInsertSchema(managedProducts);
export const insertManagedVariantSchema = createInsertSchema(managedVariants);
export const insertManagedOfferSchema = createInsertSchema(managedOffers);
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type ManagedProduct = typeof managedProducts.$inferSelect;
export type ManagedVariant = typeof managedVariants.$inferSelect;
export type ManagedOffer = typeof managedOffers.$inferSelect;
export type ManagementAuditEvent = typeof managementAuditEvents.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type InsertManagedProduct = z.infer<typeof insertManagedProductSchema>;
export type InsertManagedVariant = z.infer<typeof insertManagedVariantSchema>;
export type InsertManagedOffer = z.infer<typeof insertManagedOfferSchema>;

export const managementSchema = {
  adminUsers,
  adminSessions,
  managedProducts,
  managedVariants,
  managedOffers,
  managementAuditEvents,
};