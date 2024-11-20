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
// Admin profile 
router.get("/profile/:id", adminAuth, adminProfile);
// Update admin 
router.put("/update/:userId", adminAuth, updateAdmin);
// Delete user 
router.delete("/delete/:userId", adminAuth, deleteUser);
// Get user list 
router.get("/userlist", adminAuth, getUserList);
// Check user 
router.get("/checkUser", adminAuth, checkUser);
// check admin 
router.get("/check-admin", adminAuth, checkadmin);

module.exports = { adminRouter: router };
