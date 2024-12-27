"use server";
//check if theres a limit sell for my limit ask
// check if theres a limit buy for my limit sell
//markey buys eat the lowest limit sell and keep going until fulfilled
//market sells eat the highest limit buys and keep going until fulfilled
// @ts-expect-error websoket improt is broken
import { WebSocketServer } from "ws";
import { addNewOrder } from "../actions/orders/addNewOrder";
import { getAllOrders } from "@/actions/orders/getAllOrders";
import { updateFilledAmount } from "@/actions/orders/updateFilledAmount";
import { handleFills } from "@/actions/orders/handleFills";
import { addHistoricalOrder } from "@/actions/orders/addHistoricalOrder";
import { updateBalance } from "@/actions/balance/updateBalance";
import { completeOrder } from "@/actions/orders/completeOrder";
import { completeMarketOrder } from "@/actions/orders/completeMarketOrder";
const wss = new WebSocketServer({ port: 8080 });
type InitialOrder = {
  id: number;
  userId: number;
  side: string;
  orderType: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  amount: string;
  filledAmount: string;
  status: string;
};
let asks: InitialOrder[] = [];
let bids: InitialOrder[] = [];

async function initializeOrderBook() {
  try {
    const allOrders = await getAllOrders();
    asks = allOrders
      .filter((order) => order.side === "sell" && order.status === "pending")
      .sort((a, b) => +a.price - +b.price);

    bids = allOrders
      .filter((order) => order.side === "buy" && order.status === "pending")
      .sort((a, b) => +b.price - +a.price);

    console.log("succefully initialzed orderbook");
  } catch (error) {
    console.error("falied to initialize orderbook ", error);
  }
}

export function preciseSubtraction(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 8);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) -
      Math.round(parseFloat(value2) * scaleNumber)) /
    scaleNumber;

  return answer.toString();
}
export function preciseAddition(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 8);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) +
      Math.round(parseFloat(value2) * scaleNumber)) /
    scaleNumber;

  return answer.toString();
}

initializeOrderBook();

wss.on("connection", (ws: any) => {
  ws.send(JSON.stringify({ type: "order_book", asks, bids }));

  ws.on("message", async (message: any) => {
    try {
      const data = JSON.parse(message);
      const {
        id,
        side,
        price,
        amount,
        orderType,
        baseAsset,
        quoteAsset,
        filledAmount,
        status,
      } = data;

      if (data.type === "new_order") {
        const newOrder = await addNewOrder({
          id,
          side,
          orderType,
          baseAsset,
          quoteAsset,
          price,
          amount,
          filledAmount,
          status,
        });
        if (orderType === "market") {
          if (side === "buy") {
            await marketBuy(newOrder);
          } else if (side === "sell") {
            await marketSell(newOrder);
          }
        } else if (orderType === "limit" && side === "sell") {
          let remainingSize = amount;

          while (bids[0] && bids[0].price >= price && remainingSize > 0) {
            let bid = bids[0];
            const availableAmount = preciseSubtraction(
              bid.amount,
              bid.filledAmount
            );
            console.log(
              "RemainingSize:",
              remainingSize,
              "Available Amoung:",
              availableAmount
            );

            console.log(availableAmount, remainingSize);
            if (availableAmount === remainingSize) {
              await addHistoricalOrder(
                bid.userId,
                bid.orderType,
                bid.side,
                bid.baseAsset,
                bid.quoteAsset,
                bid.price,
                bid.amount,
                "completed"
              );

              await addHistoricalOrder(
                newOrder.userId,
                newOrder.orderType,
                newOrder.side,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                newOrder.price,
                newOrder.amount,
                "completed"
              );
              await handleFills(bid.id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await updateFilledAmount(newOrder.id, newOrder.amount);
              await updateFilledAmount(bid.id, bid.amount);

              await updateBalance(
                bid.userId,
                bid.baseAsset,
                bid.quoteAsset,
                availableAmount,
                bid.side
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount,
                newOrder.side
              );

              await completeOrder(bid.id);
              await completeOrder(newOrder.id);

              bids.shift();
              remainingSize = 0;
            } else if (availableAmount > remainingSize) {
              const newFilledAmount = preciseAddition(
                bid.filledAmount,
                remainingSize
              );
              console.log(
                "New filled amount:",
                newFilledAmount,
                "Old filled amount:",
                bid.filledAmount
              );
              await updateFilledAmount(bid.id, newFilledAmount);
              await updateFilledAmount(newOrder.id, newOrder.amount);
              await handleFills(bid.id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await addHistoricalOrder(
                id,
                orderType,
                side,
                baseAsset,
                quoteAsset,
                price,
                amount,
                "completed"
              );
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                remainingSize,
                side
              );
              await updateBalance(
                bid.userId,
                bid.baseAsset,
                bid.quoteAsset,
                remainingSize,
                bid.side
              );

              bid.filledAmount = newFilledAmount;

              remainingSize = 0;
            } else {
              let newRemainingSize = preciseSubtraction(
                remainingSize,
                availableAmount
              );
              remainingSize = newRemainingSize;
              console.log(remainingSize);
              const newFilledAmount = preciseSubtraction(
                newOrder.amount,
                remainingSize
              );

              await handleFills(bid.id, availableAmount, price);
              await handleFills(newOrder.id, availableAmount, price);
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                availableAmount,
                side
              );
              await updateBalance(
                bid.userId,
                bid.baseAsset,
                bid.quoteAsset,
                availableAmount,
                bid.side
              );
              await updateFilledAmount(newOrder.id, newFilledAmount);
              await updateFilledAmount(bid.id, bid.amount);
              await addHistoricalOrder(
                bid.userId,
                bid.orderType,
                bid.side,
                bid.baseAsset,
                bid.quoteAsset,
                bid.price,
                bid.amount,
                "completed"
              );
              await completeOrder(bid.id);
              for (const ask of asks) {
                if (ask.id === newOrder.id) {
                  ask.filledAmount = newFilledAmount;
                  break;
                }
              }

              bids.shift();
            }
          }
          if (remainingSize > 0) {
            let amountFilled = preciseSubtraction(
              newOrder.amount,
              remainingSize
            );
            const updatedFillAmount = preciseAddition(
              newOrder.filledAmount,
              amountFilled
            );
            newOrder.filledAmount = updatedFillAmount;
            asks.push(newOrder);
          } else {
            await completeOrder(newOrder.id);
          }
        } else if (orderType === "limit" && side === "buy") {
          let remainingSize = amount;

          while (asks[0] && asks[0].price <= price && remainingSize > 0) {
            let ask = asks[0];

            const availableAmount = preciseSubtraction(
              ask.amount,
              ask.filledAmount
            );
            if (availableAmount === remainingSize) {
              await addHistoricalOrder(
                ask.userId,
                ask.orderType,
                ask.side,
                ask.baseAsset,
                ask.quoteAsset,
                ask.price,
                ask.amount,
                "completed"
              );

              await addHistoricalOrder(
                newOrder.userId,
                newOrder.orderType,
                newOrder.side,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                newOrder.price,
                newOrder.amount,
                "completed"
              );

              await updateBalance(
                ask.userId,
                ask.baseAsset,
                ask.quoteAsset,
                availableAmount,
                ask.side
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount,
                newOrder.side
              );
              await handleFills(ask.id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await updateFilledAmount(newOrder.id, newOrder.amount);
              await updateFilledAmount(ask.id, ask.amount);

              await completeOrder(ask.id);
              await completeOrder(newOrder.id);

              asks.shift();
              remainingSize = 0;
            } else if (availableAmount > remainingSize) {
              const newFilledAmount = preciseAddition(
                ask.filledAmount,
                remainingSize
              );

              await updateFilledAmount(ask.id, newFilledAmount);
              await updateFilledAmount(newOrder.id, newOrder.amount);
              await handleFills(ask.id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await addHistoricalOrder(
                id,
                orderType,
                side,
                baseAsset,
                quoteAsset,
                price,
                amount,
                "completed"
              );
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                remainingSize,
                side
              );
              await updateBalance(
                ask.userId,
                ask.baseAsset,
                ask.quoteAsset,
                remainingSize,
                ask.side
              );

              ask.filledAmount = newFilledAmount;

              remainingSize = 0;
            } else {
              let newRemainingSize = preciseSubtraction(
                remainingSize,
                availableAmount
              );
              remainingSize = newRemainingSize;

              const newFilledAmount = preciseSubtraction(
                newOrder.amount,
                remainingSize
              );
              await handleFills(ask.id, availableAmount, price);
              await handleFills(newOrder.id, availableAmount, price);
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                availableAmount,
                side
              );
              await updateBalance(
                ask.userId,
                ask.baseAsset,
                ask.quoteAsset,
                availableAmount,
                ask.side
              );
              await updateFilledAmount(newOrder.id, newFilledAmount);
              await updateFilledAmount(ask.id, ask.amount);
              await addHistoricalOrder(
                ask.userId,
                ask.orderType,
                ask.side,
                ask.baseAsset,
                ask.quoteAsset,
                ask.price,
                ask.amount,
                "completed"
              );
              await completeOrder(ask.id);
              for (const bid of bids) {
                if (bid.id === newOrder.id) {
                  bid.filledAmount = newFilledAmount;
                  break;
                }
              }

              asks.shift();
            }
          }
          if (remainingSize > 0) {
            let amountToAdd = preciseSubtraction(
              newOrder.amount,
              remainingSize
            );
            const updatedFillAmount = preciseAddition(
              newOrder.filledAmount,
              amountToAdd
            );
            console.log(amountToAdd);

            newOrder.filledAmount = updatedFillAmount;
            bids.push(newOrder);
          } else {
            await completeOrder(newOrder.id);
          }
        }
        updateOrderBook();
      }
    } catch (err) {
      console.error("order failed", err);
    }
  });
});

function sortAsks() {
  asks.sort((a, b) => +a.price - +b.price);
}
function sortBids() {
  bids.sort((a, b) => +b.price - +a.price);
}
function showOrderBook() {
  const message = JSON.stringify({
    type: "order_book",
    asks,
    bids,
  });

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function updateOrderBook() {
  sortAsks();
  sortBids();
  showOrderBook();
}

async function marketBuy(newOrder: InitialOrder) {
  let remainingSize = newOrder.amount;

  while (asks.length > 0 && remainingSize > 0) {
    const ask = asks[0];
    const availableAmount = preciseSubtraction(ask.amount, ask.filledAmount);

    if (availableAmount <= remainingSize) {
      await handleFills(ask.id, availableAmount, ask.price);
      await handleFills(newOrder.id, availableAmount, ask.price);

      await updateFilledAmount(ask.id, ask.amount);

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        availableAmount,
        ask.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side
      );

      await addHistoricalOrder(
        ask.userId,
        ask.orderType,
        ask.side,
        ask.baseAsset,
        ask.quoteAsset,
        ask.price,
        ask.amount,
        "completed"
      );

      await completeOrder(ask.id);

      asks.shift();
      const newRemainingSize = preciseSubtraction(
        remainingSize,
        availableAmount
      );
      remainingSize = newRemainingSize;
    } else {
      const newFilledAmount = preciseAddition(ask.filledAmount, remainingSize);

      await handleFills(ask.id, remainingSize, ask.price);
      await handleFills(newOrder.id, remainingSize, ask.price);

      await updateFilledAmount(ask.id, newFilledAmount);
      await updateFilledAmount(newOrder.id, newOrder.amount);

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        remainingSize,
        ask.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize,
        newOrder.side
      );
      await completeMarketOrder(newOrder.id, ask.price);
      ask.filledAmount = newFilledAmount;
      remainingSize = 0;
    }
  }
  if (remainingSize >= "0") {
    const finalFilledAmount = preciseSubtraction(
      newOrder.amount,
      remainingSize
    );
    await updateFilledAmount(newOrder.id, finalFilledAmount);
  }

  if (parseFloat(remainingSize) > 0) {
    throw new Error("Market buy could not be fully fulfilled");
  }

  updateOrderBook();
}

async function marketSell(newOrder: InitialOrder) {
  let remainingSize = newOrder.amount;

  while (bids.length > 0 && remainingSize > 0) {
    const bid = bids[0];
    const availableAmount = preciseSubtraction(bid.amount, bid.filledAmount);

    if (availableAmount <= remainingSize) {
      await handleFills(bid.id, availableAmount, bid.price);
      await handleFills(newOrder.id, availableAmount, bid.price);

      await updateFilledAmount(bid.id, bid.amount);

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        availableAmount,
        bid.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side
      );

      await addHistoricalOrder(
        bid.userId,
        bid.orderType,
        bid.side,
        bid.baseAsset,
        bid.quoteAsset,
        bid.price,
        bid.amount,
        "completed"
      );

      await completeOrder(bid.id);
      if (availableAmount === remainingSize) {
        await completeMarketOrder(newOrder.id, bid.price);
        remainingSize = 0;
      }
      bids.shift();
      let newRemainingSize = preciseSubtraction(remainingSize, availableAmount);
      remainingSize = newRemainingSize;
    } else {
      const newFilledAmount = preciseAddition(bid.filledAmount, remainingSize);

      await handleFills(bid.id, remainingSize, bid.price);
      await handleFills(newOrder.id, remainingSize, bid.price);

      await updateFilledAmount(bid.id, newFilledAmount);
      await updateFilledAmount(newOrder.id, newOrder.amount);

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        remainingSize,
        bid.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize,
        newOrder.side
      );

      await completeMarketOrder(newOrder.id, bid.price);
      bid.filledAmount = newFilledAmount;
      remainingSize = 0;
    }
  }
  if (remainingSize >= "0") {
    const finalFilledAmount = preciseSubtraction(
      newOrder.amount,
      remainingSize
    );
    await updateFilledAmount(newOrder.id, finalFilledAmount);
  }

  if (remainingSize > 0) {
    throw new Error("Market sell could not be fully fulfilled");
  }

  updateOrderBook();
}
