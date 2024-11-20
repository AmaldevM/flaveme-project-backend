const express = require("express");
const {
  getOrderHistory,
  trackOrder,
} = require("../../controllers/orderHistoryController");
const router = express.Router();

// Get user's order history
router.get("/order-history", getOrderHistory);

// Track a specific order by ID
router.get("/track-order/:orderId", trackOrder);

module.exports = { orderHistoryRouter : router};
