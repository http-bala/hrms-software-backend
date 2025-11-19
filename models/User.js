import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobile: { type: String, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "employee", "manager"],
      required: true,
    },

    workProfile: { type: String }, // e.g., "Senior Developer"
    department: { type: String }, // e.g., "IT"
    address: { type: String }, // optional

    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
