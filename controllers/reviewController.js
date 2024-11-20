const { Menu } = require("../models/menuModel");
const { Restaurant } = require("../models/restModel");
const { Review } = require("../models/reviewModel");

// create review
const createReview = async (req, res) => {
  try {
    // Destructure values from req.body
    const { rating, comment, restaurant, menuItem } = req.body;
    console.log(rating, comment, restaurant, menuItem)
    const userId = req.user.id;

    if (!rating || (restaurant === undefined && menuItem === undefined)) {
      return res.status(400).json({
        message:
          "rating is required, and either restaurant or menuItem must be provided.",
      });
    }
    // Check if restaurant
    if (restaurant) {
      const restaurantExists = await Restaurant.findById(restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ message: "restaurant not found" });
      }
    }
    // Check if menu menuItem exists
    if (menuItem) {
      const menuItemExists = await Menu.findById(menuItem);
      if (!menuItemExists) {
        return res.status(404).json({ message: "menu item not found" });
      }
    }
    // Create a new review
    const review = new Review({
      user: userId,
      restaurant,
      menuItem,
      rating,
      comment,
    });
    // Save review to database
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the review.",
      error: error.message,
    });
  }
};
// get review
const getreviews = async (req, res) => {
  try {
    // Destructure values from req.query
    const { restaurantId, menuItemId } = req.query;
    let filter = {};
    if (restaurantId) {
      filter.restaurant = restaurantId;
    }
    if (menuItemId) {
      filter.menuItem = menuItemId;
    }
    const review = await Review.find(filter);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
        message: "An error occurred while fetching the reviews.",
      });
  }
};

// delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; 

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the user is the owner of the review or an admin
    if (review.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this review",
      });
    }

    // Delete the review
    await review.deleteOne();
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the review",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getreviews,
  deleteReview
};
