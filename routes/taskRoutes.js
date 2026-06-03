const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createTask,
  getTasks,
  updateTask,
    deleteTask,
} = require("../controllers/taskController");

// Create Task
router.post("/", auth, createTask);

// Get All Tasks
router.get("/", auth, getTasks);

// Update Task
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;