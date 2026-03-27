const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  acceptTask
} = require("../controllers/taskController");

router.post("/create", createTask);
router.get("/", getTasks);
router.post("/accept/:id", acceptTask);

module.exports = router;