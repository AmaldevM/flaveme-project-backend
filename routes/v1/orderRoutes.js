const express = require('express')
const {  createOrder, getOrderById, myOrders ,cancelOrder} = require('../../controllers/orderController')
const { userAuth } = require('../../middlewares/userAuth')
const { sellerAuth } = require('../../middlewares/sellerAuth')
const {  updateOrderStatus } = require('../../controllers/menuController')

const router = express.Router()

// Create order
router.post('/order' ,userAuth , createOrder)
// Get order
router.get('/my-orders', userAuth, myOrders );
// Get order by id
router.get('/:orderId', userAuth, getOrderById);
// Cancel order
router.patch('/cancel/:orderId', userAuth,cancelOrder );

// Update order status(e.g., "Pending," "Preparing," "Dispatched," or "Delivered)
router.put('/order/:id/status', sellerAuth,  updateOrderStatus);

module.exports = { orderRouter : router }