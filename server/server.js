import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import analyticsRoutes from "./routes/adminAnalytics.js";
import activityRoutes from "./routes/adminActivity.js"; // new recent activity route
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Allow only the frontend origin in production for security. Falls back to '*' if CLIENT_URL not set.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/activity", activityRoutes);
app.use("/api/admin", adminRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Waste Tracker API is running...");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Listen for driver location updates
  socket.on("updateLocation", (driver) => {
    console.log("Driver location update:", driver);
    io.emit("driverLocationUpdate", driver); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
