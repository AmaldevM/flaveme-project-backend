const express = require("express");
const {
  getPlatformStats,
  getOrdersByRestaurant,
  getTotalProfit,
} = require("../../controllers/adminAnalyticsController");
const router = express.Router();

// Get platform statistics (users, orders, revenue)
router.get("/platform-stats", getPlatformStats);

// Get orders by restaurant (for chart data)
router.get("/orders-by-restaurant", getOrdersByRestaurant);

// Get total profit (sum of all delivered orders)
router.get("/total-profit", getTotalProfit);

module.exports =  { adminAnalyticsRouter : router};
