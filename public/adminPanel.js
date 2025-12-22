// adminPanel.js (frontend)
const form = document.getElementById("notify-form");
const input = document.getElementById("notify-input");
const ws = new WebSocket(`ws://${location.host}/chat/ws`); // or your WS endpoint

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;

  // send notification via WS
  ws.send(JSON.stringify({ type: "system", content }));

  input.value = "";
});
