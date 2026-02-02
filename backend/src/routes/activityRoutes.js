const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const activityController = require("../controllers/activityController");

// 🔍 destructure AFTER importing the controller
const {
  addActivity,
  getActivities,
  updateActivity,
  deleteActivity
} = activityController;

router.use(authMiddleware);

router.post("/", addActivity);
router.get("/", getActivities);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

module.exports = router;
