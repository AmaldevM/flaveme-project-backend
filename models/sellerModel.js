const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true, select: false }, // Password will not be returned in queries
    storeName: { type: String, required: true },
    phone: {
      type: String,
      match: [
        /^\+?(\d{1,4})\)?[-.\s]?(\d{1,15})$/,
        "Please fill a valid phone number",
      ],
    },
    address: { type: String },
  },
  { timestamps: true }
); 

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = { Seller };
