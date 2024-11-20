const express = require('express');
const {  getCart, updateCart, removeitem, addItem } = require('../../controllers/cartController');
const { userAuth } = require('../../middlewares/userAuth');
const router = express.Router();

// Add item to cart
router.post('/addCart', userAuth, addItem);
// Get cart
router.get('/getCart', userAuth, getCart);
// Update cart
router.put("/updateitem", userAuth, updateCart);
// Remove item from cart
router.delete('/removeItem', userAuth, removeitem);

module.exports = { cartRouter: router };
