const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner_id: String,
  assigned_to: String,
  status: { type: String, default: "open" }
});

module.exports = mongoose.model("Task", taskSchema);