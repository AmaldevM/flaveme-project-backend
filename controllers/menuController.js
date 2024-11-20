const { cloudinaryInstance } = require("../config/cloudinary");
const { Menu } = require("../models/menuModel");

// Create a menu
const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, ...rest } = req.body;

    // Validate required fields
    if (!restaurantId || !name) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID and name are required",
      });
    }

    // Check for duplicate menu item
    const existMenuItem = await Menu.findOne({ restaurantId, name });
    if (existMenuItem) {
      return res.status(409).json({
        success: false,
        message: "Menu item already exists",
      });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await cloudinaryInstance.uploader.upload(
          req.file.path
        );
        rest.image = uploadResult.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: error.message,
        });
      }
    }

    // Create and save the menu item
    const newItem = new Menu({ restaurantId, name, ...rest });
    const savedMenuItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: savedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get the menu for a restaurant
const getMenubyRestaurantid = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menus = await Menu.find({ restaurantId });

    if (!menus.length) {
      return res.status(404).json({
        success: false,
        message: "No menus found for this restaurant",
      });
    }

    res.status(200).json({ success: true, menus });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get menu by category
const getMenusByCategory = async (req, res) => {
  try {
    const { restaurantId, category } = req.params;
    const menus = await Menu.find({ restaurantId, category });

    if (!menus.length) {
      return res.status(404).json({
        success: false,
        message: "No menu items found in this category",
      });
    }

    res.status(200).json({ success: true, menus });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search menu by name
const searchMenuByName = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name } = req.query;

    const menus = await Menu.find({
      restaurantId,
      name: { $regex: name, $options: "i" },
    });

    if (!menus.length) {
      return res.status(404).json({
        success: false,
        message: "No menu items match the search query",
      });
    }

    res.status(200).json({ success: true, menus });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Filter menu by price
const filterMenusByPrice = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;

    const menus = await Menu.find({
      restaurantId,
      price: { $gte: minPrice, $lte: maxPrice },
    });

    if (!menus.length) {
      return res.status(404).json({
        success: false,
        message: "No menu items found in the given price range",
      });
    }

    res.status(200).json({ success: true, menus });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a menu item
const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params; 
    const updates = req.body; 

    // Validate that the updates object is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    // Find the menu item and update it
    const updatedMenu = await Menu.findByIdAndUpdate(menuId, updates, {
      new: true, 
      runValidators: true, 
    });

    // If the menu item is not found, return an error
    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menu: updatedMenu, // Include updated menu item in the response
    });
  } catch (error) {
    // Catch and handle server errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Delete a menu item
const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(menuId);

    if (!deletedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Order controller status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract order ID from params
    const { status } = req.body; // Extract new status from body

    // Validate that a status was provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    // Validate that the status is one of the allowed values
    const validStatuses = [
      "Pending",
      "Preparing",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    // Find the order and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    // If order not found
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { updateOrderStatus };


module.exports = {
  createMenuItem,
  getMenubyRestaurantid,
  getMenusByCategory,
  searchMenuByName,
  filterMenusByPrice,
  updateMenu,
  deleteMenu,
  updateOrderStatus
};
