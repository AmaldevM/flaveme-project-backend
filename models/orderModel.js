const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", require: true,  },
  items: [{
    menuitem: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuitem",
      require: true, },
    food: { type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',required: true, },
      quantity: { type: Number, require: true },
      price: { type: Number, require: true }, }, ],
  totalPrice: { type: Number, require: true },
  status: { type: String,enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: "Pending" },
  createdAt: { type: Date, default: Date.now, }
});

const Order = mongoose.model("order", orderSchema);

module.exports = { Order };
