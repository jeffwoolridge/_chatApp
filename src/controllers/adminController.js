import User from "../models/User.js";

// Admin Controller
export const adminPanel = async (req, res) => {
    const users = await User.find();
    res.render("admin", { users });
};

// Ban User Controller
export const banUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isBanned: true });
    res.redirect("/admin");
};

// Unban User Controller
export const unbanUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isBanned: false });
    res.redirect("/admin");
};
