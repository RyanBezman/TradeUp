CREATE TABLE IF NOT EXISTS "activeUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"sessionToken" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
