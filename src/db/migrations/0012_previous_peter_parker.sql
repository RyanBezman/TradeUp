CREATE TABLE IF NOT EXISTS "balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" numeric NOT NULL,
	"asset" varchar NOT NULL,
	"balance" numeric DEFAULT '0.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fills" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" numeric NOT NULL,
	"filled_amount" numeric NOT NULL,
	"price" numeric NOT NULL,
	"filled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" numeric NOT NULL,
	"side" varchar(4) NOT NULL,
	"order_type" varchar(6) NOT NULL,
	"base_asset" varchar NOT NULL,
	"quote_asset" varchar NOT NULL,
	"price" numeric NOT NULL,
	"amount" numeric NOT NULL,
	"filled_amount" numeric DEFAULT '0.0' NOT NULL,
	"status" varchar(10) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fills" ADD CONSTRAINT "fills_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
