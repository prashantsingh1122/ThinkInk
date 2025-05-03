import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import streamifier from "streamifier";

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
const Post = ({ post }) => {

}

export const upload = multer({ storage });

// Upload image from buffer
export const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Blog_Images",
        transformation: [{ width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" },

        ],
      
       },
    (error, result) => {
      if (error) {
        console.error("🚨 Cloudinary Upload Error:", error.message);
        reject(error);
      } else {
        console.log("✅ Image uploaded successfully:", result.secure_url);
        resolve(result.secure_url);
      }
    }
  );

  streamifier.createReadStream(fileBuffer).pipe(uploadStream);
});
};
