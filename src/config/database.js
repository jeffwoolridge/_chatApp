import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/chatapp"; // adjust your URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
