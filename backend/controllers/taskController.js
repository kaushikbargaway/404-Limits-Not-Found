const Task = require("../models/Task");
const mongoose = require("mongoose");

// =======================
// CREATE TASK
// =======================
exports.createTask = async (req, res) => {
  try {
    const { title, description, ownerId, reward, minTrustScore } = req.body;

    if (!title || !ownerId) {
      return res.status(400).json({ msg: "Title and ownerId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ msg: "Invalid ownerId" });
    }

    const task = await Task.create({
      title,
      description,
      owner: ownerId,
      reward: reward || 0,
      minTrustScore: minTrustScore || 0,
      status: "open"
    });

    return res.status(201).json(task);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// =======================
// GET ALL TASKS
// =======================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner assignedTo").sort({ createdAt: -1 });
    return res.json(tasks);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// =======================
// GET TASK BY ID
// =======================
exports.getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id).populate("owner assignedTo");

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    return res.json(task);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// =======================
// ACCEPT TASK
// =======================
exports.acceptTask = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid userId" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.status !== "open") {
      return res.status(400).json({ msg: "Task already taken" });
    }

    // Prevent owner from accepting their own task
    if (task.owner.toString() === userId) {
      return res.status(400).json({ msg: "You cannot accept your own task" });
    }

    task.assignedTo = userId;
    task.status = "in_progress";

    await task.save();

    return res.json(task);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// =======================
// DELETE / CANCEL TASK
// =======================
exports.deleteTask = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ msg: "Invalid ownerId" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.owner.toString() !== ownerId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ msg: "Cannot delete completed task" });
    }

    task.status = "cancelled";
    await task.save();

    return res.json({ msg: "Task cancelled successfully", task });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};