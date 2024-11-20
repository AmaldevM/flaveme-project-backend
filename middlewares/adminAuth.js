const jwt = require("jsonwebtoken");
const { Admin } = require("../models/adminModel");

const adminAuth = async (req, res, next) => {
  try {
    // destructure token from cookies
    const { token } = req.cookies;

    // Check if have the cookie
    if (!token) {
      return res
        .status(401)
        .json({ succuss: false, message: "unauthoraized admin" });
    }

    // verify token using jwt verify
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifiedToken) {
      return res
        .status(401)
        .json({ succuss: false, message: "unauthoraized admin" });
    }

    console.log("tokenVerified=====", tokenVerified);

    if (tokenVerified.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, message: "user not autherized" });
    }

    // If have token send the token as a object
    req.admin = verifiedToken;
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "interal server error" });
  }
};

module.exports = { adminAuth };
