const express = require("express");
const router = express.Router();

const { getUserTransactions } = require("../controllers/rewardController");

router.get("/:userId", getUserTransactions);

module.exports = router;