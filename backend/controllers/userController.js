const User = require("../models/User");
const logger = require("../utils/logger");

// CREATE USER (with duplicate prevention)
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existing = await User.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: "A user with this name already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email || "",
      coins: 0,
      trustScore: 50
    });

    logger.info("User created: " + user.name);
    res.status(201).json(user);

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BY ID (refresh stale session data after rewards)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BY NAME (for login)
exports.getUserByName = async (req, res) => {
  try {
    const name = req.params.name.trim();
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};