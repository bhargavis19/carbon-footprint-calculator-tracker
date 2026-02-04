const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const activityController = require("../controllers/activityController");
const Activity = require("../models/Activity"); // ✅ FIX 1

const {
  addActivity,
  getActivities,
  updateActivity,
  deleteActivity
} = activityController;

router.use(authMiddleware);

/* CRUD routes */
router.post("/", addActivity);
router.get("/", getActivities);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

/* 🔥 COMPARISON ROUTE (FIXED & REGISTERED) */
router.get("/comparison", async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const sumCarbon = async (from, to) => {
      const acts = await Activity.find({
        userId,
        date: { $gte: from, $lt: to }
      });
      return acts.reduce((sum, a) => sum + a.carbonKg, 0);
    };

    res.json({
      daily: {
        current: await sumCarbon(startOfToday, now),
        previous: await sumCarbon(startOfYesterday, startOfToday)
      },
      weekly: {
        current: await sumCarbon(startOfWeek, now),
        previous: await sumCarbon(startOfLastWeek, startOfWeek)
      },
      monthly: {
        current: await sumCarbon(startOfMonth, now),
        previous: await sumCarbon(startOfLastMonth, startOfMonth)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Comparison calculation failed" });
  }
});

module.exports = router; // ✅ FIX 2 (LAST LINE)
