// import mongoose from "mongoose";
const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    // Kisne feedback diya
    from: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    },

    // Kisko feedback mila
    to: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    },

    // Type of feedback (for clarity)
    type: {
      type: String,
      enum: ["userToDriver", "driverToUser", "system"], // system -> admin feedback etc.
      required: true,
    },

    rating: { type: Number, min: 1, max: 5 }, // optional for future rating system
    message: { type: String, required: true },
    relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: "Report" }, // link to a report if feedback is about one

    tags: [String], // e.g. ["behavior", "late", "polite", "cleaning issue"]

    resolved: { type: Boolean, default: false }, // admin ne feedback action liya ya nahi

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// export default mongoose.model("Feedback", feedbackSchema);
module.exports = mongoose.model("Feedback", feedbackSchema);