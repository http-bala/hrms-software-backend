import User from "../models/User.js";
import bcrypt from "bcryptjs";

// =============================================
// 1) Admin creates EMPLOYEE or MANAGER
// =============================================
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role,
      workProfile,
      department,
      address,
      joiningDate,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["employee", "manager"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be employee or manager" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      workProfile,
      department,
      address,
      joiningDate,
    });

    return res.status(201).json({
      message: `${role} created successfully`,
      user,
    });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// 2) GET employees or managers (by role)
// =============================================
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!["employee", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // const users = await User.find({ role }).select("-password");
    const users = await User.find({
      role: { $regex: new RegExp("^" + role + "$", "i") },
    }).select("-password");

    return res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// 3) DELETE USER (employee or manager)
// =============================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: err.message });
  }
};
