const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, trim: true },
  email: { type: String, default: "" },
  coins: { type: Number, default: 50 },
  trustScore: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);