const bcrypt = require("bcrypt");
const User = require("../model/user_Model");

async function ensureAdminUser() {
  const adminEmail = "admin@batchmate.com";
  const existing = await User.findOne({ email: adminEmail }).select("+password");
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const password = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: "BatchMate Admin",
    email: adminEmail,
    password,
    role: "admin",
  });
  console.log("Admin account created:", adminEmail);
}

module.exports = { ensureAdminUser };
