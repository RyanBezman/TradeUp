"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { pbkdf2Sync } from "crypto";
import { eq, and } from "drizzle-orm";

const createRandomString = () => {
  let randomString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";
  const length = 16;
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
};
export async function authorizeUser(email: string, password: string) {
  console.log("we are here");
  try {
    const user = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        password: schema.users.password,
        salt: schema.users.salt,
      })
      .from(schema.users)
      .where(and(eq(schema.users.email, email)));

    if (user.length === 0) {
      console.log("Invalid email");
      return null;
    }
    const { id, password: storedHash, salt, firstName, lastName } = user[0];
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    if (hashedPassword !== storedHash) {
      console.log("Invalid password");
      return null;
    }

    const sessionToken = createRandomString();

    await db.insert(schema.activeUsers).values({ email, sessionToken });
    return { email, sessionToken, firstName, lastName };
  } catch (error) {
    console.error("Error authorizing user", error);
    throw error;
  }
}
