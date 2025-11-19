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
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import attendanceRoutes from "../routes/attendanceRoutes.js";

let isConnected = false; // For mongoose caching

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend API is running",
    time: new Date().toISOString(),
  });
});


  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/attendance", attendanceRoutes);

  return app(req, res);
}
