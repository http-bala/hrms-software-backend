// HRMBackend/api/auth.js
import express from "express";
import authRoutes from "../routes/authRoutes.js";
import { connectDB } from "../config/db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", authRoutes);

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
