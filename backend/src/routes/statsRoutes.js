const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getStats } = require("../controllers/statsController");

router.use(authMiddleware);

router.get("/", getStats);

module.exports = router;
