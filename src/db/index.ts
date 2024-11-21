import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

console.log("Database URL:", process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql);

export { db };
