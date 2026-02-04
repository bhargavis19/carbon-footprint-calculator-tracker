const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const statsRoutes = require("./routes/statsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/stats", statsRoutes);
app
app.get("/", (req, res) => {
  res.send("Carbon Footprint API running");
});

module.exports = app;
