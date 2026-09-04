import { eq } from "drizzle-orm";
import { getManagementDb } from "../src/management";
import { hashAdminPassword } from "../src/management-auth";
import { adminUsers } from "../src/management-schema";

const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;
const displayName = process.env.SUPERADMIN_NAME?.trim() || "Superadmin";

if (!email || !password) throw new Error("SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required");
if (password.length < 12) throw new Error("SUPERADMIN_PASSWORD must be at least 12 characters");

const { hash, salt } = await hashAdminPassword(password);
const db = getManagementDb();
const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

if (existing) {
  await db.update(adminUsers).set({ displayName, passwordHash: hash, passwordSalt: salt, role: "superadmin", status: "active", failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() }).where(eq(adminUsers.id, existing.id));
} else {
  await db.insert(adminUsers).values({ email, displayName, passwordHash: hash, passwordSalt: salt, role: "superadmin" });
}

console.log(JSON.stringify({ message: "superadmin provisioned", email }));
await db.$client.end();