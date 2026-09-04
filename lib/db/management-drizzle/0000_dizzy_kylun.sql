CREATE SCHEMA IF NOT EXISTS "management";--> statement-breakpoint
CREATE TYPE "management"."admin_role" AS ENUM('superadmin', 'catalog_manager');--> statement-breakpoint
CREATE TYPE "management"."admin_status" AS ENUM('active', 'disabled', 'locked');--> statement-breakpoint
CREATE TYPE "management"."audit_severity" AS ENUM('info', 'warn', 'error', 'critical');--> statement-breakpoint
CREATE TYPE "management"."offer_type" AS ENUM('percentage', 'fixed');--> statement-breakpoint
CREATE TABLE "management"."admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "management"."admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" text NOT NULL,
	"role" "management"."admin_role" DEFAULT 'catalog_manager' NOT NULL,
	"status" "management"."admin_status" DEFAULT 'active' NOT NULL,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "management"."product_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"variant_id" uuid,
	"name" text NOT NULL,
	"code" text,
	"type" "management"."offer_type" NOT NULL,
	"value" integer NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"max_redemptions" integer,
	"redemption_count" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_offers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "management"."products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"accent" text NOT NULL,
	"image_url" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"ingredients" text[] DEFAULT '{}' NOT NULL,
	"shelf_life" text NOT NULL,
	"heat" text NOT NULL,
	"vegetarian" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "management"."product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"label" text NOT NULL,
	"grams" integer NOT NULL,
	"price" integer NOT NULL,
	"compare_at" integer,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "management_product_variant_label" UNIQUE("product_id","label")
);
--> statement-breakpoint
CREATE TABLE "management"."audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"severity" "management"."audit_severity" DEFAULT 'info' NOT NULL,
	"admin_user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"request_id" text,
	"correlation_id" text,
	"ip_address" text,
	"user_agent" text,
	"before" jsonb,
	"after" jsonb,
	"metadata" jsonb,
	"error_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "management"."admin_sessions" ADD CONSTRAINT "admin_sessions_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "management"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management"."product_offers" ADD CONSTRAINT "product_offers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "management"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management"."product_offers" ADD CONSTRAINT "product_offers_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "management"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management"."product_offers" ADD CONSTRAINT "product_offers_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "management"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management"."product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "management"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management"."audit_events" ADD CONSTRAINT "audit_events_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "management"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_sessions_lookup_idx" ON "management"."admin_sessions" USING btree ("token_hash","expires_at");--> statement-breakpoint
CREATE INDEX "admin_users_status_idx" ON "management"."admin_users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "management_offers_live_idx" ON "management"."product_offers" USING btree ("product_id","active","starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "management_products_active_idx" ON "management"."products" USING btree ("active");--> statement-breakpoint
CREATE INDEX "management_audit_entity_idx" ON "management"."audit_events" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "management_audit_admin_idx" ON "management"."audit_events" USING btree ("admin_user_id","created_at");