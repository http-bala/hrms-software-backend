import express from "express";
import attendanceRoutes from "../routes/attendanceRoutes.js";
import { connectDB } from "../config/db.js";

const app = express();
app.use(express.json());
app.use("/", attendanceRoutes);

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
