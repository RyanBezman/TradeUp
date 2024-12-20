"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
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
      await db.insert(schema.orders).values({
        userId: user.id,
        side: "buy",
        orderType: "limit",
        baseAsset: "BTC",
        quoteAsset: "USD",
        price: "98000",
        amount: "2.0",
        status: "pending",
      });
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
  const users = [
    {
      firstName: "UserA",
      lastName: "Test",
      email: "a@icloud.com",
      phone: "1234567890",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      zip: "10001",
      password: "atheking",
    },
    {
      firstName: "UserB",
      lastName: "Test",
      email: "b@icloud.com",
      phone: "2234567890",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      zip: "10002",
      password: "btheking",
    },
    // {
    //   firstName: "UserC",
    //   lastName: "Test",
    //   email: "c@icloud.com",
    //   phone: "3234567890",
    //   address1: "123 Test St",
    //   city: "Test City",
    //   state: "NY",
    //   zip: "10003",
    //   password: "ctheking",
    // },
    // {
    //   firstName: "UserD",
    //   lastName: "Test",
    //   email: "d@icloud.com",
    //   phone: "4234567890",
    //   address1: "123 Test St",
    //   city: "Test City",
    //   state: "NY",
    //   zip: "10004",
    //   password: "dtheking",
    // },
  ];

  for (const user of users) {
    await addUserWithBalances(user);
  }
  console.log("All users added ");
}
