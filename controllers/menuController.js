const { cloudinaryInstance } = require("../config/cloudinary");
const { Menu } = require("../models/menuModel");

// menu list for restaurant
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    return res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get menu item by id
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Menu.findOne({ _id: id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

// create menu items
const createMenuItem = async (req, res) => {
  try {
    const seller = req.seller;
    console.log(seller, "===seller");
    const { name, ...rest } = req.body;
    if (!name || Object.keys(rest).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existMenuItem = await Menu.findOne({ name });
    if (existMenuItem) {
      return res.status(409).json({ message: "Item already exists" });
    }

    let uploadResult;
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
      console.log("Upload result:", uploadResult);
    } else {
      console.log("No file to upload.");
    }

    const newItem = new Menu({
      name,
      ...rest,
      image: uploadResult?.secure_url || "",
    });
    const saveMenuItem = await newItem.save();
    res.status(201).json(saveMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
  }
};

// update menu item
const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
