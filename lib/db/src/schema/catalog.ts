import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const productCategory = pgEnum("product_category", ["Podi", "Pickle", "Combo"]);
export const productHeat = pgEnum("product_heat", ["gentle", "medium", "fiery"]);

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  category: productCategory("category").notNull(),
  description: text("description").notNull(),
  accent: text("accent").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull().default([]),
  ingredients: text("ingredients").array().notNull().default([]),
  shelfLife: text("shelf_life").notNull(),
  heat: productHeat("heat").notNull(),
  vegetarian: boolean("vegetarian").notNull().default(true),
  rating: integer("rating_basis_points").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("products_category_active_idx").on(table.category, table.active)]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  grams: integer("grams").notNull(),
  price: integer("price").notNull(),
  compareAt: integer("compare_at"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  active: boolean("active").notNull().default(true),
}, (table) => [
  unique("product_variant_label").on(table.productId, table.label),
  index("product_variants_product_idx").on(table.productId, table.active),
]);

export const insertProductSchema = createInsertSchema(products);
export const insertProductVariantSchema = createInsertSchema(productVariants);
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;