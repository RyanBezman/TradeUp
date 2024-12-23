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
          amount: parseFloat(amount).toFixed(4),
          filledAmount,
          status,
        });
        if (orderType === "market") {
          if (side === "buy") {
            await marketBuy(newOrder);
          } else if (side === "sell") {
            await marketSell(newOrder);
          }
        }
        if (orderType === "limit" && side === "sell") {
          let remainingSize = parseFloat(amount);

          while (
            bids[0] &&
            parseFloat(bids[0].price) >= parseFloat(price) &&
            remainingSize > 0
          ) {
            const availableAmount =
              parseFloat(bids[0].amount) - parseFloat(bids[0].filledAmount);
            if (availableAmount === remainingSize) {
              await addHistoricalOrder(
                bids[0].userId,
                bids[0].orderType,
                bids[0].side,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                bids[0].price,
                bids[0].amount,
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
              await handleFills(bids[0].id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newOrder.amount)
              );
              await updateFilledAmount(bids[0].id, parseFloat(bids[0].amount));

              await updateBalance(
                bids[0].userId,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                availableAmount.toFixed(4),
                bids[0].side
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount.toFixed(4),
                newOrder.side
              );

              await completeOrder(bids[0].id);
              await completeOrder(newOrder.id);

              bids.shift();
              remainingSize = 0;
            } else if (availableAmount > remainingSize) {
              const newFilledAmount = (
                parseFloat(bids[0].filledAmount) + remainingSize
              ).toFixed(4);
              await updateFilledAmount(bids[0].id, parseFloat(newFilledAmount));
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newOrder.amount)
              );
              await handleFills(bids[0].id, amount, price);
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
                parseFloat(amount).toFixed(4),
                side
              );
              await updateBalance(
                bids[0].userId,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                parseFloat(amount).toFixed(4),
                bids[0].side
              );

              bids[0].filledAmount = newFilledAmount;

              remainingSize = 0;
            } else {
              remainingSize -= availableAmount;
              const newFilledAmount = (
                parseFloat(newOrder.amount) - remainingSize
              ).toFixed(4);
              await handleFills(bids[0].id, availableAmount.toString(), price);
              await handleFills(newOrder.id, availableAmount.toString(), price);
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                availableAmount.toFixed(4),
                side
              );
              await updateBalance(
                bids[0].userId,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                availableAmount.toFixed(4),
                bids[0].side
              );
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newFilledAmount)
              );
              await updateFilledAmount(bids[0].id, parseFloat(bids[0].amount));
              await addHistoricalOrder(
                bids[0].userId,
                bids[0].orderType,
                bids[0].side,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                bids[0].price,
                bids[0].amount,
                "completed"
              );
              await completeOrder(bids[0].id);
              for (const ask of asks) {
                if (ask.id === newOrder.id) {
                  ask.filledAmount = newFilledAmount.toString();
                  break;
                }
              }

              bids.shift();
            }
          }
          if (remainingSize > 0) {
            const updatedFillAmount =
              parseFloat(newOrder.filledAmount) +
              (parseFloat(newOrder.amount) - remainingSize);
            newOrder.filledAmount = updatedFillAmount.toString();
            asks.push(newOrder);
          } else {
            await completeOrder(newOrder.id);
          }
        } else if (orderType === "limit" && side === "buy") {
          let remainingSize = parseFloat(amount);

          while (
            asks[0] &&
            parseFloat(asks[0].price) <= parseFloat(price) &&
            remainingSize > 0
          ) {
            const availableAmount =
              parseFloat(asks[0].amount) - parseFloat(asks[0].filledAmount);
            if (availableAmount === remainingSize) {
              await addHistoricalOrder(
                asks[0].userId,
                asks[0].orderType,
                asks[0].side,
                asks[0].baseAsset,
                asks[0].quoteAsset,
                asks[0].price,
                asks[0].amount,
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
                asks[0].userId,
                asks[0].baseAsset,
                asks[0].quoteAsset,
                availableAmount.toFixed(4),
                asks[0].side
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount.toFixed(4),
                newOrder.side
              );
              await handleFills(asks[0].id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newOrder.amount)
              );
              await updateFilledAmount(asks[0].id, parseFloat(asks[0].amount));

              await completeOrder(asks[0].id);
              await completeOrder(newOrder.id);

              asks.shift();
              remainingSize = 0;
            } else if (availableAmount > remainingSize) {
              const newFilledAmount = (
                parseFloat(asks[0].filledAmount) + remainingSize
              ).toFixed(4);
              await updateFilledAmount(asks[0].id, parseFloat(newFilledAmount));
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newOrder.amount)
              );
              await handleFills(asks[0].id, amount, price);
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
                parseFloat(amount).toFixed(4),
                side
              );
              await updateBalance(
                asks[0].userId,
                asks[0].baseAsset,
                asks[0].quoteAsset,
                parseFloat(amount).toFixed(4),
                asks[0].side
              );

              asks[0].filledAmount = newFilledAmount;

              remainingSize = 0;
            } else {
              remainingSize -= availableAmount;
              const newFilledAmount = (
                parseFloat(newOrder.amount) - remainingSize
              ).toFixed(4);
              await handleFills(asks[0].id, availableAmount.toString(), price);
              await handleFills(newOrder.id, availableAmount.toString(), price);
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                availableAmount.toFixed(4),
                side
              );
              await updateBalance(
                asks[0].userId,
                asks[0].baseAsset,
                asks[0].quoteAsset,
                availableAmount.toFixed(4),
                asks[0].side
              );
              await updateFilledAmount(
                newOrder.id,
                parseFloat(newFilledAmount)
              );
              await updateFilledAmount(asks[0].id, parseFloat(asks[0].amount));
              await addHistoricalOrder(
                asks[0].userId,
                asks[0].orderType,
                asks[0].side,
                asks[0].baseAsset,
                asks[0].quoteAsset,
                asks[0].price,
                asks[0].amount,
                "completed"
              );
              await completeOrder(asks[0].id);
              for (const bid of bids) {
                if (bid.id === newOrder.id) {
                  bid.filledAmount = newFilledAmount.toString();
                  break;
                }
              }

              asks.shift();
            }
          }
          if (remainingSize > 0) {
            const updatedFillAmount =
              parseFloat(newOrder.filledAmount) +
              (parseFloat(newOrder.amount) - remainingSize);
            newOrder.filledAmount = updatedFillAmount.toString();
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
  let remainingSize = parseFloat(newOrder.amount);

  while (asks.length > 0 && remainingSize > 0) {
    const ask = asks[0];
    const availableAmount =
      parseFloat(ask.amount) - parseFloat(ask.filledAmount);

    if (availableAmount <= remainingSize) {
      await handleFills(ask.id, availableAmount.toFixed(4), ask.price);
      await handleFills(newOrder.id, availableAmount.toFixed(4), ask.price);

      await updateFilledAmount(ask.id, parseFloat(ask.amount));
      await updateFilledAmount(
        newOrder.id,
        parseFloat(newOrder.amount) - remainingSize + availableAmount
      );

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        availableAmount.toFixed(4),
        ask.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount.toFixed(4),
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
      remainingSize -= availableAmount;
    } else {
      const newFilledAmount = (
        parseFloat(ask.filledAmount) + remainingSize
      ).toFixed(4);

      await handleFills(ask.id, remainingSize.toFixed(4), ask.price);
      await handleFills(newOrder.id, remainingSize.toFixed(4), ask.price);

      await updateFilledAmount(ask.id, parseFloat(newFilledAmount));
      await updateFilledAmount(newOrder.id, parseFloat(newOrder.amount));

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        remainingSize.toFixed(4),
        ask.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize.toFixed(4),
        newOrder.side
      );
      await completeMarketOrder(newOrder.id, ask.price);
      ask.filledAmount = newFilledAmount;
      remainingSize = 0;
    }
  }

  if (remainingSize > 0) {
    throw new Error("Market buy could not be fully fulfilled");
  }

  updateOrderBook();
}

async function marketSell(newOrder: InitialOrder) {
  let remainingSize = parseFloat(newOrder.amount);

  while (bids.length > 0 && remainingSize > 0) {
    const bid = bids[0];
    const availableAmount =
      parseFloat(bid.amount) - parseFloat(bid.filledAmount);

    if (availableAmount <= remainingSize) {
      await handleFills(bid.id, availableAmount.toFixed(4), bid.price);
      await handleFills(newOrder.id, availableAmount.toFixed(4), bid.price);

      await updateFilledAmount(bid.id, parseFloat(bid.amount));
      await updateFilledAmount(
        newOrder.id,
        parseFloat(newOrder.amount) - remainingSize + availableAmount
      );

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        availableAmount.toFixed(4),
        bid.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount.toFixed(4),
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
        break;
      }
      bids.shift();
      remainingSize -= availableAmount;
    } else {
      const newFilledAmount = (
        parseFloat(bid.filledAmount) + remainingSize
      ).toFixed(4);

      await handleFills(bid.id, remainingSize.toFixed(4), bid.price);
      await handleFills(newOrder.id, remainingSize.toFixed(4), bid.price);

      await updateFilledAmount(bid.id, parseFloat(newFilledAmount));
      await updateFilledAmount(newOrder.id, parseFloat(newOrder.amount));

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        remainingSize.toFixed(4),
        bid.side
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize.toFixed(4),
        newOrder.side
      );

      await completeMarketOrder(newOrder.id, bid.price);
      bid.filledAmount = newFilledAmount;
      remainingSize = 0;
    }
  }

  if (remainingSize > 0) {
    throw new Error("Market sell could not be fully fulfilled");
  }

  updateOrderBook();
}
