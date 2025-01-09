"use server";
import { db } from "@/db";
import { balances } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getBalances(id: number) {
  const balance = await db
    .select({ asset: balances.asset, balance: balances.balance })
    .from(balances)
    .where(eq(balances.userId, id))
    .orderBy(balances.asset);

  return balance.length > 0 ? balance : null;
}
