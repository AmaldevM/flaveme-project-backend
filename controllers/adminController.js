const { Admin } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

// AdminSignup
const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Admin({ name, email, password: hashedPassword, phone, profilePic, role });
    await newUser.save();

    const token = generateToken(newUser._id, "admin");
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    res.json({ success: true, message: "Admin signed up successfully" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: "Internal server error" });
  }
};
// AdminLogin
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const adminExist = await Admin.findOne({ email });
    if (!adminExist) {
      return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    const passwordsMatch = await bcrypt.compare(password, adminExist.password);
    if (!passwordsMatch) {
      return res.status(401).json({ success: false, message: "Unauthorized password" });
    }

    const token = generateToken(adminExist._id, "admin");
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    res.status(200).json({ success: true, message: "Admin login successful" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: "Internal server error" });
  }
};
//adminLogout
const adminLogout = async (req, res,next) => {
  try {
    res.clearCookie("Token")
    res.status(200).json({success:true,message:"admin successfully logged out "})

  } catch (error){
    console.log(error);
    res.status(error.statusCode || 500).json({message:error.messsage || "Internal server Error"})
 }
}
//adminProfile
const adminProfile = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user,"======user");

    const { id } = req.params;
    const userData = await Admin.findOne({_id: id });

    res.json({ success:true , message: "admin data fetched", data:userData})
  } catch (error){
    console.log(error);
    res.status(error.statusCode || 500).json({message:error.messsage || "Internal server Error"})
 }
}
//checkadmin
const checkadmin = async (req, res,next) => {
  try {
    const { user }=req;
    if(!user) {
      res.status(401).json({succesd:false,message:"admin not autherized"})
    }

    res.json({success: true, messege: "user autherized",});

  } catch (error){
    console.log(error);
    res.status(error.statusCode || 500).json({message:error.messsage || "Internal server Error"})
 }
}
//adminUpdate
const updateAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, profilePic } = req.body;

    // Ensure admin exists
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (profilePic) admin.profilePic = profilePic;

    const updatedAdmin = await admin.save();
    res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};
//Userdelete
const deleteUser = async (req, res, next) => {
  try {
    
    const { userId } = req.params

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the user being deleted is an admin
    if (userToDelete.role.includes("admin")) {
      return res.status(403).json({ success: false, message: "Admins cannot delete other admins" });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res.status(404).json({success:false,message:"user not found"})
    }
    res.status(204).send()

  } catch (error){
    console.log(error);
    res.status(error.statusCode || 500).json({message:error.messsage || "Internal server Error"})
 }
}
//getUserList
const getUserList = async (req, res) => {
  try {
    const users = await Admin.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};
//checkUser
const checkUser = async (req, res) => {
  try {
    // Assuming admin is attached to req by middleware
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.status(200).json({ success: true, message: "User is authenticated", data: req.admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// controllers/adminController.js
module.exports = {
  adminSignup,
  adminLogin,
  adminLogout,
  adminProfile,
  updateAdmin,
  deleteUser,
  getUserList,
  checkUser
};
