const express = require("express");
const {
  getMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem, 
  deleteMenuItem,
} = require("../../controllers/menuController");
const { upload } = require("../../middlewares/multer");
const { sellerAuth } = require("../../middlewares/sellerAuth");
const router = express.Router();

// Get all menu items for a restaurant
router.get("/allmenus", getMenuItems);
// Get menu item by id
router.get("/item/:id", getMenuItemById);
// Create menu item
router.post("/allmenus", sellerAuth, upload.single("image"), createMenuItem);
// Update menu item
router.put("/item/:id", sellerAuth, updateMenuItem); 
// Delete menu item
router.delete("/item/:id", sellerAuth, deleteMenuItem);

module.exports = { menuRouter: router };
