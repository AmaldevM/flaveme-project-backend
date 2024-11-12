const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstname: { type: String, required: true },
  lastname: { type: String },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true, match: /^[0-9]{5,6}$/ }, // Ensure pincode fits your region
});

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address };
