import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===============================================
// 1) Admin Registration
// ===============================================
export const adminregister = async (req, res) => {
  try {
    const { name, email, mobile, password, workProfile, department, address } =
      req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
      workProfile,
      department,
      address,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (err) {
    console.error("Admin Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================================
// 2) Login Controller (Role Based)
// ===============================================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    if (user.role !== role) {
      return res.status(403).json({
        message: `Incorrect role selected. This user is registered as '${user.role}'.`,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: `Logged in successfully as ${role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ===============================================
// 3) Get Logged-In User
// ===============================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: err.message });
  }
};
