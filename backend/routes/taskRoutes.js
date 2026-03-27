const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  acceptTask,
  deleteTask
} = require("../controllers/taskController");

router.post("/create", createTask);
router.get("/", getTasks);
router.post("/accept/:id", acceptTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;