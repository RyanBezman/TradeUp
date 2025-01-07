"use server";
import { db } from "@/db";
import { historicalOrders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getTradeHistory() {
  const trades = await db
    .select()
    .from(historicalOrders)
    .where(eq(historicalOrders.status, "completed"))
    .orderBy(desc(historicalOrders.createdAt));

  return trades;
}
