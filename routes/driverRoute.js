const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const { emailVerify ,resetPassEmail} = require("../utils/emailverify");
const { isAuthenticated } = require("../middleware/authMiddelware");
const driverModel = require('../Models/driverModel')
// ---------------------- ROUTES ----------------------

//✅✅ Verify Email 
router.get("/verify/:token", async(req,res)=>{
    try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const driver = await driverModel.findById(decoded.id);
    if (!driver) return res.status(404).json({ success: false, message: "driver not found" });

    driver.isVerified = true;
    await driver.save();

    res.status(200).json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
});

//✅✅ Login
router.post("/login",[
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    console.log("hello");
    
    const { email, password } = req.body;
    const driver = await driverModel.findOne({ email });
    if (!driver)
      return res.status(404).json({ success: false, message: "driver not found" });

    // const isMatch = await bcrypt.compare(password, driver.password);
    // if (!isMatch)
    //   return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      driver,
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
    const driver = await driverModel.findOne({ email });
    if (!driver)
      return res.status(404).json({ success: false, message: "driver not found" });

    driver.otp = Math.floor(100000 + Math.random() * 900000).toString();
    driver.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10min

    resetPassEmail(driver.otp,driver.email);

    await driver.save()
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
router.post('/verify-otp/:email', async(req,res)=>{
  try {
    if (!req.body.otp) return res.status(400).json({ success: false, message: "otp is require" })

        const driver = await driverModel.findOne({ email: req.params.email })
        if (!driver) return res.status(400).json({ sucess: false, message: "driver not found" })

        if (!driver.otp || !driver.otpExpiry) return res.status(400).json({ sucess: false, message: "OTP not genrated or Expired !" })

        if (driver.otpExpiry < new Date()) return res.status(400).json({ sucess: false, message: "OTP Expired request for new OTP !" })

        if (driver.otp !== req.body.otp) return res.status(400).json({ sucess: false, message: "Invailid OTP !" })
        driver.otp = null
        driver.otpExpiry = null
        driver.eligibleForNewPass=true;
        await driver.save();
        return res.status(201).json({ message: "OTP Verification successfully", success: true });

  } catch (error) {
    res.status(500).json({success:false,message: error.message})
  }
})

//✅✅
router.get('/resend-otp/:email',async(req,res)=>{
  try {
    const email = req.params.email;
    const driver = await driverModel.findOne({ email });
    if (!driver)
      return res.status(404).json({ success: false, message: "driver not found" });
    
    if(!driver.otp)
      return res.status(404).json({ success: false, message: "First try to Forgot Password!" });

    driver.otp = Math.floor(100000 + Math.random() * 900000).toString();
    driver.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10min

    resetPassEmail(driver.otp,driver.email);

    await driver.save()
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({success:false,message: error.message})
  }
})

//✅✅
router.post('/new-password/:email', async(req,res)=>{
  try {
        const { newPassword } = req.body

        const driver = await driverModel.findOne({ email: req.params.email })

        if (!driver)
            return res.status(400).json({ sucess: false, message: "driver not found" })

        if (!newPassword )
            return res.status(400).json({ sucess: false, message: "All fields required" })
          
          if(!driver.eligibleForNewPass)
            return res.status(400).json({ sucess: false, message: "UnAuthoried" })

        const password = await bcrypt.hash(newPassword, 10);

        driver.password = password;
        driver.eligibleForNewPass=false;
        await driver.save();

        return res.status(200).json({ message: "Password changed successfully!", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", success: false });

    }
})


//  Update Profile
router.put("/update-profile",isAuthenticated ,async(req,res)=>{

});

//✅✅
router.get('/',isAuthenticated, async(req,res)=>{
    try {
        const driver = await driverModel.findById(req.id)

        if(!driver) 
          return res.status(404).json({success: false, message: "driver not found!"})

        res.status(200).json({success: true,message:"welCome", driver})


    } catch (error) {
    console.error("send driverdat Error:", error);
    res.status(500).json({ success: false, message: "Server error during fetch data" });
  }
})

module.exports = router;
