import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

// load env here to ensure env vars are available
dotenv.config();

cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Diagnostic: log presence of required env vars (do not print secrets)
const missing = [];
if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
if (missing.length) {
    console.error('Cloudinary config missing env vars:', missing.join(', '));
} else {
    console.log('Cloudinary configured (cloud name):', process.env.CLOUDINARY_CLOUD_NAME);
}

export default cloudinary;  