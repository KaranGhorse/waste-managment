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
        return res
          .status(400)
          .json({ success: false, errors: errors.array() });
      }

      const { latitude, longitude, address, type, weight, notes } = req.body;
      const userId = req.id;

      // ✅ Validate image count (min 1, max 3)
      if (!req.files || req.files.length < 1 || req.files.length > 3) {
        return res.status(400).json({
          success: false,
          message: "Please upload minimum 1 or maximum 3 images.",
        });
      }

      // ✅ Check if user exists
      const user = await userModel.findById(userId);
      if (!user)
        return res.status(404).json({ success: false, message: "User not found." });

      const data = await findNearbyRecentReportWithInHours(latitude, longitude);

      if (data.length != 0) {
        return res.status(400).json({
          success: false,
          message: "All Ready Report Posted From This Area",
        });
      }
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

      const userCoins = randomCoinGen();
      const driverCoins = randomCoinGen();

      // ✅ Create report
      const newReport = new reportModel({
        reportedBy: userId,
        userCoinsEarned: userCoins,
        driverCoinsEarned: driverCoins,
        location: { lat: latitude, lng: longitude, address },
        photos: uploadedImages,
        type: { reportedType: type },
        weight: { reportedWeight: weight },
        notes,
        status: "pending",
      });

      await newReport.save();
      console.log("new report here creted");
      
      // ✅ Update user's coin balance
      user.coins.balance += userCoins;
      user.coins.earnedTotal += userCoins;
      user.coins.updatedAt = new Date();
      user.reports.push(newReport._id)
      await user.save();

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

      // ✅ Send success response
      res.status(201).json({
        success: true,
        message: "Report created successfully!",
        report: newReport,
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


module.exports = router