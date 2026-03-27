const Task = require("../models/Task");
const mongoose = require("mongoose");

// =======================
// CREATE TASK
// =======================
exports.createTask = async (req, res) => {
  try {
    const { title, description, ownerId } = req.body;

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
      status: "open"
    });

    return res.status(201).json(task);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// =======================
// GET TASKS
// =======================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner assignedTo");
    return res.json(tasks);

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

    // ✅ Only owner can delete
    if (task.owner.toString() !== ownerId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ❌ Cannot delete completed task
    if (task.status === "completed") {
      return res.status(400).json({
        msg: "Cannot delete completed task"
      });
    }

    // 🔥 Better approach → cancel instead of delete
    task.status = "cancelled";
    await task.save();

    return res.json({
      msg: "Task cancelled successfully",
      task
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};