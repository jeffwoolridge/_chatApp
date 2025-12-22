import auth from "./auth.js";
import adminAuth from "./adminAuth.js";
import banAuth from "./banAuth.js";
import applyBaseMiddleware from "./baseMiddleware.js";

// Export all middleware functions
export default {
    auth,
    adminAuth,
    banAuth,
    applyBaseMiddleware
};
