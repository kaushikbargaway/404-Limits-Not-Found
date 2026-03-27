const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed","cancelled"],
    default: "open"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);