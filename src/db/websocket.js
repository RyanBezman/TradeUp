import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let asks = [
  { side: "sell", price: 100000, size: 0.0249, formattedSize: 0.0249 },
];
let bids = [
  { side: "buy", price: 101000, size: 0.1452, formattedSize: 0.1452 },
];

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "order_book", asks, bids }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "new_order") {
        const { side, price, size, formattedSize, orderType } = data;
        const numericPrice = parseFloat(price);
        const numericSize = parseFloat(size);

        if (side === "sell") {
          let remainingSize = numericSize;
          if (orderType === "limit") {
            if (bids[0] && bids[0].price >= price) {
              while (
                remainingSize > 0 &&
                bids.length > 0 &&
                bids[0].price >= price
              ) {
                let lowestBid = bids[0];
                if (lowestBid.size > remainingSize) {
                  lowestBid.size -= remainingSize;
                  lowestBid.formattedSize = lowestBid.size.toFixed(4);
                  remainingSize = 0;
                } else {
                  remainingSize -= lowestBid.size;
                  bids.shift();
                }
              }
              if (remainingSize > 0) {
                asks.push({
                  side,
                  price: numericPrice,
                  size: remainingSize,
                  formattedSize: remainingSize.toFixed(4),
                });
              }
            } else {
              asks.push({
                side,
                price: numericPrice,
                size: numericSize,
                formattedSize,
              });
            }
          } else {
            while (remainingSize > 0 && bids.length) {
              let lowestBid = bids[0];
              if (lowestBid.size > remainingSize) {
                lowestBid.size -= remainingSize;
                lowestBid.formattedSize = lowestBid.size.toFixed(4);
                remainingSize = 0;
              } else {
                remainingSize -= lowestBid.size;
                bids.shift();
              }
            }
          }
          updateOrderBook();
        } else if (side === "buy") {
          let remainingSize = numericSize;

          if (orderType === "limit") {
            if (asks[0] && asks[0].price <= price) {
              while (
                remainingSize > 0 &&
                asks.length &&
                asks[0].price <= price
              ) {
                let lowestAsk = asks[0];

                if (lowestAsk.size > remainingSize) {
                  lowestAsk.size -= remainingSize;
                  lowestAsk.formattedSize = lowestAsk.size.toFixed(4);
                  remainingSize = 0;
                } else {
                  remainingSize -= lowestAsk.size;
                  asks.shift();
                }
              }
              if (remainingSize > 0) {
                bids.push({
                  side,
                  price: numericPrice,
                  size: remainingSize,
                  formattedSize: remainingSize.toFixed(4),
                });
              }
            } else {
              bids.push({
                side,
                price: numericPrice,
                size: numericSize,
                formattedSize,
              });
            }
          } else {
            while (remainingSize > 0 && asks.length) {
              let lowestAsk = asks[0];

              if (lowestAsk.size > remainingSize) {
                lowestAsk.size -= remainingSize;
                lowestAsk.formattedSize = lowestAsk.size.toFixed(4);
                remainingSize = 0;
              } else {
                remainingSize -= lowestAsk.size;
                asks.shift();
              }
            }
          }
          updateOrderBook();
        }
      }
    } catch (err) {
      console.error("order failed", err);
    }
  });
});
function sortAsks() {
  asks.sort((a, b) => a.price - b.price);
}

function sortBids() {
  bids.sort((a, b) => b.price - a.price);
}
function showOrderBook() {
  const formattedAsks = asks.map((ask) => ({
    ...ask,
    size: ask.size.toFixed(4),
  }));

  const formattedBids = bids.map((bid) => ({
    ...bid,
    size: bid.size.toFixed(4),
  }));

  const message = JSON.stringify({
    type: "order_book",
    asks: formattedAsks,
    bids: formattedBids,
  });

  wss.clients.forEach((client) => {
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
