const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema({
  task_id: String,
  user_id: String,
  image_url: String,
  text: String,
  ai_score: Number
});

module.exports = mongoose.model("Proof", proofSchema);