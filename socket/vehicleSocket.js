module.exports.vehicleSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Cleaning Vehicle Connected:", socket.id);

    // 📍 Listen for location updates from vehicle
    socket.on("locationUpdate", (data) => {
      // Expected data: { vehicleId, lat, lng }
      console.log("Vehicle Location Received:", data);

      // Broadcast updated location to all connected clients (frontend map)
      io.emit("vehicleLocationUpdate", data);
    });

    // 🚪 When vehicle disconnects
    socket.on("disconnect", () => {
      console.log("Vehicle Disconnected:", socket.id);
    });
  });
};
