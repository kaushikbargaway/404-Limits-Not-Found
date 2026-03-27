const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const proofRoutes = require("./routes/proofRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/proof", proofRoutes);
app.use("/api/reward", rewardRoutes);

// DB Connect
mongoose.connect("mongodb://127.0.0.1:27017/karmachain")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));