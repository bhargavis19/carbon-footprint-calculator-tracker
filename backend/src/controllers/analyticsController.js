const mongoose = require("mongoose");
const Activity = require("../models/Activity");

// Helper: get start date by period
const getStartDate = (period) => {
  const now = new Date();

  if (period === "daily") {
    return new Date(now.setHours(0, 0, 0, 0));
  }

  if (period === "weekly") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }

  if (period === "monthly") {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  return null;
};

/**
 * GET /api/analytics/summary?period=daily|weekly|monthly
 */
exports.getSummary = async (req, res) => {
  try {
    const period = req.query.period || "monthly";
    const startDate = getStartDate(period);

    const data = await Activity.aggregate([
      {
        $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
            ...(startDate && { date: { $gte: startDate } })
        }
      },
      {
        $group: {
          _id: "$category",
          totalCarbon: { $sum: "$carbonKg" }
        }
      }
    ]);

    const totalCarbon = data.reduce(
      (sum, item) => sum + item.totalCarbon,
      0
    );

    res.json({
      period,
      totalCarbon,
      breakdown: data
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    res.status(500).json({ message: "Analytics summary failed" });
  }
};

/**
 * GET /api/analytics/trend
 */
exports.getTrend = async (req, res) => {
  try {
    const trend = await Activity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          },
          totalCarbon: { $sum: "$carbonKg" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trend);
  } catch (err) {
    console.error("Trend error:", err);
    res.status(500).json({ message: "Trend fetch failed" });
  }
};
