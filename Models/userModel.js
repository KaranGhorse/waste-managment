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
    balance: { type: Number, default: 0 },           // available coins user ke paas
    earnedTotal: { type: Number, default: 0 },       // lifetime earned (record keeping)
    spentTotal: { type: Number, default: 0 },        // total used/withdrawn
    pendingWithdrawal: { type: Number, default: 0 }, // withdrawal request me jo hold hai
    locked: { type: Number, default: 0 },            // temporarily blocked (fraud/review)
    updatedAt: { type: Date, default: Date.now }     // last coins update time
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
   role: {
    type: String,
    default: "USER"
   },
    withdrawHistory: [withdrawHistorySchema],
    bankDetails: bankDetailsSchema,

    reports: [
      {
        reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
      
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
