const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    // Get token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Token is required.",
      });
    }

    // Verify the token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("==token verified", verifiedToken);
    // Check if the user is an admin
    if (verifiedToken.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins are authorized.",
      });
    }

    // Attach user data to request
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = { adminAuth };
