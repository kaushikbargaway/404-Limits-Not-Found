const User = require("../models/User");

exports.giveReward = async (userId) => {
  const user = await User.findById(userId);

  user.coins += 50;
  user.trustScore += 5;

  await user.save();

  return user;
};