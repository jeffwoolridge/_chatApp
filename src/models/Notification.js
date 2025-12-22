import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isSystem: { type: Boolean, default: true }
});

export default mongoose.model("Notification", notificationSchema);
