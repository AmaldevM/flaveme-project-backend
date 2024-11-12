const { cloudinaryInstance } = require("../config/cloudinary");
const { Restaurant } = require("../models/restModel");
const { handleImageUpload } = require("../utils/imageUpload");



// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const user = req.user;
    console.log(req.file)
    let imageUrl;
    const { name, description, address, phone, cuisineType } = req.body;

    // Validation
    if (!name || !description || !phone || !address || !cuisineType) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existRestaurant = await Restaurant.findOne({ name });

    if (existRestaurant) {
      return res
        .status(409)
        .json({ success: false, message: "Restaurant already exists" });
    }

      if (req.file) {
    imageUrl = await handleImageUpload(req.file.path);
      }

        const restaurant = new Restaurant({ 
          name, 
          description, 
          address,
          phone, 
          image:imageUrl && imageUrl , 
          cuisineType, 
          seller});
       if (user.role === "seller") restaurant.seller = user.id;
        const savedRestaurant = await restaurant.save();
        restaurant : savedRestaurant,
   res
     .status(201)
     .json({ success: true, message: "restaurant created successfully" });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating restaurant", error });
  }
};

// Update restaurant
const updateRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, address, phone, cuisineType } = req.body;
    let imageUrl;

    // Check if restaurant exists
    const existRestaurant = await Restaurant.findOne({ _id: restaurantId });

    if (!existRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant does not exist" });
    }

    // Handle image upload if file is provided
    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    // Update restaurant information
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: restaurantId },
      {
        name,
        description,
        address,
        phone,
        image: imageUrl || existRestaurant.image, 
        cuisineType
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};


// Restaurant list
const getAllRestaurants = async (_req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    return res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server not responding", error });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const deletedRestaurant = await Restaurant.findByIdAndDelete({_id: restaurantId});

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant", error });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
