const Activity = require("../models/Activity");
const calculateCarbon = require("../utils/carbonCalculator");

exports.addActivity = async (req, res) => {
  try {
    const { category, activityType, value, date } = req.body;

    const carbonKg = calculateCarbon(activityType, value);

    const activity = await Activity.create({
      userId: req.user,
      category,
      activityType,
      value,
      carbonKg,
      date
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user }).sort({
      date: -1
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { category, activityType, value, date } = req.body;

    const carbonKg = calculateCarbon(activityType, value);

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { category, activityType, value, carbonKg, date },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
