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

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo:{type: String},
    profilePic: { type: String },
    profilePicPublicId: { type: String, default: "" }, // cloudinary public id for deletation
    password: { type: String }, // optional if Google signup
    googleId: { type: String },

    referralCode: { type: String },
    referredBy: { type: String },

    coins: {
      total: { type: Number, default: 0 },
      earned: { type: Number, default: 0 },
      redemed: { type: Number, default: 0 },
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    eligibleForNewPass:{type:Boolean,default:false},
    token:{type:String},

    withdrawHistory: [withdrawHistorySchema],
    bankDetails: bankDetailsSchema,

    reportHistory: [
      {
        reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],

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

module.exports = mongoose.model("User", userSchema);
