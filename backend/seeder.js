import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedUsers = async () => {
  try {
    // Remove old seeded users (optional)
    await User.deleteMany({
      role: { $in: ["ADMIN", "AUDITOR"] }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create Admin
    const admin = await User.create({
      name: "System Admin",
      email: "admin@backup.com",
      password: hashedPassword,
      role: "ADMIN"
    });

    // Create Auditor
    const auditor = await User.create({
      name: "Security Auditor",
      email: "auditor@backup.com",
      password: hashedPassword,
      role: "AUDITOR"
    });

    console.log("✅ Seeded Users Successfully:");
    console.log("ADMIN:", admin.email);
    console.log("AUDITOR:", auditor.email);

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();