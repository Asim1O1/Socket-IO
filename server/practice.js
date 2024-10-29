import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Initialize Express
const app = express();

// Enable CORS
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;

// Set up a basic route
app.get("/get", (req, res) => {
  res.send("Learning socket.io...");
});

// Start the server
server.listen(PORT, () => {
  console.log("Connected to the HTTP server listening on port " + PORT);
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data); // Broadcast message to other users
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});
