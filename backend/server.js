const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const proofRoutes = require("./routes/proofRoutes");
const userRoutes = require("./routes/userRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

dotenv.config();

const app = express();

// CORS — allow Vite dev server
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" })); // 10mb for base64 images

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/proofs", proofRoutes);
app.use("/api/rewards", rewardRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));