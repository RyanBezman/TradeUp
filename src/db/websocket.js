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
        console.log(data);

        if (side === "sell") {
          asks.push({
            side: side,
            price: numericPrice,
            size: numericSize,
            formattedSize: formattedSize,
          });
          sortAsks();
        } else if (side === "buy") {
          // need to check if the limit sells have something available for a limit buy at their price or cheaper
          // if they do, we need to do the same thing as a normal buy, contingent upon the buyers asking price
          // when fulfilled, we need to add the limit buy to the order book with the remaining size it wants to purchase
          let remainingSize = numericSize;
          if (orderType === "limit") {
            if (asks[0].price <= price) {
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
                  console.log(asks);
                } else {
                  remainingSize -= lowestAsk.size;
                  bids.push({
                    side,
                    price: numericPrice,
                    size: remainingSize,
                    formattedSize: remainingSize.toFixed(4),
                  });
                  asks.shift();
                  sortBids();
                  showOrderBook();
                  return;
                }
              }
            } else {
              bids.push({
                side,
                price: numericPrice,
                size: numericSize,
                formattedSize,
              });
              sortBids();
              showOrderBook();
              return;
            }
          }

          while (remainingSize > 0 && asks.length) {
            let lowestAsk = asks[0];

            if (lowestAsk.size > remainingSize) {
              lowestAsk.size -= remainingSize;
              lowestAsk.formattedSize = lowestAsk.size.toFixed(4);
              remainingSize = 0;
              console.log(asks);
            } else {
              remainingSize -= lowestAsk.size;
              asks.shift();
            }
          }
          sortAsks();
        }
        showOrderBook();
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
  bids.sort((a, b) => a.price - b.price);
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
