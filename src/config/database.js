import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://jmw:$ullY15243@cluster0.hejvqyv.mongodb.net/?appName=Cluster0"; // \ // adjust your URI

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
