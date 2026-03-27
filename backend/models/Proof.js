const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: String,
  text: String,
  aiScore: { type: Number, default: 50 },
  rating: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Proof", proofSchema);