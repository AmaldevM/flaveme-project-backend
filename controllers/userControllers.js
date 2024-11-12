const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const { cloudinaryInstance } = require("../config/cloudinary");

//UserSignup
const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // validation
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }
    // check user available
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }
    // Upload an image cloudinary
    let uploadResult;
    // Upload an image to Cloudinary if a file is provided
    if (req.file) {
      uploadResult = await cloudinaryInstance.uploader
        .upload(req.file.path)
        .catch((error) => {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Error uploading image" });
        });
    }
    // password hashing
    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    // check req.file.path have image url
    if (uploadResult?.url) {
      newUser.profilePic = uploadResult.url; // assign url to profilePic
    }
    // save user
    await newUser.save();
    // to remove password from response
    const userResponse = await User.findById(newUser._id).select("-password");
    //   authentication using jwt token
    const token = generateToken(email, "user");
    //   send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    //   send success response
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    // send error response
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
//UserLogin
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }
    // Check user availability
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }

    // Check password
    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
      console.log("Unauthorized user or invalid password");
      return res.status(401).json({
        success: false,
        message: "Unauthorized user or invalid password",
      });
    }

    // Generate JWT token
    const token = generateToken(email, "user");
    // Send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        ...userExist._doc,
        password: undefined, // Hide password from response
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};
//userLogout
const userLogout = async (req, res) => {
  try {
    // Clear cookie
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res
      .status(200)
      .json({ success: true, message: "User logout successfully" });
  } catch (error) {
    console.error("Error clearing cookie:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// UserProfile
const userProfile = async (req, res) => {
  try {
    const { user } = req;
    console.log("User Data: ", user);

    const userData = await User.findOne({ _id: user.id });
    const { image, name, email, phone, _id } = userData;
    res.json({
      success: true,
      message: "User profile",
      profilePic,
      name,
      email,
      phone,
      _id,
    });
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//checkUser
const checkUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "unauthoraized user" });
    }
    res.status(200).json({ success: true, message: "authoraized user" });
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.messsage || "Internal server Error" });
  }
};
//UserUpdate
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { path } = req.file;
    let { name, email } = req.body;

    const user = await User.findById(userId).exec();

    let imgUrl = await handleImageUpload(path);

    if (!name) {
      name = user.name;
    }

    if (email && email !== user.email) {
      const emailInUse = await User.findOne({ email }).exec();
      if (emailInUse) {
        return res
          .status(401)
          .json({ success: false, message: "Email already in use" });
      }
    } else {
      email = user.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name, email: email, profile_img: imgUrl },
      { new: true }
    );
    res.status(200).json({ success: true, message: "user updated" });
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.messsage || "Internal server Error" });
  }
};
//UserList
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}).exec();
    const data = allUsers.map((user) => {
      return {
        name: user.name,
        email: user.email,
        id: user._id,
        roles: user.roles,
      };
    });
    res
      .status(200)
      .json({ success: true, message: "fetched all users", data: data });
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.messsage || "Internal server Error" });
  }
};
//Userdelete
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user being deleted is an admin
    if (userToDelete.role.includes("admin")) {
      return res
        .status(403)
        .json({ success: false, message: "Admins cannot delete other admins" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.messsage || "Internal server Error" });
  }
};
//reset password

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  checkUser,
};
