const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const { emailVerify, resetPassEmail, OtpEmail } = require("../utils/emailverify");
const { isAuthenticated } = require("../middleware/authMiddelware");
const userModel = require('../Models/userModel');
const reportModel = require('../Models/reportModel');
const { uniqueReferralCode, randomOtp } = require("../utils/service");
// ---------------------- ROUTES ----------------------
//✅✅
router.post('/signup', [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
], async (req, res) => {
  console.log("register touched");

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, referredBy } = req.body;

    const exitingUser = await userModel.findOne({ email });
    if (exitingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const referralCode = uniqueReferralCode();
    const otp = randomOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    const hashPassword = await bcrypt.hash(password, 10)
    let newUser;
    if (!referredBy)
      newUser = new userModel({ name, email, password: hashPassword, referralCode, otpExpiry,otp });
    else
      newUser = new userModel({ name, email, password: hashPassword, referralCode, referredBy, otpExpiry,otp });

    OtpEmail(otp, email, "Signup Verification OTP") // send email to user
    await newUser.save();
    res.status(201).json({ message: "Signup successful! Verification email sent.", success: true });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error", success: false })
  }
})

//✅✅ Verify Email 
router.post("/verify/otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) 
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || !user.otpExpiry) 
      return res.status(400).json({ sucess: false, message: "OTP not genrated or Expired !" })

    if (user.otpExpiry < new Date()) 
      return res.status(400).json({ sucess: false, message: "OTP Expired request for new OTP !" })

    if (user.otp !== otp)
      return res.status(400).json({ sucess: false, message: "Invailid OTP !" })
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.isVerified=true;
    user.otp = null
    user.otpExpiry = null
    user.token = token
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully!",user,token });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
});

//✅✅
router.get('/resend-otp/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp)
      return res.status(404).json({ success: false, message: "First try to Forgot Password!" });

    user.otp = randomOtp();
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10min

    OtpEmail(user.otp, user.email, "Otp");

    await user.save()
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})  


//✅✅ Login
router.post("/login", [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      if (!user.isVerified)
        return res.status(404).json({ success: false, message: "User not Verified" });

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Server error during login" });
    }
  });

// ✅✅ Forgot Password
router.post("/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      user.otp = randomOtp()
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10min

      OtpEmail(user.otp, user.email, "Reset Password OTP");

      await user.save()
      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ success: false, message: "Server error during forgot password" });
    }
  });

//✅✅
router.post('/verify-otp/:email', async (req, res) => {
  try {
    if (!req.body.otp) return res.status(400).json({ success: false, message: "otp is require" })

    const user = await userModel.findOne({ email: req.params.email })
    if (!user) return res.status(400).json({ sucess: false, message: "User not found" })

    if (!user.otp || !user.otpExpiry) return res.status(400).json({ sucess: false, message: "OTP not genrated or Expired !" })

    if (user.otpExpiry < new Date()) return res.status(400).json({ sucess: false, message: "OTP Expired request for new OTP !" })

    if (user.otp !== req.body.otp) return res.status(400).json({ sucess: false, message: "Invailid OTP !" })
    user.otp = null
    user.otpExpiry = null
    user.eligibleForNewPass = true;
    await user.save();
    return res.status(201).json({ message: "OTP Verification successfully", success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

//✅✅
router.post('/new-password/:email', async (req, res) => {
  try {
    const { newPassword } = req.body

    const user = await userModel.findOne({ email: req.params.email })

    if (!user)
      return res.status(400).json({ sucess: false, message: "User not found" })

    if (!newPassword)
      return res.status(400).json({ sucess: false, message: "All fields required" })

    if (!user.eligibleForNewPass)
      return res.status(400).json({ sucess: false, message: "UnAuthoried" })

    const password = await bcrypt.hash(newPassword, 10);

    user.password = password;
    user.eligibleForNewPass = false;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully!", success: true });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", success: false });

  }
})


//  Update Profile
router.put("/update-profile", isAuthenticated, async (req, res) => {

});

//✅✅
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await userModel.findById(req.id)

    if (!user)
      return res.status(404).json({ success: false, message: "user not found!" })

    const reports = await reportModel.find({reportedBy: user._id})

    res.status(200).json({ success: true, message: "welCome", user ,reports})


  } catch (error) {
    console.error("send userdat Error:", error);
    res.status(500).json({ success: false, message: "Server error during fetch data" });
  }
})

module.exports = router;
