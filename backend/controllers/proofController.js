const Proof = require("../models/Proof");
const Task = require("../models/Task");

const { validateProof } = require("../validators/proofValidator");
const { giveReward } = require("../services/rewardService");
const logger = require("../utils/logger");

// VERIFY PROOF
exports.verifyProof = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const proof = await Proof.findById(req.params.id);

    if (!proof) {
      logger.error("Proof not found");
      return res.status(404).json({ msg: "Proof not found" });
    }

    if (!isApproved) {
      logger.info("Proof rejected");
      return res.json({ msg: "Proof rejected" });
    }

    // Update task
    const task = await Task.findById(proof.task);
    task.status = "completed";
    await task.save();

    // Reward user
    await giveReward(proof.user);

    logger.info("Proof verified and reward given");

    res.json({ msg: "Proof verified & reward given" });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { taskId, userId, image, text } = req.body;

    const proof = await Proof.create({
      task: taskId,
      user: userId,
      image,
      text,
      aiScore: 0
    });

    res.status(201).json(proof);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};