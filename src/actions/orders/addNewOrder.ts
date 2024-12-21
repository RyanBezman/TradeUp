"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";

type AddNewOrderProps = {
  id: number;
  side: string;
  orderType: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  amount: string;
  filledAmount: string;
  status: string;
};

export async function addNewOrder({
  id,
  side,
  orderType,
  baseAsset,
  quoteAsset,
  price,
  amount,
  filledAmount,
  status,
}: AddNewOrderProps) {
  const order = await db
    .insert(orders)
    .values({
      userId: id,
      side: side,
      orderType: orderType,
      baseAsset: baseAsset,
      quoteAsset: quoteAsset,
      price: price,
      amount: amount,
      filledAmount: filledAmount,
      status: status,
    })
    .returning({
      id: orders.id,
      userId: orders.userId,
      side: orders.side,
      orderType: orders.orderType,
      baseAsset: orders.baseAsset,
      quoteAsset: orders.quoteAsset,
      price: orders.price,
      amount: orders.amount,
      filledAmount: orders.filledAmount,
      status: orders.status,
    });
  return order[0];
}
