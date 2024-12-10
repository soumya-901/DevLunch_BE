const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: global.CLOUDINARY_NAME, // Replace with your Cloudinary cloud name
  api_key: global.CLOUDINARY_API_KEY, // Replace with your API key
  api_secret: global.CLOUDINARY_API_SECRET, // Replace with your API secret
});

module.exports = { cloudinary };
