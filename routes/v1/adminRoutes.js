const express = require("express");
const { 
  adminSignup, 
  adminLogin, 
  adminLogout, 
  adminProfile, 
  updateAdmin, 
  deleteUser, 
  getUserList, 
  checkUser, 
  checkadmin
} = require("../../controllers/adminController");
const { adminAuth } = require("../../middlewares/adminAuth");

const router = express.Router();

// Admin signup
router.post("/signup", adminSignup);
// Admin login
router.post("/login", adminLogin);
// Admin logout
router.post("/logout", adminLogout);
// Admin profile (fetch logged-in admin profile)
router.get("/profile", adminAuth, adminProfile); // Use authenticated admin
// Update admin
router.put("/update/:userId", adminAuth, updateAdmin);
// Delete user
router.delete("/delete/:userId", adminAuth, deleteUser);
// Get user list
router.get("/userlist", adminAuth, getUserList);
// Check user (check if admin is authenticated)
router.get("/checkUser", adminAuth, checkUser);
// Check admin (check if the user is an admin)
router.get("/check-admin", adminAuth, checkadmin);

module.exports = { adminRouter: router };
