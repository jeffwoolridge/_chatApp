import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Notification from "./src/models/Notification.js";

import User from "./src/models/User.js";
import Message from "./src/models/Message.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true }); // use noServer for upgrade

/* -------------------- DATABASE -------------------- */
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

/* -------------------- MIDDLEWARE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const sessionParser = session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false
});
app.use(sessionParser);
app.use(adminRoutes);

/* -------------------- AUTH HELPERS -------------------- */
function isAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}



app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("index", { user: null });
});

// Dashboard
app.get("/dashboard", isAuthenticated, async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: 1 });
  res.render("dashboard", { user: req.session.user, notifications });
});

/* ---------- SIGNUP ---------- */
app.get("/signup", (req, res) => res.render("signup", { error: null, user: null }));
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render("signup", { error: "All fields required" });

  const exists = await User.findOne({ username });
  if (exists) return res.render("signup", { error: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  req.session.user = { _id: user._id, username: user.username, isAdmin: user.isAdmin };
  res.redirect("/dashboard");
});


/* ---------- LOGIN ---------- */
app.get("/login", (req, res) => res.render("login", { error: null, user: null }));
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.render("login", { error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { error: "Invalid credentials" });

  req.session.user = { _id: user._id, username: user.username, isAdmin: user.isAdmin };
  res.redirect("/dashboard");
});


/* ---------- PROFILE ---------- */
app.get("/profile/:username", isAuthenticated, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send("User not found");

  res.render("profile", {
    username: user.username,
    joinDate: user.joinDate,
    user: req.session.user
  });
});

/* ---------- CHAT ---------- */
app.get("/chat", isAuthenticated, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });

  res.render("chat", {
    user: req.session.user,
    messages,
    showAdminPanel: req.session.user.isAdmin
  });
});


/* ---------- LOGOUT ---------- */
app.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/")));

/* -------------------- TRACK ONLINE USERS -------------------- */
const onlineUsers = new Map(); // key: username, value: ws

const broadcast = (payload) => {
  const json = JSON.stringify(payload);
  for (const client of onlineUsers.values()) {
    if (client.readyState === 1) client.send(json);
  }
};
app.locals.broadcast = broadcast;

/* -------------------- WEBSOCKETS -------------------- */
server.on("upgrade", (req, socket, head) => {
  sessionParser(req, {}, () => {
    if (!req.session.user) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.user = req.session.user; 
      wss.emit("connection", ws);
    });
  });
});

/* ---------- WS CONNECTION ---------- */
wss.on("connection", (ws) => {
  if (!ws.user) {
    console.log("⚠️ Connected ws has no user, closing.");
    ws.close();
    return;
  }

  console.log(`🔌 ${ws.user.username} connected`);

  ws.on("message", async (data) => {
    try {
      const { type = "user", content } = JSON.parse(data);
      if (!content || !content.trim()) return;

      let message;

      if (type === "user") {
        if (!ws.user || !ws.user.username) {
          console.warn("⚠️ ws.user missing, cannot save message");
          return;
        }

        message = await Message.create({
          sender: ws.user._id,
          senderName: ws.user.username, // ✅ guaranteed now
          content,
          isSystem: false
        });
      }

      if (type === "system") {
        message = await Message.create({
          senderName: "System", // ✅ always set
          content,
          isSystem: true
        });
      }

      // broadcast
      const payload = {
        type,
        content: message.content,
        sender: { username: message.senderName },
        createdAt: message.createdAt
      };

      wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(JSON.stringify(payload));
      });

    } catch (err) {
      console.error(err);
    }
  });

  ws.on("close", () => {
    console.log(`🔌 ${ws.user.username} disconnected`);
  });
});

/* -------------------- START SERVER -------------------- */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
