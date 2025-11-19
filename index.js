// // HRMBackend/server.js
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";

// // load env first
// dotenv.config();
// let isConnected = false; // For mongoose caching
// const app = express();

// // CORS - allow your frontend (dev)
// app.use(
//   cors({
//     origin: "http://localhost:5173", // change or set to true/* during testing
//     credentials: true,
//   })
// );

// module.exports = (req, res) => {
//   res.status(200).json({ message: "Backend API working from Vercel" });
// };


// // body parser
// app.use(express.json());

// // mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/attendance", attendanceRoutes);  
// // mongo connect and server start
// const PORT = process.env.PORT || 8000;

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//   });
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ---------- DATABASE CONNECTION ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// ---------- HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend API is running",
    time: new Date().toISOString(),
  });
});

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
});
