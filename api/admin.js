import express from "express";
import adminRoutes from "../routes/adminRoutes.js";
import { connectDB } from "../config/db.js";

const app = express();
app.use(express.json());
app.use("/", adminRoutes);

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
