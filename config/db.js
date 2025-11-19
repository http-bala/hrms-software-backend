import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    // console.log("Using cached MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // optional recommended options for modern mongoose
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    isConnected = true;
    console.log("✅ MongoDB connected (Vercel cached)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
