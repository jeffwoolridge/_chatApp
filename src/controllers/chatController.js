import WebSocket from "ws";

let onlineUsers = 0;

export const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    onlineUsers++;

    // Send updated online users count to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "usersOnline", onlineUsers }));
      }
    });

    ws.on("message", (data) => {
      const { username, message } = JSON.parse(data);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", username, message }));
        }
      });
    });

    ws.on("close", () => {
      onlineUsers--;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "usersOnline", onlineUsers }));
        }
      });
    });
  });
};
