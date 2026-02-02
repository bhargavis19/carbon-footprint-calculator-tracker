const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("Carbon Footprint API running");
});

module.exports = app;
