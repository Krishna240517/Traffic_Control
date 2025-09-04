import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Driver from "./models/Driver.js";
import Vehicle from "./models/Vehicle.js";
import Tracking from "./models/Tracking.js";
import Violation from "./models/Violation.js";

dotenv.config();

const seedData = async () => {
  try {
    // 1️⃣ Connect
    await connectDB();
    console.log("✅ MongoDB Connected for Seeding");

    // 2️⃣ Clear old data
    await Promise.all([
      User.deleteMany(),
      Driver.deleteMany(),
      Vehicle.deleteMany(),
      Tracking.deleteMany(),
      Violation.deleteMany(),
    ]);
    console.log("🧹 Old data cleared");

    // 3️⃣ Vehicles
    const vehicles = await Vehicle.insertMany([
      { plateNumber: "DL01AB1234", type: "Car", status: "Active" },
      { plateNumber: "MH12CD5678", type: "Truck", status: "Active" },
      { plateNumber: "KA05EF9101", type: "Bike", status: "Inactive" },
    ]);
    console.log("🚘 Vehicles added");

    // 4️⃣ Users (with hashed passwords)
    await User.insertMany([
      { 
        name: "Admin User", 
        email: "admin@example.com", 
        password: await bcrypt.hash("admin123", 10), 
        role: "admin" 
      },
      { 
        name: "Driver One", 
        email: "driver1@example.com", 
        password: await bcrypt.hash("driver123", 10), 
        role: "driver" 
      },
      { 
        name: "Driver Two", 
        email: "driver2@example.com", 
        password: await bcrypt.hash("driver123", 10), 
        role: "driver" 
      },
    ]);
    console.log("👤 Users added");

    // 5️⃣ Drivers
    await Driver.insertMany([
      { name: "Ravi Sharma", licenseNumber: "DL123456", assignedVehicle: vehicles[0]._id },
      { name: "Suresh Kumar", licenseNumber: "MH654321", assignedVehicle: vehicles[1]._id },
    ]);
    console.log("👨‍✈️ Drivers added");

    // 6️⃣ Tracking (spread over different times for charts)
    const now = new Date();
    await Tracking.insertMany([
      { vehicle: vehicles[0]._id, lat: 28.7041, lng: 77.1025, speed: 60, congestionLevel: 65, timestamp: new Date(now.getTime() - 15 * 60000) },
      { vehicle: vehicles[1]._id, lat: 19.076, lng: 72.8777, speed: 85, congestionLevel: 85, timestamp: new Date(now.getTime() - 10 * 60000) },
      { vehicle: vehicles[2]._id, lat: 12.9716, lng: 77.5946, speed: 0, congestionLevel: 95, timestamp: new Date(now.getTime() - 5 * 60000) },
      { vehicle: vehicles[0]._id, lat: 28.7041, lng: 77.1025, speed: 50, congestionLevel: 40, timestamp: now },
    ]);
    console.log("📍 Tracking data added");

    // 7️⃣ Violations (spread over multiple days)
    await Violation.insertMany([
      { vehicle: vehicles[0]._id, type: "Speeding", fine: 500, timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
      { vehicle: vehicles[1]._id, type: "Signal Jump", fine: 1000, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) }, // 1 day ago
      { vehicle: vehicles[2]._id, type: "No Helmet", fine: 300, timestamp: now }, // today
    ]);
    console.log("🚨 Violations added");

    console.log("✅ Database Seeding Completed Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
