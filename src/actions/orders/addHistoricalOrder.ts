"use server";

import { db } from "@/db";
import { historicalOrders } from "@/db/schema";

export async function addHistoricalOrder(
  userId: number,
  orderType: string,
  side: string,
  baseAsset: string,
  quoteAsset: string,
  price: string,
  amount: string,
  status: string
) {
  await db.insert(historicalOrders).values({
    userId,
    orderType,
    side,
    baseAsset,
    quoteAsset,
    price,
    amount,
    status,
  });
}
