const { Order } = require("../models/orderModel");

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate(
      "items.restaurant"
    );

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order history", error: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: order.status });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error tracking order", error: error.message });
  }
};

module.exports = {
  getOrderHistory,
  trackOrder,
};
