const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSummary,
  getTrend
} = require("../controllers/analyticsController");

router.get("/summary", authMiddleware, getSummary);
router.get("/trend", authMiddleware, getTrend);

module.exports = router;
