const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user activities
    const activities = await Activity.find({ userId });

    if (!activities.length) {
      return res.json({
        recommendations:
          "Start logging your daily activities to receive personalized sustainability tips 🌱"
      });
    }

    // 2. Aggregate emissions
    let categoryTotals = {};
    let totalCarbon = 0;

    activities.forEach((a) => {
      categoryTotals[a.category] =
        (categoryTotals[a.category] || 0) + a.carbonKg;
      totalCarbon += a.carbonKg;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    // 3. Constrained prompt (keep this exactly like this)
    const prompt = `
You are a sustainability assistant.

User summary:
- Highest emission category: ${topCategory}
- Total emissions: ${totalCarbon.toFixed(2)} kg CO2

Task:
Give exactly 3 short, practical recommendations.
Each recommendation should be one sentence.
Avoid generic advice.
Use bullet points.
`;

    // 4. Call Gemini
    const result = await model.generateContent(prompt);

    const aiText =
      result?.response?.text() ||
      "Unable to generate recommendations at the moment.";

    res.json({ recommendations: aiText });
  } catch (err) {
    console.error("AI Recommendation Error:", err.message);

    res.json({
      recommendations:
        "AI service is temporarily unavailable. Please try again later."
    });
  }
});

module.exports = router;
