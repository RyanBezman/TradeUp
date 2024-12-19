"use server";

import { db } from "@/db";
import { fills } from "@/db/schema";

export async function completeSale(
  orderId: number,
  baseAsset: string,
  quoteAsset: string,
  filledAmount: string,
  price: string,
  userId: number
) {
  await db
    .insert(fills)
    .values({ orderId: orderId, filledAmount: filledAmount, price: price });
}
