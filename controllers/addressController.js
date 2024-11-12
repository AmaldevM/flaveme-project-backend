const { Address } = require("../models/addressModel");
const { User } = require("../models/userModel");

// create address
const createAddress = async (req, res) => {
  try {
    const { name, email, city, street, phone, pincode } = req.body;
    console.log(name, email);
    // validation
    if (!name || !email || !street || !city || !phone || !pincode) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // Get user info from auth middleware
    const userInfo = req.user;

    // Find the user and check if they already have an address
    const user = await User.findOne({ email: userInfo.email }).populate(
      "address"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    if (user.address) {
      return res.status(400).json({
        success: false,
        message:
          "User already has an address. Please update the existing address.",
      });
    }

    const newAddress = new Address({
      name,
      email,
      city,
      street,
      phone,
      pincode,
    });

    await newAddress.save();
    user.address = newAddress._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address created successfully",
      data: newAddress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};
// update address
const updateAddress = async (req, res) => {
  try {
    const { name, email, city, street, phone, pincode } = req.body;
    const userInfo = req.user;
    const user = await User.findOne({ email: userInfo.email }).populate("address");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    if (!user.address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const address = await Address.findById(user.address._id);

    if (name) address.name = name;
    if (email) address.email = email;
    if (city) address.city = city;
    if (phone) address.phone = phone;
    if (pincode) address.pincode = pincode;
    if (street) address.street = street;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

module.exports = {
  createAddress,
  updateAddress,
};
