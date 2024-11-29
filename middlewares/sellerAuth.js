const jwt = require("jsonwebtoken");
const sellerAuth = (req, res, next) => {
  try {
    // Get token form req.cookies
    const { token } = req.cookies;
    // Check have any token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "seller not autherized",
      });
    }
    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "seller not autherized",
      });
    }
    // If have token send the token as object
    req.seller = verifyToken;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "faild",
    });
  }
};
module.exports = { sellerAuth };