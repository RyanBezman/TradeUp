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
      .filter((order) => order.side === "sell")
      .sort((a, b) => +a.price - +b.price);

    bids = allOrders
      .filter((order) => order.side === "buy")
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
          amount,
          filledAmount,
          status,
        });
        console.log(newOrder.id);
        if (side === "sell") {
          let remainingSize = parseFloat(amount);
          const availableAmount =
            parseFloat(bids[0].amount) - parseFloat(bids[0].filledAmount);
          const bidsPrice = parseFloat(bids[0].price);
          const sellPrice = parseFloat(price);
          const sellAmount = parseFloat(amount);
          while (bids[0] && bidsPrice >= sellPrice && remainingSize > 0) {
            console.log(bids[0].id);
            if (availableAmount >= sellAmount) {
              const newFilledAmount =
                parseFloat(bids[0].filledAmount) + sellAmount;
              await updateFilledAmount(bids[0].id, newFilledAmount);
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
              await updateBalance(id, baseAsset, quoteAsset, amount, side);
              await updateBalance(
                bids[0].userId,
                bids[0].baseAsset,
                bids[0].quoteAsset,
                amount,
                bids[0].side
              );

              bids[0].filledAmount = newFilledAmount.toString();

              remainingSize = 0;
            } else {
              remainingSize -= availableAmount;

              bids.shift();
            }
          }
          if (remainingSize > 0) {
            asks.push({ ...newOrder, amount: remainingSize.toString() });
          }
        } else if (side === "buy") {
          bids.push(newOrder);
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
