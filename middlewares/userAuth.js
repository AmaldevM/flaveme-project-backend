const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    // Destructure token from cookies
    const { token } = req.cookies;
    // Check have any token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: No token provided",
      });
    }
    // Verify token using jwt verify
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET_KEY);

    // Check if the token was successfully decoded
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: Invalid token",
      });
    }

    // Fetch user from the database using the email from the token
    const user = await User.findOne({ email: decoded.email })
      .select("-password")
      .populate("address");

    // Handle case where user is not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: User not found",
      });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Differentiate between token expiration and other errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: Token expired",
      });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { userAuth };
