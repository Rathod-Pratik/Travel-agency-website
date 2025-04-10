import multer from "multer";
import fs from "fs";

// Create destination folder if it doesn't exist
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);  // Store in the 'temp' folder
  },
  filename: function (req, file, cb) {
    // Ensure the filename is unique by adding a timestamp
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // Use the unique name
  }
});

// Create multer instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB (adjust as needed)
  },
  fileFilter: function (req, file, cb) {
    // Allow only image files (you can adjust the mime type)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
    cb(null, true);
  }
});
