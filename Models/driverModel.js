// import mongoose from "mongoose";
const mongoose = require("mongoose");
const withdrawHistorySchema = new mongoose.Schema({
  amount: Number,
  method: String, // "bank" or "upi"
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  upiId: String,
});

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String },

    coins: {
      total: { type: Number, default: 0 },
      earned: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
    },

    withdrawHistory: [withdrawHistorySchema],
    bankDetails: bankDetailsSchema,

    active: { type: Boolean, default: false },
    
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    rating: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      totalWork: { type: Number, default: 0 },
    },

    reportStats: {
      totalReports: { type: Number, default: 0 },
      accepted: { type: Number, default: 0 },
      declined: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
    },

    feedbacks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
],


    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// export default mongoose.model("", );
module.exports = mongoose.model("Driver", driverSchema);