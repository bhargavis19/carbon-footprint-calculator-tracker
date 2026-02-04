require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const aiRoutes = require("./src/routes/aiRoutes");
app.use("/api/ai", aiRoutes);
const activityRoutes = require("./src/routes/activityRoutes");

app.use("/api/activities", activityRoutes);
const userRoutes = require("./src/routes/userRoutes");

app.use("/api/users", require("./src/routes/userRoutes"));

