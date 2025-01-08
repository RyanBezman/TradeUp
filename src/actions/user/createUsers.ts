"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { orders, users } from "@/db/schema";
import { pbkdf2Sync, randomBytes } from "crypto";

type AddUserWithBalancesProps = {
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

export async function addUserWithBalances({
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
}: AddUserWithBalancesProps) {
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

    console.log(`User ${email} added successfully`);

    if (user) {
      await db.insert(schema.balances).values([
        { userId: user.id, asset: "BTC", balance: "10.0" },
        { userId: user.id, asset: "ETH", balance: "50.0" },
        { userId: user.id, asset: "USD", balance: "100000.0" },
        { userId: user.id, asset: "XRP", balance: "4.0" },
        { userId: user.id, asset: "SOL", balance: "2.0" },
      ]);

      console.log(`Balances for ${email} added successfully`);
    } else {
      throw new Error(`Failed to insert user ${email}`);
    }
  } catch (error) {
    console.error("Error adding user with balances:", error);
    throw error;
  }
}

export async function seedUsers() {
  const fakeUsers = [
    {
      firstName: "A",
      lastName: "Test",
      email: "a",
      phone: "1234567890",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      zip: "10001",
      password: "a",
    },
    {
      firstName: "B",
      lastName: "Test",
      email: "b",
      phone: "2234567890",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      zip: "10002",
      password: "b",
    },
    {
      firstName: "C",
      lastName: "Test",
      email: "c",
      phone: "3234567890",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      zip: "10003",
      password: "c",
    },
  ];

  await db.delete(schema.historicalOrders);
  await db.delete(schema.fills);
  await db.delete(schema.balances);
  await db.delete(schema.activeUsers);
  await db.delete(orders);
  await db.delete(users);

  for (const user of fakeUsers) {
    await addUserWithBalances(user);
  }
  console.log("All users added ");
}
