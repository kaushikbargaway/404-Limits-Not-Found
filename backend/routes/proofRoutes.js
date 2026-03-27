const express = require("express");
const router = express.Router();

const {
  uploadProof,
  verifyProof,
  getProofsByTask,
  getMyTasksWithProofs
} = require("../controllers/proofController");

router.post("/upload", uploadProof);
router.post("/verify/:id", verifyProof);
router.get("/task/:taskId", getProofsByTask);
router.get("/my-tasks/:ownerId", getMyTasksWithProofs);

module.exports = router;