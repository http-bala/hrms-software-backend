// HRMBackend/routes/authRoutes.js
import express from "express";
import { adminregister, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin-register", adminregister); // use once to create initial admin
router.post("/login", login); // { email, password, role }
router.get("/me", protect, getMe);

export default router;
