const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const profileRoutes = require("./routes/profileRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTrack API is running!",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`JobTrack API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
