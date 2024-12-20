"use server";

import { db } from "@/db";
import { fills } from "@/db/schema";
import { handleFills } from "./handleFills";

export async function completeSale(
  orderId: number,
  baseAsset: string,
  quoteAsset: string,
  filledAmount: string,
  price: string,
  userId: number
) {
  await handleFills(orderId, filledAmount, price);
}
