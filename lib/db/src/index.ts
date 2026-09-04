import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { dbLogger, logDatabaseError, logDatabaseEvent } from "./logger";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS ?? 30_000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS ?? 5_000),
  maxUses: Number(process.env.DB_POOL_MAX_USES ?? 7_500),
  application_name: process.env.DB_APPLICATION_NAME ?? "sd-homemades-api",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
});

pool.on("connect", () => logDatabaseEvent("database connection established"));
pool.on("error", (error) => logDatabaseError(error, { event: "pool_error" }));
pool.on("remove", () => logDatabaseEvent("database connection removed"));

export const db = drizzle(pool, { schema, logger: dbLogger });

export * from "./schema";
export * from "./logger";
export * from "./audit";
