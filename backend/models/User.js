const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  coins: { type: Number, default: 0 },
  trust_score: { type: Number, default: 50 }
});

module.exports = mongoose.model("User", userSchema);