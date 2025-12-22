import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

// Function to create admin if it doesn't exist
export async function createAdmin() {
  const existingAdmin = await User.findOne({ username: "admin" });
  if (!existingAdmin) {
    const newAdmin = new User({
      username: "admin",
      password: "securepassword",
      isAdmin: true
    });
    await newAdmin.save();
    console.log("Admin user created!");
  } else {
    console.log("Admin user already exists.");
  }
}

export default User;
