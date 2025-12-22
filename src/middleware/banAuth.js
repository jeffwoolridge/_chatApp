export default function banAuth(req, res, next) {
    if (req.session.user && req.session.user.isBanned) {
        return res.status(403).send("You are banned from the platform.");
    }
    next();
}
