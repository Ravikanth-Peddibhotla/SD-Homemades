import { and, desc, eq, gt, isNull, lte, or } from "drizzle-orm";
import { Router, type Request, type Response } from "express";
import { getManagementDb } from "@workspace/db/management";
import {
  adminUsers,
  managedOffers,
  managedProducts,
  managedVariants,
  managementAuditEvents,
} from "@workspace/db/management-schema";
import {
  createAdminSession,
  getAdminBySession,
  hashAdminPassword,
  revokeAdminSession,
  verifyAdminPassword,
} from "@workspace/db/management-auth";

const router = Router();
const SESSION_COOKIE = "sd_superadmin_session";
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function cookieToken(request: Request) {
  return request.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
}

function setSessionCookie(response: Response, token: string, expiresAt: Date) {
  const request = response.req;
  const forwardedProtocol = request.get("x-forwarded-proto");
  const secure = request.secure || forwardedProtocol === "https" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${SESSION_COOKIE}=${token}; HttpOnly; Path=/api/admin; SameSite=Strict; Expires=${expiresAt.toUTCString()}${secure}`);
}

function clearSessionCookie(response: Response) {
  response.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; Path=/api/admin; SameSite=Strict; Max-Age=0`);
}

function requestContext(request: Request) {
  return {
    requestId: (request as Request & { id?: string }).id,
    ipAddress: request.ip,
    userAgent: request.get("user-agent"),
  };
}

async function audit(request: Request, adminUserId: string | undefined, action: string, entityType: string, entityId: string | undefined, after?: unknown, before?: unknown) {
  await getManagementDb().insert(managementAuditEvents).values({
    adminUserId,
    action,
    entityType,
    entityId,
    before,
    after,
    ...requestContext(request),
  });
}

async function requireAdmin(request: Request, response: Response, next: () => void, superadminOnly = false) {
  const token = cookieToken(request);
  const admin = token ? await getAdminBySession(token) : undefined;
  if (!admin || admin.status !== "active" || (superadminOnly && admin.role !== "superadmin")) {
    response.status(401).json({ error: "Administrator authentication required" });
    return;
  }
  (request as Request & { admin: typeof admin }).admin = admin;
  next();
}

router.post("/admin/auth/login", async (request, response) => {
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!email || password.length < 12) return response.status(400).json({ error: "Email and a 12-character password are required" });

  const db = getManagementDb();
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (!admin || admin.status !== "active" || (admin.lockedUntil && admin.lockedUntil > new Date())) return response.status(401).json({ error: "Invalid credentials" });
  const valid = await verifyAdminPassword(password, admin.passwordHash, admin.passwordSalt);
  if (!valid) {
    const failedLoginCount = admin.failedLoginCount + 1;
    await db.update(adminUsers).set({ failedLoginCount, lockedUntil: failedLoginCount >= MAX_FAILED_LOGINS ? new Date(Date.now() + LOCKOUT_MS) : null, updatedAt: new Date() }).where(eq(adminUsers.id, admin.id));
    await audit(request, admin.id, "admin.login_failed", "admin_user", admin.id);
    return response.status(401).json({ error: "Invalid credentials" });
  }

  await db.update(adminUsers).set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(adminUsers.id, admin.id));
  const session = await createAdminSession(admin.id, request.ip, request.get("user-agent"));
  setSessionCookie(response, session.token, session.expiresAt);
  await audit(request, admin.id, "admin.login_succeeded", "admin_user", admin.id);
  return response.json({ id: admin.id, email: admin.email, displayName: admin.displayName, role: admin.role, expiresAt: session.expiresAt });
});

router.post("/admin/auth/logout", async (request, response) => {
  const token = cookieToken(request);
  if (token) await revokeAdminSession(token);
  clearSessionCookie(response);
  return response.status(204).send();
});

router.get("/admin/auth/me", async (request, response) => {
  const token = cookieToken(request);
  const admin = token ? await getAdminBySession(token) : undefined;
  if (!admin) return response.status(401).json({ error: "Administrator authentication required" });
  return response.json({ id: admin.id, email: admin.email, displayName: admin.displayName, role: admin.role });
});

router.get("/admin/products", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const db = getManagementDb();
  const products = await db.select().from(managedProducts).orderBy(desc(managedProducts.updatedAt));
  const variants = await db.select().from(managedVariants);
  const offers = await db.select().from(managedOffers);
  return response.json(products.map((product) => ({ ...product, variants: variants.filter((variant) => variant.productId === product.id), offers: offers.filter((offer) => offer.productId === product.id) })));
});

router.get("/catalog/products", async (_request, response) => {
  const now = new Date();
  const db = getManagementDb();
  const products = await db.select().from(managedProducts).where(eq(managedProducts.active, true));
  const variants = await db.select().from(managedVariants).where(eq(managedVariants.active, true));
  const offers = await db.select().from(managedOffers).where(and(eq(managedOffers.active, true), lteOrNull(managedOffers.startsAt, now), or(isNull(managedOffers.endsAt), gt(managedOffers.endsAt, now))));
  return response.json(products.map((product) => ({ ...product, variants: variants.filter((variant) => variant.productId === product.id), offers: offers.filter((offer) => offer.productId === product.id || product.id === offer.productId) })));
});

function lteOrNull(column: typeof managedOffers.startsAt, value: Date) {
  return lte(column, value);
}

router.post("/admin/products", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const input = request.body;
  if (!input?.id || !input?.name || !input?.shortName || !input?.category || !input?.description || !input?.imageUrl || !input?.shelfLife || !input?.heat) return response.status(400).json({ error: "Product fields are incomplete" });
  const [product] = await getManagementDb().insert(managedProducts).values(input).returning();
  await audit(request, admin.id, "product.created", "product", product.id, product);
  return response.status(201).json(product);
});

router.patch("/admin/products/:id", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const db = getManagementDb();
  const [before] = await db.select().from(managedProducts).where(eq(managedProducts.id, request.params.id));
  if (!before) return response.status(404).json({ error: "Product not found" });
  const [product] = await db.update(managedProducts).set({ ...request.body, updatedAt: new Date() }).where(eq(managedProducts.id, request.params.id)).returning();
  await audit(request, admin.id, "product.updated", "product", product.id, product, before);
  return response.json(product);
});

router.post("/admin/products/:id/variants", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const [variant] = await getManagementDb().insert(managedVariants).values({ ...request.body, productId: request.params.id }).returning();
  await audit(request, admin.id, "variant.created", "variant", variant.id, variant);
  return response.status(201).json(variant);
});

router.patch("/admin/variants/:id", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const db = getManagementDb();
  const [before] = await db.select().from(managedVariants).where(eq(managedVariants.id, request.params.id));
  if (!before) return response.status(404).json({ error: "Variant not found" });
  const [variant] = await db.update(managedVariants).set({ ...request.body, updatedAt: new Date() }).where(eq(managedVariants.id, request.params.id)).returning();
  await audit(request, admin.id, "variant.updated", "variant", variant.id, variant, before);
  return response.json(variant);
});

router.post("/admin/products/:id/offers", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const [offer] = await getManagementDb().insert(managedOffers).values({ ...request.body, productId: request.params.id, createdBy: admin.id }).returning();
  await audit(request, admin.id, "offer.created", "offer", offer.id, offer);
  return response.status(201).json(offer);
});

router.patch("/admin/offers/:id", (request, response, next) => requireAdmin(request, response, next), async (request, response) => {
  const admin = (request as unknown as Request & { admin: typeof adminUsers.$inferSelect }).admin;
  const db = getManagementDb();
  const [before] = await db.select().from(managedOffers).where(eq(managedOffers.id, request.params.id));
  if (!before) return response.status(404).json({ error: "Offer not found" });
  const [offer] = await db.update(managedOffers).set({ ...request.body, updatedAt: new Date() }).where(eq(managedOffers.id, request.params.id)).returning();
  await audit(request, admin.id, "offer.updated", "offer", offer.id, offer, before);
  return response.json(offer);
});

export default router;