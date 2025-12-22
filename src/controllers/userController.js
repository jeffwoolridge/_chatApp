// User Controller
export const dashboard = (req, res) => {
    res.render("index/authenticated", { user: req.session.user });
};

// Profile Controller
export const profile = (req, res) => {
    res.render("profile", { user: req.session.user });
};
