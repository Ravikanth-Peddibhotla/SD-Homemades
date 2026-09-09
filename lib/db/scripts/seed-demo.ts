import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { db, pool } from "../src/index";
import { getManagementDb } from "../src/management";
import { hashAdminPassword } from "../src/management-auth";
import { adminSessions, adminUsers, managedOffers, managedProducts, managedVariants, managementAuditEvents } from "../src/management-schema";
import { addresses, auditEvents, cartItems, carts, orderItems, orders, productVariants, products, users, wishlists } from "../src/schema";

type DemoData = {
  admin: { id: string; email: string; displayName: string; password: string; passwordSalt: string };
  products: Array<Record<string, unknown>>;
  variants: Array<Record<string, unknown>>;
  offer: { id: string; productId: string; variantId: string; name: string; code: string; type: "percentage" | "fixed"; value: number; daysAgo: number; daysUntilExpiry: number; maxRedemptions: number };
  customer: { userId: string; clerkUserId: string; email: string; name: string; addressId: string; cartId: string; orderId: string; orderItemId: string; wishlistId: string; auditId: string; address: Record<string, string>; orderNumber: string };
  managementAuditId: string;
};

const fixturePath = resolve(process.env.SEED_DATA_FILE ?? resolve(import.meta.dirname, "../seed-data/demo.json"));
const data = JSON.parse(await readFile(fixturePath, "utf8")) as DemoData;
const now = new Date();
const endsAt = new Date(now.getTime() + data.offer.daysUntilExpiry * 24 * 60 * 60 * 1000);

async function seed() {
  const managementDb = getManagementDb();
  const password = await hashAdminPassword(data.admin.password, data.admin.passwordSalt);

  await managementDb.insert(adminUsers).values({ id: data.admin.id, email: data.admin.email, displayName: data.admin.displayName, passwordHash: password.hash, passwordSalt: password.salt, role: "superadmin", status: "active" }).onConflictDoNothing();
  await managementDb.insert(adminSessions).values({ id: "11111111-1111-4111-8111-111111111112", adminUserId: data.admin.id, tokenHash: createHash("sha256").update("revoked-demo-session").digest("hex"), ipAddress: "127.0.0.1", userAgent: "demo-seed", expiresAt: endsAt, revokedAt: now }).onConflictDoNothing();
  await managementDb.insert(managedProducts).values(data.products as typeof managedProducts.$inferInsert[]).onConflictDoNothing();
  await managementDb.insert(managedVariants).values(data.variants as typeof managedVariants.$inferInsert[]).onConflictDoNothing();
  await managementDb.insert(managedOffers).values({ id: data.offer.id, productId: data.offer.productId, variantId: data.offer.variantId, name: data.offer.name, code: data.offer.code, type: data.offer.type, value: data.offer.value, startsAt: new Date(now.getTime() - data.offer.daysAgo * 24 * 60 * 60 * 1000), endsAt, maxRedemptions: data.offer.maxRedemptions, createdBy: data.admin.id }).onConflictDoNothing();
  await managementDb.insert(managementAuditEvents).values({ id: data.managementAuditId, severity: "info", adminUserId: data.admin.id, action: "seed.demo_catalog_created", entityType: "catalog", entityId: data.products[0].id as string, requestId: "demo-seed", correlationId: "demo-seed", metadata: { source: fixturePath } }).onConflictDoNothing();

  await db.insert(products).values(data.products as typeof products.$inferInsert[]).onConflictDoNothing();
  await db.insert(productVariants).values(data.variants as typeof productVariants.$inferInsert[]).onConflictDoNothing();
  await db.insert(users).values({ id: data.customer.userId, clerkUserId: data.customer.clerkUserId, email: data.customer.email, name: data.customer.name }).onConflictDoNothing();
  await db.insert(addresses).values({ id: data.customer.addressId, userId: data.customer.userId, ...data.customer.address }).onConflictDoNothing();
  await db.insert(carts).values({ id: data.customer.cartId, userId: data.customer.userId }).onConflictDoNothing();
  await db.insert(cartItems).values({ cartId: data.customer.cartId, variantId: data.offer.variantId, quantity: 2 }).onConflictDoNothing();
  await db.insert(wishlists).values({ id: data.customer.wishlistId, userId: data.customer.userId, productId: "gongura" }).onConflictDoNothing();
  await db.insert(orders).values({ id: data.customer.orderId, orderNumber: data.customer.orderNumber, userId: data.customer.userId, addressId: data.customer.addressId, addressSnapshot: data.customer.address, status: "delivered", paymentStatus: "paid", paymentMethod: "upi", subtotal: 245, discount: 25, deliveryFee: 0, tax: 11, total: 231 }).onConflictDoNothing();
  await db.insert(orderItems).values({ id: data.customer.orderItemId, orderId: data.customer.orderId, variantId: data.offer.variantId, productName: data.products[0].name as string, variantLabel: data.variants[0].label as string, unitPrice: data.variants[0].price as number, quantity: 1 }).onConflictDoNothing();
  await db.insert(auditEvents).values({ id: data.customer.auditId, severity: "info", actorType: "system", actorId: "seed-demo", action: "seed.demo_data_created", entityType: "order", entityId: data.customer.orderId, requestId: "demo-seed", correlationId: "demo-seed", metadata: { source: fixturePath } }).onConflictDoNothing();

  console.log(JSON.stringify({ message: "demo fixture seeded", fixturePath, adminEmail: data.admin.email }));
}

try {
  await seed();
} finally {
  await pool.end();
  await getManagementDb().$client.end();
}
