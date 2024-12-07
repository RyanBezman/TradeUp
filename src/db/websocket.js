import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

function generateMockOrder() {
  const size = (0.1 * Math.random()).toFixed(4);
  const price = Math.floor(Math.random() * (100000 - 92000 + 1)) + 92000;
  return { size: size, price };
}
setInterval(() => {
  const ask = generateMockOrder();
  const bid = generateMockOrder();
  const message = JSON.stringify({ ask, bid });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 2000);
