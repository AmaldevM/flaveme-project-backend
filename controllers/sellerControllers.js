const { Seller } = require("../models/sellerModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const { Restaurant } = require("../models/restModel");

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

module.exports = {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
};
