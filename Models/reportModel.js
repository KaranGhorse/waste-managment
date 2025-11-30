const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },

    userCoinsEarned: { type: Number, default: 0 },
    driverCoinsEarned: { type: Number, default: 0 },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    photos: [
        {
            url: {
                type: String,
                required: true
            },
            public_id:{
                type:String,
                required: true
            }
        }
    ] ,// cloudinary public id for deletation
    type: {
      reportedType: {type:String, enum: ["dry waste", "bio waste", "solid waste", "all"]}, // what user selected
      verifiedType: {type:String, enum: ["dry waste", "bio waste", "solid waste", "all"]}, // what driver verified
    },
    weight: {  // optional
      reportedWeight: String, // what user selected
      verifiedWeight: String, // what driver verified
    },
 

    status: { type: String, enum: ["new","pending", "accepted", "rejected","done"], default: "new" },

    timestamps: {
      createdAt: { type: Date, default: Date.now },
      acceptedAt: Date,
      completedAt: Date,
      rejectedAt: Date,
    },

    notes: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Report", reportSchema);