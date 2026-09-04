import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { managementSchema } from "./management-schema";
import { dbLogger, logDatabaseError, logDatabaseEvent } from "./logger";

const { Pool } = pg;
let pool: pg.Pool | undefined;
let managementDb: ReturnType<typeof drizzle<typeof managementSchema>> | undefined;

export function getManagementDb() {
  if (managementDb) return managementDb;
  const connectionString = process.env.SUPERADMIN_DATABASE_URL;
  if (!connectionString) throw new Error("SUPERADMIN_DATABASE_URL must be set for management operations");

  pool = new Pool({
    connectionString,
    max: Number(process.env.SUPERADMIN_DB_POOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.SUPERADMIN_DB_IDLE_TIMEOUT_MS ?? 30_000),
    connectionTimeoutMillis: Number(process.env.SUPERADMIN_DB_CONNECTION_TIMEOUT_MS ?? 5_000),
    application_name: process.env.SUPERADMIN_DB_APPLICATION_NAME ?? "sd-homemades-management",
    ssl: process.env.SUPERADMIN_DB_SSL === "true" ? { rejectUnauthorized: process.env.SUPERADMIN_DB_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
  });
  pool.on("connect", () => logDatabaseEvent("management database connection established"));
  pool.on("error", (error) => logDatabaseError(error, { event: "management_pool_error" }));
  managementDb = drizzle(pool, { schema: managementSchema, logger: dbLogger });
  return managementDb;
}

export { managementSchema } from "./management-schema";