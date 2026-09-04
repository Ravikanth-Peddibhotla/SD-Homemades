# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run generate` — generate a reviewed SQL migration after schema changes
- `pnpm --filter @workspace/db run migrate` — apply committed migrations in staging/production
- `pnpm --filter @workspace/db run push:management` — push management schema changes during development
- `pnpm --filter @workspace/db run generate:management` / `migrate:management` — generate/apply reviewed management database migrations
- `SUPERADMIN_EMAIL=... SUPERADMIN_PASSWORD=... pnpm --filter @workspace/db run seed:superadmin` — provision or rotate the first superadmin account
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sd_homemades pnpm --filter @workspace/db run push` — apply the schema to a local PostgreSQL database
- Required env: `DATABASE_URL` — Postgres connection string; copy `.env.example` for local defaults
- Production secrets: configure `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`, and `SUPERADMIN_DATABASE_URL` in the deployment secret manager; never commit their values.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM, with catalog, carts, wishlists, orders, immutable order snapshots, and append-only audit events
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Customer DB schema: `lib/db/src/schema/catalog.ts` and `lib/db/src/schema/commerce.ts`
- Management DB schema: `lib/db/src/management-schema.ts`
- DB connection and diagnostics: `lib/db/src/index.ts` and `lib/db/src/logger.ts`
- Audit writer: `lib/db/src/audit.ts`

## Architecture decisions

- Money values are stored as integer rupees to avoid floating-point totals.
- Orders retain address and product-name/price snapshots so history remains correct after catalog changes.
- Audit events carry actor, request, correlation, and before/after metadata for traceability; credentials and query parameters are never logged.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
