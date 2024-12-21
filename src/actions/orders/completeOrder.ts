"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function completeOrder(orderId: number) {
  await db
    .update(orders)
    .set({ status: "complete" })
    .where(eq(orders.id, orderId));
}
