import cloudinary from 'cloudinary';
import { Request } from 'express';
import {config} from '../config';
import { v4 as uuidv4 } from 'uuid';

cloudinary.v2.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY_CLOUDINARY,
    api_secret: config.API_SECRET_CLOUDINARY,
});

export const UploadAvatarUser = async (req: Request) => {
    const path = req.file.path
    const uniqueFilename = `users/${uuidv4()}`;

    await cloudinary.v2.uploader.upload(
        path, { public_id: uniqueFilename, tags: `avatars` },
    )

    return uniqueFilename;
}
