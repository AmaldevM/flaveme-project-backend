const { Cart } = require("../models/cartModel");
const { Menu } = require("../models/menuModel");

// add items in cart
const addItemToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required and should not be empty.",
      });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Loop through items and add or update them in the cart
    for (let { menuItem, quantity } of items) {
      const itemIndex = cart.items.findIndex(
        (item) => item.menuItem.toString() === menuItem
      );
      const menuItemDetails = await Menu.findById(menuItem);
      if (!menuItemDetails) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      if (itemIndex > -1) {
        // Update quantity if item already exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          menuItem,
          quantity: 1 ,
          price: items.price,
          image: menuItemDetails.image, // Include image here
        });
      }
    }

    // Calculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (menuItem) {
        totalPrice += menuItem.price * item.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    // Save the cart and respond
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding item to cart.",
      error: error.message,
    });
  }
};

// get cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the cart.",
      error: error.message,
    });
  }
};
// remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { menuItem } = req.body;
    const userId = req.user.id;

    if (!menuItem) {
      return res.status(400).json({
        message: "menu item is required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItem
    );

    // recalculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const menuItemDetails = await Menu.findById(item.menuItem);
      if (menuItemDetails) {
        totalPrice += menuItemDetails.price * item.quantity;
      }
    }

    cart.totalPrice = totalPrice;

    // Save updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while removing item from cart.",
        error: error.message,
      });
  }
};
module.exports = {
  addItemToCart,
  getCart,
  removeFromCart,
};
