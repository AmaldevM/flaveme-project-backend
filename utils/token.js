const jwt = require("jsonwebtoken");

const generateToken = ({ _id,role }) => {
  console.log(_id,role)
  try {
    const token = jwt.sign(
      {
        id: _id,
        role: role,
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateToken };