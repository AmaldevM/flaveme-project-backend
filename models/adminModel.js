const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "admin" },
    profilePic: { type: String },
    phone: { type: String,  }, 
  },
  { timestamps: true }
);

// Add index for email field
adminSchema.index({ email: 1 });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
