"use server";

import { handleFills } from "@/actions/orders/handleFills";
import { addHistoricalOrder } from "@/actions/orders/addHistoricalOrder";
import { updateBalance } from "@/actions/balance/updateBalance";
import { addNewOrder } from "@/actions/orders/addNewOrder";
import { users } from "./schema";
import { db } from ".";
import { updateFilledAmount } from "@/actions/orders/updateFilledAmount";

async function getAllUsers() {
  const allUsers = db.select().from(users);
  return allUsers;
}

async function runTests() {
  const allUsers = await getAllUsers();
  const userOneId = allUsers[1].id;
  const userTwoId = allUsers[0].id;
  console.log(allUsers);
  try {
    const newSellOrderId = await addNewOrder({
      id: userOneId,
      side: "sell",
      orderType: "limit",
      baseAsset: "BTC",
      quoteAsset: "USD",
      price: "98000",
      amount: "1.0",
      filledAmount: "0.0",
      status: "pending",
    });
    const newBuyOrderId = await addNewOrder({
      id: userTwoId,
      side: "buy",
      orderType: "limit",
      baseAsset: "BTC",
      quoteAsset: "USD",
      price: "98000",
      amount: "1.0",
      filledAmount: "0.0",
      status: "pending",
    });
    await updateFilledAmount(newSellOrderId.id, 1.0);

    await handleFills(newSellOrderId.id, "1.0", "98000");
    await handleFills(newBuyOrderId.id, "1.0", "98000");
    await addHistoricalOrder(
      userOneId,
      "limit",
      "sell",
      "BTC",
      "USD",
      "98000",
      "1.0",
      "completed"
    );

    await updateBalance(userTwoId, "BTC", "USD", "1.0", "buy");

    await updateBalance(userOneId, "BTC", "USD", "1.0", "sell");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();

// both orders should be added to orders table
// filledAmount for the order with the userID of 20 should now be 1.0a
// there will be two filled orders with two differen orderID's of 1.0 and at a price of 98000
// there willl be a historical order for the userID of 20 with 98000 price, 1.0 amount and say completed
// the balance for the user ID of 21 should be 11 and the USD should be 9999
// the balance for user Id of 20 should be 9 and the USD should be 10001
