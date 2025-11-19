
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/getMyAttendance", protect, getMyAttendance);

export default router;
// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { checkIn, checkOut } from "../controllers/attendanceController.js";

// const router = express.Router();

// router.post("/checkin", protect, checkIn);
// router.post("/checkout", protect, checkOut);

// export default router;
