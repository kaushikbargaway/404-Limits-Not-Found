const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, ownerId } = req.body;

    const task = await Task.create({
      title,
      description,
      owner: ownerId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "open") {
      return res.status(400).json({ msg: "Task already taken" });
    }

    task.assignedTo = userId;
    task.status = "in_progress";

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};