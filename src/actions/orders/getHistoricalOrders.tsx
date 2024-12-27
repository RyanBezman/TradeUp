"use server";
import { db } from "@/db";
import { historicalOrders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getHistoricalOrders(id: number) {
  const orders = await db
    .select()
    .from(historicalOrders)
    .where(eq(historicalOrders.userId, id));
  return orders;
}
