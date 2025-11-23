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
    balance: { type: Number, default: 0 },           // available coins user ke paas
    earnedTotal: { type: Number, default: 0 },       // lifetime earned (record keeping)
    spentTotal: { type: Number, default: 0 },        // total used/withdrawn
    pendingWithdrawal: { type: Number, default: 0 }, // withdrawal request me jo hold hai
    locked: { type: Number, default: 0 },            // temporarily blocked (fraud/review)
    updatedAt: { type: Date, default: Date.now }     // last coins update time
  },

    withdrawHistory: [withdrawHistorySchema],
    bankDetails: bankDetailsSchema,

    active: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    eligibleForNewPass:{type:Boolean,default:false},
     isVerified:{
        type:Boolean,
        default: false
    },
    token:{type:String},
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    rating: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      totalWork: { type: Number, default: 0 },
    },
 reports: [
      {
        reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
      
      },
    ],
    
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