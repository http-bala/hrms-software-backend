export default function handler(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "Backend API is running on Vercel",
    time: new Date().toISOString(),
  });
}
