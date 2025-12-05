const express = require("express");
const router = express.Router();
let io=null;
const {getIO,getConnectedDrivers,getConnectedAdmins,getConnectedUsers} = require('../socket/vehicleSocket')
const { body, validationResult } = require("express-validator");

const { multipleUpload } = require('../config/multer')
const cloudinary = require('../config/cloudinary');
const userModel = require("../Models/userModel");
const reportModel = require("../Models/reportModel");


const { randomCoinGen, findNearbyRecentReportWithInHours, getNearbyDrivers } = require("../utils/reportsUtils");
const { isAuthenticated } = require("../middleware/authMiddelware");
const driverModel = require("../Models/driverModel");


router.post("/make-report",multipleUpload,
  [
    body("latitude").notEmpty().withMessage("latitude is required"),
    body("longitude").notEmpty().withMessage("longitude is required"),
    body("type").notEmpty().withMessage("type is required"),
  ],
  isAuthenticated,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Error in express validation in body");
        
        return res
        .status(400)
        .json({ success: false, errors: errors.array() });
      }
      
      console.log("Request body:", req.body);
      const { latitude, longitude, address, type, weight, notes } = req.body;
      const userId = req.id;
      console.log("userid:", req.id);
      
      // ✅ Validate image count (min 1, max 3)
      if (!req.files || req.files.length < 1 || req.files.length > 3) {
        console.log("Invalid number of images uploaded");
        return res.status(400).json({
          success: false,
          message: "Please upload minimum 1 or maximum 3 images.",
        });
      }
      
      // ✅ Check if user exists
      const user = await userModel.findById(userId);
      if (!user){
        console.log("User not found");
        return res.status(404).json({ success: false, message: "User not found." });
      }
      
      console.log("User found =", user);
      const data = await findNearbyRecentReportWithInHours(latitude, longitude);
      console.log("Data found", data);
      
      if (data.length != 0) {
        return res.status(400).json({
          success: false,
          message: "All Ready Report Posted From This Area",
        });
      }
      // console.log("User found =", user);
      console.log("chek for files");
      // ✅ Upload all images to Cloudinary
      const uploadedImages = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) return reject(error);
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );
            uploadStream.end(file.buffer);
          });
        })
      );

      // ✅ Random coins between 5–35

      // const userCoins = randomCoinGen();
      // const driverCoins = randomCoinGen();

      // ✅ Create report
      let newReport = new reportModel({
        reportedBy: userId,
        // userCoinsEarned: userCoins,
        // driverCoinsEarned: driverCoins,
        location: { lat: latitude, lng: longitude, address },
        photos: uploadedImages,
        type: { reportedType: type },
        weight: { reportedWeight: weight },
        notes,
        status: "new",
      });

      await newReport.save();
      console.log("new report here creted");
      
      // ✅ Update user's coin balance
      // user.coins.balance += userCoins;
      // user.coins.earnedTotal += userCoins;
      // user.coins.updatedAt = new Date();
      user.reports.push(newReport._id)
      await user.save();
      
      newReport.populate({
        path: "reportedBy",
        select: "name email phoneNo"
      })

      const io = getIO();
      const drivers = getConnectedDrivers();
      let filterdDrivers = getNearbyDrivers(newReport.location.lat,newReport.location.lng,drivers,1000)
      console.log("total connected drivers ", drivers);
      console.log("filterd connected drivers ",filterdDrivers);
      
      filterdDrivers.forEach((driver) => {
        io.to(driver.socketId).emit("new-report", {
          report: newReport,
          distance: driver.distance,
          msg: "A new report is available near you."
        });

        console.log(`📢 Sent new-report to driver ${driver.socketId}`);
      });

      const report = await reportModel.findById(newReport._id)
  .populate("reportedBy", "name email phone") // fields limit
  .populate("acceptedBy", "name email phoneNo rating coins active");

      // ✅ Send success response
      res.status(201).json({
        success: true,
        message: "Report created successfully!",
        report,
        user
      });
    } catch (error) {
      console.error("Error in /make-report:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error: error.message });
    }
  }
);

router.get('/accept-report/:reportId',isAuthenticated ,async(req,res)=>{
try {
  const driver = await driverModel.findById(req.user._id)

  if(!driver)
    return res.status(400).json({success: false, message:"Driver not found"})
  
  console.log(req.params.reportId);
  const report = await reportModel.findById(req.params.reportId)
  
  report.acceptedBy = driver._id;
  report.status = "pending";
  await report.save()
  
  driver.reports.push({ reportId: report._id })
  driver.pending = driver.pending + 1;
  driver.accepted = driver.accepted + 1;
  
  await driver.save()

// send socket notification to user
  const connectedUsers = getConnectedUsers();

  connectedUsers.forEach((user) => {
    if (user.userId.toString() === report.reportedBy.toString()) {
      const io = getIO();
      io.to(user.socketId).emit("report-accepted", {
        report,
        driver,
        msg: "Your report has been accepted by a driver."
      });

      console.log(`📢 Sent report-accepted to user ${user.socketId}`);
    }
  }); 
  
  res.status(200).json({success: true, message: "report added", report, driver})
  
} catch (error) {
  console.log(error);
  
  return res.status(500).json({success: false, message: error.message})
}
})
module.exports = router