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
app.get('/home', (req,res)=>{
  res.send("hello user");
});
app.use('/api/v1/user/', userRouter)
app.use('/api/v1/report/', reportRouter)

// Integrate Socket.io handler
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
