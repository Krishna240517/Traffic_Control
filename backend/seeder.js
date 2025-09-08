 import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import connectDB from "./config/db.js";

import User from "./models/User.js";
import Driver from "./models/Driver.js";
import Vehicle from "./models/Vehicle.js";
import Tracking from "./models/Tracking.js";
import Violation from "./models/Violation.js";
import Fine from "./models/Fine.js";
import Toll from "./models/Toll.js";
import Wallet from "./models/Wallet.js";

dotenv.config();

// Load traffic.json
const trafficData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "traffic.json"))
);

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
      Fine.deleteMany(),
      Toll.deleteMany(),
      Wallet.deleteMany(),
    ]);
    console.log("🧹 Old data cleared");

    // 3️⃣ Users (owners & drivers)
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        name: "Driver One",
        email: "driver1@example.com",
        password: await bcrypt.hash("driver123", 10),
        role: "driver",
      },
      {
        name: "Driver Two",
        email: "driver2@example.com",
        password: await bcrypt.hash("driver123", 10),
        role: "driver",
      },
    ]);
    console.log("👤 Users added");

    const ownerUser = users.find(u => u.role === "driver");

    // 4️⃣ Vehicles
    const vehicles = await Vehicle.insertMany([
      { 
        plateNumber: "DL01AB1234", 
        type: "Car", 
        status: "active",        // lowercase
        obuId: "OBU001", 
        ownerId: ownerUser._id 
      },
      { 
        plateNumber: "MH12CD5678", 
        type: "Truck", 
        status: "active", 
        obuId: "OBU002", 
        ownerId: ownerUser._id 
      },
      { 
        plateNumber: "KA05EF9101", 
        type: "Bike", 
        status: "inactive", 
        obuId: "OBU003", 
        ownerId: ownerUser._id 
      },
    ]);
    console.log("🚘 Vehicles added");

    // 5️⃣ Drivers
    const drivers = await Driver.insertMany([
      {
        name: "Ravi Sharma",
        licenseNumber: "DL123456",
        assignedVehicle: vehicles[0]._id,
      },
      {
        name: "Suresh Kumar",
        licenseNumber: "MH654321",
        assignedVehicle: vehicles[1]._id,
      },
    ]);
    console.log("👨‍✈️ Drivers added");

    // 6️⃣ Tracking (manual sample)
    const now = new Date();
    await Tracking.insertMany([
      {
        vehicle: vehicles[0]._id,
        lat: 28.7041,
        lng: 77.1025,
        speed: 60,
        congestionLevel: 65,
        timestamp: new Date(now.getTime() - 15 * 60000),
      },
      {
        vehicle: vehicles[1]._id,
        lat: 19.076,
        lng: 72.8777,
        speed: 85,
        congestionLevel: 85,
        timestamp: new Date(now.getTime() - 10 * 60000),
      },
    ]);
    console.log("📍 Tracking (manual) added");

    // 7️⃣ Violations (manual)
    await Violation.insertMany([
      {
        vehicle: vehicles[0]._id,
        type: "Speeding",
        fine: 500,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        vehicle: vehicles[1]._id,
        type: "Signal Jump",
        fine: 1000,
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log("🚨 Violations added");

    // 8️⃣ Wallets (manual)
    for (const d of drivers) {
      await Wallet.create({
        user: d._id,
        balance: 1000,
      });
    }
    console.log("💰 Wallets added");

    // 9️⃣ Traffic.json integration
    for (const trip of trafficData) {
      // Vehicle
      let vehicle = await Vehicle.findOne({ plateNumber: `TEMP-${trip.trip_id}` });
      if (!vehicle) {
        vehicle = await Vehicle.create({
          plateNumber: `TEMP-${trip.trip_id}`,
          type: "Truck",
          status: "active",
          obuId: `OBU-${trip.trip_id}`,
          ownerId: ownerUser._id
        });
      }

      // Driver
      let driver = await Driver.findOne({ licenseNumber: trip.driver_id });
      if (!driver) {
        driver = await Driver.create({
          name: `Driver-${trip.driver_id}`,
          licenseNumber: trip.driver_id,
          assignedVehicle: vehicle._id,
        });
      }

      // Tracking
      await Tracking.create({
        vehicle: vehicle._id,
        driver: driver._id,
        route: trip.route,
        state: trip.state,
        distance: trip.distance_km,
        duration: trip.duration_minutes,
        speed: trip.avg_speed_kmh,
        behaviorClass: trip.behavior_class,
        behaviorLabel: trip.behavior_label,
        sensorFeatures: trip.sensor_features,
        safetyScore: trip.safety_score,
        grade: trip.grade,
        weather: trip.weather,
        timeOfDay: trip.time_of_day,
        trafficDensity: trip.traffic_density,
        accidentRisk: trip.accident_risk,
        timestamp: new Date(trip.timestamp * 1000),
      });

      // Fine (random)
      await Fine.create({
        vehicle: vehicle._id,
        type: "Overspeeding",
        amount: Math.floor(Math.random() * 1000),
        timestamp: new Date(),
      });

      // Toll (random)
      await Toll.create({
        vehicle: vehicle._id,
        location: trip.state,
        amount: Math.floor(Math.random() * 500),
        timestamp: new Date(),
      });

      // Wallet (ensure exists)
      let wallet = await Wallet.findOne({ user: driver._id });
      if (!wallet) {
        wallet = await Wallet.create({
          user: driver._id,
          balance: 1500,
        });
      }
    }
    console.log("📊 Traffic.json data seeded");

    // 🔄 Update driver stats
    for (const driver of await Driver.find()) {
      const trips = await Tracking.find({ driver: driver._id });

      if (trips.length > 0) {
        const avgSafetyScore =
          trips.reduce((sum, t) => sum + (t.safetyScore || 0), 0) / trips.length;

        // Simple grading system
        let grade = "F";
        if (avgSafetyScore >= 90) grade = "A";
        else if (avgSafetyScore >= 75) grade = "B";
        else if (avgSafetyScore >= 60) grade = "C";
        else if (avgSafetyScore >= 45) grade = "D";

        driver.totalTrips = trips.length;
        driver.avgSafetyScore = Math.round(avgSafetyScore);
        driver.grade = grade;

        await driver.save();
      }
    }
    console.log("✅ Driver stats updated");

    // 🔄 Update vehicle stats
    for (const vehicle of await Vehicle.find()) {
      const trips = await Tracking.find({ vehicle: vehicle._id });

      if (trips.length > 0) {
        const avgSpeed =
          trips.reduce((sum, t) => sum + (t.speed || 0), 0) / trips.length;

        // Get latest trip for lastKnownLocation + timestamp
        const lastTrip = trips.sort((a, b) => b.timestamp - a.timestamp)[0];

        vehicle.totalTrips = trips.length;
        vehicle.avgSpeed = Math.round(avgSpeed);
        vehicle.lastKnownLocation = lastTrip.location || {
          type: "Point",
          coordinates: [0, 0],
        };
        vehicle.lastTrackedAt = lastTrip.timestamp;

        await vehicle.save();
      }
    }
    console.log("✅ Vehicle stats updated");

    console.log("✅ Database Seeding Completed Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
