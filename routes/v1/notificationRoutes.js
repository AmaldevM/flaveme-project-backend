const express = require("express");
const {
  sendOrderNotification,
  sendPromotionNotification,
} = require("../../controllers/notificationController");
const router = express.Router();


router.post("/send-order-notification", sendOrderNotification);
router.post("/send-promotion-notification", sendPromotionNotification);

module.exports = { notificationRouter : router};
