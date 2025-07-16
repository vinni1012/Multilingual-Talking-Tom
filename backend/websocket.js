import { WebSocketServer } from "ws";
export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", ws => ws.send("connected"));
  return wss;
}
