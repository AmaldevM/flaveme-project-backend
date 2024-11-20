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

// Create new restaurant
router.post( "/create", upload.single("image"),adminAuth,  createRestaurant );

// Get all restaurants
router.get("/restaurants",adminAuth, getAllRestaurants);
// Get restaurant by id
router.get("/restaurants/:id",adminAuth, getRestaurantById);

// Update restaurant
router.put( "/update/:restaurantId", upload.single("image"), adminAuth, updateRestaurant );
// Delete restaurant
router.delete("/delete/:restaurantid", adminAuth, deleteRestaurant);

module.exports = { restRouter: router };
