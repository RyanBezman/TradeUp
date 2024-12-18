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
  await db.insert(orders).values({
    userId: id,
    side: side,
    orderType: orderType,
    baseAsset: baseAsset,
    quoteAsset: quoteAsset,
    price: price,
    amount: amount,
    filledAmount: filledAmount,
    status: status,
  });
}
