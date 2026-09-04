import type { Logger } from "drizzle-orm/logger";

type DbLogLevel = "silent" | "error" | "warn" | "info" | "debug";

const levels: Record<DbLogLevel, number> = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
const configuredLevel = (process.env.DB_QUERY_LOG_LEVEL ?? "error") as DbLogLevel;
const minimumLevel = levels[configuredLevel] === undefined ? levels.error : levels[configuredLevel];

function write(level: Exclude<DbLogLevel, "silent">, message: string, fields: Record<string, unknown> = {}) {
  if (levels[level] > minimumLevel) return;
  const output = JSON.stringify({ time: new Date().toISOString(), level, component: "database", message, ...fields });
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.log(output);
}

export const dbLogger: Logger = {
  logQuery(query) {
    write("debug", "database query", { query });
  },
};

export function logDatabaseError(error: unknown, fields: Record<string, unknown> = {}) {
  write("error", "database error", {
    ...fields,
    error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
  });
}

export function logDatabaseEvent(message: string, fields: Record<string, unknown> = {}) {
  write("info", message, fields);
}