import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new multer.memoryStorage();

export async function imageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
    });
    return result;
};

export const upload = multer({ storage });