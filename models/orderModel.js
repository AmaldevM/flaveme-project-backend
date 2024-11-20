const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "dispatched", "delivered"],
      default: "pending",
    },
    paymentId: { type: String }, // Optional: can be used to store Stripe/PayPal payment ID
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };
