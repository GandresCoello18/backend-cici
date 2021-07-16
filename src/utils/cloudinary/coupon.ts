import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import { RemoveFilesTemp } from '../removeFileTemp';

export const UploadSourceCoupon = async (req: Request) => {
  const path = req.file.path;
  const uniqueFilename = `coupons/${uuidv4()}`;

  await cloudinary.v2.uploader.upload(path, { public_id: uniqueFilename, tags: `coupons` });

  RemoveFilesTemp();

  return uniqueFilename;
};
