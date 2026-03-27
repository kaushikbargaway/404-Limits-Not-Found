const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  acceptTask,
  deleteTask
} = require("../controllers/taskController");

router.post("/create", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/accept/:id", acceptTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;