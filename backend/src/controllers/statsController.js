const Activity = require("../models/Activity");

// Helper to get date range
const getDateRange = (period) => {
  const now = new Date();
  let start;

  if (period === "daily") {
    start = new Date(now.setHours(0, 0, 0, 0));
  } else if (period === "weekly") {
    start = new Date();
    start.setDate(start.getDate() - 7);
  } else if (period === "monthly") {
    start = new Date();
    start.setMonth(start.getMonth() - 1);
  }

  return start;
};

exports.getStats = async (req, res) => {
  try {
    const { period } = req.query; // daily | weekly | monthly
    const startDate = getDateRange(period);

    const stats = await Activity.aggregate([
      {
        $match: {
          userId: req.user,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$category",
          totalCarbon: { $sum: "$carbonKg" }
        }
      }
    ]);

    const total = stats.reduce(
      (sum, item) => sum + item.totalCarbon,
      0
    );

    res.json({
      period,
      totalCarbon: total,
      breakdown: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
