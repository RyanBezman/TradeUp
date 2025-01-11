import { seedUsers } from "@/actions/user/createUsers";

async function main() {
  try {
    await seedUsers();
    console.log("Seeding complete");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    process.exit(0);
  }
}

main();
