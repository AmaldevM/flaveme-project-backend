const express = require("express");
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
} = require("../../controllers/sellerControllers");
const { adminAuth } = require("../../middlewares/adminAuth");
const router = express.Router();


// Register seller
router.post("/register", registerSeller);
// Login seller
router.post("/login", loginSeller);
// Logout seller (GET request instead of POST)
router.get("/logout", logoutSeller);


// Get all sellers
router.get("/sellers", adminAuth, getSellersList);


module.exports = { sellerRouter: router };
