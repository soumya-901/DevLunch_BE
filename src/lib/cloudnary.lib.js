const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const uploadZipFile = async (filePath) => {
  try {
    // Upload the ZIP file to Cloudinary
    console.log("Uploading zip file from ", filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Use 'raw' for ZIP and other non-media files
      folder: "userdata", // Optional: Specify folder in Cloudinary
    });

    console.log("Upload successful:", result);

    // Delete the file after a successful upload
    fs.unlinkSync(filePath);
    console.log("File deleted successfully:", filePath);

    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Re-throw the error if needed
  }
};

module.exports = {
  uploadZipFile,
};
