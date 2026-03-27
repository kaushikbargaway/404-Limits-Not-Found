const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  getUserByName
} = require("../controllers/userController");

router.post("/create", createUser);
router.get("/", getUsers);
router.get("/by-name/:name", getUserByName);  // must come before /:id
router.get("/:id", getUserById);

module.exports = router;