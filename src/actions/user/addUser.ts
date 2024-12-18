"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { pbkdf2Sync, randomBytes } from "crypto";

type AddUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  password: string;
};
export async function addUser({
  firstName,
  lastName,
  password,
  email,
  phone,
  address1,
  address2,
  city,
  state,
  zip,
}: AddUserProps) {
  try {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    const [user] = await db
      .insert(schema.users)
      .values({
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        email: email.toString(),
        phone: phone.toString(),
        address1: address1.toString(),
        address2: address2,
        city: city,
        state: state,
        zip: zip.toString(),
        salt: salt,
      })
      .returning({ id: schema.users.id });
    console.log("user added succesfully");

    if (user) {
      await db.insert(schema.balances).values({
        userId: user.id,
        asset: "BTC",
        balance: "1.0",
      });

      console.log("Bitcoin balance added succesfully");
    } else {
      throw new Error("Falied to insert user");
    }
  } catch (error) {
    console.error("Error adding user", error);
    throw error;
  }
}

// await db.insert(schema.balances).values([
//   { userId: user.id, asset: "BTC", balance: "10.0" },
//   { userId: user.id, asset: "ETH", balance: "50.0" },
//   { userId: user.id, asset: "USD", balance: "100000.0" },
//   { userId: user.id, asset: "XRP", balance: "4.0" },
//   { userId: user.id, asset: "SOL", balance: "2.0" },
// ]);
