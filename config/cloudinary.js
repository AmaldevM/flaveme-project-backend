const { v2 } = require("cloudinary")
const dotenv = require('dotenv');

dotenv.config()

v2.config({

    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryInstance = v2

module.exports={ cloudinaryInstance }