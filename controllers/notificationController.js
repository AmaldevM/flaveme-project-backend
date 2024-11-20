const nodemailer = require("nodemailer");

const sendOrderNotification = async (order, userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your order #${order._id} status`,
      text: `Your order is now ${order.status}.`,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending order notification", error);
  }
};

const sendPromotionNotification = async (userEmail, promotionDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Special Promotion Just for You!",
      text: `Don't miss out on our new promotion: ${promotionDetails}`,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending promotion notification", error);
  }
};

module.exports = {
  sendOrderNotification,
  sendPromotionNotification,
};
