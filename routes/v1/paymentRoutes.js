const express = require("express");
const {
  createPayment,
  verifyPayment,
} = require("../../controllers/paymentController");
const router = express.Router();

router.post("/create-payment", createPayment); // Create a payment intent
router.post("/verify-payment", verifyPayment); // Verify the payment success

module.exports = { paymentRoutes : router};
