const express = require("express");
const router = express.Router();

const {
  uploadProof,
  verifyProof
} = require("../controllers/proofController");

router.post("/upload", uploadProof);
router.post("/verify/:id", verifyProof);  // IMPORTANT

module.exports = router;