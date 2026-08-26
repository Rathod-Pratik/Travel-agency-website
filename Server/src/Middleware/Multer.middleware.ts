import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({ storage })

export const uploadImages = upload.array("image", 10);

export default upload;
