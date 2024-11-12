const express = require("express");
const {
  userSignup,
  userLogin,
  userLogout,
  userProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  checkUser,
} = require("../../controllers/userControllers");

const { userAuth } = require("../../middlewares/userAuth");
const { upload } = require("../../middlewares/multer");
const router = express.Router();

// User signup
router.post("/signup", upload.single("image"), userSignup);

// User login
router.post("/login", userLogin);

// User logout
router.post("/logout", userLogout);

// User profile
router.get("/profile/:id", userProfile);

// User update
router.put("/update/:id", userAuth, upload.single("image"), updateUser);

// User delete
router.delete("/delete/:id", userAuth, deleteUser);

// User list
router.get("/userlist", userAuth, getAllUsers);

// Check user
router.get("/checkUser", userAuth, checkUser);

module.exports = { userRouter: router };
