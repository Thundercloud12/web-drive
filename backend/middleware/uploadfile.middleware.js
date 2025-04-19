import dotenv from 'dotenv';
dotenv.config();
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage with dynamic folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log(req)
    const folderName = req.body.folderName || "default_folder"; // You can send this from the frontend
    return {
      folder: folderName,
      allowed_formats: ["jpeg", "jpg", "png", "gif"],
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
  
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
};

// Initialize multer with Cloudinary
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
