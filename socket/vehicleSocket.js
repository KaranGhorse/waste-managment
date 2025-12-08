const driverModel = require("../Models/driverModel");

let io;
// Maps
const connectedDrivers = new Map(); // key = driverId
const connectedUsers = new Map();   // key = userId
const connectedAdmins = new Map();   // key = adminId

const socketHandler = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    
    //todo DRIVER CONNECT
    socket.on("driver_connect", async (data) => {
      let driver = await driverModel.findById(data.driverId)
      driver.active = true;
      await driver.save();
      // data = { driverId, lat, lng ,id}
      connectedDrivers.set(data.driverId, {
        socketId: socket.id,
        lat: data.lat,
        lng: data.lng,
        lastUpdate: Date.now()
      });

      console.log("🚗 Driver connected:", data);
    });

    
    // todo USER CONNECT
    socket.on("user_connect", (data) => {
      // data = { userId, id }
      connectedUsers.set(data.userId, {
        socketId: socket.id,
      });

      console.log("👤 User connected:", data.userId);
    });

    
    //todo Driver CONNECT
    socket.on("admin_connect", (data) => {
      // data = { userId, id }
      connectedDrivers.set(data.adminId, {
        socketId: socket.id,
      });

      console.log("👤 User connected:", data.userId);
    });

    
    // todo DRIVER LOCATION UPDATE
    socket.on("driver_location", (data) => {
      // { driverId, lat, lng }
      if (connectedDrivers.has(data.driverId)) {
        const driver = connectedDrivers.get(data.driverId);
        driver.lat = data.lat;
        driver.lng = data.lng;
        driver.lastUpdate = Date.now();

        connectedDrivers.set(data.driverId, driver);
        console.log(`📍 Driver ${data.driverId} location updated`);
      }
    });

    
    // todod DISCONNECT 
    socket.on("disconnect",async () => {
      console.log("❌ Client disconnected:", socket.id);

      // Remove from drivers map
      for (const [driverId, driverData] of connectedDrivers) {
        if (driverData.socketId === socket.id) {
          let driver = await driverModel.findById(driverId)
          driver.active = false;
          connectedDrivers.delete(driverId);
          console.log("🚗 Driver removed:", driverId);
        }
      }

      // Remove from users map
      for (const [userId, userData] of connectedUsers) {
        if (userData.socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log("👤 User removed:", userId);
        }
      }
      // Remove from Admin map
      for (const [adminId, adminData] of connectedAdmins) {
        if (adminData.socketId === socket.id) {
          connectedAdmins.delete(adminId);
          console.log("👤 Admin removed:", adminId);
        }
      }
    });
  });
};

// Exports
function getIO() {
  return io;
}

function getConnectedDrivers() {
  return connectedDrivers;
}

function getConnectedUsers() {
  return connectedUsers;
}
function getConnectedAdmins() {
  return connectedAdmins;
}

module.exports = { socketHandler, getIO, getConnectedDrivers, getConnectedUsers,getConnectedAdmins };
