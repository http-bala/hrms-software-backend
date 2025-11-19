// backend/models/Device.js
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  deviceId: { type: String, required: true },
  deviceName: { type: String },
  verified: { type: Boolean, default: true },
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model("Device", deviceSchema);
