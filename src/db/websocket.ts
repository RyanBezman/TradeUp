"use server";
// @ts-expect-error websoket improt is broken
import { WebSocketServer, WebSocket } from "ws";
import { addNewOrder } from "../actions/orders/addNewOrder";
import { getAllOrders } from "@/actions/orders/getAllOrders";
import { updateFilledAmount } from "@/actions/orders/updateFilledAmount";
import { handleFills } from "@/actions/orders/handleFills";
import { addHistoricalOrder } from "@/actions/orders/addHistoricalOrder";
import { updateBalance } from "@/actions/balance/updateBalance";
import { completeOrder } from "@/actions/orders/completeOrder";
import { completeMarketOrder } from "@/actions/orders/completeMarketOrder";
import { getTradeHistory } from "@/actions/orders/getTradeHistory";
import { getOneBalance } from "@/actions/balance/getOneBalance";
import http from "http";
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
  const scaleNumber = Math.pow(10, 20);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) *
      Math.round(parseFloat(value2) * scaleNumber)) /
    Math.pow(scaleNumber, 2);

  return answer.toString();
}
export function preciseDivision(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 20);
  const scaledValue1 = Math.round(parseFloat(value1) * scaleNumber);
  const scaledValue2 = Math.round(parseFloat(value2) * scaleNumber);

  if (scaledValue2 === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  const answer = scaledValue1 / scaledValue2;

  return answer.toString();
}
const server = http.createServer();
const wss = new WebSocketServer({ server });
console.log("Websocket server started on ws://localhost:8443");
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
export type HistoricalOrder = {
  id: number;
  userId: number;
  side: string;
  orderType: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  amount: string;
  createdAt: Date;
  status: string;
};

type LocalHistoricalOrders = {
  id?: number;
  userId?: number;
  side: string;
  orderType?: string;
  baseAsset?: string;
  quoteAsset?: string;
  price: string;
  amount: string;
  createdAt: Date;
  status?: string;
};
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
const tradeHistoryBooks: Record<string, { orders: LocalHistoricalOrders[] }> = {
  "BTC-ETH": { orders: [] },
  "BTC-XRP": { orders: [] },
  "BTC-SOL": { orders: [] },
  "BTC-USD": { orders: [] },
  "ETH-BTC": { orders: [] },
  "ETH-XRP": { orders: [] },
  "ETH-SOL": { orders: [] },
  "ETH-USD": { orders: [] },
  "XRP-BTC": { orders: [] },
  "XRP-ETH": { orders: [] },
  "XRP-SOL": { orders: [] },
  "XRP-USD": { orders: [] },
  "SOL-BTC": { orders: [] },
  "SOL-ETH": { orders: [] },
  "SOL-XRP": { orders: [] },
  "SOL-USD": { orders: [] },
  "USD-BTC": { orders: [] },
  "USD-ETH": { orders: [] },
  "USD-XRP": { orders: [] },
  "USD-SOL": { orders: [] },
};
type ClientConection = {
  [id: number]: string;
};
const clientConnection: ClientConection = {};
async function initializeOrderBook() {
  try {
    const allOrders = await getAllOrders();
    const tradeHistory = await getTradeHistory();

    for (const order of allOrders) {
      const book = order.orderBook;
      if (order.side === "sell" && order.status === "pending") {
        orderBooks[book].asks.push(order);
      } else if (order.side === "buy" && order.status === "pending") {
        orderBooks[book].bids.push(order);
      }
    }
    for (const trade of tradeHistory) {
      const book = `${trade.baseAsset}-${trade.quoteAsset}`;
      tradeHistoryBooks[book].orders.push(trade);
    }

    console.log("Initialized Orderbook");
  } catch (error) {
    console.error("falied to initialize orderbook ", error);
  }
}

initializeOrderBook();

wss.on("connection", (ws: WebSocket) => {
  ws.send("Hello from WebSocket server!");
  ws.on("message", async (message: WebSocket.RawData) => {
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
        ws.subscribedPair = pair;
        clientConnection[id] = pair;
        const currPair: string = clientConnection[id];
        const book = orderBooks[currPair];
        const tradeHistory = tradeHistoryBooks[currPair].orders;

        ws.send(
          JSON.stringify({
            type: "order_book",
            asks: book.asks,
            bids: book.bids,
            tradeHistory: tradeHistory,
          })
        );
      } else if (data.type === "new_order") {
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

          for (let i = 0; i < currBids.length && remainingSize > 0; ) {
            const bid = currBids[i];
            if (+bid.price < +price) {
              break;
            }
            if (bid.userId === newOrder.userId) {
              i++;
              continue;
            }
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
                bid.price,
                newOrder.amount,
                "completed"
              );
              tradeHistoryBooks[currBook].orders.unshift({
                amount: bid.amount,
                price: bid.price,
                side: bid.side,
                createdAt: new Date(),
              });
              tradeHistoryBooks[currBook].orders.unshift({
                amount: newOrder.amount,
                price: bid.price,
                side: newOrder.side,
                createdAt: new Date(),
              });
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

              currBids.splice(i, 1);
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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: amount,
                price: price,
                side: side,
                createdAt: new Date(),
              });
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
              const newRemainingSize = preciseSubtraction(
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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: bid.amount,
                price: bid.price,
                side: bid.side,
                createdAt: new Date(),
              });
              await completeOrder(bid.id);
              for (const ask of orderBooks[currBook].asks) {
                if (ask.id === newOrder.id) {
                  ask.filledAmount = newFilledAmount;
                  break;
                }
              }

              currBids.splice(i, 1);
            }
          }
          if (remainingSize > 0) {
            const amountFilled = preciseSubtraction(
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
          const currAsks = orderBooks[currBook].asks;

          const currentQuoteAssetBalance = await getOneBalance(
            newOrder.userId,
            newOrder.quoteAsset
          );
          const expectedPurchaseAmount = +preciseMultiplication(
            newOrder.amount,
            newOrder.price
          );
          if (currentQuoteAssetBalance === null) {
            return;
          }

          if (+currentQuoteAssetBalance < expectedPurchaseAmount) {
            return;
          }
          for (let i = 0; i < currAsks.length && remainingSize > 0; ) {
            const ask = currAsks[i];
            if (+ask.price > +newOrder.price) {
              break;
            }
            if (ask.userId === newOrder.userId) {
              i++;
              continue;
            }

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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: ask.amount,
                price: ask.price,
                side: ask.side,
                createdAt: new Date(),
              });

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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: newOrder.amount,
                price: ask.price,
                side: newOrder.side,
                createdAt: new Date(),
              });
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

              currAsks.splice(i, 1);
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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: amount,
                price: price,
                side: side,
                createdAt: new Date(),
              });
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
              const newRemainingSize = preciseSubtraction(
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
              tradeHistoryBooks[currBook].orders.unshift({
                amount: ask.amount,
                price: ask.price,
                side: ask.side,
                createdAt: new Date(),
              });
              await completeOrder(ask.id);
              for (const bid of orderBooks[currBook].bids) {
                if (bid.id === newOrder.id) {
                  bid.filledAmount = newFilledAmount;
                  break;
                }
              }

              currAsks.splice(i, 1);
            }
          }
          if (remainingSize > 0) {
            const amountToAdd = preciseSubtraction(
              newOrder.amount,
              remainingSize
            );
            const updatedFillAmount = preciseAddition(
              newOrder.filledAmount,
              amountToAdd
            );

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
  const tradeHistory = tradeHistoryBooks[book].orders;
  const message = JSON.stringify({
    type: "order_book",
    pair: book,
    asks: asksToShow,
    bids: bidsToShow,
    tradeHistory: tradeHistory,
  });

  wss.clients.forEach((client: WebSocket) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.subscribedPair === book
    ) {
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
  let partialFill = false;

  const balanceInfo = await getOneBalance(newOrder.userId, newOrder.quoteAsset);
  if (
    balanceInfo === undefined ||
    balanceInfo?.balance === undefined ||
    +balanceInfo.balance <= 0
  ) {
    return;
  }
  let currentQuoteAssetBalance = +balanceInfo.balance;
  for (
    let i = 0;
    i < currAsks.length && +remainingSize > 0 && partialFill === false;

  ) {
    const ask = currAsks[i];

    if (ask.userId === newOrder.userId) {
      i++;
      continue;
    }
    const availableAmount = preciseSubtraction(ask.amount, ask.filledAmount);

    if (availableAmount === remainingSize) {
      const transactionCost = +preciseMultiplication(
        availableAmount,
        ask.price
      );
      if (transactionCost > +currentQuoteAssetBalance) {
        const affordableAmount = preciseDivision(
          currentQuoteAssetBalance.toString(),
          ask.price
        );
        const newFilledAmount = preciseAddition(
          ask.filledAmount,
          affordableAmount
        );
        await handleFills(ask.id, affordableAmount, ask.price);
        await handleFills(newOrder.id, affordableAmount, ask.price);
        await updateFilledAmount(ask.id, newFilledAmount);
        await updateBalance(
          ask.userId,
          ask.baseAsset,
          ask.quoteAsset,
          affordableAmount,
          ask.side,
          ask.price
        );

        await updateBalance(
          newOrder.userId,
          newOrder.baseAsset,
          newOrder.quoteAsset,
          affordableAmount,
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
          affordableAmount,
          "completed"
        );
        tradeHistoryBooks[currBook].orders.unshift({
          amount: affordableAmount,
          price: ask.price,
          side: newOrder.side,
          createdAt: new Date(),
        });
        await completeMarketOrder(newOrder.id, ask.price);

        const finalFilledAmount = preciseAddition(
          newOrder.filledAmount,
          affordableAmount
        );
        await updateFilledAmount(newOrder.id, finalFilledAmount);
        ask.filledAmount = newFilledAmount;
        partialFill = true;
        return;
      } else {
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
        // amount price side date
        tradeHistoryBooks[currBook].orders.unshift({
          amount: ask.amount,
          price: ask.price,
          side: ask.side,
          createdAt: new Date(),
        });
        tradeHistoryBooks[currBook].orders.unshift({
          amount: newOrder.amount,
          price: ask.price,
          side: newOrder.side,
          createdAt: new Date(),
        });
        await completeOrder(ask.id);
        await completeMarketOrder(newOrder.id, ask.price);

        currAsks.splice(i, 1);
        remainingSize = "0";
      }
    } else if (availableAmount < remainingSize) {
      const transactionCost = preciseMultiplication(availableAmount, ask.price);
      if (currentQuoteAssetBalance < +transactionCost) {
        const affordableAmount = preciseDivision(
          currentQuoteAssetBalance.toString(),
          ask.price
        );
        const newFilledAmount = preciseAddition(
          ask.filledAmount,
          affordableAmount
        );
        await handleFills(ask.id, affordableAmount, ask.price);
        await handleFills(newOrder.id, affordableAmount, ask.price);
        await updateFilledAmount(ask.id, affordableAmount);
        await updateBalance(
          ask.userId,
          ask.baseAsset,
          ask.quoteAsset,
          affordableAmount,
          ask.side,
          ask.price
        );

        await updateBalance(
          newOrder.userId,
          newOrder.baseAsset,
          newOrder.quoteAsset,
          affordableAmount,
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
          affordableAmount,
          "completed"
        );
        tradeHistoryBooks[currBook].orders.unshift({
          amount: affordableAmount,
          price: ask.price,
          side: newOrder.side,
          createdAt: new Date(),
        });
        await completeMarketOrder(newOrder.id, ask.price);
        const finalFilledAmount = preciseAddition(
          newOrder.filledAmount,
          affordableAmount
        );
        await updateFilledAmount(newOrder.id, finalFilledAmount);
        ask.filledAmount = newFilledAmount;
        partialFill = true;
        return;
      } else {
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
        tradeHistoryBooks[currBook].orders.unshift({
          amount: ask.amount,
          price: ask.price,
          side: ask.side,
          createdAt: new Date(),
        });
        await completeOrder(ask.id);

        currAsks.splice(i, 1);
        const newRemainingSize = preciseSubtraction(
          remainingSize,
          availableAmount
        );
        if (currAsks.length === 0) {
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
          tradeHistoryBooks[currBook].orders.unshift({
            amount: marketFilledAmount,
            price: ask.price,
            side: newOrder.side,
            createdAt: new Date(),
          });
          await completeMarketOrder(newOrder.id, ask.price);
          updateOrderBook(id);
        }
        currentQuoteAssetBalance = +preciseSubtraction(
          currentQuoteAssetBalance.toString(),
          transactionCost
        );
        remainingSize = newRemainingSize;
      }
    } else {
      const transactionCost = +preciseMultiplication(remainingSize, ask.price);
      if (currentQuoteAssetBalance < transactionCost) {
        const affordableAmount = preciseDivision(
          currentQuoteAssetBalance.toString(),
          ask.price
        );
        const newFilledAmount = preciseAddition(
          ask.filledAmount,
          affordableAmount
        );
        const amountProcessed = preciseSubtraction(
          newOrder.amount,
          remainingSize
        );
        const totalFill = preciseAddition(amountProcessed, affordableAmount);
        await handleFills(ask.id, affordableAmount, ask.price);
        await handleFills(newOrder.id, affordableAmount, ask.price);
        await updateFilledAmount(ask.id, newFilledAmount);
        await updateFilledAmount(newOrder.id, affordableAmount);
        await updateBalance(
          ask.userId,
          ask.baseAsset,
          ask.quoteAsset,
          affordableAmount,
          ask.side,
          ask.price
        );

        await updateBalance(
          newOrder.userId,
          newOrder.baseAsset,
          newOrder.quoteAsset,
          affordableAmount,
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
          totalFill,
          "completed"
        );
        tradeHistoryBooks[currBook].orders.unshift({
          amount: totalFill,
          price: ask.price,
          side: newOrder.side,
          createdAt: new Date(),
        });

        await completeMarketOrder(newOrder.id, ask.price);
        const finalFilledAmount = preciseAddition(
          newOrder.filledAmount,
          affordableAmount
        );
        await updateFilledAmount(newOrder.id, finalFilledAmount);
        ask.filledAmount = newFilledAmount;
        partialFill = true;
        return;
      } else {
        const newFilledAmount = preciseAddition(
          ask.filledAmount,
          remainingSize
        );

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
        tradeHistoryBooks[currBook].orders.unshift({
          amount: newOrder.amount,
          price: ask.price,
          side: newOrder.side,
          createdAt: new Date(),
        });

        await completeMarketOrder(newOrder.id, ask.price);
        ask.filledAmount = newFilledAmount;
        remainingSize = "0";
      }
    }
  }
  if (remainingSize >= "0" && partialFill === false) {
    const finalFilledAmount = preciseSubtraction(
      newOrder.amount,
      remainingSize
    );

    await updateFilledAmount(newOrder.id, finalFilledAmount);
  }

  if (parseFloat(remainingSize) > 0 && partialFill === false) {
    throw new Error("Market buy could not be fully fulfilled");
  }

  updateOrderBook(id);
}

async function marketSell(newOrder: InitialOrder, id: number) {
  let remainingSize = newOrder.amount;
  const currBook = clientConnection[id];
  const currBids = orderBooks[currBook].bids;
  const usersBalance = await getOneBalance(newOrder.userId, newOrder.baseAsset);
  if (usersBalance === null) {
    return;
  }
  if (+newOrder.amount > +usersBalance) {
    return;
  }

  for (let i = 0; i < currBids.length && +remainingSize > 0; ) {
    const bid = currBids[i];

    if (bid.userId === newOrder.userId) {
      i++;
      continue;
    }
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
      tradeHistoryBooks[currBook].orders.unshift({
        amount: bid.amount,
        price: bid.price,
        side: bid.side,
        createdAt: new Date(),
      });
      tradeHistoryBooks[currBook].orders.unshift({
        amount: newOrder.amount,
        price: bid.price,
        side: newOrder.side,
        createdAt: new Date(),
      });
      await completeOrder(bid.id);
      await completeMarketOrder(newOrder.id, bid.price);

      currBids.splice(i, 1);

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
      tradeHistoryBooks[currBook].orders.unshift({
        amount: bid.amount,
        price: bid.price,
        side: bid.side,
        createdAt: new Date(),
      });
      await completeOrder(bid.id);

      currBids.splice(i, 1);

      const newRemainingSize = preciseSubtraction(
        remainingSize,
        availableAmount
      );
      if (currBids.length === 0) {
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
        tradeHistoryBooks[currBook].orders.unshift({
          amount: newOrder.amount,
          price: bid.price,
          side: newOrder.side,
          createdAt: new Date(),
        });
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
      tradeHistoryBooks[currBook].orders.unshift({
        amount: newOrder.amount,
        price: bid.price,
        side: newOrder.side,
        createdAt: new Date(),
      });
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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// function getRandomInt(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function getRandomFloat(min: number, max: number, decimals = 2): string {
//   const rand = Math.random() * (max - min) + min;
//   return rand.toFixed(decimals);
// }

// const possibleSides = ["buy", "sell"];

// setInterval(() => {
//   const pair = "BTC-USD";

//   const sideIndex = getRandomInt(0, possibleSides.length - 1);

//   const randomPrice = getRandomFloat(1, 100, 3);
//   const randomAmount = getRandomFloat(0.01, 2, 4);

//   const randomUserId = getRandomInt(1, 1000);

//   const newOrder: InitialOrder = {
//     id: getRandomInt(1, 999999999),
//     userId: randomUserId,
//     side: "buy",
//     orderType: "limit",
//     baseAsset: "BTC",
//     quoteAsset: "USD",
//     price: randomPrice,
//     amount: randomAmount,
//     filledAmount: "0",
//     orderBook: pair,
//     status: "pending",
//   };
//   const newOrderTwo: InitialOrder = {
//     id: getRandomInt(1, 999999999),
//     userId: randomUserId,
//     side: "sell",
//     orderType: "limit",
//     baseAsset: "BTC",
//     quoteAsset: "USD",
//     price: randomPrice,
//     amount: randomAmount,
//     filledAmount: "0",
//     orderBook: pair,
//     status: "pending",
//   };

//   orderBooks[pair].asks.unshift(newOrder);
//   orderBooks[pair].bids.unshift(newOrderTwo);

//   tradeHistoryBooks[pair].orders.unshift({
//     side: newOrder.side,
//     price: newOrder.price,
//     amount: newOrder.amount,
//     createdAt: new Date(),
//   });
//   tradeHistoryBooks[pair].orders.unshift({
//     side: newOrderTwo.side,
//     price: newOrderTwo.price,
//     amount: newOrderTwo.amount,
//     createdAt: new Date(),
//   });

//   showOrderBook(pair);
// }, 500);
