const jwt = require("jsonwebtoken");

const generateToken = (user, role) => {
  try {
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateToken };
