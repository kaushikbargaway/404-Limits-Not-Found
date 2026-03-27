const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  type: {
    type: String,
    enum: ["reward", "penalty"]
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);