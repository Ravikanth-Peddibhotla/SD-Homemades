import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.SUPERADMIN_DATABASE_URL) {
  throw new Error("SUPERADMIN_DATABASE_URL is required for management migrations");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/management-schema.ts"),
  out: path.join(__dirname, "./management-drizzle"),
  dialect: "postgresql",
  dbCredentials: { url: process.env.SUPERADMIN_DATABASE_URL },
});