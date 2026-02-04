const Activity = require("../models/Activity");

/* =========================
   AI RECOMMENDATIONS
   ========================= */
exports.getAIRecommendations = async (req, res) => {
  try {
    // 1. Fetch user's recent activities (last 30 days)
    const activities = await Activity.find({
      userId: req.user.id
    });

    if (!activities || activities.length === 0) {
      return res.json({
        recommendations:
          "Start logging your daily activities to receive personalized sustainability tips 🌱"
      });
    }

    // 2. Aggregate emissions by category
    const summary = {};
    let totalCarbon = 0;

    activities.forEach((a) => {
      totalCarbon += a.carbonKg;
      summary[a.category] =
        (summary[a.category] || 0) + a.carbonKg;
    });

    // 3. Find highest emission category
    const highestCategory = Object.keys(summary).reduce((a, b) =>
      summary[a] > summary[b] ? a : b
    );

    // 4. Generate rule-based + AI-style recommendations
    let recommendations = `Your highest carbon emissions come from **${highestCategory}**.\n\n`;

    if (highestCategory === "transport") {
      recommendations +=
        "🚗 Consider reducing short car trips, carpooling, or using public transport.\n" +
        "🚲 Switching to cycling or walking for short distances can significantly lower emissions.\n";
    }

    if (highestCategory === "diet") {
      recommendations +=
        "🥗 Reducing beef consumption and opting for vegetarian meals can greatly cut carbon emissions.\n" +
        "🌱 Try plant-based meals 2–3 times a week.\n";
    }

    if (highestCategory === "energy") {
      recommendations +=
        "💡 Reduce electricity usage by switching to LED bulbs and unplugging unused devices.\n" +
        "🌞 Consider energy-efficient appliances.\n";
    }

    recommendations +=
      "\nSmall consistent changes can reduce your monthly footprint by 10–30% 🌍";

    // 5. Send response
    res.json({ recommendations });
  } catch (error) {
    console.error("AI recommendation error:", error);
    res.status(500).json({
      message: "Failed to generate AI recommendations"
    });
  }
};
