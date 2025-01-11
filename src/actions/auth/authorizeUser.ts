"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { pbkdf2Sync } from "crypto";
import { eq, and } from "drizzle-orm";

const createRandomString = () => {
  let randomString = "";
  const characters =
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
  try {
    const user = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        password: schema.users.password,
        salt: schema.users.salt,
        phone: schema.users.phone,
        city: schema.users.city,
        state: schema.users.state,
        zip: schema.users.zip,
        job: schema.users.job,
      })
      .from(schema.users)
      .where(and(eq(schema.users.email, email)));

    if (user.length === 0) {
      console.log("Invalid email");
      return null;
    }
    const {
      password: storedHash,
      salt,
      firstName,
      lastName,
      phone,
      city,
      state,
      zip,
      id,
      job,
    } = user[0];
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
    return {
      email,
      sessionToken,
      firstName,
      lastName,
      phone,
      city,
      state,
      zip,
      id,
      job,
    };
  } catch (error) {
    console.error("Error authorizing user", error);
    throw error;
  }
}
