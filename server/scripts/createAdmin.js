
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const User = require("../models/User");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from server/.env");
    }

    const email = (await ask("Admin email: ")).trim().toLowerCase();
    const name = (await ask("Admin name: ")).trim();
    const password = await ask("Admin password (minimum 12 characters): ");

    if (!email || !name || password.length < 12) {
      throw new Error(
        "Enter a name, email, and password of at least 12 characters."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(
        "An account with this email already exists. No changes were made."
      );
      console.log(
        "Use a separate admin email, or contact your existing administrator."
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      status: "active",
    });

    console.log(`Admin account created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
