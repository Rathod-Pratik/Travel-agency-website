import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";

// Middleware to Handle Upload to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "Travel agency"
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadedUrl = await streamUpload();
    req.imageUrl = uploadedUrl.secure_url;
    console.log("✅ Uploaded to Cloudinary:", req.imageUrl);

    next();

  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// Update Blog Image (New)
const updateBlogImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const blogId = req.params.id;

    // 🗑️ Delete existing image
    const deleted = await cloudinary.v2.uploader.destroy(`Travel agency/${blogId}`);
    if (deleted.result === "ok") {
      console.log("✅ Deleted existing image");
    } else {
      console.log("❌ Failed to delete existing image:", deleted);
    }

    // 📤 Upload new image
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "Travel agency",
            public_id: blogId, // overwrite existing
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploaded = await streamUpload();
    req.newImageUrl = uploaded.secure_url;

    next();

  } catch (error) {
    console.error("❌ Cloudinary update error:", error);
    return res.status(500).json({
      success: false,
      message: "Image update failed",
      error: error.message,
    });
  }
};

// Delete Blog Image (Unchanged — as it already works well)
const DeleteBlogImage = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const deleted = await cloudinary.v2.uploader.destroy(`Travel agency/${blogId}`);
    console.log("✅ Deleted:", deleted);
    next();
  } catch (error) {
    console.error("❌ Deletion Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export { uploadToCloudinary, updateBlogImage, DeleteBlogImage };