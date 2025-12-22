// routes/adminRoutes.js
import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import adminAuth from "../middleware/adminAuth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Admin dashboard
router.get("/admin", adminAuth, async (req, res) => {
  const users = await User.find().sort({ joinDate: 1 });
  res.render("admin", {
    user: req.session.user,
    users
  });
});

function isAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Send notification
router.post("/admin/notify", isAuthenticated, async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).send("Empty message");
    }

    const notification = await Notification.create({
      senderName: req.session.user.username,
      content: message
    });

    req.app.locals.broadcast({
      type: "system",
      senderName: notification.senderName,
      content: notification.content,
      createdAt: notification.createdAt
    });

    res.redirect("/admin");
  } catch (err) {
    console.error("Notify error:", err);
    res.status(500).send("Server error");
  }
});




// Ban / unban
router.post("/admin/ban/:id", adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: true });
  res.redirect("/admin");
});

router.post("/admin/unban/:id", adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: false });
  res.redirect("/admin");
});

export default router;
