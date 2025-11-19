import express from "express";
import {
  createUser,
  getUsersByRole,
  deleteUser,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", protect, adminOnly, createUser);
router.get("/users/:role", protect, adminOnly, getUsersByRole);
router.delete("/user/:id", protect, adminOnly, deleteUser);

export default router;
