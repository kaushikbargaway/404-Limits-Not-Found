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
app.use(express.json());
app.use("/api/users", userRoutes);

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/proofs", proofRoutes);
app.use("/api/rewards", rewardRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));