import mongoose from "mongoose";
import User from "./src/models/User.js";

await mongoose.connect("mongodb+srv://jmw:$ullY15243@cluster0.hejvqyv.mongodb.net/?appName=Cluster0");

const adminExists = await User.findOne({ username: "admin" });

if (!adminExists) {
  const admin = new User({
    username: "admin",
    password: "securepassword", 
    isAdmin: true
  });
  await admin.save();
  console.log("Admin user created");
} else {
  console.log("Admin already exists");
}

process.exit();
