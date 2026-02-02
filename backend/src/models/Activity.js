const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      enum: ["transport", "energy", "diet"],
      required: true
    },

    activityType: {
      type: String,
      required: true
    },

    value: {
      type: Number,
      required: true
    },

    carbonKg: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
