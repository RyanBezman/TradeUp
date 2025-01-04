"use server";
import { handleFills } from "./handleFills";

export async function completeSale(
  orderId: number,
  filledAmount: string,
  price: string
) {
  await handleFills(orderId, filledAmount, price);
}
