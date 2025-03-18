import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Multer Storage (Temporarily Saves File Locally Before Uploading)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/temp"); // Temporary folder before upload
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware to Handle Upload to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const localFilePath = req.file.path;

    // Upload file to Cloudinary
    const uploadedUrl = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    req.imageUrl = uploadedUrl.secure_url; // Attach Cloudinary URL to request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    // Remove local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
  }
};

export { upload, uploadToCloudinary };