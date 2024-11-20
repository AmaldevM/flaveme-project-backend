const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
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
