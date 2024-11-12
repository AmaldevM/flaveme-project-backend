const jwt = require("jsonwebtoken");

const sellerAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ succuss: false, message: "unauthoraized seller" });
    }

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

    req.seller = verifiedToken;

    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "interal server error" });
  }
};
module.exports = { sellerAuth };
