import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Ensure that the temp directory exists
const tempDir = "public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer Storage (Temporarily Saves File Locally Before Uploading)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Temporary folder before upload
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Multer Middleware Configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Only allow images (jpg, png, gif)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")
      );
    }
    cb(null, true);
  },
});

// Middleware to Handle Upload to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const localFilePath = req.file.path; // Multer stores the file in req.file

    // Upload file to Cloudinary
    const uploadedUrl = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detects file type (image, video, etc.)
      folder: "Travel agency",
    });

    // Clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    req.imageUrl = uploadedUrl.secure_url; // Attach Cloudinary URL to request
    console.log(req.imageUrl)
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    // Remove local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res
      .status(500)
      .json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
  }
};

const updateBlogImage = async (req, res, next) => {
  if (!req.file) {
    // No file uploaded — just continue
    return next();
  }

  try {
    const blogId = req.params.id;

    // 🗑️ Delete existing image from Cloudinary
    const deleted = await cloudinary.uploader.destroy(`Travel agency/${blogId}`);
    if (deleted.result === "ok") {
      console.log("✅ Deleted successfully from Cloudinary");
    } else {
      console.log("❌ Failed to delete from Cloudinary:", deleted);
    }

    // 📤 Upload new image
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "Travel agency",
      public_id: blogId,  // optional: use the same id to overwrite
    });

    // 🧹 Remove local file
    fs.unlinkSync(req.file.path);

    // 📝 Attach new URL to req for controller to use
    req.newImageUrl = uploaded.secure_url;

    next(); // continue to next middleware/controller

  } catch (error) {
    console.error("❌ Cloudinary update error:", error);

    // Clean up local file if it still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Image update failed",
      error: error.message,
    });
  }
};


const DeleteBlogImage = async (req, res, next) => {
  try {
    const blogId = req.params.id;

  const deleted=await cloudinary.uploader.destroy(`Travel agency/${blogId}`);
  next();
  } catch (error) {
    return res.status(400).json({"Message":error})
  }
};

export { upload, uploadToCloudinary, updateBlogImage,DeleteBlogImage };
