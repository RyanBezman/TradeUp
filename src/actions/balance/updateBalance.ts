"use server";

import { db } from "@/db";
import { balances } from "@/db/schema";
import {
  preciseAddition,
  preciseMultiplication,
  preciseSubtraction,
} from "@/db/websocket";
import { and, eq } from "drizzle-orm";

export async function updateBalance(
  userId: number,
  baseAsset: string,
  quoteAsset: string,
  amount: string,
  side: string,
  price: string
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
    const newBalance = preciseSubtraction(balanceToUpdate[0].balance, amount);
    await db.insert(balances).values({
      userId: userId,
      asset: baseAsset,
      balance: amount,
    });
    await db
      .update(balances)
      .set({ balance: newBalance })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
    return;
  }
  if (side === "buy") {
    const newBalance = preciseAddition(currentBalance[0].balance, amount);
    const amountToSubract = preciseMultiplication(price, amount);
    const newQuoteAssetBalance = preciseSubtraction(
      balanceToUpdate[0].balance,
      amountToSubract
    );
    await db
      .update(balances)
      .set({ balance: newBalance })
      .where(and(eq(balances.userId, userId), eq(balances.asset, baseAsset)));
    await db
      .update(balances)
      .set({ balance: newQuoteAssetBalance })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
  } else {
    const newBalance = preciseSubtraction(currentBalance[0].balance, amount);
    const amountToAdd = preciseMultiplication(amount, price);
    const newQuoteAssetBalance = preciseAddition(
      balanceToUpdate[0].balance,
      amountToAdd
    );
    await db
      .update(balances)
      .set({ balance: newBalance })
      .where(and(eq(balances.userId, userId), eq(balances.asset, baseAsset)));
    await db
      .update(balances)
      .set({ balance: newQuoteAssetBalance })
      .where(and(eq(balances.userId, userId), eq(balances.asset, quoteAsset)));
  }
}
