const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 

const createPayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., $5.00 = 500)
      currency,
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
    });

    // Respond with the status of the payment
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
};

// Verify payment success (optional)
const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      res.status(200).json({ success: true, message: "Payment succeeded" });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
