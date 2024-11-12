const express = require("express");
const { 
  adminSignup, 
  adminLogin, 
  adminLogout, 
  adminProfile, 
  updateAdmin, 
  deleteUser, 
  getUserList, 
  checkUser 
} = require("../../controllers/adminController");
const { adminAuth } = require("../../middlewares/adminAuth");

const router = express.Router();

// Admin signup
router.post("/signup", adminSignup);

// Admin login
router.post("/login", adminLogin);

// Admin logout
router.post("/logout", adminLogout);

// Admin profile (protected route)
router.get("/profile/:id", adminAuth, adminProfile);

// Update admin (protected route)
router.put("/update/:userId", adminAuth, updateAdmin);

// Delete user (protected route)
router.delete("/delete/:userId", adminAuth, deleteUser);

// Get user list (protected route)
router.get("/userlist", adminAuth, getUserList);

// Check user (protected route)
router.get("/checkUser", adminAuth, checkUser);

module.exports = { adminRouter: router };
