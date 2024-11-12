const express = require('express')
const {  createOrder, getOrderById, myOrders ,cancelOrder} = require('../../controllers/orderController')
const { userAuth } = require('../../middlewares/userAuth')
const { adminAuth } = require('../../middlewares/adminAuth')
const { updateMenuItem } = require('../../controllers/menuController')

const router = express.Router()

// Create order
router.post('/order' ,userAuth , createOrder)
// Get order
router.get('/my-orders', userAuth, myOrders );
// Get order by id
router.get('/:orderId', userAuth, getOrderById);
// Cancel order
router.patch('/cancel/:orderId', userAuth,cancelOrder );
// Update order
router.put('/order/:id/status',adminAuth,  updateMenuItem)
module.exports = { orderRouter : router }