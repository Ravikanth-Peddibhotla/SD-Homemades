import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getManagementDb } from "./management";
import { adminSessions, adminUsers } from "./management-schema";

const scrypt = promisify(nodeScrypt);
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export async function hashAdminPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return { hash: derivedKey.toString("hex"), salt };
}

export async function verifyAdminPassword(password: string, hash: string, salt: string) {
  const derived = await hashAdminPassword(password, salt);
  const expected = Buffer.from(hash, "hex");
  const actual = Buffer.from(derived.hash, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(adminUserId: string, ipAddress?: string, userAgent?: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await getManagementDb().insert(adminSessions).values({
    adminUserId,
    tokenHash: hashSessionToken(token),
    ipAddress,
    userAgent,
    expiresAt,
  });
  return { token, expiresAt };
}

export async function getAdminBySession(token: string) {
  const [result] = await getManagementDb()
    .select({ session: adminSessions, admin: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminUsers.id, adminSessions.adminUserId))
    .where(and(eq(adminSessions.tokenHash, hashSessionToken(token)), isNull(adminSessions.revokedAt), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  return result?.admin;
}

export async function revokeAdminSession(token: string) {
  await getManagementDb().update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
}