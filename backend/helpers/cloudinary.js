// helpers/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure cloudinary with explicit values
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const imageUploadUtils = async (file) => {
    try {
        // Validate configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration missing');
        }

        // Upload image
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: "ecommerce"
        });

        return {
            success: true,
            result: {
                url: result.secure_url,
                public_id: result.public_id
            }
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

// Configure multer
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed!'), false);
        return;
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});