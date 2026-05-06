const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const aiRoutes = require("./routes/aiRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
// Increase JSON limit because we are sending base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/interviews", interviewRoutes);

// Simple Health Check
app.get("/", (req, res) => {
  res.send("PrepWise MERN API is running!");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("⚠️  MongoDB Connection Failed:", err.message));

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
