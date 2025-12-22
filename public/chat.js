document.addEventListener("DOMContentLoaded", () => {

  const ws = new WebSocket(`ws://${location.host}`);

  const messagesEl = document.getElementById("messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");

  ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const div = document.createElement("div");
  const time = data.createdAt ? new Date(data.createdAt).toLocaleTimeString() : "Unknown";

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
  if (!input.value.trim()) return;

  ws.send(JSON.stringify({
    type: "user",
    content: input.value
  }));

  input.value = "";
});
});