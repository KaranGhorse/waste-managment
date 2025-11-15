// utils/reportUtils.js
const reportModel = require("../Models/reportModel");

// Convert degree to radians 
const toRad = (deg) => (deg * Math.PI) / 180;
// Calculate distance (in meters) between two lat/lng 
const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius (m)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 🎲 Random coin generator (inclusive)
 */
const randomCoinGen = (min = 5, max = 35) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Find reports created in last X hours (default 5)

const findReportsWithinHours = async (hours = 5) => {
  const now = new Date();
  const past = new Date(now.getTime() - hours * 60 * 60 * 1000);
  console.log("time - ",now,past);
  
  return await reportModel.find({
    createdAt: { $gte: past, $lte: now },
    "location.lat": { $exists: true },
    "location.lng": { $exists: true },
  });
};

/**
 * Only checks recent reports (5 hours by default)
 * Find if any report exists within given radius (e.g., 70m)
 */
const findNearbyRecentReportWithInHours = async (lat, lng, radius = 70, hours = 5) => {
  const recentReports = await findReportsWithinHours(hours);
  console.log("check recent reports :", recentReports.length);
  if(recentReports.length == 0){
    console.log("no recent reports here go back");
    return []
  }
  console.log("no recent reports then why here ???");

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  const nearby = recentReports.filter((r) => {
    const rLat = r.location?.lat;
    const rLng = r.location?.lng;
    if (!rLat || !rLng) return false;

    const distance = getDistanceMeters(latNum, lngNum, rLat, rLng);
    return distance <= radius;
  });

  return nearby; // Array of reports within 70m & 5 hours
};


function getNearbyDrivers(lat, lng, drivers ,radius = 3000) {
  // Map driverId → driverData
  const nearby = [];

  for (const [driverId, driver] of drivers) {
    if (!driver.lat || !driver.lng) continue;

    const distance = getDistanceMeters(
      lat,
      lng,
      driver.lat,
      driver.lng
    );
console.log(distance)
    if (distance <= radius) {
      nearby.push({
        driverId,
        socketId: driver.socketId,
        distance,
        lat: driver.lat,
        lng: driver.lng
      });
    }
  }
  return nearby;
}

module.exports = {
  randomCoinGen,
  findReportsWithinHours,
  findNearbyRecentReportWithInHours,
  getNearbyDrivers
};
