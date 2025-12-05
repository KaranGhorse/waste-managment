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

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional if Google signup
    phoneNo:{type: String},
    profilePic: { type: String },
    profilePicPublicId: { type: String, default: "" }, // cloudinary public id for deletation
    googleId: { type: String },
role:String,
    isVerified:{
        type:Boolean,
        default: false
    },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    eligibleForNewPass:{type:Boolean,default:false},
    token:{type:String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
