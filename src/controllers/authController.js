import bcrypt from "bcrypt";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.redirect("/signup");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Invalid password");

  req.session.user = user.username; // <-- set session correctly
  res.redirect("/chat"); // <-- send to chat page
};

export const signupUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send("All fields required");

  const existing = await User.findOne({ username });
  if (existing) return res.send("Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  req.session.user = username;

  res.redirect("/chat");
};
