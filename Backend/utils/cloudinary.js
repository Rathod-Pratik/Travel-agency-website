import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

// Upload Function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type
        });

        console.log("✅ File uploaded to Cloudinary:", response.secure_url);

        // Return only the URL instead of the full response
        return response.secure_url;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);

        // Remove the file if it exists (to clean up temp storage)
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("🗑️ Local file deleted due to upload failure.");
        }

        return null;
    }
};

export { uploadOnCloudinary };
