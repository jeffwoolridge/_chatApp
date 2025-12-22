import express from "express";
import auth from "../middleware/auth.js";
import banAuth from "../middleware/banAuth.js";
import { dashboard, profile } from "../controllers/userController.js";

const router = express.Router();

// User Routes
router.get("/dashboard", auth, banAuth, dashboard);
router.get("/profile", auth, banAuth, profile);

export default router;
