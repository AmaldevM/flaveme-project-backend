const jwt = require("jsonwebtoken");

const sellerAuth = (req, res, next) => {
  try {
    // Get token form req.cookies
    const { token } = req.cookies;
    // Check have any token
    if (!token) {
      return res
        .status(401)
        .json({ succuss: false, message: "unauthoraized seller" });
    }
    // Verify the token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifiedToken) {
      return res
        .status(401)
        .json({ succuss: false, message: "unauthoraized seller" });
    }

    console.log("tokenVerified=====", tokenVerified);

    if (tokenVerified.role !== "seller" && tokenVerified.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, message: "user not autherized" });
    }
    // If have token send the token as object
    req.seller = verifiedToken;
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "interal server error" });
  }
};
module.exports = { sellerAuth };
