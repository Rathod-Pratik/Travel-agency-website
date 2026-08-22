import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({ storage })

export const uploadFiles = upload.fields([
    { name: 'image', maxCount: 10 },
]);

export default upload;
