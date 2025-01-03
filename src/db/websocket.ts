"use server";
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
import { getOneBalance } from "@/actions/balance/getOneBalance";
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
  orderBook: string;
  status: string;
};
let asks: InitialOrder[] = [];
let bids: InitialOrder[] = [];

const orderBooks: Record<
  string,
  { asks: InitialOrder[]; bids: InitialOrder[] }
> = {
  "BTC-ETH": { asks: [], bids: [] },
  "BTC-XRP": { asks: [], bids: [] },
  "BTC-SOL": { asks: [], bids: [] },
  "BTC-USD": { asks: [], bids: [] },
  "ETH-BTC": { asks: [], bids: [] },
  "ETH-XRP": { asks: [], bids: [] },
  "ETH-SOL": { asks: [], bids: [] },
  "ETH-USD": { asks: [], bids: [] },
  "XRP-BTC": { asks: [], bids: [] },
  "XRP-ETH": { asks: [], bids: [] },
  "XRP-SOL": { asks: [], bids: [] },
  "XRP-USD": { asks: [], bids: [] },
  "SOL-BTC": { asks: [], bids: [] },
  "SOL-ETH": { asks: [], bids: [] },
  "SOL-XRP": { asks: [], bids: [] },
  "SOL-USD": { asks: [], bids: [] },
  "USD-BTC": { asks: [], bids: [] },
  "USD-ETH": { asks: [], bids: [] },
  "USD-XRP": { asks: [], bids: [] },
  "USD-SOL": { asks: [], bids: [] },
};
type ClientConection = {
  [id: number]: string;
};
const clientConnection: ClientConection = {};
async function initializeOrderBook() {
  try {
    const allOrders = await getAllOrders();

    for (const order of allOrders) {
      const book = order.orderBook;
      if (order.side === "sell" && order.status === "pending") {
        orderBooks[book].asks.push(order);
      } else if (order.side === "buy" && order.status === "pending") {
        orderBooks[book].bids.push(order);
      }
    }

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
export function preciseMultiplication(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 8);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) *
      Math.round(parseFloat(value2) * scaleNumber)) /
    Math.pow(scaleNumber, 2);

  return answer.toString();
}

initializeOrderBook();

wss.on("connection", (ws: any) => {
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
        orderBook,
        status,
      } = data;
      if (data.type === "subscribe") {
        const { pair, id } = data;
        clientConnection[id] = pair;
        const currPair: string = clientConnection[id];
        const book = orderBooks[currPair];

        ws.send(
          JSON.stringify({
            type: "order_book",
            asks: book.asks,
            bids: book.bids,
          })
        );
      } else if (data.type === "new_order") {
        const quoteAssetBalance = await getOneBalance(id, quoteAsset);
        const baseAssetBalance = await getOneBalance(id, baseAsset);

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
          orderBook,
        });
        if (orderType === "market") {
          if (side === "buy") {
            await marketBuy(newOrder, id);
          } else if (side === "sell") {
            await marketSell(newOrder, id);
          }
        } else if (orderType === "limit" && side === "sell") {
          let remainingSize = amount;
          const currBook = clientConnection[id];
          const currBids = orderBooks[currBook].bids;

          while (
            currBids[0] &&
            currBids[0].price >= price &&
            remainingSize > 0
          ) {
            let bid = currBids[0];
            const availableAmount = preciseSubtraction(
              bid.amount,
              bid.filledAmount
            );

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
                bid.side,
                bid.price
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount,
                newOrder.side,
                bid.price
              );

              await completeOrder(bid.id);
              await completeOrder(newOrder.id);

              currBids.shift();
              remainingSize = 0;
            } else if (availableAmount > remainingSize) {
              const newFilledAmount = preciseAddition(
                bid.filledAmount,
                remainingSize
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
                side,
                bid.price
              );
              await updateBalance(
                bid.userId,
                bid.baseAsset,
                bid.quoteAsset,
                remainingSize,
                bid.side,
                bid.price
              );

              bid.filledAmount = newFilledAmount;

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

              await handleFills(bid.id, availableAmount, price);
              await handleFills(newOrder.id, availableAmount, price);
              await updateBalance(
                id,
                baseAsset,
                quoteAsset,
                availableAmount,
                side,
                bid.price
              );
              await updateBalance(
                bid.userId,
                bid.baseAsset,
                bid.quoteAsset,
                availableAmount,
                bid.side,
                bid.price
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
              for (const ask of orderBooks[currBook].asks) {
                if (ask.id === newOrder.id) {
                  ask.filledAmount = newFilledAmount;
                  break;
                }
              }

              currBids.shift();
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
            orderBooks[currBook].asks.push(newOrder);
          } else {
            await completeOrder(newOrder.id);
          }
        } else if (orderType === "limit" && side === "buy") {
          let remainingSize = amount;
          const currBook = clientConnection[id];
          console.log(clientConnection);
          console.log(currBook);
          const currAsks = orderBooks[currBook].asks;
          while (
            currAsks[0] &&
            currAsks[0].price <= price &&
            remainingSize > 0
          ) {
            let ask = currAsks[0];

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
                ask.side,
                newOrder.price
              );

              await updateBalance(
                newOrder.userId,
                newOrder.baseAsset,
                newOrder.quoteAsset,
                availableAmount,
                newOrder.side,
                newOrder.price
              );
              await handleFills(ask.id, amount, price);
              await handleFills(newOrder.id, amount, price);
              await updateFilledAmount(newOrder.id, newOrder.amount);
              await updateFilledAmount(ask.id, ask.amount);

              await completeOrder(ask.id);
              await completeOrder(newOrder.id);

              currAsks.shift();
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
                side,
                newOrder.price
              );
              await updateBalance(
                ask.userId,
                ask.baseAsset,
                ask.quoteAsset,
                remainingSize,
                ask.side,
                newOrder.price
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
                side,
                newOrder.price
              );
              await updateBalance(
                ask.userId,
                ask.baseAsset,
                ask.quoteAsset,
                availableAmount,
                ask.side,
                newOrder.price
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
              for (const bid of orderBooks[currBook].bids) {
                if (bid.id === newOrder.id) {
                  bid.filledAmount = newFilledAmount;
                  break;
                }
              }

              currAsks.shift();
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
            orderBooks[currBook].bids.push(newOrder);
          } else {
            await completeOrder(newOrder.id);
          }
        }
        updateOrderBook(id);
      }
    } catch (err) {
      console.error("order failed", err);
    }
  });
});

function sortAsks(book: string) {
  const asksToSort = orderBooks[book].asks;
  asksToSort.sort((a, b) => +a.price - +b.price);
}
function sortBids(book: string) {
  const bidsToSort = orderBooks[book].bids;
  bidsToSort.sort((a, b) => +b.price - +a.price);
}
function showOrderBook(book: string) {
  const asksToShow = orderBooks[book].asks;
  const bidsToShow = orderBooks[book].bids;
  const message = JSON.stringify({
    type: "order_book",
    asks: asksToShow,
    bids: bidsToShow,
  });

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function updateOrderBook(id: number) {
  const book = clientConnection[id];
  sortAsks(book);
  sortBids(book);
  showOrderBook(book);
}

async function marketBuy(newOrder: InitialOrder, id: number) {
  let remainingSize = newOrder.amount;
  const currBook = clientConnection[id];
  const currAsks = orderBooks[currBook].asks;
  while (currAsks.length > 0 && remainingSize > 0) {
    const ask = currAsks[0];
    const availableAmount = preciseSubtraction(ask.amount, ask.filledAmount);

    if (availableAmount === remainingSize) {
      await handleFills(ask.id, availableAmount, ask.price);
      await handleFills(newOrder.id, availableAmount, ask.price);

      await updateFilledAmount(ask.id, ask.amount);
      await updateFilledAmount(newOrder.id, newOrder.amount);

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        availableAmount,
        ask.side,
        ask.price
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side,
        ask.price
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

      await addHistoricalOrder(
        newOrder.userId,
        newOrder.orderType,
        newOrder.side,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        ask.price,
        newOrder.amount,
        "completed"
      );

      await completeOrder(ask.id);
      await completeMarketOrder(newOrder.id, ask.price);

      currAsks.shift();
      remainingSize = 0;
    } else if (availableAmount < remainingSize) {
      await handleFills(ask.id, availableAmount, ask.price);
      await handleFills(newOrder.id, availableAmount, ask.price);

      await updateFilledAmount(ask.id, ask.amount);

      await updateBalance(
        ask.userId,
        ask.baseAsset,
        ask.quoteAsset,
        availableAmount,
        ask.side,
        ask.price
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side,
        ask.price
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

      currAsks.shift();
      const newRemainingSize = preciseSubtraction(
        remainingSize,
        availableAmount
      );
      if (asks.length === 0) {
        const marketFilledAmount = preciseSubtraction(
          newOrder.amount,
          newRemainingSize
        );
        await addHistoricalOrder(
          newOrder.userId,
          newOrder.orderType,
          newOrder.side,
          newOrder.baseAsset,
          newOrder.quoteAsset,
          ask.price,
          marketFilledAmount,
          "completed"
        );
        await completeMarketOrder(newOrder.id, ask.price);
        updateOrderBook(id);
      }
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
        ask.side,
        ask.price
      );

      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize,
        newOrder.side,
        ask.price
      );

      await addHistoricalOrder(
        newOrder.userId,
        newOrder.orderType,
        newOrder.side,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        ask.price,
        newOrder.amount,
        "completed"
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

  updateOrderBook(id);
}

async function marketSell(newOrder: InitialOrder, id: number) {
  let remainingSize = newOrder.amount;
  const currBook = clientConnection[id];
  const currBids = orderBooks[currBook].bids;
  while (currBids.length > 0 && remainingSize > 0) {
    const bid = currBids[0];
    const availableAmount = preciseSubtraction(bid.amount, bid.filledAmount);

    if (availableAmount === remainingSize) {
      await handleFills(bid.id, availableAmount, bid.price);
      await handleFills(newOrder.id, availableAmount, bid.price);

      await updateFilledAmount(bid.id, bid.amount);
      await updateFilledAmount(newOrder.id, newOrder.amount);

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        availableAmount,
        bid.side,
        bid.price
      );
      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side,
        bid.price
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
      await addHistoricalOrder(
        newOrder.userId,
        newOrder.orderType,
        newOrder.side,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        bid.price,
        newOrder.amount,
        "completed"
      );

      await completeOrder(bid.id);
      await completeMarketOrder(newOrder.id, bid.price);

      currBids.shift();

      remainingSize = "0";
    } else if (availableAmount < remainingSize) {
      await handleFills(bid.id, availableAmount, bid.price);
      await handleFills(newOrder.id, availableAmount, bid.price);

      await updateFilledAmount(bid.id, bid.amount);

      await updateBalance(
        bid.userId,
        bid.baseAsset,
        bid.quoteAsset,
        availableAmount,
        bid.side,
        bid.price
      );
      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        availableAmount,
        newOrder.side,
        bid.price
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

      currBids.shift();

      const newRemainingSize = preciseSubtraction(
        remainingSize,
        availableAmount
      );
      if (bids.length === 0) {
        const marketFilledAmount = preciseSubtraction(
          newOrder.amount,
          newRemainingSize
        );
        await addHistoricalOrder(
          newOrder.userId,
          newOrder.orderType,
          newOrder.side,
          newOrder.baseAsset,
          newOrder.quoteAsset,
          bid.price,
          marketFilledAmount,
          "completed"
        );
        await completeMarketOrder(newOrder.id, bid.price);
        updateOrderBook(id);
      }
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
        bid.side,
        bid.price
      );
      await updateBalance(
        newOrder.userId,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        remainingSize,
        newOrder.side,
        bid.price
      );

      await addHistoricalOrder(
        newOrder.userId,
        newOrder.orderType,
        newOrder.side,
        newOrder.baseAsset,
        newOrder.quoteAsset,
        bid.price,
        newOrder.amount,
        "completed"
      );

      await completeMarketOrder(newOrder.id, bid.price);

      bid.filledAmount = newFilledAmount;

      remainingSize = "0";
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
    throw new Error("Market sell could not be fully fulfilled");
  }

  updateOrderBook(id);
}
