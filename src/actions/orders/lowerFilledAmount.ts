"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function lowerFilledAmount(id: number, newFilledAmount: number) {
  await db
    .update(orders)
    .set({ filledAmount: newFilledAmount.toString() })
    .where(eq(orders.id, id));
}
