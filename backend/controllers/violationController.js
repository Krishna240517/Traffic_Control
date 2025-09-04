import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Violation from "./models/Violation.js";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
  },
});

// 🔔 Emit latest violations from MongoDB when client connects
io.on("connection", async (socket) => {
  console.log("🚦 Client connected to Live Alerts");

  // Send last 5 violations immediately
  const recentViolations = await Violation.find()
    .populate("vehicle") // fetch plateNumber
    .sort({ createdAt: -1 })
    .limit(5);

  recentViolations.forEach((v) => {
    socket.emit("alert", {
      vehicle: v.vehicle?.plateNumber || "Unknown",
      type: v.type,
      fine: v.fine,
      lat: v.vehicle?.lat || "N/A",
      lng: v.vehicle?.lng || "N/A",
      timestamp: v.timestamp,
    });
  });

  // Listen for new violations in DB (Change Streams)
  const changeStream = Violation.watch();

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const newViolation = await Violation.findById(change.fullDocument._id)
        .populate("vehicle");

      socket.emit("alert", {
        vehicle: newViolation.vehicle?.plateNumber || "Unknown",
        type: newViolation.type,
        fine: newViolation.fine,
        lat: newViolation.vehicle?.lat || "N/A",
        lng: newViolation.vehicle?.lng || "N/A",
        timestamp: newViolation.timestamp,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error(err));
