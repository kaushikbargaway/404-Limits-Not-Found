const User = require("../models/User");

exports.getTrustScore = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return 50; // default

  return user.trustScore || 50;
};