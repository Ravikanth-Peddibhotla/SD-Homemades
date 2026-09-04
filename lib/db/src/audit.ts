import { db } from "./index";
import { auditEvents, type InsertAuditEvent } from "./schema";

export type AuditContext = Pick<InsertAuditEvent, "actorType" | "actorId" | "requestId" | "correlationId" | "ipAddress" | "userAgent">;

export async function recordAuditEvent(event: Omit<InsertAuditEvent, keyof AuditContext> & Partial<AuditContext>) {
  const [saved] = await db.insert(auditEvents).values(event).returning();
  return saved;
}