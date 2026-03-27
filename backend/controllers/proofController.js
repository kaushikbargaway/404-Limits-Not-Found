const Proof = require("../models/Proof");
const Task = require("../models/Task");

const { validateProof } = require("../validators/proofValidator");
const { giveReward } = require("../services/rewardService");
const { verifyProofAI } = require("../services/aiService");
const { sendNotification } = require("../services/notificationService");
const { getTrustScore } = require("../services/trustService");

const logger = require("../utils/logger");

// =========================
// UPLOAD PROOF (with AI)
// =========================
exports.uploadProof = async (req, res) => {
  try {
    const { taskId, userId, image, text } = req.body;

    const error = validateProof(req.body);
    if (error) {
      logger.error(error);
      return res.status(400).json({ error });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      logger.error("Task not found");
      return res.status(404).json({ msg: "Task not found" });
    }

    console.log("🤖 Calling AI now...");
    const aiScore = await verifyProofAI(image, text, task.description);

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
// GET PROOFS FOR A TASK
// (used by the task owner to review submissions)
// =========================
exports.getProofsByTask = async (req, res) => {
  try {
    const proofs = await Proof.find({ task: req.params.taskId })
      .populate("user", "name trustScore coins")
      .sort({ createdAt: -1 });

    res.json(proofs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================
// GET ALL TASKS OWNED BY USER + THEIR PROOFS
// (single call for the "My Tasks" inbox page)
// =========================
exports.getMyTasksWithProofs = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const tasks = await Task.find({ owner: ownerId })
      .sort({ createdAt: -1 });

    const taskIds = tasks.map(t => t._id);

    const proofs = await Proof.find({ task: { $in: taskIds } })
      .populate("user", "name trustScore coins")
      .sort({ createdAt: -1 });

    // Group proofs by taskId
    const proofsByTask = {};
    proofs.forEach(p => {
      const key = p.task.toString();
      if (!proofsByTask[key]) proofsByTask[key] = [];
      proofsByTask[key].push(p);
    });

    // Attach proofs to each task
    const result = tasks.map(t => ({
      ...t.toObject(),
      proofs: proofsByTask[t._id.toString()] || []
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================
// VERIFY PROOF + REWARD
// =========================
exports.verifyProof = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const proof = await Proof.findById(req.params.id);

    if (!proof) {
      logger.error("Proof not found");
      return res.status(404).json({ msg: "Proof not found" });
    }

    if (!isApproved) {
      proof.status = "rejected";
      await proof.save();
      logger.info("Proof rejected by user");
      return res.json({ msg: "Proof rejected by user" });
    }

    const trustScore = await getTrustScore(proof.user);
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    proof.rating = rating;
    proof.status = "approved";
    await proof.save();

    const humanScore = rating * 20;
    const finalScore =
      proof.aiScore * 0.4 +
      humanScore * 0.4 +
      trustScore * 0.2;

    if (finalScore < 50) {
      logger.info("Final score too low, proof rejected");
      return res.status(400).json({
        msg: "Proof rejected due to low confidence",
        aiScore: proof.aiScore,
        trustScore,
        finalScore
      });
    }

    if (proof.aiScore < 20) {
      logger.info("Extremely low AI score");
      return res.status(400).json({
        msg: "Proof rejected (AI detected strong inconsistency)"
      });
    }

    const task = await Task.findById(proof.task);
    if (!task) {
      logger.error("Task not found during verification");
      return res.status(404).json({ msg: "Task not found" });
    }

    task.status = "completed";
    await task.save();

    // Use the task's actual reward value — give a 20% bonus if score > 80
    const baseReward = task.reward || 50;
    const rewardAmount = finalScore > 80 ? Math.round(baseReward * 1.2) : baseReward;
    await giveReward(proof.user, rewardAmount, proof.task);

    logger.info("Proof verified with hybrid scoring");

    res.json({
      msg: "Proof verified & reward given",
      aiScore: proof.aiScore,
      trustScore,
      finalScore,
      reward: rewardAmount
    });

    try {
      sendNotification(proof.user, "You earned reward!");
    } catch (err) {
      console.log("Notification failed:", err.message);
    }

  } catch (error) {
    logger.error(error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
};