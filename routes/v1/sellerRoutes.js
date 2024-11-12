const express = require("express");
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
} = require("../../controllers/sellerControllers");

const router = express.Router();

// Register seller
router.post("/register", registerSeller);

// Login seller
router.post("/login", loginSeller);

// Logout seller (GET request instead of POST)
router.get("/logout", logoutSeller);

// Get all sellers (Consider adding authentication middleware)
router.get("/sellers", getSellersList);

module.exports = { sellerRouter: router };
