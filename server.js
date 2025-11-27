const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./DB/conn.js");
const { socketHandler } = require("./socket/vehicleSocket");

const userRouter = require('./routes/userRoute.js')
const reportRouter = require('./routes/reportRoute.js')
const adminRouter = require('./routes/adminRoute.js')
const driverRouter = require('./routes/driverRoute.js')

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
socketHandler(io);

app.get('/', (req, res) => {
  try {
    const uptime = process.uptime(); // in seconds
    const now = new Date();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Health Check</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f9; color: #333; text-align: center; padding: 50px; }
          h1 { color: #4CAF50; }
          .card { background: #fff; padding: 20px; margin: 20px auto; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 400px; }
          p { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Server is Running</h1>
          <p><strong>Timestamp:</strong> ${now.toISOString()}</p>
          <p><strong>Uptime:</strong> ${Math.floor(uptime / 60)} min ${Math.floor(uptime % 60)} sec</p>
        </div>
      </body>
      </html>
    `;

    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
});
app.use('/api/v1/user/', userRouter)
app.use('/api/v1/admin/', adminRouter)
app.use('/api/v1/report/', reportRouter)
app.use('/api/v1/driver/', driverRouter)



const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
