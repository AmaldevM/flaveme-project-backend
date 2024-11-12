const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId,ref: "Category",},
    availability: { type: Boolean, default: true },
  },

  { timestamps: true }
); 

const Menu = mongoose.model("Menu", menuSchema);

module.exports = { Menu };

