"use server";

import { db } from "@/db";
import { balances } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function updateBalance(
  userId: number,
  baseAsset: string,
  quoteAsset: string,
  amount: string,
  side: string
) {
  const currentBalance = await db
    .select({ balance: balances.balance })
    .from(balances)
    .where(and(eq(balances.userId, userId), eq(balances.asset, baseAsset)));
  const balanceToUpdate = await db
    .select({ balance: balances.balance })
    .from(balances)
    .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));

  if (currentBalance.length === 0 && side === "buy") {
    const newBalance = +balanceToUpdate - +amount;
    await db.insert(balances).values({
      userId: userId,
      asset: baseAsset,
      balance: amount,
    });
    await db
      .update(balances)
      .set({ balance: newBalance.toString() })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
    return;
  }
  if (side === "buy") {
    const newBalance = +currentBalance + +amount;
    const newQuoteAssetBalance = +balanceToUpdate - +amount;
    await db
      .update(balances)
      .set({ balance: newBalance.toString() })
      .where(and(eq(balances.userId, userId), eq(balances.asset, baseAsset)));
    await db
      .update(balances)
      .set({ balance: newQuoteAssetBalance.toString() })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
  } else {
    const newBalance = +currentBalance - +amount;
    const newQuoteAssetBalance = +balanceToUpdate + +amount;
    await db
      .update(balances)
      .set({ balance: newBalance.toString() })
      .where(and(eq(balances.userId, userId), eq(balances.asset, baseAsset)));
    await db
      .update(balances)
      .set({ balance: newQuoteAssetBalance.toString() })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
  }
}
