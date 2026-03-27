const User = require("../models/User");
const logger = require("../utils/logger");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
      coins: 0,
      trustScore: 50
    });

    logger.info("User created");

    res.status(201).json(user);

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};