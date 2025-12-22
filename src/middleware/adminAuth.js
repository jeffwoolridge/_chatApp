export default function adminAuth(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect("/login");
  }
  next();
}
