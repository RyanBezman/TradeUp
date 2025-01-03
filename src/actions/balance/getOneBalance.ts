"use server";
import { db } from "@/db";
import { balances } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getOneBalance(id: number, asset: string) {
  const balance = await db
    .select({ asset: balances.asset, balance: balances.balance })
    .from(balances)
    .where(and(eq(balances.userId, id), eq(balances.asset, asset)));

  const formattedBalance = balance[0];

  return balance.length > 0 ? formattedBalance : null;
}
