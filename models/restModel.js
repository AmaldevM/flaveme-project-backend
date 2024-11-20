const mongoose = require("mongoose");

const restSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  openingHours: {
    open: { type: String },
    close: { type: String },
  },
  isActive: { type: Boolean, default: true },
  image: {
    type: [String],
    default:
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },
});


const Restaurant = mongoose.model("restaurant", restSchema);
module.exports = { Restaurant };
