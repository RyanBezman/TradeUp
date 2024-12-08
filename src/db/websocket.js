import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let asks = [{ side: "sell", price: "100,000", size: "0.10" }];
let bids = [{ side: "buy", price: "101,000", size: "0.0012" }];

let userBalances = {};

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "order_book", asks, bids }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "new_order") {
        const { side, price, size } = data;

        if (side === "sell") {
          asks.unshift({ price, size });
        }
        showOrderBook();
      }
    } catch (err) {
      console.error("order faile", err);
    }
  });
});

function showOrderBook() {
  const message = JSON.stringify({ type: "order_book", asks, bids });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
// function generateMockOrder() {
//   const size = (0.1 * Math.random()).toFixed(4);
//   const price = Math.floor(Math.random() * (100000 - 92000 + 1)) + 92000;
//   return { size: size, price };
// }
// setInterval(() => {
//   const ask = generateMockOrder();
//   const bid = generateMockOrder();
//   const message = JSON.stringify({ ask, bid });

//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }, 100);
