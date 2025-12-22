// src/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true }); 

export default mongoose.model("Message", messageSchema);

