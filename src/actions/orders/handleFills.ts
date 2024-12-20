"use server";

import { db } from "@/db";
import { fills } from "@/db/schema";

export async function handleFills(
  orderId: number,
  filledAmount: string,
  price: string
) {
  await db
    .insert(fills)
    .values({ orderId: orderId, filledAmount: filledAmount, price: price });
}
