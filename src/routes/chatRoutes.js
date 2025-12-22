import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

import Message from "../models/Message.js";

router.get("/chat", async (req, res) => {
  // Populate the sender for all messages
  const messages = await Message.find().sort({ createdAt: 1 }).populate("sender");

  res.render("chat", {
    user: req.session.user,
    messages
  });
});


export default router;
