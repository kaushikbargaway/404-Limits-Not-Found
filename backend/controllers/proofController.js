const Proof = require("../models/Proof");
const Task = require("../models/Task");

const { validateProof } = require("../validators/proofValidator");
const { giveReward } = require("../services/rewardService");
const { verifyProofAI } = require("../services/aiService");


const logger = require("../utils/logger");

// =========================
// UPLOAD PROOF (with AI)
// =========================
exports.uploadProof = async (req, res) => {
  try {
    const { taskId, userId, image, text } = req.body;

    // ✅ Validation
    const error = validateProof(req.body);
    if (error) {
      logger.error(error);
      return res.status(400).json({ error });
    }

    // ✅ Check task exists
    const task = await Task.findById(taskId);
    if (!task) {
      logger.error("Task not found");
      return res.status(404).json({ msg: "Task not found" });
    }

    // ✅ AI validation (Groq)
    console.log("🤖 Calling AI now...");
    const aiScore = await verifyProofAI(
  image,
  text,
  task.description
);

    // ✅ Create proof
    const proof = await Proof.create({
      task: taskId,
      user: userId,
      image,
      text,
      aiScore
    });

    logger.info(`Proof uploaded with AI score: ${aiScore}`);

    res.status(201).json(proof);

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// =========================
// VERIFY PROOF + REWARD
// =========================
const { getTrustScore } = require("../services/trustService");

exports.verifyProof = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const proof = await Proof.findById(req.params.id);

    if (!proof) {
      logger.error("Proof not found");
      return res.status(404).json({ msg: "Proof not found" });
    }

    // ❌ If rejected by human
    if (!isApproved) {
      logger.info("Proof rejected by user");
      return res.json({ msg: "Proof rejected by user" });
    }

    // ✅ Get trust score
    const trustScore = await getTrustScore(proof.user);

    // ✅ Convert human approval into score
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            msg: "Rating must be between 1 and 5"
        });
    }
    proof.rating = rating;
    await proof.save();

    // Convert rating to score
    const humanScore = rating * 20;

    // ✅ Calculate final score
    const finalScore =
      proof.aiScore * 0.4 +
      humanScore * 0.4 +
      trustScore * 0.2;

    // ❌ Reject if too low
    if (finalScore < 50) {
      logger.info("Final score too low, proof rejected");

      return res.status(400).json({
        msg: "Proof rejected due to low confidence",
        aiScore: proof.aiScore,
        trustScore,
        finalScore
      });
    }

    // ⚠️ Optional AI safety (extra layer)
    if (proof.aiScore < 20) {
      logger.info("Extremely low AI score");
      return res.status(400).json({
        msg: "Proof rejected (AI detected strong inconsistency)"
      });
    }

    // ✅ Update task
    const task = await Task.findById(proof.task);

    if (!task) {
      logger.error("Task not found during verification");
      return res.status(404).json({ msg: "Task not found" });
    }

    task.status = "completed";
    await task.save();

    // ✅ Dynamic reward
    let rewardAmount = 50;

    if (finalScore > 80) {
      rewardAmount = 80;
    }

    await giveReward(proof.user, rewardAmount);

    logger.info("Proof verified with hybrid scoring");

    res.json({
      msg: "Proof verified & reward given",
      aiScore: proof.aiScore,
      trustScore,
      finalScore,
      reward: rewardAmount
    });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};