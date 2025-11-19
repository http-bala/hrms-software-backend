import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 user → 1 employee record
    },

    firstCheckinDeviceId: { type: String, default: null },

    firstCheckinLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
