import cloudinary from 'cloudinary';
import { Request } from 'express';
import {config} from '../config';
import { v4 as uuidv4 } from 'uuid';

cloudinary.v2.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY_CLOUDINARY,
    api_secret: config.API_SECRET_CLOUDINARY,
});

export const UploasProduct = async (req: Request) => {
    const path = req.file.path
    const uniqueFilename = `products/${uuidv4()}`;

    await cloudinary.v2.uploader.upload(
        path, { public_id: uniqueFilename, tags: `products` },
    )

    return uniqueFilename;
}

export const UploadMoreSourcesProduct = async (req: Request | any) => {
    const result: string[] = [];

    if(req.files.length){
        for(let i = 0; i < req.files.length; i++){
            const item = req.files[i];
            const path = item.path
            const uniqueFilename = `more-sources/${uuidv4()}`;

            await cloudinary.v2.uploader.upload(
                path, { public_id: uniqueFilename, tags: `more-sources` },
            )

            result.push(uniqueFilename);
        }
    }

    return result;
}