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

    await db.insert(schema.users).values({
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
    });
    console.log("user added succesfully");
  } catch (error) {
    console.error("Error adding user", error);
    throw error;
  }
}
