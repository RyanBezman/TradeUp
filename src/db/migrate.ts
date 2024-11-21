"use server";
import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    console.log("Migration compoleted");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};
main();
