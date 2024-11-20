const { Seller } = require("../models/sellerModel");
const { Order } = require("../models/orderModel");
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");


// Seller Registration
const registerSeller = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    if (!email || !password || Object.keys(rest).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if seller already exists
    const isSellerExist = await Seller.findOne({ email });
    if (isSellerExist) {
      return res.status(409).json({ message: "Seller already exists" });
    }

    // Password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create seller
    const newSeller = new Seller({ email, ...rest, password: hashedPassword });
    await newSeller.save();

    // Generate token
    const token = generateToken({
      _id: newSeller._id,
      email: newSeller.email,
      role: "seller",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production", // Set secure flag for production
    });

    res
      .status(201)
      .json({ success: true, message: "Seller created", seller: newSeller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seller Login
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res
        .status(401)
        .json({ success: false, message: "Seller does not exist" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
      _id: seller._id,
      email: seller.email,
      role: "seller",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production", // Set secure flag for production
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ success: true, message: "Seller logged in" });
  } catch (error) {
    res.status(500).json({ message: "Failed to login seller" });
  }
};

// Seller Logout
const logoutSeller = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Seller logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Sellers
const getSellersList = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve sellers list" });
  }
};

// Get Restaurant Orders
const getRestaurantOrders = async (req, res) => {
  try {
    const sellerId = req.user.id; // Assuming seller is authenticated

    // Fetch orders related to the seller's restaurant
    const orders = await Order.find({ seller: sellerId }).populate("user restaurant");

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving orders", error });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status if necessary
    const validStatuses = ["Pending", "Preparing", "Dispatched", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order status", error });
  }
};

// Check Restaurant Profit
const checkRestaurantProfit = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch completed orders for this restaurant
    const completedOrders = await Order.find({ seller: sellerId, status: "Completed" });

    // Calculate total profit from completed orders
    const totalProfit = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({ success: true, totalProfit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error calculating profit", error });
  }
};

// View Total Users
const viewTotalUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Adjust query based on your logic

    res.status(200).json({ success: true, totalUsers: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving users", error });
  }
};



module.exports = {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
  getRestaurantOrders,
  updateOrderStatus,
  checkRestaurantProfit,
  viewTotalUsers,
};
