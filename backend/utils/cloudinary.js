// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage with dynamic folder paths
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine the folder name based on request data
    const folderName = req.body.folderName || 'default_folder';
    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
