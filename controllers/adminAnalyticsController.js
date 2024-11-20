const { User } = require("../models/userModel");
const { Order } = require("../models/orderModel");
const { Restaurant } = require("../models/restModel");

// Get platform statistics: total users, orders, and total profit
const getPlatformStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.status(200).json({
      usersCount,
      ordersCount,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching platform stats", error: error.message });
  }
};

// Get orders by restaurant for chart data (Total orders per restaurant)
const getOrdersByRestaurant = async (req, res) => {
  try {
    const ordersByRestaurant = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.restaurant",
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      {
        $project: {
          restaurantName: "$restaurant.name",
          totalOrders: 1,
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(ordersByRestaurant);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching orders by restaurant",
        error: error.message,
      });
  }
};

// Get total profit (sum of all delivered orders)
const getTotalProfit = async (req, res) => {
  try {
    const totalProfit = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, totalProfit: { $sum: "$totalAmount" } } },
    ]);

    res.status(200).json({ totalProfit: totalProfit[0]?.totalProfit || 0 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching total profit", error: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getOrdersByRestaurant,
  getTotalProfit,
};
