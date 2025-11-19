
// import Attendance from "../models/Attendance.js";
// import Employee from "../models/Employee.js";
// import User from "../models/User.js";


// // convert to today's start
// const toStartOfDay = () => {
//   const d = new Date();
//   d.setHours(0, 0, 0, 0);
//   return d;
// };

// // calculate distance
// const isWithinRange = (loc1, loc2, allowedMeters = 100) => {
//   if (!loc1 || !loc2) return false;

//   const R = 6371e3;
//   const φ1 = (loc1.lat * Math.PI) / 180;
//   const φ2 = (loc2.lat * Math.PI) / 180;
//   const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
//   const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c <= allowedMeters;
// };

// // =====================
// // FIRST CHECK-IN LOGIC
// // =====================
// export const checkIn = async (req, res) => {
//   console.log("🔥 CHECK-IN HIT");
//   console.log("Body:", req.body);
//   console.log("User:", req.user);

//   try {
//     const { lat, lng, deviceId } = req.body;

//     const employeeId = req.user.id; // FIXED ✔
//     console.log("Employee ID:", employeeId);

//     const emp = await Employee.findById(employeeId);

//     if (!emp) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // FIRST TIME CHECK-IN
//     if (!emp.firstCheckinDeviceId) {
//       emp.firstCheckinDeviceId = deviceId;
//       emp.firstCheckinLocation = { lat, lng };
//       await emp.save();
//     }

//     const warnings = [];

//     if (emp.firstCheckinDeviceId && emp.firstCheckinDeviceId !== deviceId) {
//       warnings.push("Device does not match first check-in");
//     }

//     if (
//       emp.firstCheckinLocation &&
//       !isWithinRange(emp.firstCheckinLocation, { lat, lng })
//     ) {
//       warnings.push("Location is outside first check-in range");
//     }

//     // Prevent double check-in
//     const existing = await Attendance.findOne({
//       employee: employeeId,
//       checkOutTime: { $exists: false },
//       date: { $gte: toStartOfDay() },
//     });

//     if (existing) {
//       return res.status(400).json({ message: "Already checked in today" });
//     }

//     const attendance = await Attendance.create({
//       employee: employeeId,
//       location: { lat, lng },
//       deviceId,
//       date: new Date(),
//       checkInTime: new Date(),
//       status: "Checked In",
//       warnings,
//     });

//     res.json({ message: "Check-in done", attendance, warnings });
//   } catch (err) {
//     console.error("🔥 ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



// // =====================
// // CHECK-OUT
// // =====================
// export const checkOut = async (req, res) => {
//   try {
//     const { lat, lng, deviceId } = req.body;

//     const employeeId = req.user.id; // FIXED ✔

//     const emp = await Employee.findById(employeeId);

//     if (!emp) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const warnings = [];

//     if (emp.firstCheckinDeviceId && emp.firstCheckinDeviceId !== deviceId) {
//       warnings.push("Device mismatch on checkout");
//     }

//     if (
//       emp.firstCheckinLocation &&
//       !isWithinRange(emp.firstCheckinLocation, { lat, lng })
//     ) {
//       warnings.push("Checkout location mismatch");
//     }

//     const attendance = await Attendance.findOne({
//       employee: employeeId,
//       checkOutTime: { $exists: false },
//       date: { $gte: toStartOfDay() },
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: "No active check-in found" });
//     }

//     attendance.checkOutTime = new Date();
//     attendance.status = "Checked Out";
//     attendance.warnings.push(...warnings);
//     await attendance.save();

//     res.json({ message: "Check-out done", attendance, warnings });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// convert to start of today
const toStartOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isWithinRange = (loc1, loc2, allowedMeters = 100) => {
  if (!loc1 || !loc2) return false;

  const R = 6371e3;
  const φ1 = (loc1.lat * Math.PI) / 180;
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= allowedMeters;
};

// ===================================
// CHECK-IN
// ===================================
export const checkIn = async (req, res) => {
  console.log("🔥 CHECK-IN HIT");
  console.log("Body:", req.body);
  console.log("User:", req.user);

  try {
    const { lat, lng, deviceId } = req.body;
    const userId = req.user.id;

    let emp = await Employee.findOne({ userId });

    // create Employee record automatically if not exist
    if (!emp) {
      emp = await Employee.create({ userId });
    }

    const warnings = [];

    // first time
    if (!emp.firstCheckinDeviceId) {
      emp.firstCheckinDeviceId = deviceId;
      emp.firstCheckinLocation = { lat, lng };
      await emp.save();
    }

    // compare device
    if (emp.firstCheckinDeviceId !== deviceId) {
      warnings.push("Device mismatch from first check-in");
    }

    // compare location
    if (!isWithinRange(emp.firstCheckinLocation, { lat, lng })) {
      warnings.push("Location mismatch from first check-in");
    }

    // prevent repeat check-in
    const existing = await Attendance.findOne({
      employee: userId,
      checkOutTime: { $exists: false },
      date: { $gte: toStartOfDay() },
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      employee: userId,
      deviceId,
      location: { lat, lng },
      date: new Date(),
      checkInTime: new Date(),
      status: "Checked In",
      warnings,
    });

    return res.json({ message: "Check-in successful", attendance, warnings });
  } catch (err) {
    console.error("🔥 CHECK-IN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================================
// CHECK-OUT
// ===================================
export const checkOut = async (req, res) => {
  try {
    const { lat, lng, deviceId } = req.body;
    const userId = req.user.id;

    const emp = await Employee.findOne({ userId });
    if (!emp) {
      return res.status(404).json({ message: "Employee record missing" });
    }

    const warnings = [];

    // compare device and location
    if (emp.firstCheckinDeviceId !== deviceId) {
      warnings.push("Device mismatch on checkout");
    }

    if (!isWithinRange(emp.firstCheckinLocation, { lat, lng })) {
      warnings.push("Checkout location mismatch");
    }

    const attendance = await Attendance.findOne({
      employee: userId,
      checkOutTime: { $exists: false },
      date: { $gte: toStartOfDay() },
    });

    if (!attendance) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    attendance.checkOutTime = new Date();
    attendance.status = "Checked Out";
    attendance.warnings.push(...warnings);

    await attendance.save();

    return res.json({ message: "Checkout successful", attendance, warnings });
  } catch (err) {
    console.error("🔥 CHECKOUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// FETCH MY ATTENDANCE
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user.id,
    }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
