"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateFilledAmount(id: number, newFilledAmount: string) {
  await db
    .update(orders)
    .set({ filledAmount: newFilledAmount })
    .where(eq(orders.id, id));
}
