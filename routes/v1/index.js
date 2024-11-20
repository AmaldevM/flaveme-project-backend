const express = require("express");
require("dotenv").config();

const { userRouter } = require("./userRoutes");
const { restRouter } = require("./restRoutes");
const { adminRouter } = require("./adminRoutes");
const { sellerRouter } = require("./sellerRoutes");
const { menuRouter } = require("./menuRoutes");
const { orderRouter } = require("./orderRoutes");
const { cartRouter } = require("./cartRoutes");
const { reviewRouter } = require("./reviewRoutes");
const { addressRouter } = require("./addressRoutes");
const { adminAnalyticsRouter } = require("./adminAnalyticsRoutes");
const { notificationRouter } = require("./notificationRoutes");
const { orderHistoryRouter } = require("./orderHistoryRoutes");
const { paymentRoutes } = require("./paymentRoutes");

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/rest", restRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/seller", sellerRouter);
v1Router.use("/menu", menuRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/review", reviewRouter);
v1Router.use("/addresses", addressRouter);
v1Router.use("/adminAnalytics", adminAnalyticsRouter);
v1Router.use("/notification", notificationRouter);
v1Router.use("/orderHistory", orderHistoryRouter);
v1Router.use("/payment", paymentRoutes);

module.exports = { v1Router };
