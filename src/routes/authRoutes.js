import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* ---------- GET signup ---------- */
router.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

/* ---------- POST signup ---------- */
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("signup", { error: "Username already exists" });
        }

        // Create user — password will be hashed automatically
        await User.create({ username, password });

        res.redirect("/login");
    } catch (err) {
        console.error("Signup error:", err);
        res.render("signup", { error: "Signup failed" });
    }
});

/* ---------- GET login ---------- */
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

/* ---------- POST login ---------- */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { error: "Invalid username or password" });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render("login", { error: "Invalid username or password" });
        }

        // Save session
        req.session.user = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
        };

        res.redirect("/chat");
    } catch (err) {
        console.error("Login error:", err);
        res.render("login", { error: "Login failed" });
    }
});

/* ---------- POST logout ---------- */
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export default router;
