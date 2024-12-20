"use server";

import { lowerFilledAmount } from "@/actions/orders/lowerFilledAmount";
import { handleFills } from "@/actions/orders/handleFills";
import { addHistoricalOrder } from "@/actions/orders/addHistoricalOrder";
import { updateBalance } from "@/actions/balance/updateBalance";

async function runTests() {
  try {
    await lowerFilledAmount(13, 1.0);

    await handleFills(13, "1.0", "98000");
    await addHistoricalOrder(
      13,
      "limit",
      "sell",
      "BTC",
      "USD",
      "98000",
      "1.0",
      "completed"
    );

    await updateBalance(14, "BTC", "USD", "1.0", "buy");

    await updateBalance(13, "BTC", "USD", "1.0", "sell");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();
