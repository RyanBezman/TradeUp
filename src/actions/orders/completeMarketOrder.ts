"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function completeMarketOrder(orderId: number, newPrice: string) {
  await db
    .update(orders)
    .set({ status: "complete", price: newPrice })
    .where(eq(orders.id, orderId));
}
