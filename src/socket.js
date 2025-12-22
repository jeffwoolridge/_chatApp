let wssRef = null;

/* Attach WebSocket server */
export function initSockets(wss) {
  wssRef = wss;
}

/* Broadcast to all connected clients */
export function broadcast(payload) {
  if (!wssRef) return;

  wssRef.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(payload));
    }
  });
}
