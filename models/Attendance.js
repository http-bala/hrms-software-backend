import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceId: String,

    location: {
      lat: Number,
      lng: Number,
    },

    date: Date,

    checkInTime: Date,
    checkOutTime: Date,

    status: {
      type: String,
      enum: ["Checked In", "Checked Out"],
      default: "Checked In",
    },

    warnings: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
