document.addEventListener("DOMContentLoaded", () => {
  const ws = new WebSocket(`ws://${location.hostname}:4000`);

  const messagesEl = document.getElementById("messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");
  const submitBtn = form.querySelector("button");

  // Disable submit until WS opens
  submitBtn.disabled = true;

  ws.onopen = () => {
    console.log("✅ WebSocket connected");
    submitBtn.disabled = false;
  };

  ws.onerror = (err) => console.error("❌ WebSocket error:", err);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const div = document.createElement("div");
    const time = data.createdAt
      ? new Date(data.createdAt).toLocaleTimeString()
      : "Unknown";

    if (data.type === "user") {
      div.innerHTML = `<strong>${data.sender.username}</strong> [${time}]: ${data.content}`;
    } else if (data.type === "system") {
      div.classList.add("system-message");
      div.innerHTML = `<em>System</em> [${time}]: ${data.content}`;
    }

    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;

    if (ws.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not ready, message not sent");
      return;
    }

    ws.send(JSON.stringify({ type: "user", content }));
    input.value = "";
  });
});
