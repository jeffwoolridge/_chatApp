import mongoose from "mongoose";
import User from "./src/models/User.js";

await mongoose.connect(
  "ongodb+srv://jwool:ooguR2ku@chatapp.iu8ztkq.mongodb.net/chatapp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const adminExists = await User.findOne({ username: "admin" });

if (!adminExists) {
  const admin = new User({
    username: "admin",
    password: "securepassword",
    isAdmin: true,
  });
  await admin.save();
  console.log("Admin user created");
} else {
  console.log("Admin already exists");
}

process.exit();
