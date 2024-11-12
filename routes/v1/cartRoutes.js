const express = require('express');
const { addItemToCart, getCart, removeFromCart } = require('../../controllers/cartController');
const { userAuth } = require('../../middlewares/userAuth');
const router = express.Router();

// Add item to cart
router.post('/addCart', userAuth, addItemToCart);

// Get cart
router.get('/getCart', userAuth, getCart);

// Remove item from cart
router.delete('/removeItem', userAuth, removeFromCart);

module.exports = { cartRouter: router };
