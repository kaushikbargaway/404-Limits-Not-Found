const Transaction = require("../models/Transaction");

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.params.userId
    }).populate("task");

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};