CREATE TABLE IF NOT EXISTS "historicalOrders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_type" varchar(6) NOT NULL,
	"side" varchar(4) NOT NULL,
	"base_asset" varchar NOT NULL,
	"quote_asset" varchar NOT NULL,
	"price" numeric NOT NULL,
	"amount" numeric NOT NULL,
	"status" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "historicalOrders" ADD CONSTRAINT "historicalOrders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
