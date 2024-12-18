import { db } from "@/db";
import { orders } from "@/db/schema";

export async function getAllOrders() {
  const allOrders = await db.select().from(orders);
  return allOrders;
}
