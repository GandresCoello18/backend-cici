import cloudinary from 'cloudinary';
import { Request } from 'express';
import {config} from '../config';

export const UploasProduct = async (req: Request) => {
    cloudinary.v2.config({
        cloud_name: config.CLOUD_NAME,
        api_key: config.API_KEY_CLOUDINARY,
        api_secret: config.API_SECRET_CLOUDINARY,
    });

    const path = req.file.path
    const uniqueFilename = new Date().toISOString()

    return await cloudinary.v2.uploader.upload(
        path, { public_id: `products/${uniqueFilename}`, tags: `products` },
    )
}