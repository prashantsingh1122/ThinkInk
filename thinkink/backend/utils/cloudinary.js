import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Blog_Images",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

export const upload = multer({ storage });

// Image upload function
export const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Blog_Images",
    });
    return result.secure_url;
  } catch (error) {
    console.error("🚨 Cloudinary Upload Error:", error.message);
    throw error;
  }
};
