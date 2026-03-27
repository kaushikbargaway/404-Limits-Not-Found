const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.giveReward = async (userId, amount = 50, taskId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  // update coins
  user.coins += amount;
  user.trustScore += 5;

  await user.save();

  // 🔥 CREATE TRANSACTION (THIS WAS MISSING)
  await Transaction.create({
    user: userId,
    amount,
    type: "reward",
    task: taskId
  });

  console.log("🔥 Transaction created");

  return user;
};