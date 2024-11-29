const express = require("express");
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../../controllers/restControllers");
const { adminAuth } = require("../../middlewares/adminAuth");
const { upload } = require("../../middlewares/multer");

const router = express.Router();

// Create new restaurant (Admin Only)
router.post("/create", upload.single("image"), adminAuth, createRestaurant);

// Get all restaurants (Public Access)
router.get("/restaurants", getAllRestaurants);

// Get a restaurant by ID (Public Access)
router.get("/restaurants/:restaurantid", getRestaurantById);

// Update restaurant (Admin Only)
router.put("/update/:restaurantId",  upload.single("image"),adminAuth, updateRestaurant);

// Delete restaurant (Admin Only)
router.delete("/delete/:restaurantid", adminAuth, deleteRestaurant);

module.exports = { restRouter: router };
