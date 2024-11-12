const { Menu } = require("../models/menuModel");
const { Order } = require("../models/orderModel");
const { Restaurant } = require("../models/restModel");
const { User } = require("../models/userModel");
const { generateToken } = require("../utils/token");


// create order
const createOrder = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
    
        const cart = await Cart.findOne({ user: user._id }).populate({
          path: "items.food",
          select: "price restaurant",
        });
    
        if (!cart) {
          return res
            .status(404)
            .json({ success: false, message: "Cart not found" });
        }
    
        // Assume the cart total has been updated with any applied discount
        const updatedCartTotal = cart.total;
    
        // Group cart items by restaurant
        const itemsByRestaurant = cart.items.reduce((acc, item) => {
          const restaurantId = item.food.restaurant.toString();
          if (!acc[restaurantId]) {
            acc[restaurantId] = [];
          }
          acc[restaurantId].push(item);
          return acc;
        }, {});
    
        // Calculate the discounted total for each restaurant
        const orders = [];
        for (const restaurantId in itemsByRestaurant) {
          const items = itemsByRestaurant[restaurantId];
    
          if (items.length === 0) continue; 
    
          // Validate and calculate the total for the restaurant's order
          let restaurantTotal = 0;
          const validatedItems = items.map((item) => {
            const price = item.food.price;
            if (
              isNaN(price) ||
              price <= 0 ||
              isNaN(item.quantity) ||
              item.quantity <= 0
            ) {
              console.error(
                `Invalid item - Price: ${price}, Quantity: ${item.quantity}`
              );
              throw new Error("Invalid item price or quantity");
            }
            restaurantTotal += price * item.quantity;
            return {
              food: item.food,
              quantity: item.quantity,
              price: price,
            };
          });
    
          
          const newOrder = new Order({
            user: user._id,
            restaurant: restaurantId,
            items: validatedItems,
            total: updatedCartTotal / Object.keys(itemsByRestaurant).length, 
            proportionally
          });
    
          await newOrder.save();
    
          const restaurant = await Restaurant.findById(restaurantId);
          if (restaurant) {
            restaurant.orders.push(newOrder._id);
            await restaurant.save();
          }
    
          user.orders.push(newOrder._id);
          orders.push(newOrder);
        }
    
        // Clear the cart
        await Cart.deleteOne({ _id: cart._id });
        await user.save();
    
        res.status(200).json({
          success: true,
          message: "Orders created successfully",
          orders,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
    
    // get orderby id
     const getOrderById = async (req, res) => {
      try {
        // destructure order id
        const { orderId } = req.params;
    
        // find order
        const order = await Order.findById(orderId).populate({
          path: "restaurant",
          select: "-password -orders -email", 
        }).populate({
          path: "food",
        });;
        if (!order) {
          res.status(404).json({ success: false, message: "Order not found" });
        }
        res
          .status(200)
          .json({ success: true, message: "order details fetched", order: order });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
    
    // cancel order
     const cancelOrder = async (req, res) => {
      try {
        // desturcture order id
        const { orderId } = req.params;
    
        // find order
        const order = await Order.findById(orderId);
        if (!orderId) {
          return res
            .status(404)
            .json({ sucess: false, message: " Order not found" });
        }
        if (order.status === "Delivered" || order.status === "Confirmed") {
          return res
            .status(404)
            .json({ sucess: false, message: " Cannot cancel the order" });
        }
        // change status to canceled
        order.status = "Cancelled";
        await order.save();
    
        res
          .status(200)
          .json({ success: true, message: "order cancel successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
    // get all orders by user
     const myOrders = async (req, res) => {
      try {
        // get from auth user
        const user = req.user;
    
        if (!user) {
          return res
            .status(404)
            .json({ sucess: false, message: " user not found" });
        }
    
        // find orders by user ID
        const orders = await Order.find({ user: user._id }).populate({
          path: "restaurant",
          select: "-password -orders -email", 
        }).populate({
          path: 'items.food', 
        });
        if (!orders || orders.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "No orders found" });
        }
        res.status(200).json({
          success: true,
          message: "my order fetched  successfully",
          data: orders,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    module.exports = { createOrder, myOrders , getOrderById, cancelOrder  }